# GitHub Copilot Instructions

## 🌐 Project Overview
This is a **Personal Portfolio Website** built with **Vanilla JavaScript (ES6+)**, **HTML5**, and **Modular CSS3**. It follows a **mobile-first** design approach and includes PWA capabilities. There are **no frontend frameworks** (React, Vue, etc.) - all functionality is implemented in pure JavaScript.

## 🏗️ Architecture

### CSS Architecture
- **Entry Point**: `ASSETS/css/main.css` manages imports.
- **Structure**:
  - `base/`: Reset, typography, and **CSS variables** (`variables.css`).
  - `layout/`: Structural styles (header, hero, footer).
  - `components/`: Reusable UI elements (buttons, cards, modals).
  - `mobile/`: Mobile-specific overrides and base styles.
  - `desktop/`: Desktop-specific overrides (media queries).
  - `themes/`: Theme-specific styles.
- **Pattern**: Use `@import` in `main.css` to maintain load order.

### JavaScript Architecture
- **Entry Point**: `ASSETS/js/main.js` handles application lifecycle.
- **Modules**: Located in `ASSETS/js/modules/`.
  - **Barrel Export**: All modules are exported via `ASSETS/js/modules/index.js`.
  - **Phased Initialization**: `main.js` initializes modules in 3 phases:
    1. **Critical**: `ScrollManager`, `ThemeManager`, `HamburgerMenu`.
    2. **Animations**: `SectionAnimator`, `TextAnimation`.
    3. **Interactive**: `PortfolioFilter`, `ProjectModal`.
- **Data Separation**: Content data (projects, etc.) resides in `ASSETS/js/data/`.
- **Configuration**: Constants and config settings in `ASSETS/js/config/`.

## 🛠️ Critical Workflows

### Development
- **Edit Source**: Modify files in `ASSETS/js/` and `ASSETS/css/`.
- **Data Updates**: To add/edit projects, modify `ASSETS/js/data/projects.js` instead of HTML.
- **Styling**:
  - Start with **mobile styles** in `mobile/` or base files.
  - Add **desktop overrides** in `desktop/` folders.
  - Use **CSS Variables** from `variables.css` for colors/fonts to ensure theme compatibility.

### Build & Deployment
- **Obfuscation**: Run `node build-obfuscated.js` to generate protected code.
- **Deployment**: Deployed via GitHub Pages.

## 📏 Conventions & Patterns

- **No Frameworks**: Do not suggest React/Vue/Angular solutions. Use `document.querySelector`, `addEventListener`, and ES6 classes.
- **Theming**:
  - Use `var(--variable-name)` for all colors.
  - Light theme uses **Pantone Cloud Dancer** (#F0EEE9) as base background.
  - `ThemeManager.js` handles toggling the `[data-theme]` attribute on `<html>`.
- **DOM Manipulation**:
  - Cache DOM elements in class constructors.
  - Use event delegation for dynamic content (like project modals).
- **Responsive Design**:
  - Use `clamp()` for fluid typography and spacing.
  - Mobile breakpoint: `max-width: 767px`.
  - Desktop breakpoint: `min-width: 1024px`.
- **Performance**:
  - Use `IntersectionObserver` for scroll animations (`SectionAnimator.js`).
  - Disable complex animations on mobile for better performance.
  - Lazy load images where possible.
  - Use `!important` sparingly - only for mobile overrides that must take precedence.

## 📂 Key Files
- `ASSETS/js/main.js`: App entry point with phased initialization.
- `ASSETS/css/main.css`: CSS entry point (manages @import order).
- `ASSETS/js/data/projects.js`: Project data source.
- `ASSETS/js/config/constants.js`: Global constants.
- `ASSETS/css/themes/theme.css`: Light/dark theme variables.
- `ASSETS/css/base/variables.css`: Design tokens (spacing, colors, shadows).
- `build-obfuscated.js`: Build script for code protection.

## 🎨 Recent Refactors (Dec 2025)
- **Cloud Dancer Theme**: Light theme updated to #F0EEE9 with cohesive cool accents.
- **Typography**: Enhanced scale with improved `clamp()` values and line heights.
- **Mobile Hero**: Increased text sizes (`clamp(28px, 8.5vw, 42px)`) and auto-width buttons.
- **Hamburger Menu**: Full-screen overlay with background scrolling and click-to-close.
- **Performance**: Disabled complex animations on mobile, optimized render performance.
