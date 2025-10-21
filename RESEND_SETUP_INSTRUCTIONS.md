# Resend Email Configuration - Quick Setup

## ✅ Domain Secured
- **Production domain**: what-is-this.app
- **Support email**: info@what-is-this.app

## 🔧 Next Steps to Configure Resend

### 1. Configure DNS Records
Follow the detailed instructions in `EMAIL_DOMAIN_SETUP.md` to:
- Add SPF, DKIM, and MX records to your DNS provider
- Wait for DNS propagation (up to 48 hours, usually faster)
- Verify domain in Resend dashboard

### 2. Update Resend Connector Settings in Replit

Once DNS is configured and domain is verified in Resend:

1. Open Replit **Secrets** or **Integrations** panel
2. Find the **Resend** integration/connector
3. Update the `from_email` setting to: `info@what-is-this.app`
   - Full format: `What Is This <info@what-is-this.app>`
4. Ensure `RESEND_API_KEY` is set correctly

### 3. Test Email Delivery

After configuration:
1. Navigate to `/forgot-password` in your app
2. Request a password reset
3. Check your inbox for the reset email
4. Verify the "From" address shows: `info@what-is-this.app`

## 📝 Code Updates Already Completed

All code references have been updated to use `info@what-is-this.app`:
- ✅ Help page support email
- ✅ Privacy Policy contact emails
- ✅ Documentation examples
- ✅ Email templates

The app will automatically use the `from_email` setting from the Resend connector configuration.

## 🆘 Troubleshooting

If emails aren't sending:
1. Verify DNS records are propagated: `nslookup -type=txt what-is-this.app`
2. Check Resend dashboard shows domain as "Verified"
3. Confirm `from_email` in Resend connector matches exactly: `info@what-is-this.app`
4. Check server logs for email sending errors

For detailed troubleshooting, see `EMAIL_DOMAIN_SETUP.md` - Step 9.
