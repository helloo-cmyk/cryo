# ❄️ CRYO Radiator Coolant - Web Platform Documentation

Welcome to the official repository documentation for the **CRYO Radiator Coolant** web application. This document serves as a comprehensive developer and design guide, outlining the project structure, tech stack, page details, component design, database integrations, and developer guidelines.

---

## 🛠️ 1. Technical Stack Overview

The CRYO Radiator Coolant web application is designed as a high-performance, lightweight, static site, adhering strictly to traditional web design standards to ensure maximum speed, portability, and zero-build complexity.

| Layer | Technology | Details |
|---|---|---|
| **Frontend Core** | Pure HTML5, CSS3, Vanilla ES6 JavaScript | Zero compile/build step required for frontend delivery. No React, Next.js, TailwindCSS, Bootstrap, or jQuery. |
| **Component Model** | Vanilla HTML5 Web Components | Encapsulated shared layout structures (Header, Footer). |
| **State Management** | LocalStorage API | Local shopping cart state managed under the `cryoCart` key. |
| **Backend & Database** | Supabase | Cloud database, authentication, and static page content management using the Supabase JavaScript Client. |
| **Clean Routing** | Native redirects | Netlify/Cloudflare `_redirects` and Vercel `vercel.json` rewrites for clean, extensionless URLs (e.g., `/shop` instead of `/shop.html`). |
| **Admin WYSIWYG** | Quill Editor | Used in the Admin panel for rich text configuration. |
| **Asset Utilities** | Node.js / Jimp | Automation scripts for image processing and structural code migrations. |

---

## 📁 2. Directory Layout & Structure

```yaml
cryo/
├── admin/                         # Admin Dashboard / CMS Portal
│   ├── assets/
│   │   ├── css/
│   │   │   └── admin.css          # Stylesheets for the CMS panel
│   │   └── js/
│   │       ├── admin-nav.js       # Dynamic sidebar navigator injection
│   │       ├── admin.js           # Core admin dashboard operations (Supabase CRUD)
│   │       ├── auth.js            # Admin session & authentication logic
│   │       └── cms-admin.js       # CMS rich text updates (policies, testimonials)
│   ├── banners.html               # Banner customization panel
│   ├── content.html               # Static content (policies, testimonials) management
│   ├── dashboard.html             # Overview panel showing stats (Products, Orders, Revenue)
│   ├── login.html                 # Supabase-based admin login panel
│   ├── migrate_products.sql       # SQL migration file for product tables
│   ├── orders.html                # Orders management screen
│   ├── products.html              # Product CRUD operations and modal forms
│   ├── reviews.html               # Testimonials moderator screen
│   ├── seed.html                  # Database seeding wizard
│   └── settings.html              # Core configurations (charges, phone numbers)
├── assets/                        # Public assets folder
│   ├── css/
│   │   └── style.css              # Main global stylesheet (consists of all styles)
│   ├── images/                    # Product imagery, branding, logos, backgrounds
│   └── js/
│       ├── cms-store.js           # Client-side CMS content loader (Supabase settings)
│       ├── cms.js                 # Shared UI content injects (phones, address mappings)
│       ├── components.js          # Shared Web Components (<site-header>, <site-footer>)
│       ├── main.js                # Global state, cart system, and page initializers
│       └── supabase-config.js     # Supabase initialization client configuration
├── components/                    # Legacy HTML header/footer blocks
├── resources/                     # Product sheets, documentation, briefs
├── scripts/                       # Asset processing & utility automation tools
│   ├── fix.js                     # HTML header/footer component migration script
│   ├── horizontal_logo_jimp.js    # Combines vertical logo parts to horizontal via Jimp
│   ├── inject_favicon.js          # Injects favicon tags globally into header tags
│   ├── remove_bg.js               # Green-screen background removal script using Jimp
│   └── replace_emojis.js          # Scrapes HTML files to substitute emojis with clean SVGs
├── supabase/                      # Database schema and initialization scripts
│   └── schema.sql                 # Table queries, RLS policies, and triggers
├── .gitignore                     # Git ignore rules
├── _redirects                     # Routing rewrites for static cloud hosting providers
├── vercel.json                    # Routing rewrites for Vercel deployments
├── package.json                   # Jimp dependency for scripts
└── package-lock.json              # Jimp lock file
```

---

## 🎨 3. Design System & Brand Guidelines

All pages follow a sleek **"Recster" dark-automotive aesthetic** tailored for heavy-duty, performance-oriented marketing.

### 🎨 Brand Color Tokens
* **Primary Red (Brand Accent):** `#E8211D` (Hover/Dark state: `#B81A17`)
* **Primary Dark Background:** `#111111` (Default body and main section base)
* **Component Dark-Alt Background:** `#1E1E1E` (Used for cards, steps, filters, and fields)
* **Deep Navy/Secondary Accent:** `#1A1A2E` (Used for footer and main layout anchors)
* **Mid-Grey Border/Accent:** `#2C2C3A`
* **Light-Grey contrast Background:** `#F5F5F5` (Used for trust bars, badges, and checkout forms)
* **Review Gold Accent:** `#C8A84B` (Used for rating stars)
* **WhatsApp Green:** `#25D366`
* **Success Green:** `#28A745`

### 🧪 Color Variants (Coolant Fluids)
* **Coolant Green:** `#4CAF50` (Green fluid badges & toggles)
* **Coolant Red:** `#E53935` (Red fluid badges & toggles)
* **Coolant Blue:** `#1E88E5` (Blue fluid badges & toggles)

### 📐 Typography Hierarchy
* **Headings (H1-H6):** `Barlow`, sans-serif (Bold, heavy weight 700-800, uppercase, automotive tone).
* **Body, Forms & UI Elements:** `Inter`, sans-serif (Clean, high-legibility sans-serif font).

---

## ⚠️ 4. Strict Coding Rules & Standards

To maintain absolute quality control, the following guidelines are **strictly enforced** across the codebase:

1. **Strict Emoji Ban:** Text-based emojis (e.g., `❓`, `🚗`, `🛒`) are strictly prohibited in HTML code or JS-rendered templates. You must always use inline **SVGs** matching the established styling patterns (run `scripts/replace_emojis.js` to clean files).
2. **Never Use Em Dashes:** The use of `—` is prohibited site-wide. Use hyphens (`-`), colons (`:`), or commas.
3. **No Gradients:** Radial or linear gradients are prohibited. Visual blocks, overlays, and buttons must use solid brand colors.
4. **Header Scroll Hysteresis:** The sticky header implementation in `main.js` must prevent layout flickering by employing a hysteresis range:
   * **Apply `.scrolled` state** when `window.scrollY > 100`.
   * **Remove `.scrolled` state** only when `window.scrollY < 40`.
5. **Section Transition Continuity:** Avoid jarring background transitions. When editing page blocks, verify that background changes transition smoothly into the previous and next sections.
6. **No Content Replacement:** Do not rewrite or modify copywriting contents during structural redesigns unless explicitly commanded.
7. **Clean Extensionless Links:** Head links must omit the `.html` extension (e.g., `/shop`, `/about`), relying on hosting redirect tables.

---

## 🏗️ 5. Component Architecture

The header and footer are centralized using custom HTML Web Components in `assets/js/components.js`.

### 🧭 `<site-header>`
* **Top Bar (Desktop):** Incorporates branding, physical locations, phone numbers, social media links, and WhatsApp quick buttons.
* **Navigation Links:** Highlighted dynamically based on the current window path (`window.location.pathname`).
* **Sticky Clone:** Employs a cloned node element styled as `.sticky-clone` which slides down smoothly when scroll offsets exceed `250px`.
* **Mobile Interaction:** Responsive slide-in drawer layout toggled via a hamburger menu.
* **Search Integration:** An input trigger that redirects clients to the shop parameter page (`shop.html?q=input_value`).

### ⛑️ `<site-footer>`
* **Layout:** A responsive 4-column layout detailing About context, Quick Navigation, Policy Links, and Contact details.
* **Floating WhatsApp Button:** Fixed to the bottom-right corner, toggled to visibility dynamically when `window.scrollY > 300`.

---

## 📄 6. Pages Overview

### 🏡 Homepage (`index.html`)
* **Hero Section:** Full-screen viewport design featuring brand slogans, Call to Actions, and an absolute positioned slanted banner.
* **USP (Unique Selling Proposition) Grid:** Displays key performance benefits (Advanced formula, Climate protection, 100% Genuine, Industrial rating).
* **Featured Products:** Dynamically fetches up to 6 in-stock products from Supabase. Generates skeleton placeholder cards during loading states.
* **Benefits Showcase:** Split layout showing coolant attributes alongside product packaging images.
* **Order Flowchart:** 3-step visualization highlighting how to buy.
* **Testimonial Slider:** Curated customer feedback blocks with gold rating stars.

### 🛒 Shop Catalog (`shop.html`)
* **Filtering Options:** Includes category selects for fluid colors (Green, Red, Blue) and sizes (1L, 4L).
* **Search Input:** Filters catalog entries by matching name substrings in real-time.
* **Price Filter:** Allows custom Minimum/Maximum bounds inputs.
* **Sorting Dropdown:** Organizes products by price (Low to High, High to Low).

### 🏷️ Product Detail Page (`product.html`)
* **Product Matching:** Evaluates `product` parameters in the URL query string (e.g., `?product=green-1l`) to fetch the corresponding details from the active state.
* **Quantity Toggles:** Controls purchase quantities (range 1–99).
* **Tab-based Panels:** Toggles views between **Long Description**, **Features List**, and **Specifications Table**.
* **Related Recommendations:** Recommends alternative products at the bottom of the page.

### 🛍️ Cart (`cart.html`) & Checkout (`checkout.html`)
* **Cart Page:** CRUD actions allowing users to modify quantities or remove items from `localStorage`.
* **Checkout Page:** Collecting customer shipping details. Supports selection of delivery options (Default vs Express delivery fee) and compiles a structured template redirecting details straight to the official WhatsApp number (`0301-4138007`). Submits details to the Supabase `orders` table.

---

## 💾 7. Database & Backend Configuration

The platform uses **Supabase** for configuration, dynamic inventory, orders, and content updates.

### 📊 Database Schema

#### `products`
* Contains inventory details.
* Columns: `id` (Text PK), `name` (Text), `color` (Text: green/red/blue), `size` (Text), `regularPrice` (Numeric), `offerPrice` (Numeric), `imageUrl` (Text), `shortDescription` (Text), `longDescription` (Text), `features` (Text HTML), `specifications` (Text HTML), `inStock` (Boolean).

#### `settings`
* Contains global values.
* Columns: `id` (Text: global PK), `whatsappNumber` (Text), `deliveryCharge` (Numeric), `expressDeliveryCharge` (Numeric).

#### `orders`
* Logs checkout attempts.
* Columns: `id` (UUID PK), `customer_name` (Text), `phone` (Text), `city` (Text), `address` (Text), `items` (JSONB), `subtotal` (Numeric), `delivery_fee` (Numeric), `total` (Numeric), `status` (Text: pending/shipped/completed), `created_at` (TIMESTAMPTZ).

#### `page_content`
* Handles CMS parameters.
* Columns: `slug` (Text PK), `title` (Text), `content` (Text), `updated_at` (TIMESTAMPTZ).

---

## 🛠️ 8. Developer Workflows

* **Favicon Inject:** After creating new pages, run `node inject_favicon.js` to ensure the brand icon is added to page head tags.
* **Emoji Compliance:** Run `node scripts/replace_emojis.js` to automatically parse and swap code emojis for SVG tags site-wide.
* **Logo Realignment:** To regenerate the horizontal logo after editing the primary brand assets, run `node scripts/horizontal_logo_jimp.js`.
