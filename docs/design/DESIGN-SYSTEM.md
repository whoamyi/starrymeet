# StarryMeet Design System
**Comprehensive Design Documentation**

Version: 3.1.0
Last Updated: 2025-10-20
Status: ✅ CURRENT - Reflects actual implementation

---

## Document Purpose

This document contains **everything about Star

ryMeet's design system** - brand identity, visual language, implementation details, and component specifications. This is the **single source of truth** for all design decisions.

**Last Major Changes:**
- **Oct 20, 2025**: Documentation consolidation - merged multiple design docs
- **Oct 18, 2025**: Line-height optimization and card spacing improvements
- **Oct 15, 2025**: Background updated to Cameo's exact #0c0d0e
- **Oct 13, 2025**: Drastic simplification to true Cameo minimal aesthetic

---

# Part 1: Brand Identity

## 1.1 Brand Positioning

**StarryMeet** is the premium platform for face-to-face meetings with celebrities, influencers, and creators.

### Core Values
1. **Accessible Celebrity** - Direct, personal connections with public figures
2. **Trust & Verification** - Secure, verified celebrity experiences
3. **Premium Yet Approachable** - High-quality without being intimidating
4. **Global & Inclusive** - Celebrities from every category and location

### Target Audience
- **Primary**: Fans (18-45) seeking authentic celebrity interactions
- **Secondary**: Gift givers, event planners, super fans
- **Tertiary**: Celebrities looking to monetize their time

---

# Part 2: Design Philosophy

## 2.1 Core Principles

### True Minimal Aesthetic
**"Extreme restraint. Typography smaller than typical modern web. Color usage approaching monochrome."**

StarryMeet's design evolved from colorful Cameo-inspired to **even more minimal**:

1. **Smaller Typography** - h1 max 24px (not 48px), extremely restrained sizing
2. **Near-Monochrome** - 95% black/white/gray, color is rare and meaningful
3. **Flat Design** - No elevation, one background color everywhere (#0c0d0e)
4. **App-Like Mobile** - Compact, tight spacing, mobile-first mentality
5. **Sans-Serif Only** - Inter exclusively, no decorative fonts

### What We Removed (v2.0 → v3.0)
- ❌ All gradient card variants (purple, pink, red, blue, teal, lime, orange, gold)
- ❌ Colorful badge gradients (gold verified, cyan trust)
- ❌ Playfair Display serif font
- ❌ Large heading sizes (48px, 36px, 30px)

### What We Added
- ✅ Extreme typography restraint (max 24px headings)
- ✅ Near-monochrome palette
- ✅ Flat #0c0d0e background everywhere
- ✅ App-like compact mobile spacing

---

# Part 3: Color System

## 3.1 Foundation Colors

### Background
```css
--bg-primary: #0c0d0e;           /* Cameo dark paper - rgb(12, 13, 14) */
```

**NOT #000000** - We use Cameo's exact "A4 dark paper" color #0c0d0e everywhere. This is a very dark blue-gray, not pure black.

### Text Colors
```css
--text-primary: #FFFFFF;         /* Headings, important text - pure white */
--text-secondary: #C0C0C0;       /* Body text */
--text-tertiary: #909090;        /* Subtle labels */
--text-muted: #505050;           /* Very subtle/disabled text */
```

## 3.2 Accent Colors (Minimal Usage)

### Purple (Primary Interactive)
```css
--primary: #8B5CF6;              /* Electric Violet - RARE USAGE */
--primary-dark: #7C3AED;
--primary-light: #A78BFA;
--primary-gradient: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
```

**Usage:** ONLY for primary CTA buttons. No gradient cards, no gradient badges.

### Pink (Secondary Accent)
```css
--accent-pink: #EC4899;          /* Hot Pink */
--accent-pink-dark: #DB2777;
--accent-pink-light: #F472B6;
```

**Usage:** In gradients with purple, love/favorite actions

### Other Accent Colors
```css
--accent-gold: #F59E0B;          /* Gold - rarely used */
--accent-cyan: #06B6D4;          /* Cyan - trust indicators */
--success: #10B981;              /* Green - success states */
--error: #EF4444;                /* Red - errors */
```

## 3.3 Border Colors

```css
--border-light: rgba(139, 92, 246, 0.14);    /* Slightly visible */
--border-medium: rgba(139, 92, 246, 0.20);   /* Medium visibility */
--border-dark: rgba(139, 92, 246, 0.28);     /* More visible */
```

All borders have a subtle purple tint for brand cohesion.

---

# Part 4: Typography

## 4.1 Font Family

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Inter** exclusively. No serif fonts, no decorative fonts.

## 4.2 Font Sizes (Mobile-First)

### Headings
```css
h1: 18px → 24px (desktop)     /* Page titles */
h2: 16px → 20px (desktop)     /* Section headers */
h3: 15px → 18px (desktop)     /* Card titles */
h4: 14px → 16px (desktop)     /* Small headings */
```

### Body Text
```css
body: 14px → 15px (desktop)   /* Standard text */
small: 12px → 13px (desktop)  /* Secondary text */
caption: 11px → 12px (desktop) /* Captions, labels */
```

### Font Weights
```css
--fw-light: 300;
--fw-regular: 400;             /* Default body text */
--fw-medium: 500;              /* Slightly emphasized */
--fw-semibold: 600;            /* Headings */
--fw-bold: 700;                /* Strong emphasis (rare) */
```

## 4.3 Line Heights

```css
--lh-tight: 1.2;               /* Headings, compact text */
--lh-normal: 1.5;              /* Body text */
--lh-relaxed: 1.7;             /* Long-form content */
```

---

# Part 5: Spacing System

## 5.1 Spacing Scale

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-7: 32px;
--space-8: 40px;
--space-9: 48px;
--space-10: 64px;
```

## 5.2 Component Spacing

- **Buttons**: 12px padding (mobile), 14px (desktop)
- **Cards**: 16px internal padding, 12px gap between cards
- **Sections**: 32px → 48px between major sections
- **Navbar**: 16px padding, 48px height
- **Input fields**: 12px padding

---

# Part 6: Components

## 6.1 Buttons

### Primary Button
```css
.btn-primary {
    background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
    color: #FFFFFF;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    transition: transform 0.2s ease;
}

.btn-primary:hover {
    transform: translateY(-1px);
}
```

### Secondary Button
```css
.btn-secondary {
    background: rgba(139, 92, 246, 0.1);
    color: #8B5CF6;
    border: 1px solid rgba(139, 92, 246, 0.3);
    /* ... same sizing as primary */
}
```

### Ghost Button
```css
.btn-ghost {
    background: transparent;
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.2);
}
```

## 6.2 Cards

### Standard Card
```css
.card {
    background: #0c0d0e;
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 12px;
    padding: 16px;
    transition: border-color 0.2s ease;
}

.card:hover {
    border-color: rgba(139, 92, 246, 0.4);
}
```

**NO gradient backgrounds** - All cards use flat #0c0d0e background.

## 6.3 Celebrity Cards

```css
.celebrity-card {
    aspect-ratio: 200 / 300;
    display: flex;
    flex-direction: column;
}

.celebrity-image {
    flex: 0 0 60%;              /* Image takes 60% of card height */
    border-radius: 12px 12px 0 0;
}

.celebrity-info {
    flex: 1 1 auto;             /* Info section takes remaining 40% */
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    justify-content: flex-start;
}
```

## 6.4 Input Fields

```css
input, textarea {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 8px;
    padding: 12px 16px;
    color: #FFFFFF;
    font-size: 14px;
}

input:focus, textarea:focus {
    border-color: #8B5CF6;
    outline: none;
}
```

## 6.5 Badges

```css
.badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.badge-verified {
    background: rgba(245, 158, 11, 0.15);
    color: #F59E0B;
}

.badge-trending {
    background: rgba(139, 92, 246, 0.15);
    color: #8B5CF6;
}
```

---

# Part 7: Filters & Navigation

## 7.1 Filter Sidebar

### Collapsible Filter Sections
```css
.filter-label-collapsible {
    cursor: pointer;
    user-select: none;
    padding: 4px 0;
    transition: all 0.2s ease;
}

.filter-section-toggle {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    transition: transform 0.2s ease;
}

.filter-tree.collapsed {
    max-height: 0;
    opacity: 0;
    pointer-events: none;
}

.filter-tree.expanded {
    max-height: 500px;
    opacity: 1;
    pointer-events: auto;
}
```

### Filter Tree Structure
```css
.filter-tree-parent {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 4px;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.2s ease;
}

.filter-tree-toggle.expanded {
    transform: rotate(90deg);
}

.filter-tree-child {
    padding: 6px 4px 6px 28px;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.2s ease;
}

.filter-tree-child.active {
    background: rgba(139, 92, 246, 0.15);
    color: #FFFFFF;
}
```

## 7.2 Navbar Categories

**Current Structure:**
- Music (K-Pop, Pop, Hip-Hop & Rap, Rock)
- Sports (Football/Soccer, Basketball, Olympics)
- Film & TV (Hollywood, TV Series, International Cinema)
- Digital Creators (YouTube, TikTok, Gaming & Esports)
- Business & Tech (Tech Leaders, Entrepreneurs)

---

# Part 8: Responsive Design

## 8.1 Breakpoints

```css
/* Mobile First */
@media (min-width: 768px)  { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Large Desktop */ }
```

## 8.2 Mobile Optimizations

- Filter sidebar becomes bottom sheet on mobile
- Touch targets minimum 44x44px
- Swipe gestures for dismissing modals
- Simplified navigation on small screens

---

# Part 9: Animation & Transitions

## 9.1 Transition Standards

```css
/* Fast interactions */
transition: transform 0.2s ease, opacity 0.2s ease;

/* Medium interactions */
transition: all 0.3s ease;

/* Slow/smooth transitions */
transition: max-height 0.4s ease-out;
```

## 9.2 Hover Effects

- Buttons: `translateY(-1px)` on hover
- Cards: Border color change
- Links: Opacity change (0.7 → 1.0)

---

# Part 10: Accessibility

## 10.1 Color Contrast

All text meets WCAG AA standards:
- White text on #0c0d0e: Excellent contrast
- #C0C0C0 body text on #0c0d0e: AA compliant
- Purple (#8B5CF6) buttons with white text: AA compliant

## 10.2 Focus States

```css
*:focus-visible {
    outline: 2px solid #8B5CF6;
    outline-offset: 2px;
}
```

## 10.3 Screen Reader Support

- Semantic HTML everywhere
- `aria-label` attributes on interactive elements
- `role` attributes on navigation
- `.sr-only` class for screen-reader-only text

---

# Part 11: Implementation Guidelines

## 11.1 CSS Organization

```
css/
├── shared.css              # Global styles, variables, typography
├── pages/
│   ├── browse.css         # Browse page specific
│   ├── profile.css        # Profile page specific
│   └── dashboard.css      # Dashboard specific
└── components/
    ├── buttons.css        # (if needed for complex buttons)
    └── cards.css          # (if needed for complex cards)
```

## 11.2 Variable Usage

Always use CSS variables from shared.css:
```css
/* ✅ GOOD */
color: var(--text-primary);
background: var(--bg-primary);

/* ❌ BAD */
color: #FFFFFF;
background: #0c0d0e;
```

## 11.3 Naming Conventions

- **BEM methodology** for component classes
- **Kebab-case** for all classes
- **Descriptive names** over abbreviations

Examples:
```css
.celebrity-card                   /* Block */
.celebrity-card__image            /* Element */
.celebrity-card--featured         /* Modifier */
```

---

# Part 12: Brand Assets

## 12.1 Logo

**StarryMeet** wordmark only - no icon
- Font: Inter, weight 700
- Color: White (#FFFFFF) on dark backgrounds
- Minimum size: 120px width

## 12.2 Favicon

Simple "S" letter icon with purple gradient background

---

# Part 13: Quality Checklist

Before launching any design:

- [ ] Follows color system (no custom colors)
- [ ] Uses Inter font exclusively
- [ ] Typography sizes within defined scale
- [ ] Spacing uses spacing scale variables
- [ ] Meets accessibility standards (WCAG AA)
- [ ] Tested on mobile and desktop
- [ ] Animations are smooth (no jank)
- [ ] Focus states visible for keyboard navigation
- [ ] Semantic HTML used throughout

---

**Status**: ✅ Current
**Maintainer**: Update when design changes occur
**Last Major Update**: 2025-10-20 (Consolidation of all design docs)
