# EcoCycle Solutions Website

**URL (when deployed):** https://ecocyclesolutions.co.za  
**Deployment Platform:** Netlify / GitHub Pages  
**Last Updated:** 2026-06-18  
**Assignment:** Web Development — Part 3  
**Student:** Takunda Moyo  

---

## Project Overview

EcoCycle Solutions is a South African non-profit environmental organisation based in Johannesburg, Gauteng. The website promotes their recycling collection services, environmental education workshops, community clean-up campaigns, and corporate sustainability consulting.

---

## File Structure

```
ecocycle-part3/
├── index.html          — Home page (hero, stats, services preview, CTA)
├── about.html          — About page (mission/vision, team, FAQ accordion, map)
├── services.html       — Services page (tab filter, search bar, service cards)
├── resources.html      — Resources page (downloadable guides, photo gallery + lightbox)
├── enquiry.html        — Enquiry form (NEW — Part 3)
├── contact.html        — Contact form (enhanced — Part 3)
├── robots.txt          — SEO: crawler instructions
├── sitemap.xml         — SEO: site structure for search engines
├── style.css           — All styles (enhanced for Part 3)
├── images/
│   ├── hero.jpg
│   ├── recycling-collection.jpg
│   ├── education-workshop.jpg
│   ├── community-cleanup.jpg
│   └── sustainability-accounting.jpg
└── js/
    ├── main.js         — UI interactions (accordion, tabs, lightbox, map, animations)
    └── forms.js        — Form validation and AJAX submission
```

---

## Part 3 Features Implemented

### 2. JavaScript Enhancements

#### 2.1 Interactive Elements
| Feature | Location | Implementation |
|---------|----------|---------------|
| **Accordion** | `about.html` — FAQ section | Pure JS with ARIA roles; animates with `max-height` transition |
| **Tabs / Filter** | `services.html`, `resources.html` | Tab buttons set `data-category` visibility with keyboard support |
| **Modal / Lightbox** | `resources.html` — gallery | Full-screen image viewer; keyboard arrows + Escape to close |
| **Interactive Map** | `about.html`, `contact.html` | Leaflet.js (OpenStreetMap); pin with popup on Johannesburg |
| **Animations** | All pages | CSS `@keyframes` + `IntersectionObserver`-driven `.reveal` classes |
| **Hamburger Menu** | All pages | ARIA-controlled mobile nav toggle |
| **Scroll-to-Top** | All pages | Fixed button; shows after 400px scroll |

#### 2.2 Dynamic Content
| Feature | Location | Implementation |
|---------|----------|---------------|
| **Search filter** | `services.html` | Live `input` listener filters `[data-category]` cards by keyword |
| **Stats counter** | `index.html` | `IntersectionObserver` triggers animated number count-up |
| **Dynamic enquiry response** | `enquiry.html` | JS generates cost/availability table based on selected service type after async submit |

---

### 3. SEO

#### 3.1 On-Page SEO
- **Title Tags** — Unique, keyword-rich `<title>` on every page  
- **Meta Descriptions** — Compelling, 150–160 character descriptions per page  
- **Meta Keywords** — Relevant keywords per page  
- **Header Tags** — Proper `H1 → H2 → H3` hierarchy throughout  
- **Image Optimisation** — Descriptive `alt` text on every `<img>`; `loading="lazy"` on all non-hero images  
- **Internal Linking** — Every page links to all others via nav; contextual links in body text  
- **Mobile-Friendliness** — Responsive CSS grid; hamburger nav on mobile; fluid typography  
- **Canonical URLs** — `<link rel="canonical">` on every page  
- **Open Graph Tags** — `og:title`, `og:description`, `og:image`, `og:url` per page  
- **Twitter Card Tags** — `twitter:card`, `twitter:title`, etc. on home page  
- **Schema.org Structured Data** — `Organization` on home; `AboutPage`, `Service`, `ContactPage` on relevant pages  

#### 3.2 Off-Page SEO (Recommendations)
- Submit sitemap to **Google Search Console** and **Bing Webmaster Tools**
- Share pages on social media (Facebook, Twitter/X, LinkedIn)  
- Request backlinks from partner schools and NGOs  
- List on **Google My Business** for local SEO  

#### 3.3 Technical SEO
- **`robots.txt`** — Instructs crawlers; disallows private/admin paths; references sitemap  
- **`sitemap.xml`** — Lists all 6 pages with `lastmod`, `changefreq`, and `priority`  
- **Page Speed** — Lazy loading on images; CDN-hosted Leaflet.js; no render-blocking scripts (all `<script>` at end of `<body>`)  
- **Security** — No inline JavaScript with user input; `escHtml()` helper sanitises all dynamic DOM insertions; external links use `rel="noopener"`  
- **Accessibility** — Skip link, ARIA labels, `role="alert"` on error messages, `aria-live` on form responses  

---

### 4. Forms

#### 4.1 `enquiry.html` — Service / Volunteer / Sponsor Enquiry Form
**Fields:** First Name, Last Name, Email, Phone, Enquiry Type *(Service/Volunteer/Sponsor/Product)*, Service *(conditional — shown only when type = Service)*, Preferred Date, Organisation, Message, Referral source  

**Validation rules:**
| Field | Rule |
|-------|------|
| First / Last Name | Required; min 2 chars; max 50 chars |
| Email | Required; valid format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) |
| Phone | Required; 7–15 digits/symbols |
| Enquiry Type | Required; must select from allowed values |
| Service | Required when Enquiry Type = "service" |
| Date | Optional; must be today or future date |
| Message | Required; min 10 chars; max 1000 chars |

**After submission:**  
A dynamic response table is shown with:
- Unique reference number (`ECO-YYYYMM + 5 chars`)
- Enquiry type label
- Estimated cost (e.g. *R850 – R1 500/month*)
- Availability (e.g. *Available within 5 business days*)
- Next step (email follow-up)

#### 4.2 `contact.html` — General Contact Form
**Fields:** First Name, Last Name, Email, Phone, Message Type *(General/Feedback/Complaint/Partnership/Media/Other)*, Subject, Message, Privacy consent checkbox  

**After submission:**  
- Form data is compiled into a `mailto:` URI targeting `takundajohnm@gmail.com`
- User is shown a ticket ID and a button that opens their email client with the message pre-filled
- Allows the user to send the email directly without any server-side processing

**JavaScript validation (both forms):**
- Real-time validation on `blur` and `change` events
- Red border + error message below each invalid field
- Green border on valid fields
- Prevents submission if any field is invalid
- Focus moves to first invalid field on submit attempt
- Loading spinner on submit button during async delay
- Toast notifications for success and error states
- `escHtml()` sanitises all user-generated content before DOM insertion

---

## Deployment

The website is deployed as a static site. Recommended free platforms:

| Platform | Steps |
|----------|-------|
| **Netlify** | Drag-and-drop the `ecocycle-part3` folder at netlify.com/drop |
| **GitHub Pages** | Push to `main` branch; enable Pages in repository Settings |
| **Vercel** | Import GitHub repo; deploy with zero config |

---

## References

1. MDN Web Docs — HTML Forms: https://developer.mozilla.org/en-US/docs/Learn/Forms  
2. MDN Web Docs — Constraint Validation API: https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation  
3. Leaflet.js Documentation: https://leafletjs.com/reference.html  
4. OpenStreetMap: https://www.openstreetmap.org  
5. Google Search Central — SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide  
6. Schema.org — Organization: https://schema.org/Organization  
7. Sitemaps Protocol: https://www.sitemaps.org/protocol.html  
8. W3C — ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/  
9. Google Fonts — Poppins: https://fonts.google.com/specimen/Poppins  
10. IntersectionObserver API: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver  

---

## Changelog

### Version 3.0.0 — 2026-06-18 (Part 3 Submission)

#### New Features
- **Added `enquiry.html`** — New dedicated enquiry page with full HTML5 + JavaScript form validation. Collects first/last name, email, phone, enquiry type (service/volunteer/sponsor/product), conditional service selection, preferred date, organisation, message, and referral source. On successful async submission, displays a dynamic response table showing the estimated cost, availability window, reference number, and next steps tailored to the enquiry type.
- **Enhanced `contact.html`** — Replaced the original non-functional form with a fully validated contact form. Fields include name, email, phone, message type (General/Feedback/Complaint/Partnership/Media), subject, message, and privacy consent checkbox. On submission, form data is compiled into a `mailto:` URI pre-filled with all fields, targeting `takundajohnm@gmail.com`, allowing the user to send the email from their email client.
- **Added `js/forms.js`** — New JavaScript module handling all form logic: real-time field validation on blur/change, client-side error display with ARIA `role="alert"`, AJAX-style async submission with fetch (simulated with configurable delay), loading spinner on submit button, toast notifications, and `escHtml()` sanitisation for DOM-injected content.
- **Added `js/main.js`** — New JavaScript module handling all UI interactions: hamburger navigation, accordion open/close, tab-based filtering, search/filter with `input` events, gallery lightbox (keyboard-navigable), scroll-reveal animations with `IntersectionObserver`, animated stats counter, scroll-to-top button, and Leaflet.js map initialisation.
- **Added accordion to `about.html`** — Six-item FAQ accordion with smooth `max-height` animation, ARIA `aria-expanded` attributes, and keyboard accessibility.
- **Added interactive map to `about.html` and `contact.html`** — Leaflet.js maps using OpenStreetMap tiles, centred on Johannesburg (-26.2041, 28.0473), with a custom marker and popup.
- **Added gallery with lightbox to `resources.html`** — Four-image gallery grid with hover overlay; clicking an image opens a full-screen modal lightbox with previous/next navigation via buttons or arrow keys, and Escape to close.
- **Added tab filter to `services.html`** — Category tabs (All / Collection / Education / Community / Corporate) that show/hide service cards using `data-category` attributes.
- **Added search bar to `services.html`** — Live keyword filter on service cards; shows "No results" message when no matches found.
- **Added animated stats counter to `index.html`** — Four metrics (2,400+ tonnes recycled, 180+ workshops, 56 communities, 320+ partners) animate from 0 to target when scrolled into view.
- **Added scroll-reveal animations to all pages** — Cards and sections fade/slide in using `IntersectionObserver` and CSS transition classes (`.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-delay-*`).

#### SEO Enhancements
- **Added unique `<title>` tags** to all 6 pages with primary keywords.
- **Added `<meta name="description">`** to all 6 pages (150–160 characters, keyword-rich, action-oriented).
- **Added Open Graph tags** (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`) to all pages.
- **Added Twitter Card tags** to `index.html`.
- **Added Schema.org JSON-LD** structured data: `Organization` on home page, `AboutPage` on about, `Service` on services, `ContactPage` on contact.
- **Added `<link rel="canonical">`** to all pages.
- **Added descriptive `alt` text** to all images and `loading="lazy"` on all non-hero images.
- **Added breadcrumb navigation** to all inner pages for improved UX and SEO.
- **Added `robots.txt`** instructing search engine crawlers which paths to index.
- **Added `sitemap.xml`** listing all 6 pages with `lastmod`, `changefreq`, and `priority` values.

#### Navigation & Structure
- **Added `enquiry.html` link** to navigation on all pages.
- **Added hamburger menu** for mobile navigation using ARIA-controlled toggle.
- **Added skip link** ("Skip to main content") on all pages for accessibility.
- **Enhanced footer** with four-column grid: brand description, quick links, contact details, and secondary links.
- **Added breadcrumb** navigation on all inner pages.

#### Design & UX
- **Redesigned hero section** with dual CTA buttons ("Explore Services" and "Get a Quote").
- **Added service price indicators** to all service cards on `index.html` and `services.html`.
- **Added team section** to `about.html` with four team member cards.
- **Added page hero banners** to all inner pages with descriptive subtitles.
- **Added section labels** (small uppercase category tags above section headings) across all pages.
- **Added CSS custom properties** (`--green-dark`, `--green-mid`, etc.) for consistent theming.
- **Improved button system** with three variants: primary, outline, and accent.
- **Added scroll-to-top button** (fixed, bottom-left) on all pages.
- **Added toast notifications** system for form feedback.

#### Part 2 Feedback Corrections
- Added `<label>` elements to all form inputs (previously unlabelled, causing accessibility issues).
- Added `required` attributes and proper `type` values to all form fields.
- Replaced non-functional form `action` attribute with JavaScript-handled submission.
- Added `<main id="main">` landmark element wrapping page content on all pages.
- Added `lang="en"` to all `<html>` elements (was already present but confirmed).
- Fixed missing `alt` attributes on service images in `services.html`.

Amahle Myeni 

*End of README*
