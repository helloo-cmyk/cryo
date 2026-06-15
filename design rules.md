# CRYO Radiator Coolant - Design Rules & Guidelines

This document outlines the strict guidelines, coding practices, and design standards specifically established for the **CRYO Radiator Coolant** website. All future updates to the project must strictly comply with these rules.

---

## 🛠️ 1. Technology Stack & Directory Structure
* **Core:** Pure HTML5, CSS3, and Vanilla JavaScript.
* **Prohibited Technologies:** React, Next.js, TailwindCSS, Bootstrap, jQuery, or any Node-based build tools (npm, webpack, vite).
* **Directory Layout:**
  * Root (`/`): Main HTML page files (e.g. `index.html`, `shop.html`, `product.html`, `cart.html`, `checkout.html`, `dealer.html`).
  * CSS: [assets/css/style.css](file:///d:/cryo/assets/css/style.css) (Consolidated global stylesheet).
  * JS: [assets/js/main.js](file:///d:/cryo/assets/js/main.js) (App initialization & core scripts), [assets/js/components.js](file:///d:/cryo/assets/js/components.js) (Shared custom HTML elements).
  * Images: [assets/images/](file:///d:/cryo/assets/images/) (All product images, backgrounds, and logo assets).
  * Scripts & Docs: `/scripts/` (Utility scripts) and `/resources/` (Raw documentation & documents).

---

## 🎨 2. Design Aesthetics & Colors
The website uses a dynamic "Recster" dark-theme aesthetic, combining sleek dark backgrounds with high-contrast vibrant accent colors:

### Brand Color Tokens (HSL/HEX)
* **Primary Red (Brand Accent):** `#E8211D` (Hover/Dark state: `#B81A17`)
* **Primary Dark Background:** `#111111` (Default body and main section base)
* **Component Dark-Alt Background:** `#1E1E1E` (Used for steps, filters, and cards)
* **Deep Navy/Secondary Accent:** `#1A1A2E` (Used for footer and main layout anchors)
* **Mid-Grey Border/Accent:** `#2C2C3A`
* **Light-Grey contrast Background:** `#F5F5F5` (Used for trust bars, badges, and checkout forms)
* **Review Gold Accent:** `#C8A84B` (Used for rating stars)
* **WhatsApp / Success Green:** `#25D366` / `#28A745` (Used for WhatsApp CTAs and success overlays)

### Variant Colors
* **Coolant Green:** `#4CAF50` (Green variant badges & toggles)
* **Coolant Red:** `#E53935` (Red variant badges & toggles)
* **Coolant Blue:** `#1E88E5` (Blue variant badges & toggles)

---

## 📐 3. Typography & Typography Hierarchy
* **Heading Font:** `Barlow`, sans-serif.
  * *Usage:* All Headings (H1-H6). Should be heavily weighted (700+ or 800) and uppercase to maintain a bold, masculine, automotive aesthetic.
* **Body Font:** `Inter`, sans-serif.
  * *Usage:* Paragraphs, description copy, forms, and general UI labels.

---

## 📐 4. UI Layout, Spacing, & Spacing Rules

### Emojis Strictly Prohibited
* **Rule:** Emojis (e.g., ❓, 🚗, 🛒) MUST NEVER be used in the markup, script-rendered contents, or copy.
* **Replacement:** You must always use crisp, scalable, inline **SVG icons** (styled like Lucide icons) matching the `currentColor` or brand colors.

### Global Header Dimensions & Scroll Behavior
* **Unscrolled State (Desktop):**
  * `.header-logo-section` padding is `6px 0` with logo image height `48px` (making the black top bar ~60px tall).
  * `.main-nav a` padding is `12px 20px` with font size `14px` (making the white bottom bar ~44px tall).
  * Total unscrolled height: ~104px.
* **Scrolled Sticky State (`.site-header.scrolled` class):**
  * Hides secondary `.header-info-blocks` (address/phone text) and `.logo-subtext` completely.
  * Shrinks logo image height to `36px` and padding to `3px 0`.
  * Shrinks action boxes (cart, search) to `42px`.
  * Shrinks main navigation link padding to `10px 15px`.
  * Total scrolled height: ~80px.
* **Hysteresis Scroll Listener (JS):**
  * To prevent layout shift flickering, the scroll listener in `main.js` must implement **hysteresis**:
    * Add `.scrolled` class when `window.scrollY > 100`.
    * Remove `.scrolled` class only when `window.scrollY < 40`.

### Hero Section Layout Spacing Rules
* **Bypassing Defaults:** The hero section `.hero-full` must have `padding: 0 !important;` to prevent inheriting the default `80px 0` section paddings.
* **Top Spacing (Desktop):** `.hero-full-content` has `padding-top: 80px` to maintain a spacious, clean vertical top gap below the sticky header.
* **Bottom Spacing (Desktop):** `.hero-text-area` has `padding-bottom: 110px` to create a clean gap below the CTA buttons and prevent overlapping with the absolute positioned `.hero-bottom-brand` slant banner.
* **Alignment:** 
  * `.hero-full-content` uses `align-items: stretch;` and `.hero-text-area` uses `display: flex; flex-direction: column; justify-content: flex-start;` to keep text top-aligned.
  * If a graphic/worker is inside `.hero-image-area`, it must use `align-items: flex-end;` to sit flush at the bottom edge.
* **Background Cover:** Use `background-size: cover; background-position: 105% -30px;` to slightly shift background details up and right for text readability.

---

## 📱 5. Responsive Spacing Breakpoints

### Tablet Breakpoint (max-width: 1024px)
* `.hero-full` has `min-height: 480px`.
* `.hero-full-content` has `padding-top: 60px`.
* `.hero-text-area` has `padding-bottom: 80px`.

### Mobile Breakpoint (max-width: 768px)
* `.hero-full` has `min-height: auto`.
* `.hero-full-content` has `padding: 40px 20px 30px 20px; flex-direction: column; text-align: center;`.
* `.hero-text-area` has `padding-bottom: 0 !important; margin-bottom: 25px;`.
* `.hero-bottom-brand` (slant banner) is hidden (`display: none;`).

---

## ⚙️ 6. Component Standards
* **Local Storage:** Cart data must be managed through `localStorage` using the key `cryoCart`.
* **WhatsApp Checkout Form:** Cart submissions compile details and redirect the client to the official WhatsApp number `0301-4138007`.
* **Dynamic Image Fallbacks:** Product cards and detail gallery elements must implement dynamic fallbacks to `assets/images/placeholder.jpg` via `onerror` attribute to prevent broken layout boxes.

---

## 🎨 7. Design Continuity & Section Compatibility
* **Continuous Design Review:** Whenever designing, redesigning, or modifying any section of a page, you MUST carefully consider and analyze the design, background colors, typography, borders, and general layout transitions of both the **immediate next section** and the **immediate previous section**. 
* **Seamless Transitions:** Creating jarring color transitions or clashing layouts (e.g., placing high-contrast dark bars directly next to white-background component sections) is STRICTLY PROHIBITED. Always ensure a smooth, premium, and unified visual flow across all adjacent sections of the page.
