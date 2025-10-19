# PWA Deployment Guide - What Is This?

## Overview
This guide covers deploying "What Is This?" as a Progressive Web App (PWA) that users can install on their iOS devices via Safari's "Add to Home Screen" feature.

---

## Prerequisites

- Replit account with your project
- Custom domain (optional but recommended for branding)
- Updated pricing tiers implemented ($0.49-$144.99)
- Image quality validation active
- Confidence scoring enabled

---

## Step 1: Publish to Replit

### 1.1 Static Deployment (Recommended)

Since this is a React + Express app with backend, you'll use **Autoscale Deployment**:

1. Click **"Publish"** button in Replit workspace
2. Select **"Autoscale Deployment"**
3. Configure settings:
   - **Name**: what-is-this-app
   - **Environment**: Production
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. Click **"Deploy"**

### 1.2 Environment Variables

Ensure these secrets are set in your deployment:
- `OPENAI_API_KEY` - Your OpenAI API key
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Random string for session encryption
- `RESEND_API_KEY` - For password reset emails
- `NODE_ENV=production`

---

## Step 2: Add PWA Manifest

### 2.1 Create manifest.json

Create `public/manifest.json`:

```json
{
  "name": "What Is This?",
  "short_name": "What Is This",
  "description": "AI-powered image analysis for seniors and non-English speakers",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0066cc",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### 2.2 Create App Icons

Generate icons at:
- **192x192px** → `public/icon-192.png`
- **512x512px** → `public/icon-512.png`
- **180x180px** → `public/apple-touch-icon.png` (iOS specific)

**Icon Design Tips:**
- Simple, recognizable symbol (e.g., question mark in circle)
- High contrast
- No text (will be too small)
- Square with rounded corners

### 2.3 Add iOS-Specific Meta Tags

Update `index.html` `<head>`:

```html
<!-- PWA Manifest -->
<link rel="manifest" href="/manifest.json">

<!-- iOS Specific -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="What Is This">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">

<!-- Theme Color -->
<meta name="theme-color" content="#0066cc">

<!-- Viewport (ensure this exists) -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

---

## Step 3: Configure Custom Domain (Optional)

### 3.1 Purchase Domain

**Option A: Through Replit**
1. Go to **Publishing** → **Settings** → **Purchase Domain**
2. Search for available domains
3. Purchase directly ($10-20/year)

**Option B: External Registrar**
- Namecheap: ~$9/year (.com)
- Google Domains: ~$12/year
- Cloudflare: ~$9/year

### 3.2 Point Domain to Replit

If purchased externally:

1. In Replit Publishing → **Settings** → **Custom Domain**
2. Enter your domain: `whatisthis.app`
3. Copy the DNS records shown:
   - **A Record**: `100.100.100.100` (example)
   - **TXT Record**: For verification

4. In your domain registrar:
   - Add A record: `@` → Replit's IP
   - Add TXT record for verification
   - Wait 5-60 minutes for DNS propagation

5. Click **"Verify"** in Replit

Replit automatically provides:
- **Free SSL/TLS certificate** (HTTPS)
- **Global CDN**
- **DDoS protection**

---

## Step 4: Email Domain Setup (Resend)

See `EMAIL_DOMAIN_SETUP.md` for complete DNS configuration.

Quick steps:
1. Add domain to Resend dashboard
2. Add 3 DNS records (SPF, DKIM, MX)
3. Verify domain
4. Update `RESEND_API_KEY` in environment

---

## Step 5: Create Service Worker (Optional)

For offline support, create `public/service-worker.js`:

```javascript
const CACHE_NAME = 'whatisthis-v1';
const urlsToCache = [
  '/',
  '/offline.html',
  // Add critical assets
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
      .catch(() => caches.match('/offline.html'))
  );
});
```

Register in `index.html`:
```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
</script>
```

---

## Step 6: iOS Installation Instructions

Create in-app banner showing users how to install:

### 6.1 Detect iOS Safari

```typescript
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

if (isIOS && !isStandalone) {
  // Show installation banner
}
```

### 6.2 Installation Steps to Show Users

**Text for Banner:**
> **Install App on Your Home Screen**
> 
> 1. Tap the Share button (box with arrow)
> 2. Scroll down and tap "Add to Home Screen"
> 3. Tap "Add" in the top right
> 4. App will appear on your home screen!

**Visual Guide:**
Include screenshots showing:
- Share button location
- "Add to Home Screen" option
- Confirmation screen

---

## Step 7: Testing the PWA

### 7.1 Desktop Testing
1. Open Chrome DevTools → **Application** tab
2. Check:
   - ✅ Manifest loads correctly
   - ✅ Service worker registered
   - ✅ Icons display properly

### 7.2 iOS Testing
1. Open in Safari on iPhone/iPad
2. Test installation flow:
   - Share → Add to Home Screen
3. Launch from home screen
4. Verify:
   - ✅ App opens in standalone mode (no Safari UI)
   - ✅ Status bar matches theme color
   - ✅ Splash screen shows app icon
   - ✅ Camera/upload features work
   - ✅ Stripe payments work

### 7.3 Lighthouse Audit
1. Chrome DevTools → **Lighthouse** tab
2. Select "Progressive Web App"
3. Run audit
4. Target score: **90+**

---

## Step 8: Monitoring & Analytics

### 8.1 Error Tracking
Add Sentry (free tier):
```bash
npm install @sentry/react
```

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

### 8.2 Analytics
Consider:
- **Google Analytics 4** (free, comprehensive)
- **Plausible** ($9/month, privacy-focused)
- **Mixpanel** (free tier, event tracking)

Track key events:
- App installs
- Image analyses
- Subscription conversions
- Error rates

---

## Step 9: Beta Testing

See `BETA_TESTING_GUIDE.md` for complete audience recruitment strategies.

Quick start:
1. Deploy to production URL
2. Create TestFlight-style feedback form
3. Recruit testers from:
   - r/TestMyApp (Reddit)
   - BetaList.com
   - Friends/family in target demographic
4. Collect feedback via:
   - In-app feedback button
   - Google Form
   - Email survey

---

## Troubleshooting

### Issue: PWA won't install on iOS
**Solution:**
- Ensure HTTPS is enabled
- Check manifest.json is accessible at `/manifest.json`
- Verify `apple-mobile-web-app-capable` meta tag exists
- Test in Safari only (Chrome/Firefox on iOS don't support install)

### Issue: Icons don't appear
**Solution:**
- Clear browser cache
- Verify icon paths are correct
- Check icon dimensions match manifest
- Ensure icons are square PNG files

### Issue: Stripe payments fail
**Solution:**
- Verify `NODE_ENV=production`
- Check Stripe publishable key is production key
- Test with Stripe test cards first

### Issue: Camera doesn't work
**Solution:**
- Ensure HTTPS is enabled (required for camera access)
- Check browser permissions
- Test on actual device (desktop webcam vs mobile camera)

---

## Launch Checklist

Before public launch:

- [ ] Terms of Service page added and linked
- [ ] Privacy Policy updated with AI disclaimers
- [ ] Email domain configured (password reset working)
- [ ] OpenAI API quota sufficient (check billing)
- [ ] Database backups enabled
- [ ] Error monitoring setup
- [ ] Analytics tracking implemented
- [ ] iOS installation tested on real device
- [ ] Pricing displayed correctly ($0.49-$144.99)
- [ ] Stripe payment flow tested (test mode → production)
- [ ] All 11 languages working (en, es, zh, fr, de, it, pt, ru, he, ja, ko)
- [ ] Image quality validation active
- [ ] Confidence scoring visible
- [ ] FAQ/Help content complete

---

## Post-Launch

### Week 1:
- Monitor error rates daily
- Check user feedback
- Watch OpenAI API costs
- Track conversion rates

### Month 1:
- Collect user testimonials
- Iterate based on feedback
- Optimize AI prompts if accuracy issues
- Consider adding features from user requests

### Ongoing:
- Monthly security updates
- Quarterly pricing review
- Annual Terms/Privacy updates
- OpenAI API version updates

---

## Support Resources

- **Replit Docs**: https://docs.replit.com/hosting/deployments
- **PWA Guide**: https://web.dev/progressive-web-apps/
- **iOS PWA**: https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html
- **Stripe Mobile**: https://stripe.com/docs/payments/accept-a-payment
- **Resend**: https://resend.com/docs

---

**Estimated Deployment Time**: 2-4 hours (first time), 30 minutes (updates)

**Cost**: $0/month (Replit Autoscale starts free, scales with usage)
