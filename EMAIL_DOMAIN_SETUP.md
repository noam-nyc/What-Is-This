# Email Domain Setup Guide - Resend

## Overview

This guide walks you through configuring a custom domain for email delivery using Resend. This enables password reset emails to be sent from your branded domain (e.g., `noreply@whatisthis.app`) instead of a generic service.

---

## Why Use a Custom Domain?

**Benefits:**
- ✅ **Professional branding**: Emails from `noreply@yourapp.com` instead of `noreply@resend.dev`
- ✅ **Better deliverability**: Custom domains have higher email delivery rates
- ✅ **Trust**: Users are more likely to open emails from your domain
- ✅ **Separation**: Password resets, notifications use different subdomains for organization

**Cost**: FREE (included with Resend free tier: 3,000 emails/month)

---

## Prerequisites

- Registered domain name (`whatisthis.app`, `example.com`, etc.)
- Access to DNS settings at your registrar (Namecheap, Cloudflare, GoDaddy, etc.)
- Resend account (sign up at https://resend.com)

---

## Step 1: Get Resend API Key

1. Sign up at https://resend.com
2. Go to **API Keys** → **Create API Key**
3. Name it "Production"
4. Copy the key (starts with `re_...`)
5. Add to Replit Secrets:
   - Key: `RESEND_API_KEY`
   - Value: `re_xxxxxxxxxxxxx`

---

## Step 2: Choose Your Email Domain

**Option A: Use Subdomain (Recommended)**
- Format: `updates.whatisthis.app` or `mail.yourapp.com`
- Pros: 
  - Keeps main domain clean
  - Better reputation management
  - Can use different subdomains for different email types
- Examples:
  - `noreply@updates.whatisthis.app`
  - `support@mail.yourapp.com`

**Option B: Use Root Domain**
- Format: `whatisthis.app`
- Pros: Simpler, shorter
- Cons: Mixes web traffic with email reputation

**Recommendation**: Use subdomain like `mail.yourapp.com`

---

## Step 3: Add Domain to Resend

1. Log into https://resend.com/domains
2. Click **"Add Domain"**
3. Enter your domain:
   - Subdomain: `mail.whatisthis.app`
   - Or root: `whatisthis.app`
4. Click **"Add Domain"**

Resend will show you 3 DNS records to add:

---

## Step 4: Configure DNS Records

You need to add **3 types of records** to your domain's DNS:

### Record 1: SPF (TXT Record)

**Purpose**: Lists servers authorized to send email on your behalf

| Field | Value |
|-------|-------|
| **Type** | TXT |
| **Name** | `mail` (or your subdomain) |
| **Value** | `v=spf1 include:_spf.resend.com ~all` |
| **TTL** | 3600 (or Auto) |

**Example** (for `mail.whatisthis.app`):
```
Type: TXT
Name: mail
Value: v=spf1 include:_spf.resend.com ~all
```

### Record 2: DKIM (TXT Record)

**Purpose**: Cryptographic signature to verify email authenticity

| Field | Value |
|-------|-------|
| **Type** | TXT |
| **Name** | `resend._domainkey.mail` |
| **Value** | `[Long string provided by Resend]` |
| **TTL** | 3600 |

**Example**:
```
Type: TXT
Name: resend._domainkey.mail
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQ...
```

### Record 3: MX (Mail Exchange)

**Purpose**: Routes bounces and feedback to Resend

| Field | Value |
|-------|-------|
| **Type** | MX |
| **Name** | `mail` |
| **Value** | `feedback-smtp.us-east-1.amazonses.com` |
| **Priority** | 10 |
| **TTL** | 3600 |

**Example**:
```
Type: MX
Name: mail
Priority: 10
Value: feedback-smtp.us-east-1.amazonses.com
```

---

## Step 5: Add Records to Your DNS Provider

### Cloudflare

1. Go to **DNS** → **Records**
2. Click **"Add record"**
3. For each record above:
   - Select **Type** (TXT or MX)
   - Enter **Name** (omit your domain, use `mail` not `mail.whatisthis.app`)
   - Paste **Value** from Resend
   - Set **Proxy status** to **DNS only** (grey cloud)
4. Click **"Save"**

### Namecheap

1. Go to **Advanced DNS**
2. Click **"Add New Record"**
3. For each record:
   - Select type
   - Enter **Host** (e.g., `mail`)
   - Paste **Value**
4. Save changes

### GoDaddy

1. Go to **DNS Management**
2. Click **"Add"** for each record type
3. Fill in details and save

### Other Providers

Follow similar steps - key points:
- **Remove domain suffix from Name field** (use `mail`, not `mail.whatisthis.app`)
- **Copy values exactly** from Resend (no typos!)
- **Turn off proxy/CDN** for email records (if applicable)

---

## Step 6: Verify Domain

1. After adding all 3 DNS records, wait **5-30 minutes** for DNS propagation
2. Return to Resend dashboard
3. Click **"Verify DNS Records"**
4. Status should change to **"Verified"** ✅

**If verification fails:**
- Wait longer (DNS can take up to 48 hours, though usually 5-30 minutes)
- Double-check records match exactly (case-sensitive!)
- Ensure you removed domain suffix from Name field
- Use DNS checker: https://dnschecker.org

---

## Step 7: Test Email Sending

### Method 1: Resend Dashboard

1. Go to **Domains** → Your domain
2. Click **"Send Test Email"**
3. Enter your email address
4. Click **"Send"**
5. Check inbox (and spam folder)

### Method 2: Test in Your App

1. Go to `/forgot-password` in your app
2. Enter your email
3. Click **"Send Reset Link"**
4. Check inbox for password reset email

**Expected From Address**: `noreply@mail.whatisthis.app`

---

## Step 8: Update Application Code (If Needed)

The app already uses Resend, but verify:

**File: `server/routes.ts`** (password reset function)

```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'What Is This <noreply@mail.whatisthis.app>', // Update this
  to: user.email,
  subject: 'Reset Your Password - What Is This?',
  html: emailHtml,
});
```

**Make sure `from` matches your verified domain!**

---

## Troubleshooting

### Issue: "Domain not verified"

**Solutions:**
1. Wait up to 48 hours for DNS propagation
2. Check DNS records with: `nslookup -type=txt mail.whatisthis.app`
3. Ensure Priority 10 for MX record
4. Remove any conflicting MX records

### Issue: Emails go to spam

**Solutions:**
1. Add **DMARC record** (optional but recommended):
   ```
   Type: TXT
   Name: _dmarc.mail
   Value: v=DMARC1; p=none; rua=mailto:your-email@example.com
   ```
2. Warm up domain (send gradually increasing volume)
3. Check email content for spam triggers
4. Ensure proper SPF/DKIM setup

### Issue: "Can't send from this domain"

**Solutions:**
1. Verify domain is "Verified" in Resend
2. Check `from` address matches exactly: `noreply@mail.whatisthis.app`
3. Ensure RESEND_API_KEY is correct in environment

### Issue: MX record conflicts

**Solutions:**
- If Priority 10 is taken, use 11 or 12
- Resend only needs MX for bounces, not primary mail
- You can use different subdomain for email vs app

---

## DNS Record Summary

**Quick Copy-Paste for `mail.yourapp.com`:**

| Type | Name | Value | Priority |
|------|------|-------|----------|
| TXT | `mail` | `v=spf1 include:_spf.resend.com ~all` | - |
| TXT | `resend._domainkey.mail` | `[From Resend Dashboard]` | - |
| MX | `mail` | `feedback-smtp.us-east-1.amazonses.com` | 10 |

---

## Optional: Add DMARC for Better Deliverability

DMARC tells email providers how to handle emails that fail SPF/DKIM checks.

**Add 4th DNS Record:**

| Field | Value |
|-------|-------|
| **Type** | TXT |
| **Name** | `_dmarc.mail` |
| **Value** | `v=DMARC1; p=none; rua=mailto:admin@yourapp.com` |

**Explanation:**
- `p=none`: Monitor mode (don't reject failed emails yet)
- `rua=mailto:...`: Send reports to this email
- Later, change to `p=quarantine` or `p=reject` for stricter enforcement

---

## Cost Breakdown

**Resend Pricing:**

| Tier | Monthly Emails | Cost | Notes |
|------|----------------|------|-------|
| **Free** | 3,000 | $0 | Perfect for starting |
| **Pro** | 50,000 | $20 | If you scale |
| **Business** | 100,000+ | Custom | Enterprise |

**Your App Usage:**
- 100 users → ~50 password resets/month → **FREE tier**
- 1,000 users → ~200 resets/month → **FREE tier**
- 10,000 users → ~1,000 resets/month → **FREE tier**
- 100,000 users → ~5,000 resets/month → **$20/month Pro**

**Conclusion**: Email costs will be $0 for a long time!

---

## Security Best Practices

1. **Never expose RESEND_API_KEY** in frontend or public repos
2. **Use environment variables** (already implemented)
3. **Rate limit** password resets (already implemented: 1/hour per email)
4. **Monitor sending** via Resend dashboard for abuse
5. **Set up DMARC** after initial testing

---

## Next Steps

After email is working:

1. ✅ Test password reset flow end-to-end
2. ✅ Add other email types:
   - Welcome email for new signups
   - Subscription confirmation
   - Usage limit warnings
3. ✅ Monitor deliverability in Resend dashboard
4. ✅ Set up DMARC after 1 week of successful sending
5. ✅ Consider branded templates using Resend's React Email

---

## Support Resources

- **Resend Docs**: https://resend.com/docs
- **DNS Checker**: https://dnschecker.org
- **SPF/DKIM Validator**: https://mxtoolbox.com/SuperTool.aspx
- **Email Testing**: https://www.mail-tester.com

---

**Estimated Setup Time**: 15-30 minutes

**Cost**: $0 (Free tier covers most startups)

**Complexity**: ⭐⭐ (2/5) - Just DNS records!
