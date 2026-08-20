#!/usr/bin/env python3
"""
KYC Outreach Automation for LPG (BPCL) distributors.

Takes a CSV export of your customer tracker (the "KYC due" sheet) and turns it
into ready-to-run outreach campaigns for SMS and IVR, plus clean staff worklists
for the cases automation can't handle (no number / deceased-transfer).

Pure Python standard library. No installs needed:

    python3 kyc_outreach.py --input sample_data/customers_sample.csv

Outputs (into ./output by default):
    sms_campaign.csv        -> upload to your DLT-registered SMS gateway
    ivr_campaign.csv        -> upload to your IVR / voice-call provider
    worklist_no_number.csv  -> customers with no/invalid number (staff to trace)
    worklist_deceased.csv   -> deceased consumers (Transfer of Connection process)
    master_tracker.csv      -> every customer + segment + status column to update
    campaign_summary.txt     -> counts + what to do next

Config (message text, column names, links, DLT ids) lives in config.json.
"""

import argparse
import csv
import json
import os
import re
import sys
from datetime import datetime, date

DEFAULT_CONFIG = "config.json"
DEFAULT_OUTDIR = "output"


# --------------------------------------------------------------------------- #
# Config
# --------------------------------------------------------------------------- #
def load_config(path):
    if not os.path.exists(path):
        sys.exit(
            f"Config file '{path}' not found. Copy config.example.json to "
            f"config.json and edit it, or pass --config."
        )
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def find_column(headers, aliases):
    """Case/space-insensitive match of a logical field to an actual CSV header."""
    norm = {re.sub(r"[^a-z0-9]", "", h.lower()): h for h in headers}
    for alias in aliases:
        key = re.sub(r"[^a-z0-9]", "", alias.lower())
        if key in norm:
            return norm[key]
    # loose "contains" fallback
    for alias in aliases:
        key = re.sub(r"[^a-z0-9]", "", alias.lower())
        for nk, original in norm.items():
            if key and key in nk:
                return original
    return None


# --------------------------------------------------------------------------- #
# Cleaning helpers
# --------------------------------------------------------------------------- #
def clean_phone(raw):
    """
    Normalize an Indian mobile number to 10 digits.
    Returns (clean_number_or_None, reason_if_invalid).
    """
    if raw is None:
        return None, "missing"
    digits = re.sub(r"\D", "", str(raw))
    if not digits:
        return None, "missing"
    # strip country / trunk prefixes
    if len(digits) == 12 and digits.startswith("91"):
        digits = digits[2:]
    elif len(digits) == 11 and digits.startswith("0"):
        digits = digits[1:]
    elif len(digits) == 13 and digits.startswith("091"):
        digits = digits[3:]
    if len(digits) != 10:
        return None, "wrong_length"
    if digits[0] not in "6789":
        return None, "not_mobile"  # landline / invalid series
    if len(set(digits)) == 1:
        return None, "junk"  # 9999999999 etc.
    return digits, None


DEAD_WORDS = re.compile(
    r"\b(dead|deceased|expired|passed\s*away|death|late|mrit|nidhan)\b", re.I
)
UNREACHABLE_WORDS = re.compile(
    r"\b(not\s*reach|unreach|switch(ed)?\s*off|wrong\s*number|invalid|"
    r"disconnect|out\s*of\s*service|bounce|no\s*response|nr)\b",
    re.I,
)


def parse_date(raw):
    if not raw:
        return None
    raw = str(raw).strip()
    for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y", "%m/%d/%Y", "%d-%b-%Y",
                "%d %b %Y", "%d.%m.%Y", "%Y/%m/%d"):
        try:
            return datetime.strptime(raw, fmt).date()
        except ValueError:
            continue
    return None


# --------------------------------------------------------------------------- #
# Message rendering
# --------------------------------------------------------------------------- #
def render(template, row):
    """Fill {placeholders} from row dict; leave unknown ones blank."""
    def repl(m):
        return str(row.get(m.group(1), "")).strip()
    return re.sub(r"\{(\w+)\}", repl, template)


# --------------------------------------------------------------------------- #
# Core
# --------------------------------------------------------------------------- #
def process(input_path, cfg, outdir):
    with open(input_path, "r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames or []
        rows = list(reader)

    al = cfg["column_aliases"]
    col_name = find_column(headers, al["name"])
    col_phone = find_column(headers, al["phone"])
    col_status = find_column(headers, al["status"])
    col_due = find_column(headers, al["due_date"])
    col_id = find_column(headers, al["consumer_id"])
    col_lang = find_column(headers, al["language"])
    col_address = find_column(headers, al["address"])

    if not col_phone:
        print("WARNING: could not find a phone column. Everyone will land in "
              "the 'no number' worklist. Check column_aliases in config.json.")

    seen_phones = set()
    segments = {"sms": [], "ivr": [], "no_number": [], "deceased": []}
    master = []

    for row in rows:
        name = (row.get(col_name, "") or "").strip() if col_name else ""
        status_text = (row.get(col_status, "") or "") if col_status else ""
        due_raw = row.get(col_due, "") if col_due else ""
        due = parse_date(due_raw)
        consumer_id = (row.get(col_id, "") or "").strip() if col_id else ""
        lang = (row.get(col_lang, "") or "").strip() if col_lang else ""
        lang = lang or cfg.get("default_language", "en")

        phone, phone_reason = clean_phone(row.get(col_phone)) if col_phone else (None, "missing")

        # unified variables available to every template
        vars_ = {
            "name": name or "Customer",
            "consumer_id": consumer_id,
            "due_date": due.strftime("%d-%m-%Y") if due else str(due_raw).strip(),
            "distributor": cfg.get("distributor_name", ""),
            "helpline": cfg.get("helpline_number", ""),
            "kyc_video": cfg.get("kyc_help_video", ""),
        }

        segment = None
        reason = ""

        # 1) deceased -> transfer worklist (never auto-message)
        if DEAD_WORDS.search(status_text):
            segment = "deceased"
            reason = "flagged deceased"
        # 2) no / invalid number
        elif not phone:
            segment = "no_number"
            reason = f"phone {phone_reason}"
        # 3) marked unreachable earlier -> IVR (a live call can still connect,
        #    and confirms whether the number is truly dead) but not SMS
        elif UNREACHABLE_WORDS.search(status_text):
            if phone in seen_phones:
                segment = None
                reason = "duplicate number"
            else:
                seen_phones.add(phone)
                segment = "ivr"
                reason = "previously unreachable - retry by voice"
        # 4) good number -> SMS (primary) and IVR (fallback wave)
        else:
            if phone in seen_phones:
                segment = None
                reason = "duplicate number"
            else:
                seen_phones.add(phone)
                segment = "sms"
                reason = "reachable"

        master_row = {
            "consumer_id": consumer_id,
            "name": name,
            "phone": phone or (row.get(col_phone, "") if col_phone else ""),
            "language": lang,
            "kyc_due_date": vars_["due_date"],
            "segment": segment or "skipped",
            "segment_reason": reason,
            "outreach_status": "",   # staff/gateway fills: sent/delivered/done/failed
            "attempts": "",
            "last_contacted": "",
            "remarks": status_text.strip(),
        }
        master.append(master_row)

        if segment == "sms":
            segments["sms"].append({
                "phone": phone,
                "consumer_id": consumer_id,
                "name": vars_["name"],
                "language": lang,
                "template_id": cfg["sms"]["dlt_template_id"],
                "sender_id": cfg["sms"]["dlt_sender_id"],
                "message": render(cfg["sms"]["templates"].get(lang,
                             cfg["sms"]["templates"]["en"]), vars_),
            })
            # good numbers also get queued for an IVR follow-up wave
            segments["ivr"].append({
                "phone": phone,
                "consumer_id": consumer_id,
                "name": vars_["name"],
                "language": lang,
                "wave": "followup",
                "ivr_script": render(cfg["ivr"]["scripts"].get(lang,
                                cfg["ivr"]["scripts"]["en"]), vars_),
            })
        elif segment == "ivr":
            segments["ivr"].append({
                "phone": phone,
                "consumer_id": consumer_id,
                "name": vars_["name"],
                "language": lang,
                "wave": "primary",
                "ivr_script": render(cfg["ivr"]["scripts"].get(lang,
                                cfg["ivr"]["scripts"]["en"]), vars_),
            })
        elif segment == "no_number":
            segments["no_number"].append({
                "consumer_id": consumer_id,
                "name": name,
                "kyc_due_date": vars_["due_date"],
                "address": (row.get(col_address, "") if col_address else "").strip(),
                "raw_phone": row.get(col_phone, "") if col_phone else "",
                "action": "Trace via address / last cash-memo / ask on delivery",
            })
        elif segment == "deceased":
            segments["deceased"].append({
                "consumer_id": consumer_id,
                "name": name,
                "kyc_due_date": vars_["due_date"],
                "phone": phone or (row.get(col_phone, "") if col_phone else ""),
                "address": (row.get(col_address, "") if col_address else "").strip(),
                "action": "Transfer of Connection to family member "
                          "(death certificate + KYC of transferee + declaration)",
            })

    # priority sort: overdue / earliest due date first
    def due_key(item):
        d = parse_date(item.get("kyc_due_date")) or parse_date(item.get("due_date"))
        return d or date.max
    for seg in ("sms", "ivr"):
        segments[seg].sort(key=lambda r: parse_date(r.get("kyc_due_date", "")) or date.max)

    write_outputs(segments, master, outdir, cfg)
    return segments, master


def write_csv(path, rows, fieldnames):
    with open(path, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        for r in rows:
            w.writerow(r)


def write_outputs(segments, master, outdir, cfg):
    os.makedirs(outdir, exist_ok=True)

    write_csv(os.path.join(outdir, "sms_campaign.csv"), segments["sms"],
              ["phone", "consumer_id", "name", "language", "sender_id",
               "template_id", "message"])
    write_csv(os.path.join(outdir, "ivr_campaign.csv"), segments["ivr"],
              ["phone", "consumer_id", "name", "language", "wave", "ivr_script"])
    write_csv(os.path.join(outdir, "worklist_no_number.csv"), segments["no_number"],
              ["consumer_id", "name", "kyc_due_date", "address", "raw_phone", "action"])
    write_csv(os.path.join(outdir, "worklist_deceased.csv"), segments["deceased"],
              ["consumer_id", "name", "kyc_due_date", "phone", "address", "action"])
    write_csv(os.path.join(outdir, "master_tracker.csv"), master,
              ["consumer_id", "name", "phone", "language", "kyc_due_date",
               "segment", "segment_reason", "outreach_status", "attempts",
               "last_contacted", "remarks"])

    summary = build_summary(segments, master, cfg)
    with open(os.path.join(outdir, "campaign_summary.txt"), "w", encoding="utf-8") as f:
        f.write(summary)
    print(summary)


def build_summary(segments, master, cfg):
    total = len(master)
    n_sms = len(segments["sms"])
    n_ivr = len(segments["ivr"])
    n_none = len(segments["no_number"])
    n_dead = len(segments["deceased"])
    dupes = sum(1 for m in master if m["segment"] == "skipped")
    lines = [
        "=" * 60,
        " KYC OUTREACH — CAMPAIGN SUMMARY",
        "=" * 60,
        f" Total rows read ............. {total}",
        f" SMS campaign (reachable) .... {n_sms}",
        f" IVR campaign (all waves) .... {n_ivr}",
        f" No / invalid number ......... {n_none}  -> worklist_no_number.csv",
        f" Deceased (transfer) ......... {n_dead}  -> worklist_deceased.csv",
        f" Skipped (duplicate number) .. {dupes}",
        "-" * 60,
        " NEXT STEPS",
        "  1. SMS: upload sms_campaign.csv to your DLT-registered gateway.",
        "     Message maps to DLT template id "
        f"{cfg['sms']['dlt_template_id']} / header {cfg['sms']['dlt_sender_id']}.",
        "  2. IVR: upload ivr_campaign.csv to your voice provider. Run the",
        "     'primary' wave first (previously-unreachable), then 'followup'",
        "     3-4 days after SMS to catch non-responders.",
        "  3. No-number list: hand to delivery staff — capture number on next",
        "     cylinder delivery / from cash-memo history.",
        "  4. Deceased list: start Transfer of Connection with the family.",
        "  5. As replies/deliveries come in, update outreach_status in",
        "     master_tracker.csv (sent/delivered/kyc_done/failed).",
        "=" * 60,
    ]
    return "\n".join(lines) + "\n"


def main():
    ap = argparse.ArgumentParser(description="KYC outreach campaign builder")
    ap.add_argument("--input", "-i", required=True, help="CSV export of your tracker")
    ap.add_argument("--config", "-c", default=DEFAULT_CONFIG)
    ap.add_argument("--outdir", "-o", default=DEFAULT_OUTDIR)
    args = ap.parse_args()

    cfg = load_config(args.config)
    if not os.path.exists(args.input):
        sys.exit(f"Input file not found: {args.input}")
    process(args.input, cfg, args.outdir)


if __name__ == "__main__":
    main()
