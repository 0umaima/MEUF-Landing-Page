# MEUF — Top Bardot Oversize

A responsive, mobile-first landing page in Moroccan Darija with French/English product details. Plain HTML/CSS/JavaScript; no frontend build tools. Original supplied photography is compressed to WebP without generative alterations; logo is trimmed to its transparent bounds and favicon resized.

## 1. Preview locally (no orders are sent)

Unzip, open this folder in VS Code, then use a local web server (ES modules do not work reliably via file://).

- With VS Code Live Server: open `public/index.html` with Live Server. If your server uses the project root, go to `/public/`.
- Or use `python -m http.server 8000 --directory public` from this folder and visit http://localhost:8000.
- Select a color, gallery angle, size and quantity; use fictional name, Moroccan phone, city and address to test. The thank-you page explicitly identifies a demo order.

`npm test` runs the included Node.js validation tests (Node 20+; no dependencies).

## 2. Configure product and delivery

Edit `public/js/config.js`. Price 129 MAD, former price 200 MAD, 3 colors and S/M/L/XL are already set. The displayed discount is rounded down to 35% (actual reduction 35.5%). Confirm delivery coverage and set `shippingFee` to your **actual** fixed delivery fee in MAD (0 only if free); if fees vary by city, extend the server-side fee calculation before going live. `null` means unknown and prevents live checkout. Change `promotion` to false when the offer ends. Review the product description and promotion; add verified business/contact details, applicable privacy notice, retention policy, returns/exchanges and shipping terms before launch. No claims about material, free delivery, stock or exchanges have been invented.

## 3. Set up Google Sheets and Apps Script

1. Create a private Google Sheet, e.g. `MEUF - Commandes`. Copy its spreadsheet ID from the URL between `/d/` and `/edit`.
2. In the sheet choose Extensions > Apps Script. Replace the contents of `Code.gs` with `google-apps-script/Code.gs` from this ZIP.
3. Open Project Settings > Script properties and add `SPREADSHEET_ID` (your ID) and `ORDER_SECRET` (a long random secret, at least 32 bytes; use a password generator). Never share either the sheet or the secret publicly.
4. Run `setup` manually and authorize access. It creates the `Commandes` tab and headers. Don't reorder the headers. Add a status dropdown manually if wanted: Nouveau, Confirmé, Expédié, Livré, Annulé.
5. Deploy > New deployment > Web app. Execute as **Me**, access **Anyone** (if allowed by your Google account). Authorize, copy the `/exec` URL. The public endpoint requires the secret provided only by your server; the spreadsheet stays private.
6. For subsequent Apps Script changes, edit the deployment and select a new version.

Orders contain unique request and order IDs, timestamp, customer details, variant, quantity, server-calculated amounts, status, optional opted-in ad attribution. Locking and request IDs protect against repeat submissions; retries within the same page reuse the request ID. Google Sheets is the primary store; no separate database is used. Keep access restricted and export backups regularly.

## 4. Deploy Cloudflare Pages

1. Create a GitHub repository, push this folder (never commit `.dev.vars` or private credentials). Use a private repository if desired.
2. In Cloudflare dashboard, create a **Pages** project connected to GitHub. Set framework preset None, build command empty, output directory `public`, root directory the repository root. `functions/` must be at the repository root. Do not upload only the public directory as a static-only site if you need the API.
3. Deploy and open the generated `*.pages.dev` URL. Demo mode remains active.
4. Create a Cloudflare Turnstile widget allowing the actual website hostname(s). Copy the public site key into `public/js/config.js`. Add the private secret key as a Pages secret named `TURNSTILE_SECRET`.
5. In Pages project settings, set encrypted secrets for the appropriate production (and preview, if used) environment: `APPS_SCRIPT_URL`, `ORDER_SECRET` and `TURNSTILE_SECRET`. Use the same ORDER_SECRET as in Apps Script. The Apps Script URL should be the trusted Google `/exec` URL.
6. Set the real `shippingFee`, `turnstileSiteKey` and then `demoMode: false` in the public config. Commit and redeploy. Confirm the backend endpoint is active and not a static 404. Optionally configure a custom domain and add its hostname to Turnstile.
7. Submit a fictional test order, confirm exactly one matching Sheet row and the correct total, verify a failed request shows an error instead of a fake success, then delete the test row. Test on a real phone and Meta in-app browser before switching ads.

For local full-stack work, install/use Wrangler with `npm run dev`. Copy `.dev.vars.example` to `.dev.vars` and fill in secrets. Use a separate test Sheet and test Turnstile keys/hostname as appropriate; live integration is not preconfigured.

## 5. Meta ads (optional, after successful order testing)

- In Meta Events Manager use the Pixel/dataset that you own. Put its public numeric ID in `metaPixelId` in the config. A privacy choice appears when a pixel is configured and live mode is enabled. Review the wording and legal requirements for your business. Tracking defaults to off until opt-in; declining does not block checkout.
- Browser events: PageView, ViewContent, InitiateCheckout and Lead. Lead fires only after a successful backend acknowledgement. No Purchase event is fired for unconfirmed COD orders.
- Optional Conversions API: add private `META_ACCESS_TOKEN` and `META_API_VERSION` (a supported Graph API version such as the one shown in your Meta developer setup) as encrypted Pages secrets. The server sends opted-in Lead events with the same event ID as the browser, hashed phone and available matching signals. No raw customer contact details go to the browser Pixel. Delivery is best-effort; there is no durable CAPI retry queue. Check Events Manager diagnostics and test deduplication. This is an integration starter, not live-verified against your account.
- Add URL parameters in Ads Manager, e.g. `utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&campaign_id={{campaign.id}}&adset_id={{adset.id}}&ad_id={{ad.id}}`. The sheet stores attribution only when the customer opts in. Use Meta's own reporting for other aggregated metrics.
- For delivered-sale optimization later, build a separate confirmed/delivered Purchase event workflow keyed by order ID. Do not mark submitted orders as paid.

## Project layout

```
public/                 # Cloudflare build output, website only
  index.html
  thank-you.html
  assets/images/        # All 12 supplied product angles, logo, favicon
  css/style.css
  js/config.js          # Product, promotion, shipping, tracking, demo mode
  js/main.js            # Gallery, selections, validation, order submission
  _headers
functions/api/orders.js # Secure server-side endpoint
 google-apps-script/Code.gs # Sheet setup, append, idempotency
 tests/orders.test.js   # Node validation tests
```

## Before you launch

Configure actual delivery fee, live Google Sheet, secrets and Turnstile. Verify your Meta dataset and domain (if used). Add complete merchant identification/privacy/terms appropriate for your business and Morocco's personal data requirements. The page uses Google Fonts (DM Serif Display and Tajawal) with local system fallbacks; decide whether to retain this external dependency in production. Test order submission and ad events with your own accounts. Neither hosting nor your Google/Meta account is connected by this ZIP.
