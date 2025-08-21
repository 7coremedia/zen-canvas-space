KING Website — Instruction Whitepaper (Entry -> AI Brand Builder -> Checkout)

Purpose: This whitepaper provides step-by-step developer and product instructions for turning the KING website from a portfolio into an active, AI-powered brand starter and commerce funnel that converts visitors into paying clients. It describes architecture, pages, components, data models, AI prompts, payment flows, dynamic pricing logic, acceptance criteria and a launch checklist.

---

EXECUTIVE SUMMARY

KING's website will become an acquisition engine. Visitors can generate a brand starter (name, logo, colors, competitor snapshot, domain check) with AI, save their Brand Data, and either buy single deliverables or upgrade to human refinement and full packages (Crest -> Conquest). The system stores brand seeds, shows cost/feature tradeoffs (dynamic pricing), and supports card and bank transfer payments.

Key principles:

* Fast wins: show a visible result quickly (logo + palette)
* Data-first: store every generated result in a structured BrandData object
* Human handoff: easy path to human refinement with discounts
* Protect margins: enforce pricing floors and controlled downgrade steps
* Performance and UX: load under 3s, checkout within 3 clicks

---

OBJECTIVES & KPIs

Primary objective: Convert visitors into qualified leads and paying customers via AI starters and human upgrades.
KPIs:

* Visitor -> AI starter initiation rate: target 10-15%
* AI starter -> upgrade to human: target 8-12%
* Visitor-to-customer conversion lift: +20% within 90 days (with ads)
* Site load time: < 3s
* Checkout clicks: < 3
* Payment completion rate: > 95%
* Uptime: 99.9%

---

HIGH-LEVEL USER JOURNEY

1. Landing page with CTA: "Start your brand now (AI)".
2. AI Brand Builder wizard: inputs (industry, tone, product types), outputs (name options, logo drafts, palette, one-line positioning, domain and handle availability, competitor snapshot).
3. Brand Data Dashboard: saved assets, versioning, export, upgrade CTA.
4. Productization: paid items (Starter Logo, Arsenal, Throne, Conquest) and dynamic pricing widget to negotiate downgrades.
5. Checkout and Fulfillment: card or transfer payments, webhook-driven order state transitions, human team onboarding.

---

PAGES & COMPONENTS

Pages:

* Home / Landing
* Portfolio / Case Studies
* AI Brand Builder (wizard)
* Brand Dashboard (saved brands)
* Product Catalog (services as products)
* Product Detail (dynamic pricing widget)
* Cart
* Checkout (card and transfer)
* Order Confirmation / Account
* Admin Panel

Core UI components:

* Hero Banner
* CTA Button
* Wizard Stepper
* Asset Preview (logo + palette + moodboard)
* Dynamic Pricing Widget
* Checkout components (payment form, transfer upload)
* Notification / Toast system
* Admin review panel

---

TECH STACK (recommended)

Front-end: React (Next.js) + Tailwind CSS.
Back-end: Node.js with Next.js API routes or Express. Use Supabase or Firebase for auth, DB, and storage during MVP.
AI Layer: OpenAI / Gemini for copy and analysis; an image model for logos. Use a prompt orchestration layer server-side.
Storage: S3-compatible for images and asset exports.
Payments: Flutterwave / Paystack / Stripe. Use webhooks.
Domain checks: WHOIS or registrar APIs.
Analytics: GA4 + PostHog.
Deployment: Vercel for front-end; backend on Render / DigitalOcean as needed.

---

DATA MODELS (field list)

User:

* id (string)
* email (string)
* name (string)
* created\_at (timestamp)

BrandData (core object saved after AI generation):

* id
* owner\_id
* project\_name
* industry
* inputs (user choices)
* generated: names\[], logo\_url, colors\[], fonts\[], positioning, domain\_check
* versions\[]
* created\_at

Product:

* id
* name
* price\_floor
* price\_ceiling
* feature\_list
* removal\_order

Order:

* id
* user\_id
* items\[] (product\_id, price, options)
* status (pending, paid, in\_progress, completed)
* payment\_method

---

API ENDPOINTS (examples)

* POST /api/ai/generate-brand  -> triggers AI sequence and returns BrandData preview
* GET /api/brand/\:id            -> fetch saved brand data
* POST /api/orders             -> create order, return checkout session
* POST /api/webhooks/payments  -> payment provider webhook
* POST /api/domain/check       -> domain and handle availability

---

AI PROMPTS & WORKFLOWS (developer-ready)

Prompts should be parameterized and run server-side to protect API keys and control costs. All outputs must be validated and transformed into structured BrandData.

Name generator template:

* System: You are a creative brand name generator for premium consumer brands.
* Input variables: industry, tone, audience, keywords.
* Output: 8-12 name options with a short rationale and a suggested tld.

Logo brief generator:

* Create a vector-friendly logo brief for the selected name. Include a one-line concept, three composition options, color usage, recommended typography, and export sizes.

Color palette generator:

* Given a primary hex and mood, output 5 color swatches with suggested usage and contrast info.

Competitor snapshot:

* Given industry and region, return 5 competitors with positioning, strengths, weaknesses and 3 opportunity areas.

Social templates generator:

* From the brand tone and product list, output 5 caption templates and short image prompts suitable for social posts.

---

LOGO GENERATION NOTES

* Prefer vector-friendly output. If the image model returns raster images, include an automated vectorization step (raster2vector API).
* Provide three variants: wordmark, monogram, emblem. Export SVG and PNG at typical sizes.
* Keep logos simple for memorability and reproduction.

---

DYNAMIC PRICING ALGORITHM (pseudocode)

Rules:

* Higher package includes all features from lower packages.
* Discount steps are in increments of 25,000 NGN. Each step triggers removal of a predefined feature.
* Do not allow price to drop below package floor.

Pseudocode flow:

* function applyDiscount(product, discountAmount):

  * steps = floor(discountAmount / 25000)
  * features = clone(product.feature\_list)
  * for i in 0..steps-1:

    * remove features according to product.removal\_order
  * newPrice = product.price\_ceiling - steps\*25000
  * if newPrice < product.price\_floor: error
  * return { newPrice, remainingFeatures }

Example removal\_order for Arsenal (most conservative first):

1. reduce social templates
2. shorten brand guide
3. remove color system
4. remove typography system
5. reduce website page count

Developers must store removal\_order for each product and present exact user-facing messages for each removal.

---

CHECKOUT & PAYMENT FLOWS

* Create checkout session server-side with selected items and final price.
* Card flow: redirect to provider or use embedded elements; handle webhook for success and failure.
* Bank transfer: show bank instructions; allow upload of payment proof; mark order pending until admin confirms.
* On payment success: set order status to paid, send receipt email, create project record, schedule kickoff.

Webhooks:

* Verify signature, update order status, trigger fulfillment steps.

---

BRAND DASHBOARD

Features:

* Thumbnail gallery of saved BrandData
* Compare versions and restore
* Export assets package (zip)
* Button: "Upgrade to Human Refinement" which pre-fills checkout and applies a starter discount
* Activity timeline and notes for human team

Upgrade flow:

* Apply discount code for users who generated using AI
* On purchase, assign to project manager and change order status

---

ADMIN PANEL

* Orders list with filters
* BrandData review interface
* Manual payment confirmation for transfers
* Override pricing and discounts
* Analytics overview

---

SECURITY & PERFORMANCE

Security:

* HTTPS and secure cookies
* Do not store raw card data; rely on payment provider
* Rate-limit AI endpoints to prevent abuse
* Sanitize all inputs and file uploads

Performance:

* CDN for static assets
* Image optimization and lazy loading
* SSR for landing pages and SEO

---

TESTING & QA

* Test AI flows to ensure consistent BrandData structure
* Test logo export and brand asset zips
* Test domain checks and handle lookups
* End-to-end payments (card and transfers)
* Simulate webhooks and order lifecycle
* Load testing for 1000 concurrent users

---

LAUNCH MILESTONES (suggested)

* Week 0: Kickoff & architecture decisions
* Week 1: AI Builder MVP (name + logo + palette + BrandData model)
* Week 2: Brand Dashboard + asset export
* Week 3: Checkout + card payments
* Week 4: Admin panel + manual flows
* Week 5: QA, performance tuning
* Week 6: Soft launch and measurement

---

TEAM ROLES

* Product Lead: product decisions and acceptance
* Frontend Dev: UI and wizard components
* Backend Dev: APIs, DB, payment orchestration
* AI Engineer: prompt engineering and model orchestration
* Designer: UI, templates, brand guide assets
* QA: automated and manual testing
* Project Manager: timeline and client communication

---

ACCEPTANCE CRITERIA

* AI Brand Builder returns a valid BrandData record per user action
* User can upgrade to a paid package and complete checkout
* Payment success triggers order state and kickoff email
* Admin can view and accept bank transfers, and assign projects
* Site meets load and UX targets

---

NEXT STEPS

1. Review and confirm stack choices (AI provider and payment gateway)
2. Wireframe core flows in Figma
3. Implement AI orchestration and BrandData storage
4. Launch MVP: name + logo + palette + starter checkout

---

This document is the master instruction set for developers, designers and product stakeholders. Use it as the single source of truth when building KING's AI-powered brand starter and commerce funnel.
