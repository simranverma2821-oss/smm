# KYC Outreach Automation (LPG / BPCL distributor)

Turns your messy "KYC due" customer sheet into ready-to-run **SMS** and **IVR**
campaigns, plus clean staff worklists for the cases that need a human
(no number, deceased → transfer). Pure Python, no installs.

## Why this exists
Chasing KYC-due customers one by one is slow. This splits the whole list
automatically so 80%+ go out as bulk SMS/IVR in one click, and your staff only
touch the genuine exceptions.

## Quick start
```bash
# 1. Export your Google Sheet: File -> Download -> Comma-separated values (.csv)
# 2. Copy the config and edit it (message text, links, DLT ids, helpline)
cp config.example.json config.json      # then edit config.json
# 3. Run
python3 kyc_outreach.py --input path/to/your_export.csv
```
Outputs land in `./output/`.

## What you get
| File | What to do with it |
|------|--------------------|
| `sms_campaign.csv` | Upload to your DLT-registered SMS gateway |
| `whatsapp_campaign.csv` | Upload to your WhatsApp Business API provider (cheapest for Punjabi/Hindi). Each row also has a `wa_link` — a tap-to-send link staff can use by hand, no API needed |
| `ivr_campaign.csv` | Upload to your IVR / voice-call provider (2 waves) |
| `worklist_no_number.csv` | Delivery staff capture number on next cylinder drop |
| `worklist_deceased.csv` | Start Transfer of Connection with the family |
| `master_tracker.csv` | Your new source of truth — update status as replies come |
| `campaign_summary.txt` | Counts + next steps |

## How customers are segmented
1. **Deceased** (status says dead/expired/late/नidhan) → transfer worklist, never messaged.
2. **No / invalid number** (blank, junk like 9999999999, landline series) → trace worklist.
3. **Previously unreachable** (switched off / wrong number / NR) → IVR **primary** wave — a live call still connects and confirms if the number is truly dead. No SMS.
4. **Reachable** → SMS now + IVR **followup** wave 3–4 days later for non-responders.
Duplicate mobile numbers are skipped automatically.

## Configuring for your agency
Everything lives in `config.json`:
- `column_aliases` — the tool auto-detects your sheet's column names; add yours if it misses.
- `sms.dlt_sender_id` / `sms.dlt_template_id` — your approved DLT header + template id.
- `sms.templates` / `ivr.scripts` — message text per language (`en`, `hi` shipped; add more).
- `helpline_number`, `kyc_help_video`, `distributor_name`.

### Cutting cost (Punjabi/Hindi are ~3x the SMS length of English)
- **Short SMS:** set `"use_short": true` in `config.json` → uses the shorter `short_templates`, roughly a third of the SMS cost. Details then go in the IVR call / WhatsApp instead.
- **WhatsApp:** cheapest per message for Punjabi/Hindi and carries the video. Reaches smartphone users only. Uses `whatsapp.templates`; register the template text with your provider under `whatsapp.template_name`.

> The shipped SMS/IVR wording must match the text you register on DLT **word for word**
> (only the `{...}` variables may differ). Register the template first, then paste the
> approved text into `config.json`.

See `SOP.md` for the compliance rules (DLT, DND, calling hours) and the day-by-day
runbook.
