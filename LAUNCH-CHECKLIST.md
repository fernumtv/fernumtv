# Fernum AdPass Launch Checklist

## 1. Domain Configuration in Vercel
To ensure the canonical apex domain `https://fernum.online` functions as primary without redirect loops:
1. Log into your **Vercel Dashboard** -> Select the **fernum** project.
2. Navigate to **Settings > Domains**.
3. Under the domains list, ensure both `fernum.online` and `www.fernum.online` are added.
4. Set `fernum.online` as primary and configure `www.fernum.online` to redirect to `fernum.online` (or use the redirects in `vercel.json`).
5. Vercel automatically manages SSL/TLS and redirects HTTP to HTTPS.

---

## 2. Search Engine Indexing (Transition from TEST MODE to Production)
While TEST MODE is active, all public pages carry `noindex, nofollow` to prevent search engines from indexing test banners or draft checkout states.
When you are ready to index the site publicly:
1. Set the Vercel environment variable:
   ```bash
   NEXT_PUBLIC_INDEXING_ENABLED=true
   ```
2. In `vercel.json`, permanent noindex headers are preserved on non-indexable routes (`/login`, `/portal`, `/thanks`, and `/cancelled`).
3. Redeploy the site on Vercel.

---

## 3. Environment Variables Reference Table (Vercel Project Settings)

| Variable Name | Exposure | Required / Optional | Location / Usage | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `RESEND_API_KEY` | **Secret (Server Only)** | Recommended | `src/app/api/brief/route.ts` | Resend API key for delivering creative brief emails to the studio team. |
| `BRIEF_TO_EMAIL` | **Secret (Server Only)** | Optional | `src/app/api/brief/route.ts` | Destination email where creative briefs are delivered (defaults to `fernumtv@gmail.com`). |
| `BRIEF_FROM_EMAIL` | **Secret (Server Only)** | Optional | `src/app/api/brief/route.ts` | Sender email address for briefs (e.g., `Fernum Studio <onboarding@resend.dev>`). |
| `NEXT_PUBLIC_FORM_FALLBACK_URL` | Public | Optional | `src/app/api/brief/route.ts` | Optional Formspree or Web3Forms fallback endpoint if Resend is not configured. |
| `NEXT_PUBLIC_APP_URL` | Public | Optional | `src/config/site.ts` | Base canonical application URL (`https://fernum.online`). |
| `NEXT_PUBLIC_DODO_TEST_MODE` | Public | Optional | `src/config/site.ts` | Controls whether Dodo checkout URLs point to test or live endpoints (`true`/`false`). |
| `NEXT_PUBLIC_DODO_CUSTOMER_PORTAL_URL` | Public | Optional | `src/config/site.ts` | URL for Dodo customer subscription self-serve portal. |
| `NEXT_PUBLIC_BOOKING_URL` | Public | Optional | `src/config/site.ts` | Calendly 30-min strategy booking URL. |
| `NEXT_PUBLIC_INDEXING_ENABLED` | Public | Optional | `src/config/site.ts` | Controls search engine indexability meta tag. |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Optional | `src/lib/supabase/client.ts` | Supabase project URL for authentication. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Optional | `src/lib/supabase/client.ts` | Public anonymous key for client-side authentication. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret (Server Only)** | Optional | `src/lib/supabase/server.ts` | Server-only admin key for elevated database queries. |
| `APP_SECRET` | **Secret (Server Only)** | Optional | `src/lib/auth/session.ts` | 32+ byte string used for JWT session signature encryption. |
| `GEMINI_API_KEY` | **Secret (Server Only)** | Optional | `src/lib/ai/vision/adapter.ts` | Server-only API key for automated creative quality analysis. |
| `FAL_KEY` | **Secret (Server Only)** | Optional | `src/lib/ai/providers/fal-flux.ts` | Server-only API key for video/animatic generation. |
| `ELEVENLABS_API_KEY` | **Secret (Server Only)** | Optional | `src/lib/ai/providers/elevenlabs.ts` | Server-only API key for AI voiceover generation. |

---

## 4. Verification Check Commands
- Check secrets in codebase:
  ```bash
  npm run check-secrets
  ```
- Run metadata audit:
  ```bash
  node scripts/check-metadata.js
  ```
- Run live site audit:
  ```bash
  node scripts/check-live.js
  ```
