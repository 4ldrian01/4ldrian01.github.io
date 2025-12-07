# 🌐 Aldrian Sahid - Personal Portfolio

![Portfolio Preview](images/ALDRIAN-MAIN-IMG.png)

[![GitHub Pages](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-blue?logo=github)](https://4ldrian01.github.io/)
[![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red)](LICENSE)

## 📋 Overview

Professional portfolio website showcasing my work, skills, and projects as a 3rd-year BS IT student at Western Mindanao State University. This portfolio demonstrates expertise in web development, IT networking, cybersecurity, and system administration.

**🌐 Live Demo:** [https://4ldrian01.github.io/](https://4ldrian01.github.io/)

## ✨ Features

- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **Dark/Light Theme**: Automatic theme switching based on device preference with manual toggle
- **Smooth Animations**: Scroll-based animations and interactive elements
- **Dynamic Content**: Project filtering, certification navigation, and interactive modals
- **Contact Form**: Secure form submission via Web3Forms
- **Installable PWA**: Manifest-driven install prompt with custom icons and theme colors
- **Performance Optimized**: Lazy loading, code splitting, and optimized assets
- **SEO Optimized**: Meta tags, Open Graph, structured data, and sitemap
- **Security Hardened**: CSP headers, XSS protection, and input sanitization

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3 (Modular Architecture), Vanilla JavaScript (ES6+)
- **Frameworks**: None (Pure vanilla implementation)
- **Icons**: Font Awesome 6.5.1
- **Fonts**: Google Fonts (Montserrat)
- **Form Backend**: Web3Forms API
- **Version Control**: Git & GitHub

## 📁 Project Structure

```
OFFICIAL PERSONAL PORTFOLIO - ALDRIAN/
├── index.html              # Main HTML file
├── sitemap.xml            # SEO sitemap
├── robots.txt             # Search engine directives
├── manifest.json          # PWA manifest (icons, theme, metadata)
├── DEPLOYMENT_CHECKLIST.md # Deployment & QA guide
├── .gitignore            # Git ignore rules
├── ASSETS/
│   ├── css/
│   │   ├── main.css
│   │   ├── base/         # Reset, typography, variables
│   │   ├── components/   # Buttons, cards, forms, modals
│   │   ├── layout/       # Header, hero, sections, footer
│   │   ├── themes/       # Theme styles
│   │   ├── mobile/       # Mobile-specific styles
│   │   └── desktop/      # Desktop-specific styles
│   ├── js/
│   │   ├── main.js       # Application entry point
│   │   ├── config/       # Configuration files
│   │   ├── modules/      # Feature modules
│   │   └── utils/        # Helper utilities
│   └── icons/
├── images/               # Profile and project images
├── FLATICONS/           # SVG icons
└── README.md            # This file
```

## 🚀 Deployment Guide

### GitHub Pages (Recommended - Currently Deployed)

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Portfolio website"
   git branch -M main
   git remote add origin https://github.com/4ldrian01/4ldrian01.github.io.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "main" branch as source
   - Save and wait for deployment
   - Your site will be live at: `https://4ldrian01.github.io/`

3. **Custom Domain (Optional)**
   - Add a CNAME file with your custom domain
   - Configure DNS settings with your domain provider
   - Enable HTTPS in GitHub Pages settings

### Important Notes for GitHub Pages
- Repository name should be `4ldrian01.github.io` for user site
- All file paths are case-sensitive
- Ensure `index.html` is in the root directory
- The site automatically deploys on push to main branch

### Option 2: Netlify

1. **Connect Repository**
   - Sign up at [Netlify](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Build command: (leave empty, static site)
   - Publish directory: `/`
   - Deploy site

3. **Update URLs**
   - Update URLs in `index.html` with your Netlify domain
   - Update `sitemap.xml`
   - Configure Web3Forms

### Option 3: Vercel

1. **Import Project**
   - Sign up at [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Deploy**
   - Framework Preset: Other
   - Deploy

3. **Update URLs** (same as above)

### Option 4: Cloudflare Pages

1. **Connect Repository**
   - Sign up at [Cloudflare Pages](https://pages.cloudflare.com)
   - Create a new project
   - Connect GitHub

2. **Build Settings**
   - Build command: (none)
   - Build output directory: `/`
   - Deploy

3. **Update URLs** (same as above)

## 🔐 Security Features

- Content Security Policy (CSP) headers
- XSS protection with input sanitization
- CSRF protection via Web3Forms
- Rate limiting on form submissions
- Honeypot spam protection
- Referrer policy for privacy
- Frame protection against clickjacking

## 🎨 Customization

### Updating Personal Information

1. **Contact Details**: Update in `index.html` (About section)
2. **Social Links**: Update URLs in Hero and Contact sections
3. **Projects**: Modify portfolio section HTML
4. **Skills**: Update skills section with your technologies
5. **Certifications**: Add/remove certification images

### Changing Theme Colors

Edit `ASSETS/css/base/variables.css`:
```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
    /* ... more variables */
}
```

### Updating PWA Manifest

1. Open `manifest.json` and update:
   - `name` and `short_name`
   - `theme_color` and `background_color`
   - `description`
2. Replace icon files referenced in `icons` with your own (`images/letter-a.png` currently used).
3. Ensure `<link rel="manifest" href="/manifest.json">` is present in `index.html` head.
4. Re-run Lighthouse (Progressive Web App category) to verify installability.

### Web3Forms Configuration

1. Sign up at [Web3Forms](https://web3forms.com)
2. Get your access key
3. Update `ASSETS/js/config/form-config.js`
4. Add your production domain in Web3Forms dashboard

## 📊 SEO Checklist

- [x] Meta tags (title, description, keywords)
- [x] Open Graph tags (Facebook)
- [x] Twitter Card tags
- [x] JSON-LD structured data
- [x] Canonical URL
- [x] Sitemap.xml
- [x] Robots.txt
- [x] Alt text on all images
- [x] Semantic HTML structure
- [x] Mobile responsive
- [x] Fast loading times

## 🧪 Testing

### Performance Testing
- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [PageSpeed Insights](https://pagespeed.web.dev/)

### SEO Testing
- [Google Search Console](https://search.google.com/search-console)
- [Open Graph Debugger](https://www.opengraph.xyz/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### Security Testing
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [Security Headers](https://securityheaders.com/)

## 📝 Post-Deployment Tasks

1. **Submit Sitemap**
   - Google Search Console: Submit `sitemap.xml`
   - Bing Webmaster Tools: Submit sitemap

2. **Verify Social Media Cards**
   - Test Open Graph tags
   - Test Twitter Cards

3. **Configure Web3Forms**
   - Add production domain
   - Test form submissions

4. **Monitor Performance**
   - Set up Google Analytics (optional)
   - Monitor Core Web Vitals

5. **Update Content**
   - Keep projects updated
   - Add new certifications
   - Update skills as you learn
   - Refresh manifest colors/icons if branding changes

## 📄 License

© 2025 Aldrian Muksan Sahid. All rights reserved.

## 📞 Contact & Social Links

- **Email**: aldriansahid30@gmail.com
- **Phone**: (+63) 955 800 1142
- **Location**: Zamboanga City, Philippines

### Connect With Me
- **LinkedIn**: [linkedin.com/in/aldrian-sahid](https://www.linkedin.com/in/aldrian-sahid)
- **GitHub**: [github.com/4ldrian01](https://github.com/4ldrian01)
- **Facebook**: [facebook.com/aldrian.dead](https://www.facebook.com/aldrian.dead)
- **Instagram**: [instagram.com/aint.drian_](https://www.instagram.com/aint.drian_/)

---

**Last Updated**: December 7, 2025

**Note**: This portfolio is deployed on GitHub Pages at [https://4ldrian01.github.io/](https://4ldrian01.github.io/)
