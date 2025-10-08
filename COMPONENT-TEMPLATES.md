# Reusable Component Templates

**Project**: StarryMeet
**Purpose**: Standardized components for consistency across all pages
**Last Updated**: 2025-10-08

---

## 🎯 Usage Instructions

1. These templates should be extracted from the actual pages
2. Once extracted, ALL pages must conform to these templates
3. Any deviations should be documented and justified
4. Update this file when making approved changes to shared components

---

## 📋 Component Inventory

### Components to Standardize:
1. ✅ Header (with navigation)
2. ✅ Footer
3. ✅ Mobile Navigation Menu
4. ✅ Meta Tags (SEO)
5. ✅ CSS/JS Imports
6. ✅ Social Media Links
7. ✅ Call-to-Action Buttons

---

## 🎨 1. Standard Header Template

**Location**: Top of `<body>` on all pages
**File Reference**: To be extracted from existing pages

```html
<!-- STANDARD HEADER - TO BE EXTRACTED -->
<!-- This section will be populated after analyzing existing pages -->
<!-- Expected elements:
  - Logo
  - Main navigation menu
  - Mobile hamburger menu
  - Sign In / Sign Up buttons
  - Search functionality (if applicable)
-->
```

**Required Features**:
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Active page indicator
- [ ] Accessible navigation (ARIA labels)
- [ ] Consistent styling across all pages
- [ ] Logo links to homepage

---

## 🎨 2. Standard Footer Template

**Location**: Bottom of `<body>` on all pages before closing scripts
**File Reference**: To be extracted from existing pages

```html
<!-- STANDARD FOOTER - TO BE EXTRACTED -->
<!-- This section will be populated after analyzing existing pages -->
<!-- Expected elements:
  - Company info
  - Quick links (sitemap)
  - Legal links (Terms, Privacy)
  - Social media links
  - Newsletter signup (if applicable)
  - Copyright notice
-->
```

**Required Features**:
- [ ] Consistent layout across all pages
- [ ] All links functional
- [ ] Social media icons with proper links
- [ ] Current year in copyright
- [ ] Responsive design

---

## 🎨 3. Mobile Navigation Template

**Location**: Usually within header or as separate component
**File Reference**: To be extracted from existing pages

```html
<!-- MOBILE NAVIGATION - TO BE EXTRACTED -->
<!-- This section will be populated after analyzing existing pages -->
<!-- Expected elements:
  - Hamburger icon
  - Slide-out or dropdown menu
  - Close button
  - Mobile-optimized navigation links
-->
```

**Required Features**:
- [ ] Smooth animation
- [ ] Touch-friendly targets (min 44x44px)
- [ ] Accessible (keyboard navigation)
- [ ] Proper z-index layering

---

## 🎨 4. Standard Meta Tags Template

**Location**: `<head>` section of all pages
**File Reference**: To be standardized across pages

```html
<!-- STANDARD META TAGS - TO BE EXTRACTED -->
<!-- This section will be populated after analyzing existing pages -->
<!-- Expected elements:
  - charset
  - viewport
  - description
  - keywords
  - Open Graph tags
  - Twitter Card tags
  - Favicon
-->
```

**Required Features**:
- [ ] Unique title per page
- [ ] Unique description per page
- [ ] Proper viewport settings
- [ ] Social media preview tags
- [ ] Favicon references

---

## 🎨 5. Standard CSS/JS Imports

**Location**: `<head>` for CSS, before `</body>` for JS
**File Reference**: To be standardized

### CSS Imports (in `<head>`):
```html
<!-- To be extracted and standardized -->
<!-- Expected:
  - shared.css
  - page-specific CSS (if needed)
  - Font imports
  - Icon libraries
-->
```

### JS Imports (before `</body>`):
```html
<!-- To be extracted and standardized -->
<!-- Expected:
  - shared.js
  - page-specific JS (if needed)
  - Third-party libraries (jQuery, etc.)
  - Analytics scripts
-->
```

---

## 🎨 6. Social Media Links Template

**Location**: Usually in footer
**File Reference**: To be standardized

```html
<!-- SOCIAL MEDIA LINKS - TO BE EXTRACTED -->
<!-- Expected platforms:
  - Facebook
  - Twitter/X
  - Instagram
  - LinkedIn
  - YouTube
  - TikTok
-->
```

**Required Features**:
- [ ] Consistent icons across all pages
- [ ] Working links (or # placeholders)
- [ ] `target="_blank"` and `rel="noopener noreferrer"`
- [ ] ARIA labels for accessibility

---

## 🎨 7. Call-to-Action Button Template

**Location**: Various throughout pages
**File Reference**: To be standardized

```html
<!-- CTA BUTTON STANDARD - TO BE EXTRACTED -->
<!-- Expected variants:
  - Primary CTA (e.g., "Get Started", "Book Now")
  - Secondary CTA (e.g., "Learn More")
  - Ghost/Outline CTA
-->
```

**Required Features**:
- [ ] Consistent styling
- [ ] Hover/active states
- [ ] Accessible (proper contrast, keyboard focus)
- [ ] Responsive sizing

---

## 📝 Shared CSS Classes

### To be documented after analyzing shared.css:
```css
/* Common utility classes used across pages */
/* To be extracted from css/shared.css */
```

**Categories**:
- Layout (containers, grid, flex)
- Typography (headings, paragraphs, links)
- Buttons (primary, secondary, ghost)
- Forms (inputs, labels, validation)
- Colors (brand colors, backgrounds)
- Spacing (margins, padding)
- Utilities (visibility, responsive)

---

## 📝 Shared JavaScript Functions

### To be documented after analyzing shared.js:
```javascript
// Common functions used across pages
// To be extracted from js/shared.js
```

**Categories**:
- Navigation (mobile menu toggle, smooth scroll)
- Forms (validation, submission)
- UI Components (modals, tooltips, accordions)
- Utilities (date formatting, API calls)

---

## 🔄 Extraction Process

### Next Steps:
1. ✅ Read index.html to extract header template
2. ✅ Read index.html to extract footer template
3. ✅ Read shared.css to document common classes
4. ✅ Read shared.js to document common functions
5. ✅ Verify templates against other high-priority pages
6. ✅ Document any variations or special cases
7. ✅ Update this file with actual templates

### Variations Log:
Document any necessary deviations from templates:
- **Page**: [page name]
- **Component**: [header/footer/etc]
- **Variation**: [what's different]
- **Reason**: [why it's different]
- **Approved**: [yes/no]

---

## ✅ Consistency Checklist

Before marking a page as complete, verify:
- [ ] Header matches template exactly
- [ ] Footer matches template exactly
- [ ] Mobile navigation matches template
- [ ] Meta tags follow standard (with unique content)
- [ ] CSS/JS imports match standard
- [ ] Social media links match template
- [ ] CTAs use standard button classes
- [ ] No inline styles (unless absolutely necessary)
- [ ] Consistent spacing and layout
- [ ] Same color scheme throughout

---

## 📌 Notes

- This is a living document - update as needed
- All changes to templates must be documented
- Consistency is key to maintainability
- When in doubt, refer to the most recently debugged page
