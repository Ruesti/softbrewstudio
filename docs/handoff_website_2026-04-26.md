# Claude Code Handoff — softbrewstudio.com (Next.js)
# 2026-04-26

## Context

This is the public marketing website for Softbrew Studio.
Primary product: FocusPilot.
Secondary product: Hardware Copilot (coming soon, in development).
All other previous products are on hold — do not reference them.

---

## Step 1 — Read the vision first

FocusPilot is a silent project intelligence layer — not a
decisions-list tool, not a project management app.

One sentence that defines the product:
  "Every other tool tells you what to do.
   FocusPilot knows what you're doing."

Keep this in mind for every design and copy decision.

---

## Step 2 — Analyse the existing site

Show me:
1. Current page structure and routing
2. Where the main landing page content lives
3. Existing components that can be reused
4. Current styling system (Tailwind, CSS modules, etc.)

Do not make changes yet — analysis first.

---

## Step 3 — Landing page to build

One page only. Keep it simple.
No login, no pricing, no blog yet.

### Section 1 — Hero

Headline:
  FocusPilot remembers why you built it, what you decided,
  and where you left off — so you can get back to work
  in minutes, not hours.

Subtext:
  Whether you're building software, electronics, or something
  entirely different — FocusPilot tracks your decisions,
  remembers your context, and gets you back up to speed
  instantly. For solo builders and small teams who can't
  afford to lose momentum.

CTA button: "Join the Early Access →"
  → scrolls to early access section on same page

---

### Section 2 — Four feature blocks

Block 1 — Always Knows Where You Are
  FocusPilot runs silently in the background — capturing
  context, tracking decisions, and understanding your project
  state. No forms. No manual updates. No lists to maintain.

Block 2 — Back Up to Speed in Minutes
  Been away for a week? FocusPilot briefs you instantly.
  Current state, what changed, what was decided, what comes
  next. Works for software, electronics, CAD, and anything
  in between.

Block 3 — Synced With Reality
  FocusPilot knows your calendar. It reconciles what you
  planned with where your project actually is — and tells
  you only when it matters.

Block 4 — Your Data, Your Rules
  Works locally or synced to the cloud. Multi-provider AI —
  OpenAI, Anthropic, or fully local. No vendor lock-in.
  You own everything.

---

### Section 3 — Early Access / Waitlist

Headline:
  Be the first to try FocusPilot.

Subtext:
  We're opening early access to a small group of builders
  in Summer 2026. No spam — just one email when your
  spot is ready.

Form fields:
  - Email address (required)
  - What kind of projects do you work on? (optional, text input)

Button: "Join the Waitlist →"

Below the form:
  "Early access includes direct feedback access to the founder.
   Your input shapes the product."

Note: For now the form can write to a simple backend route
or a service like Resend / Mailchimp. Keep it simple.

---

### Section 4 — Hardware Copilot teaser

Headline: "Hardware Copilot"
Subtext:
  AI-assisted electronics platform for embedded systems
  and PCB design. Built for makers who work at the
  intersection of software and hardware.

Status badge: "In Development"
No CTA yet — coming soon only.

---

### Footer

- Softbrew Studio © 2026
- softbrewstudio.com
- No social links yet (profiles not set up)

---

## Step 4 — What NOT to build

Do not build:
- User accounts or login
- Pricing page
- Blog or articles section
- Individual product pages
- Navigation with many links

One page, four sections, clean and fast.

---

## Step 5 — Design direction

- Clean, minimal, dark or light — your call based on
  existing site styles
- Builder / maker aesthetic — not corporate, not startup-flashy
- Mobile responsive
- Fast — no heavy animations

---

## Process reminder

Show the analysis from Step 2 first.
Propose the implementation plan.
Build only after confirmation.
