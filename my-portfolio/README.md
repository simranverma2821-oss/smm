# Simran Verma — Portfolio

Personal portfolio site for Simran Verma, a digital marketing specialist (GMB, SEO, Google Ads). Built with Next.js (App Router) and Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/
    layout.tsx      # fonts, metadata, root layout
    page.tsx         # assembles all sections
    globals.css       # theme (accent color, fonts, reduced-motion)
  components/
    Header.tsx        # sticky nav with mobile menu
    Hero.tsx
    About.tsx
    Skills.tsx
    Experience.tsx
    Certifications.tsx # certifications + education
    Contact.tsx
    ContactForm.tsx    # client-side form
    Footer.tsx
    Reveal.tsx         # scroll-in animation wrapper
    SectionHeading.tsx
  data/
    portfolio.ts       # all site content (bio, skills, experience, etc.)
```

To update site content (bio, skills, experience, certifications, education, contact email/phone), edit `src/data/portfolio.ts` — no need to touch the components.

## Before you deploy

- **Resume**: the "Download Resume" button links to `/resume.pdf`. Add your resume PDF at `public/resume.pdf` (create the `public` folder file with that exact name) — the link will 404 until it's there.
- **Phone number**: `src/data/portfolio.ts` has `phone: ""`. Add a number there and the phone link will appear in the Contact section automatically; it's hidden while empty.
- **Contact form**: the form currently opens the visitor's email client via a `mailto:` link (no backend required). If you'd rather receive submissions directly (e.g. via Formspree, Resend, or a serverless function), swap the `handleSubmit` logic in `src/components/ContactForm.tsx`.

## Build

```bash
npm run build
npm start
```
