# Fernum AdPass Launch Checklist

## 1. Domain Configuration in Netlify
To ensure the canonical apex domain `https://fernum.online` functions as primary without redirect loops:
1. Log into your **Netlify Dashboard** -> Select the **fernum** site.
2. Navigate to **Site configuration > Domain management > Domains**.
3. Under the domains list, locate `fernum.online` and `www.fernum.online`.
4. Click the **Options (three dots)** button next to `fernum.online` and select **Set as primary domain**.
5. Netlify will now automatically make `https://fernum.online` primary and 301 redirect all `www.fernum.online` requests to `https://fernum.online`.

---

## 2. Search Engine Indexing (Transition from TEST MODE to Production)
While TEST MODE is active, all public pages carry `noindex, nofollow` to prevent search engines from indexing test banners or draft checkout states.
When you are ready to index the site publicly:
1. Set the Netlify environment variable:
   ```bash
   NEXT_PUBLIC_INDEXING_ENABLED=true
   ```
2. In `netlify.toml`, remove or comment out the global test header:
   ```toml
   # X-Robots-Tag = "noindex, nofollow"
   ```
   *(Keep the permanent noindex blocks on `/login`, `/portal`, `/thanks`, `/cancelled`, and `/404`).*
3. Redeploy the site.

---

## 3. Environment Variables Reference Table

| Variable Name | Exposure | Required / Optional | Location / Usage | Purpose |
| :--- | :--- | :--- | :--- | :--- |
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
