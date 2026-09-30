# Tawqee by ForgRise

A responsive static product website for Tawqee, the SharePoint document approval and PDF signing application.

## Preview

Requires Node.js 22 or later. No package installation is needed.

```powershell
cd D:\Projects\Learning\TawqeeWeb
npm start
```

Open http://127.0.0.1:4173. The server is local-only and supports MP4 range requests for seeking. Stop with Ctrl+C.

## Check and build

```powershell
npm run check
npm run build
```

Publish the contents of `dist/` to a static website host. The output includes a host-compatible `_headers` file; hosts that do not read it need equivalent header configuration. Use HTTPS. No backend, API keys, runtime framework, analytics, or form service is required.

The demo buttons open the visitor's email client to **sales@forgrise.com**. The address is also visible and selectable. No enquiry is sent by this website itself.

## Domain and SEO

Prepared for **https://tawqee.forgrise.com/**:

- A single semantic H1, crawlable HTML and descriptive headings.
- Page title, description, canonical URL and Open Graph/Twitter metadata.
- SoftwareApplication structured data without invented prices or ratings.
- Sitemap and robots.txt.
- Image alt text, video captions and a visible text summary.

After deploying, add `tawqee.forgrise.com` as a custom domain in the host and add the DNS record it supplies. Confirm its HTTPS certificate, then submit `/sitemap.xml` to your search console. The site has not been published or connected to DNS. Metadata does not guarantee rankings.

If the domain changes, update `index.html`, `robots.txt`, and `sitemap.xml` together.

## Files

- `index.html`: content, links, metadata and structured data.
- `styles.css`: responsive layout, local font and reduced-motion support.
- `script.js`: mobile navigation, demo playback and footer year.
- `assets/`: local logo, optimized stills, 1280px demo video, captions, font and its license.
- `tools/`: dependency-free preview, build, content checks, optional browser checks and media optimization.
- `evidence/`: locally captured desktop/mobile screenshots and browser results. Not copied to the public build.

## Media and provenance

The logo comes from `Tawqee/assets/branding/tawqee-logo-v1.png`. The supplied Remotion walkthrough and stills come from `tawqee-video/out`. These are illustrative product scenes with fictional data, not evidence of production deployment. The HTML hero and small workflow diagrams are illustrative.

The supplied 1920px MP4 was encoded at 1280px using H.264, CRF 25 and fast-start metadata: 12,907,446 bytes to approximately 2,166,127 bytes. It is 42.67 seconds long. Playback uses native controls and `preload="none"`. No autoplay on page load. Still images use WebP. Plus Jakarta Sans is self-hosted under the included SIL Open Font License.

For a future media refresh, set `BROWSER_PATH` to Chrome/Chromium, `MEDIA_SOURCE` to the directory containing the source stills and `LOGO_SOURCE` to the source PNG, then run `node tools/optimize-media.mjs`. It resizes/compresses the existing artwork; it does not generate replacements. Video encoding is a separate step.

## Optional browser verification

The browser checks need a local Chrome/Chromium executable. Example used in this workspace:

```powershell
$env:BROWSER_PATH = 'D:\Projects\Learning\tawqee-video\node_modules\.remotion\chrome-headless-shell\win64\chrome-headless-shell-win64\chrome-headless-shell.exe'
node tools/browser-check.mjs
```

The check starts its own local server on port 4175 and an isolated headless browser, then closes both. It checks five viewport sizes, local images/font, deferred video loading, navigation, FAQs, mail links, reduced motion, MP4 range requests and actual playback. Screenshots and results are saved under `evidence/`. These are local browser checks, not a Lighthouse score or a live SharePoint test.

## Product claims

Copy is based on Tawqee's `docs/requirements.md`, `docs/architecture.md`, `docs/ui-design.md`, and `STATUS.md` as inspected on 30 September 2026. The app runs within SharePoint, stores business data there, and sends PDF bytes to a dedicated processing service. Current scope is internal users. English/Arabic support applies to the end-user UI; admin diagnostics and document-type screens are English-only. The FAQ states that production authentication and pilot hardening are unfinished. No certification, tamper-proof audit, Microsoft affiliation, adoption figures, or legal-validity claims are made.
