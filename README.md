# Ishika Bhaumik — Portfolio

An editorial-dark, motion-led portfolio site built for Ishika Bhaumik — Designer & Developer.

## Stack

- **Next.js 14** (App Router, RSC, MDX)
- **React Three Fiber** + custom GLSL shaders for the hero particle field
- **GSAP** (+ ScrollTrigger, Draggable) for choreographed motion
- **Lenis** smooth scroll
- **Tailwind CSS** for styling, with a bespoke palette and type scale
- **next-mdx-remote/rsc** for blog posts
- **Resend** for the contact form

## Local development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Environment

Create a `.env.local` to enable the contact form delivery:

```
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_TO_EMAIL=hello@ishikabhaumik.com
CONTACT_FROM_EMAIL=Ishika Portfolio <onboarding@resend.dev>
```

If the key is missing the form will still validate and respond — messages are logged to the server console rather than emailed, so the rest of the site can be demoed without setup.

## Structure

```
src/
├── app/
│   ├── layout.tsx        Global font load, smooth scroll, cursor
│   ├── page.tsx          Home (server) → HomeClient
│   ├── HomeClient.tsx    All sections, mounts preloader
│   ├── blog/             Blog list + [slug] post pages
│   ├── actions/          Server actions (contact)
│   └── globals.css
├── components/
│   ├── preloader/        IB logo morph
│   ├── cursor/           Context-aware cursor
│   ├── nav/              Fullscreen overlay nav
│   ├── three/            WebGL particle field
│   ├── sections/         Hero, About, Skills, Experience, Work, Blog, Playground, Contact
│   ├── providers/        Lenis smooth scroll
│   └── ui/               SplitText, MagneticButton, RevealImage, SectionLabel
├── lib/                  fonts, gsap registration, blog loader, cn
└── content/blog/         MDX essays
```

## Design language

- Palette: `#0A0A0A` ink · `#C9A84C` warm gold · `#F5F0E8` bone
- Type: `Cormorant Garamond` (display), `DM Sans` (body), `DM Mono` (UI)
- Motion: slow, deliberate, generous easings (`expo.out`, `expo.inOut`)
- Cursor labels: `View` (projects) · `Drag` (playground) · `Open` (links/buttons)
