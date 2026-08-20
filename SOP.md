# KYC Outreach — Standard Operating Procedure

A repeatable runbook so KYC-due outreach becomes a weekly 30-minute job instead
of a manual grind. Read this once before your first campaign.

## 1. Compliance first (India) — do not skip
Getting this right is what keeps your sender working and keeps you on the right
side of TRAI.

- **DLT registration (mandatory for SMS).** Register your business (Principal
  Entity) on any operator's DLT portal, register your **Header/Sender ID**
  (e.g. `BPCLKY`), and register each **content template** with its exact text.
  You can only send text that matches an approved template. Put the approved
  template id in `config.json`.
- **Message category = Service / Transactional, not Promotional.** A KYC
  reminder to *your own existing customer* is a service message. Register it as
  Service-Explicit / Service-Implicit. This matters because **service messages
  reach customers even if they are on DND**, while promotional ones do not.
  Keep the wording factual (reminder + how-to + helpline), no offers/marketing —
  that is what keeps it in the service category.
- **Calling / messaging hours.** Keep automated SMS and IVR within **9:00 AM –
  9:00 PM**. It is the safe window and gets far better pickup anyway.
- **IVR consent & opt-out.** Voice broadcasts should identify you at the start
  and offer a way to talk to a human (the script's "press 2"). Honour any
  "do not call" requests — mark them `opt_out` in the tracker and exclude them
  next run.
- **Data.** This is your customers' personal data. Keep exports on a company
  machine, don't forward the raw sheet outside the agency, and delete old
  exports you no longer need.

## 2. One-time setup
1. Get DLT header + KYC template approved (section 1).
2. Record a short **home-KYC how-to video** (or use BPCL's official one) and put
   the link in `config.json` → `kyc_help_video`.
3. Pick an SMS gateway and an IVR/voice provider that accept CSV upload.
4. Fill in `config.json`: distributor name, helpline, DLT ids, message text.

## 3. Weekly runbook
**Day 0 — build the campaign**
1. Update your Google Sheet (mark new deaths, wrong numbers, done KYCs).
2. Download it as CSV.
3. `python3 kyc_outreach.py --input this_week.csv`
4. Read `campaign_summary.txt` — sanity-check the counts.

**Day 0 — send wave 1**
5. Upload `sms_campaign.csv` to the SMS gateway.
6. Upload the **`primary`** rows of `ivr_campaign.csv` (previously-unreachable) to
   the voice provider — a live call is your best shot at these.

**Day 1 — exceptions to staff**
7. Give `worklist_no_number.csv` to delivery staff: capture the mobile number on
   the next cylinder delivery, from cash-memo history, or from the DBC register.
   Add the numbers back into the sheet for next week's run.
8. Give `worklist_deceased.csv` to office staff: begin **Transfer of Connection**
   for each — death certificate, KYC of the family member taking over, and the
   transfer declaration. This is the legitimate route when the registered
   consumer has passed away.

**Day 3–4 — send wave 2**
9. Upload the **`followup`** IVR rows for everyone who got an SMS but hasn't done
   KYC yet (filter `master_tracker.csv` where `outreach_status` is blank).

**Ongoing — close the loop**
10. As deliveries confirm KYC done / numbers corrected / opt-outs, update
    `master_tracker.csv` (or your sheet). That file is your live status board.

## 4. Escalation ladder for a single customer
SMS → (no action in 3–4 days) → IVR call → (still nothing) → flag for a **human
call** from staff → (unreachable) → **capture/confirm number on next delivery**
→ (confirmed dead / moved) → **Transfer of Connection** or de-activation.

## 5. What to measure
Track these weekly from `master_tracker.csv` so you know it's working:
- % of list reachable by SMS/IVR vs. needing a human
- KYC completion rate per wave (SMS vs. IVR vs. delivery-staff)
- Numbers corrected via delivery capture
- Transfers opened / completed

## 6. A note on the tricky cases you raised
- **"Some numbers unreachable"** → these go to the IVR primary wave first (a
  voice call connects when SMS silently fails), then to a human, then to
  number-capture on delivery. You stop wasting SMS credits on dead numbers.
- **"Some have no number"** → automation can't reach them; the fastest real fix
  is capturing the number at the doorstep on the next delivery. The worklist is
  built for exactly that.
- **"Some are dead"** → don't message the deceased. Route the family to the
  official **Transfer of Connection**, which keeps the connection active under a
  surviving family member's name and completes their KYC in the same step.
