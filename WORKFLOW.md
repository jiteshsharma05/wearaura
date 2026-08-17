# WearAura — Project Workflow

> **Premium Direct-to-Consumer Fragrance E-Commerce Website**
> Built with Next.js 16 · TypeScript · Tailwind CSS v4 · Supabase · Framer Motion

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Environment Setup](#environment-setup)
5. [Development Workflow](#development-workflow)
6. [Architecture & Data Flow](#architecture--data-flow)
7. [Pages & Routes](#pages--routes)
8. [Components](#components)
9. [Supabase Backend](#supabase-backend)
10. [Styling Guide](#styling-guide)
11. [Deployment](#deployment)
12. [Common Tasks](#common-tasks)
13. [Troubleshooting](#troubleshooting)

---

## Project Overview

**WearAura** is a premium fragrance e-commerce website featuring:
- Dynamic hero image carousel (managed via Supabase)
- Product catalog with detail pages
- Shopping cart (localStorage-based)
- User authentication (Supabase Auth)
- Wishlist functionality
- Order management
- Admin dashboard (product & hero image management)
- Policy pages (privacy, shipping, returns, etc.)
- Fully responsive design with elegant animations

---

## Tech Stack

| Layer          | Technology                     | Version  |
|----------------|--------------------------------|----------|
| Framework      | Next.js (App Router)           | 16.1.6   |
| Language       | TypeScript                     | ^5       |
| UI Library     | React                          | 19.2.3   |
| Styling        | Tailwind CSS                   | v4       |
| Animations     | Framer Motion                  | ^12.36.0 |
| Icons          | Lucide React                   | ^0.577.0 |
| Backend / Auth | Supabase (supabase-js)         | ^2.97.0  |
| Notifications  | React Hot Toast                | ^2.6.0   |
| Fonts          | Cormorant Garamond, Inter      | Google   |

---

## Project Structure

```
wearaura/
├── .env.local                    # Supabase credentials (NEVER commit)
├── .gitignore
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies & scripts
├── postcss.config.mjs            # PostCSS config (Tailwind)
├── tsconfig.json                 # TypeScript config
│
├── lib/
│   └── supabase.ts               # Supabase client initialization
│
├── src/
│   ├── app/
│   │   ├── globals.css            # Tailwind imports & theme (fonts)
│   │   ├── layout.tsx             # Root layout (providers, header, footer)
│   │   ├── page.tsx               # Homepage (hero carousel, products, features)
│   │   │
│   │   ├── about/                 # About page
│   │   ├── account/               # User profile/account page
│   │   ├── admin/                 # Admin dashboard
│   │   │   ├── page.tsx           # Admin panel (products CRUD, orders)
│   │   │   └── HeroManagement.tsx # Hero image management component
│   │   ├── cart/                  # Shopping cart page
│   │   ├── contact/               # Contact page
│   │   ├── forgot-password/       # Password recovery
│   │   ├── login/                 # Login page
│   │   ├── my-orders/             # User's order history
│   │   ├── order-success/         # Order confirmation page
│   │   ├── policies/              # Legal/policy pages
│   │   │   ├── cancellation-policy/
│   │   │   ├── privacy-policy/
│   │   │   ├── product-disclaimer/
│   │   │   ├── return-refund-exchange/
│   │   │   ├── shipping-policy/
│   │   │   └── terms-and-conditions/
│   │   ├── products/
│   │   │   └── [id]/              # Dynamic product detail page
│   │   ├── reset-password/        # Password reset
│   │   ├── signup/                # Registration page
│   │   └── wishlist/              # Wishlist page
│   │
│   └── components/
│       ├── AuthProvider.tsx        # Auth context (Supabase session mgmt)
│       ├── CartProvider.tsx        # Cart context (localStorage)
│       ├── Header.tsx             # Navigation bar + sidebar menu
│       ├── Footer.tsx             # Site footer with links
│       └── utils/
│           ├── cloudinaryUpload.ts # Image upload to Cloudinary
│           └── imageUtils.ts      # Image processing utilities
│
├── modify_admin.py               # Python script: admin panel modifications
├── update_frontend_images.py     # Python script: frontend image updates
├── update_homepage_hero.py       # Python script: hero section updates
└── update_product_page.py        # Python script: product page updates
```

---

## Environment Setup

### Prerequisites
- **Node.js** ≥ 18.x
- **npm** (comes with Node.js)
- A **Supabase** project with configured tables

### 1. Clone / Navigate to the project
```bash
cd C:\Users\user 1\Projects\wearaura
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create (or verify) `.env.local` in the project root with:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> ⚠️ **Never commit `.env.local` to version control.** It is already in `.gitignore`.

### 4. Start the dev server
```bash
npm run dev
```
The site will be available at **http://localhost:3000**

---

## Development Workflow

### Available Scripts

| Command          | Description                          |
|------------------|--------------------------------------|
| `npm run dev`    | Start development server (Turbopack) |
| `npm run build`  | Create production build              |
| `npm run start`  | Run production server                |
| `npm run lint`   | Run ESLint                           |

### Day-to-Day Workflow

1. **Start dev server**: `npm run dev`
2. **Edit files** in `src/app/` or `src/components/` — changes auto-reload
3. **Add new pages**: Create folder in `src/app/<route>/page.tsx`
4. **Add components**: Create in `src/components/`
5. **Test locally** at `http://localhost:3000`
6. **Commit changes**: `git add . && git commit -m "description"`

### Branch Strategy (Recommended)
```
main        ← production-ready code
├── dev     ← integration branch
│   ├── feature/xyz  ← feature branches
│   └── fix/abc      ← bugfix branches
```

---

## Architecture & Data Flow

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│                                                  │
│  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ AuthProvider  │  │      CartProvider         │  │
│  │ (Supabase     │  │  (localStorage-based)    │  │
│  │  Session)     │  │                          │  │
│  └──────┬───────┘  └──────────┬───────────────┘  │
│         │                     │                   │
│  ┌──────▼─────────────────────▼───────────────┐  │
│  │              App Layout                     │  │
│  │  ┌────────┐ ┌──────────────┐ ┌──────────┐  │  │
│  │  │ Header │ │    Pages     │ │  Footer  │  │  │
│  │  └────────┘ └──────┬───────┘ └──────────┘  │  │
│  └────────────────────┼───────────────────────┘  │
│                       │                           │
└───────────────────────┼───────────────────────────┘
                        │ API Calls
                        ▼
            ┌───────────────────────┐
            │   Supabase Backend    │
            │  ┌─────────────────┐  │
            │  │  Auth Service   │  │
            │  │  Database (SQL) │  │
            │  │  Storage        │  │
            │  └─────────────────┘  │
            └───────────────────────┘
```

### Key Patterns:
- **AuthProvider** wraps the entire app, providing `user`, `session`, `loading`, `signOut` via React Context
- **CartProvider** wraps the entire app, managing cart state with localStorage persistence
- **Supabase client** (`lib/supabase.ts`) is a singleton used throughout for DB/auth calls
- **React Hot Toast** provides notification popups (bottom-right)

---

## Pages & Routes

| Route                               | File                                          | Auth Required | Description                          |
|-------------------------------------|-----------------------------------------------|:------------:|--------------------------------------|
| `/`                                 | `src/app/page.tsx`                            | No           | Homepage with hero carousel & products |
| `/products/[id]`                    | `src/app/products/[id]/page.tsx`              | No           | Product detail page                  |
| `/cart`                             | `src/app/cart/page.tsx`                       | No           | Shopping cart                        |
| `/wishlist`                         | `src/app/wishlist/page.tsx`                   | Yes          | User wishlist                        |
| `/login`                            | `src/app/login/page.tsx`                      | No           | Sign in                             |
| `/signup`                           | `src/app/signup/page.tsx`                     | No           | Register                            |
| `/forgot-password`                  | `src/app/forgot-password/page.tsx`            | No           | Password recovery                    |
| `/reset-password`                   | `src/app/reset-password/page.tsx`             | No           | Password reset (from email link)     |
| `/account`                          | `src/app/account/page.tsx`                    | Yes          | User profile                         |
| `/my-orders`                        | `src/app/my-orders/page.tsx`                  | Yes          | Order history                        |
| `/order-success`                    | `src/app/order-success/page.tsx`              | Yes          | Order confirmation                   |
| `/admin`                            | `src/app/admin/page.tsx`                      | Admin        | Admin dashboard                      |
| `/about`                            | `src/app/about/page.tsx`                      | No           | About the brand                      |
| `/contact`                          | `src/app/contact/page.tsx`                    | No           | Contact form                         |
| `/policies/privacy-policy`          | `src/app/policies/privacy-policy/page.tsx`    | No           | Privacy policy                       |
| `/policies/terms-and-conditions`    | `src/app/policies/terms-and-conditions/...`   | No           | Terms & conditions                   |
| `/policies/shipping-policy`         | `src/app/policies/shipping-policy/...`        | No           | Shipping policy                      |
| `/policies/return-refund-exchange`  | `src/app/policies/return-refund-exchange/...` | No           | Returns & refunds                    |
| `/policies/cancellation-policy`     | `src/app/policies/cancellation-policy/...`    | No           | Cancellation policy                  |
| `/policies/product-disclaimer`      | `src/app/policies/product-disclaimer/...`     | No           | Product disclaimer                   |

---

## Components

### Core Components

| Component            | File                                | Purpose                                        |
|----------------------|-------------------------------------|------------------------------------------------|
| `AuthProvider`       | `src/components/AuthProvider.tsx`   | React Context for Supabase auth state          |
| `CartProvider`       | `src/components/CartProvider.tsx`   | React Context for shopping cart (localStorage) |
| `Header`             | `src/components/Header.tsx`        | Fixed navigation bar with sidebar menu         |
| `Footer`             | `src/components/Footer.tsx`        | Site footer with nav, policies, contact         |
| `HeroManagement`     | `src/app/admin/HeroManagement.tsx` | Admin: manage hero carousel images             |

### Utilities

| Utility              | File                                         | Purpose                          |
|----------------------|----------------------------------------------|----------------------------------|
| `cloudinaryUpload`   | `src/components/utils/cloudinaryUpload.ts`   | Upload images to Cloudinary CDN  |
| `imageUtils`         | `src/components/utils/imageUtils.ts`         | Image processing/optimization    |

---

## Supabase Backend

### Database Tables (Inferred from Code)

| Table          | Key Columns                                                                 | Used By           |
|----------------|-----------------------------------------------------------------------------|-------------------|
| `products`     | `id`, `name`, `description`, `price`, `category`, `stock`, `image_url`, `images`, `status` | Homepage, Products |
| `hero_images`  | `id`, `image_url`, `title`, `subtitle`, `button_text`, `button_link`, `sort_order`, `is_active` | Homepage Carousel |
| `wishlist`     | `user_id`, `product_id`                                                     | Wishlist           |
| `profiles`     | `id`, `role`                                                                | Admin access       |
| `orders`       | *(managed via admin)*                                                       | Orders             |

### Authentication
- Uses **Supabase Auth** with email/password
- Session managed via `AuthProvider` (context)
- Admin role checked via `profiles.role === 'admin'`
- Password recovery via Supabase's built-in email flow

### Client Setup (`lib/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## Styling Guide

### Design System

| Token               | Value                  | Usage                        |
|----------------------|------------------------|------------------------------|
| Background           | `#FAF9F6`             | Main page background         |
| Text Primary          | `#1a1a1a`             | Headings, body text          |
| Text Secondary        | `#4a4a4a`             | Subtle labels, descriptions  |
| Text Muted            | `#8a8a8a`             | Placeholders, hints          |
| Border                | `#e8e6e1`             | Dividers, card borders       |
| Surface               | `#f0eeea`             | Card backgrounds, hover      |
| Accent (Purple)       | `#2d1b3d → #4a3558`  | Feature section gradient     |
| Accent Text (Purple)  | `#c4a8d4`             | Feature section body text    |

### Fonts
- **Serif (Headings)**: `Cormorant Garamond` — `--font-cormorant`
- **Sans (Body)**: `Inter` — `--font-inter`

### Tailwind CSS v4
- Config via `postcss.config.mjs` (PostCSS plugin)
- Theme tokens defined in `globals.css` using `@theme` directive
- No `tailwind.config.js` (v4 uses CSS-first config)

---

## Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy — Vercel auto-detects Next.js

### Other Platforms
The project can be deployed to any Node.js hosting (Railway, Render, AWS, etc.) using:
```bash
npm run build && npm run start
```

---

## Common Tasks

### Add a New Page
1. Create folder: `src/app/<route-name>/`
2. Create `page.tsx` inside it
3. The route is automatically available at `/<route-name>`

### Add a New Product (via Admin)
1. Login as admin
2. Navigate to `/admin`
3. Use the product management interface

### Update Hero Images (via Admin)
1. Login as admin
2. Navigate to `/admin`
3. Use the Hero Management section

### Add a New Component
1. Create file in `src/components/`
2. Import and use in your pages
3. If it needs auth: use `useAuth()` hook
4. If it needs cart: use `useCart()` hook

### Modify Environment Variables
1. Edit `.env.local`
2. Restart the dev server (`Ctrl+C` then `npm run dev`)

---

## Troubleshooting

| Issue                              | Solution                                                    |
|------------------------------------|-------------------------------------------------------------|
| "Module not found" errors          | Run `npm install` to reinstall dependencies                 |
| Supabase connection fails          | Check `.env.local` values are correct                       |
| Styles not applying                | Clear `.next` folder: `Remove-Item -Recurse .next`          |
| Auth not working                   | Verify Supabase URL and anon key in `.env.local`            |
| Cart not persisting                | Check browser localStorage isn't disabled                   |
| Admin page not accessible          | Ensure user's `profiles.role` is set to `"admin"` in Supabase |
| Port 3000 already in use           | Kill the process: `npx kill-port 3000` or use another port  |
| Build fails                        | Check TypeScript errors: `npx tsc --noEmit`                 |

---

## Quick Reference

```bash
# Start development
npm run dev

# Build & preview production
npm run build && npm run start

# Lint code
npm run lint

# Clear Next.js cache
Remove-Item -Recurse -Force .next

# Check TypeScript
npx tsc --noEmit
```

---

*Last updated: June 16, 2026*
