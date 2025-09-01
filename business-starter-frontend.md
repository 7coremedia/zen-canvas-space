# Prompt for IDE — Business Starter → Brand Builder Frontend (SevenCore / KING)

**Objective**
Build the **frontend flow** that lets any business starter go from **idea → name → logo → brand assets → strategy → competitor research → refine or launch**. The user may begin **without an account**; we collect basics first, then **gate continuation with signup**. After generation, the user can **save brand data**, view a **Brand Details** page, **export PDF**, or choose **Refine with Human Experts** (discount), which routes to **Contact** with a **unique brand view link**.

---

## 1) General Requirements

* **Mobile-first** responsive UI (TailwindCSS).
* **Minimal, premium** brand aesthetic (SevenCore energy; clean grid, generous whitespace, xl headings, rounded-2xl, soft shadows).
* **Framer Motion** for step transitions and modal/overlay animations.
* **Local-first** state: persist progress in `localStorage` pre-auth; on signup, **migrate** to backend.
* **PDF export** of the mini brand guide (client-side first; server export optional later).
* **CTA:** “Refine with Human Experts (Discount)” opens a modal → proceed to Contact with **unique view link** (not file).
* **AI integration**: all AI outputs and APIs must connect to real AI services for production use.

---

## 2) High-Level Flow (Happy Path)

1. **Entry / Landing** → “Start in 5 minutes” CTA.
2. **Step Wizard (Pre-Auth)** collects: **Idea, Industry, Optional Brand Name, Logo Variations** (placeholders).
3. User clicks **Continue Brand Development** → **Signup modal** (Email + Password + OAuth buttons).
4. After signup/login, user returns to the wizard at the **next step** with previously collected data intact.
5. Complete steps: **Name → Logo → Colors/Type → Strategy Lite → Competitors → Brand Guide Preview**.
6. User clicks **Save Brand Data** → Brand stored; redirect to **Brand Details** page.
7. From Brand Details: **Export Brand (PDF)** or **Refine with Human Experts** → modal → **Contact** page with **unique link** to the saved brand view.

---

## 3) Routes & Screens

* `/start` — Entry page (hero + value props + Start CTA).
* `/wizard` — Multi-step flow (pre/post auth, same route; step index via query or hash).
* `/auth` — Dedicated auth page (fallback if modal fails).
* `/brands` — User’s brand list (after login).
* `/brand/:id` — Brand Details (tabs: Overview, Assets, Strategy, Research).
* `/brand/:id/preview` — Public/Share view (read-only) used for **Contact** link.
* `/contact` — Contact/Brief form; accepts `?brandLink=` param to attach the unique view link.

**Navigation rules**

* If **not signed in** and user enters `/wizard`, allow **Steps 1–3**; on **Continue Brand Development**, show **signup modal**.
* After auth success, **migrate local draft** → user account; continue to Step 4+.
* “Save Brand Data” should **create brand** (real ID) and route to `/brand/:id`.

---

## 4) Step-by-Step Wizard (Content & UI)

Use a **stepper**: *Idea → Name → Logo → Colors/Type → Strategy → Competitors → Guide → Action*.

### Step 1: Business Idea Input (Pre-Auth)

* Inputs:

  * **Business Idea** (textarea)
  * **Industry** (dropdown + free-text)
* Actions: Next, Save Draft.
* AI placeholder: suggest **brand directions** & **tone options** (real AI).
* UX: side panel preview of tone/direction chips.

### Step 2: Business Name Generator (Pre-Auth)

* Show **5–10 AI name suggestions** with **domain availability** indicators (real API).
* Actions: **Pick** one, **Regenerate**, or **Use my own**.
* Store chosen `brandName` and `domainStatus` in state.

### Step 3: Logo Generator (Pre-Auth)

* Show **3–5 logo placeholders** (grid cards).
* Actions: **Select**, **Request variations** (just regenerate placeholder), **Back/Next**.
* Store `logoChoice` (image URL or token); note that this is **placeholder** for now.

### Auth Gate

* Primary CTA: **Continue Brand Development** → open **Signup Modal**.
* Modal fields: Email, Password (or OAuth buttons).
* On success: close modal and **resume wizard** at Step 4.

### Step 4: Color & Typography System (Post-Auth)

* AI suggests **palette** (4–6 swatches with hex) and **2–3 font pairs**.
* Preview: palette bars; sample text blocks with headings/body.
* Actions: **Select palette**, **Select typography**, **Regenerate**.

### Step 5: Brand Strategy Lite

* Auto-draft: **Mission**, **Vision**, **Tone of Voice**, **Positioning Statement**.
* Editor: inline edits; show character-count hints.
* Actions: Save, Next.

### Step 6: Competitor Research

* Display **top 3–5 competitors** (name, site, strengths, gaps) — real data.
* Actions: **Mark as relevant/irrelevant**, add custom competitor, Next.

### Step 7: Brand Guide Preview

* Compose **mini brand guide preview** in-page:

  * Cover (Name + Logo)
  * Colors + Typography
  * Strategy Lite (Mission, Vision, Tone, Positioning)
  * Competitor Snapshot
* CTA: **Save Brand Data** (creates brand, routes to `/brand/:id`).
* Secondary: **Download Draft PDF** (client-side render).

### Step 8: Action Choice (on Brand Details)

* Buttons:

  * **Export Brand (PDF)** — triggers PDF render; also generates **unique brand view link** `/brand/:id/preview?token=...`.
  * **Refine with Human Experts (Discount)** — opens **motion modal** with story-driven visuals (research clips/illustrations placeholder); button → `/contact?brandLink=<encoded preview URL>`.

---

## 5) State & Persistence

* **Wizard State** (pre-auth): keep in `localStorage` under `brandDraft_v1`.
* **On Signup**: call migration function to create a draft on backend (real) and swap to `brandId`.
* **Post-auth**: persist to backend (real service) on step changes and major actions.
* **Recovery**: if a draft exists, prompt **Continue where you left off?**

State shape (frontend):

```json
{
  "idea": "",
  "industry": "",
  "brandName": "",
  "domain": { "status": "unknown", "name": "" },
  "logo": { "id": null, "url": "" },
  "palette": ["#111111", "#D9A441", "#F5F5F5", "#0E7490"],
  "typography": { "heading": "", "body": "" },
  "strategy": { "mission": "", "vision": "", "tone": "", "positioning": "" },
  "competitors": [
    { "name": "", "url": "", "strengths": [], "gaps": [], "relevant": true }
  ],
  "brandId": null,
  "publicPreview": { "url": null, "token": null }
}
```

---

## 6) Components (Atomic → Composite)

* **Atoms**: Button, Input, Textarea, Select, Chip, Badge, Modal, Tooltip, Stepper.
* **Molecules**: NameSuggestionCard, LogoCard, PaletteSwatch, FontPreview, CompetitorCard.
* **Organisms**: WizardStepCard, SignupModal, BrandGuidePreview, PDFExportModal, RefineModal.
* **Layouts**: WizardLayout (with progress rail), DashboardLayout (for Brand Details).

---

## 7) PDF Export (Client-First)

* Use `html2pdf.js` or similar to render the **Brand Guide Preview** section to PDF.
* Include **cover page**, logo, palette (hex), typography, strategy, competitors.
* Filename: `brand_{{brandName}}_{{YYYYMMDD}}.pdf`.
* On export, also **create/refresh** a **public preview link**: `/brand/:id/preview?token=...` and store it in state for sharing.

---

## 8) Refine with Human Experts (Discount) Flow

* **Trigger:** Button on Brand Details or after export.
* **Modal:** Motion-animated; copy explains value of human refinement; optional placeholder visuals.
* **Proceed CTA:** Go to `/contact?brandLink=<encoded preview URL>` (use URL-encoded token).
* **Contact Form** (already exists): add a hidden field `brandLink` to capture the link.
* **No file upload** needed at this step; link suffices.

---

## 9) Auth Gate Rules

* Steps 1–3 are accessible pre-auth; any attempt to go beyond Step 3 triggers **Signup Modal**.
* After auth, resume at Step 4 with preserved state.
* If a user cancels signup, stay on Step 3 and show unobtrusive hint to continue later.

---

## 10) AI Integration & Data Management

* **Name suggestions**: deterministic array from seed `{idea, industry}`.
* **Domain availability**: simple hash → true/false for demo.
* **Logo placeholders**: fetch from a local gallery or placeholder API.
* **Palette/Type**: prebuilt themes + seeded variation.
* **Strategy Lite**: template filled using `{idea, industry, tone}`.
* **Competitors**: hardcoded per industry with editable rows.

---

## 11) Events & Telemetry

* Track: step views, regenerate clicks, name picked, logo picked, palette picked, strategy edits, Save Brand Data, Export PDF, Refine CTA click.
* Use a simple `console.event()` placeholder for now; replace with analytics later.

---

## 12) Acceptance Criteria (Definition of Done)

* ✅ Wizard renders and works across mobile/desktop.
* ✅ Steps 1–3 function **without auth**; Continue triggers signup modal; post-auth resumes at Step 4.
* ✅ Save Brand Data creates a **Brand Details** entry and navigates to `/brand/:id`.
* ✅ Brand Details shows tabs and both CTAs (Export, Refine).
* ✅ Export produces a **valid PDF** and a **public preview link**.
* ✅ Refine CTA routes to Contact with `brandLink` param populated.
* ✅ All AI features have real outputs that integrate with live APIs.

---

## 13) Visual/Interaction Notes (SevenCore Flavor)

* Headings with **king energy** (xl/2xl), subtext concise.
* **Stepper** with crowned current step icon; soft progress glow.
* **Cards**: rounded-2xl, subtle glass effect for premium feel.
* **Motion**: 200–300ms slide/fade; modal scale-in with backdrop blur.
* **Empty states**: powerful, short copy (“From name to empire in 8 steps.”).

---

## 14) Deliverables for This Sprint

* Implement `/start`, `/wizard`, `/auth` (modal + page), `/brand/:id`, `/brand/:id/preview`, `/contact` integration for `brandLink`.
* Wizard steps with AI integration; `localStorage` draft + migration stub.
* PDF export and preview link generation (frontend-only stub).
* Refine modal with redirect.
* Sample seed data for 2 industries to demo end-to-end.

---

## 15) One‑Shot Prompt (Paste into AI IDE)

**Instruction:** Build the frontend described below using **React + Tailwind + Framer Motion** with AI services. Create routes, components, and state per spec. Implement pre-auth Steps 1–3, auth modal gate, post-auth Steps 4–7, Brand Details, PDF export, Refine modal → Contact with `brandLink` param. Use real AI integration.

**Artifacts to produce:**

* Pages: `/start`, `/wizard`, `/auth`, `/brands` (stub), `/brand/:id`, `/brand/:id/preview`, `/contact` hookup.
* Components: Stepper, WizardStepCard, SignupModal, NameSuggestionCard, LogoCard, PalettePicker, FontPicker, StrategyEditor, CompetitorList, BrandGuidePreview, PDFExportModal, RefineModal.
* State: `useWizardStore` (Zustand or Context), `localStorage` persistence, migration stub.
* Utils: `pdfExport()`, `createPublicPreviewLink()`, `seededRandom()`, `domainCheck()`.
* Style: Tailwind config for premium palette; rounded-2xl; shadow-xl; backdrop-blur for modals.

**Wizard Steps:**

1. Idea/Industry → suggest tone dirs.
2. Name suggestions + domain check.
3. Logo placeholders grid.
   (Show **Continue Brand Development** → Signup Modal → resume.)
4. Colors/Type pickers.
5. Strategy Lite editor.
6. Competitor snapshot.
7. Brand Guide preview → **Save Brand Data**.
   Brand Details: Export PDF, Refine CTA → `/contact?brandLink=<encoded>`.
   Public Preview: read-only brand view for sharing.

**AI Integration Rules:**

* Names from seeded list; domain check via hash.
* Logos from local placeholders.
* Palettes from theme presets; fonts from Google Fonts list.
* Strategy from template + variables.
* Competitors from small per-industry maps.

**Done when** acceptance criteria in §12 are met and the flow feels premium, smooth, and demo-ready.
