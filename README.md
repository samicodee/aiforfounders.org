# AI for Founders

Standalone landing site for `aiforfounders.org`.

AI for Founders is a practical AI implementation workshop for founders, business owners, and SME leaders who want AI workflows for sales, operations, hiring, reporting, and founder leverage.

## Current App

- `app/page.tsx` - focused AI for Founders landing page
- `app/components/Header.tsx` - founder-specific wordmark and navigation
- `app/components/Hero.tsx` - founder hero section
- `app/layout.tsx` - metadata and Vercel Analytics
- `styles.css` - founder visual system and responsive layout

## Backend Direction

The current form submits by email. It already includes hidden fields that match the future shared AIFORX application backend:

- `program=founders`
- `source_domain=aiforfounders.org`

Later, this site should submit to the shared application portal/database used by the other AIforX verticals.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production check:

```bash
npm run build
```
