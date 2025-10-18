# StarryMeet Design Documentation

**Last Updated:** October 18, 2025

This directory contains all design system documentation, brand guidelines, and component specifications for StarryMeet.

---

## 📋 Quick Navigation

### ✅ Current & Active Documents

| Document | Purpose | Status |
|----------|---------|--------|
| **[DESIGN-SYSTEM-CURRENT.md](DESIGN-SYSTEM-CURRENT.md)** | Complete technical design system specs (v3.0) | ✅ **CURRENT** |
| **[BRAND-IDENTITY.md](BRAND-IDENTITY.md)** | Brand foundation, personality, voice, philosophy | ✅ **CURRENT** (v1.1.0) |

### ⚠️ Deprecated Documents

| Document | Purpose | Status |
|----------|---------|--------|
| **[DESIGN-SYSTEM-V2.md](DESIGN-SYSTEM-V2.md)** | Old design system specs | ⚠️ **DEPRECATED** - Oct 2025 |
| **DESIGN-IMPLEMENTATION-PLAN.md** | Migration plan from v2.0 | ⚠️ **ARCHIVED** - Completed |
| **MIGRATION-GUIDE.md** | Step-by-step migration | ⚠️ **ARCHIVED** - Completed |

---

## 🎯 Which Document Do I Need?

### For Developers & Designers
**👉 Start with: [DESIGN-SYSTEM-CURRENT.md](DESIGN-SYSTEM-CURRENT.md)**

This document contains:
- Actual color values (#0c0d0e background, etc.)
- Typography specifications (sizes, weights, line-heights)
- Component design patterns (buttons, cards, forms, navigation)
- Spacing system
- Recent changes log
- Current mobile specifications

**This is the source of truth for implementation.**

### For Brand Strategy & Copywriters
**👉 Start with: [BRAND-IDENTITY.md](BRAND-IDENTITY.md)**

This document contains:
- Brand positioning and differentiation
- Voice and tone guidelines
- Personality traits and values
- Content strategy and storytelling
- Writing principles and terminology
- Visual brand philosophy (WHY, not HOW)

**This is the source of truth for brand direction.**

---

## 📊 Design System Evolution

### Version History

#### v3.0 (Current - October 2025)
**"Ultra-Minimal - More Restrained Than Cameo"**

Key characteristics:
- Background: #0c0d0e (Cameo exact dark paper)
- Typography: 24px max heading size (extreme restraint)
- Color: 95/5 rule (near-monochrome)
- Fonts: Inter only (Playfair Display removed)
- Badges: Gray with borders (no gradients)
- Line-height: 1.5 (reduced from 1.6)

Major changes:
- Removed ALL gradient cards (8 variants deleted)
- Removed colorful gradient badges
- Drastically reduced typography sizes
- Mobile made more app-like and compact

#### v2.0 (Deprecated - October 2025)
**"Cameo-Inspired Luxury Minimal"**

Characteristics:
- Background: #000000 (pure black)
- Typography: 48px h1, 36px h2
- Color: 90/10 rule
- Fonts: Inter + Playfair Display
- Gradient cards: 8 colorful variants
- Gradient badges: Gold, cyan

**Status:** Deprecated Oct 13-15, 2025

---

## 🏗️ Current Design System Overview

### Foundation
```
Background:    #0c0d0e (Cameo dark paper)
Text Primary:  #FFFFFF (pure white)
Text Secondary:#C0C0C0 (medium gray)
Line-height:   1.5 (body), 1.3 (headings)
```

### Typography Scale
```
Body Text:     16px (ALWAYS)
Small:         14px
Tiny:          12px
Emphasized:    18px
Headings:      24px MAX (h1, h2)
Sub-headings:  18px (h3)
```

### Color Accent (Minimal Usage)
```
Purple CTA:    #8B5CF6 (gradient for primary button ONLY)
Trust (Cyan):  #06B6D4 (semantic use)
Success:       #10B981 (semantic use)
Error:         #EF4444 (semantic use)
```

### Component Patterns
```
Buttons:       Purple gradient (primary), ghost outline (secondary)
Cards:         Black (#0c0d0e) with subtle purple border
Badges:        Gray with simple borders (NO gradients)
Forms:         Black background, purple focus state
Navigation:    Translucent dark with blur, sticky
```

---

## 🎨 Design Principles (Current)

### 1. Extreme Typography Restraint
**24px is the largest text anywhere on the site.**

Why:
- Sophistication through understatement
- More restrained than typical modern web
- Confidence doesn't need large type

### 2. Near-Monochrome Palette
**95% of design is black/white/gray.**

Why:
- Celebrity photos are the color
- Restraint = luxury
- Purple CTA stands out more when surrounded by monochrome

### 3. Flat Design
**One background color everywhere (#0c0d0e).**

Why:
- No elevation complexity
- Consistent "dark paper" surface
- Shadows are extremely subtle (like a mirage)

### 4. App-Like Mobile
**Compact, tight spacing on mobile.**

Why:
- Feels native and polished
- Not chunky web design
- Respects small screens

### 5. Sans-Serif Only
**Inter exclusively. No decorative fonts.**

Why:
- Complete consistency
- Modern and clean
- Content speaks for itself

---

## 📱 Responsive Strategy

### Breakpoints
```
Mobile:  < 768px   (tight spacing, smaller typography)
Tablet:  768-1024px (moderate spacing)
Desktop: > 1024px   (generous spacing)
```

### Mobile-First Approach
- Design starts mobile
- Enhanced progressively for larger screens
- Buttons 42px tall (not 48px)
- Tighter gaps and padding
- Logo 18px (not 24px)

---

## 🔄 Recent Changes Log

### October 18, 2025
- Updated all 17 HTML files with hierarchical category structure
- Line-height optimization: 1.6 → 1.5
- Celebrity card spacing improvements
- Category dropdown hover states added
- Documentation updated to match current implementation

### October 15, 2025
- Background changed: #0f0f0f → #0c0d0e (Cameo exact)
- All background variants unified to same flat color

### October 13, 2025
- **MAJOR DESIGN SIMPLIFICATION**
- Heading sizes drastically reduced (h1: 48px → 24px)
- All gradient card variants removed (8 classes deleted)
- All gradient badges removed
- Playfair Display serif font removed
- ALL body text standardized to 16px
- Font weights reduced (600 instead of 700-800)
- Mobile made more compact and app-like

---

## 📚 External References

### Design Inspiration
- **Cameo** (https://www.cameo.com) - Primary design reference
- Focus on their:
  - Dark paper background (#0c0d0e)
  - Minimal navigation
  - Restrained typography
  - Celebrity-first layout
  - Subtle interactions

### Typography
- **Inter Font** (https://rsms.me/inter/)
- Only font family used
- Weights: 400 (regular), 600 (semibold), 700 (bold - buttons/logo only)

---

## 🛠️ Implementation Notes

### CSS Variables Location
All design tokens are defined in `/css/shared.css`:
- Color palette (lines 1-30)
- Typography scale (lines 31-60)
- Spacing system (lines 61-90)
- Border radius (lines 91-100)
- Shadows (lines 101-120)

### Component Styles
- Shared components: `/css/shared.css`
- Page-specific: `/css/pages/*.css`

### Responsive Behavior
- Mobile breakpoint: `@media (max-width: 768px)`
- Tablet breakpoint: `@media (min-width: 769px) and (max-width: 1024px)`
- Desktop: `@media (min-width: 1025px)`

---

## ✅ Validation Checklist

When creating new components or pages, validate against:

### Typography ✓
- [ ] No text larger than 24px
- [ ] All body text is 16px
- [ ] Only Inter font used
- [ ] Line-height 1.5 for body, 1.3 for headings
- [ ] Font weights: 400, 600, or 700 only

### Color ✓
- [ ] Background is #0c0d0e
- [ ] 95% of design is black/white/gray
- [ ] Purple gradient only for primary CTA
- [ ] No gradient cards or badges
- [ ] Semantic colors only for states

### Spacing ✓
- [ ] Uses defined spacing scale (--space-*)
- [ ] Mobile spacing is tighter
- [ ] Follows 8px base unit

### Components ✓
- [ ] Cards have subtle purple borders
- [ ] Buttons use proper variants
- [ ] Forms have purple focus states
- [ ] Navigation is translucent with blur

---

## 🚀 Quick Start for New Team Members

1. **Read** [DESIGN-SYSTEM-CURRENT.md](DESIGN-SYSTEM-CURRENT.md) - Get technical specs
2. **Scan** [BRAND-IDENTITY.md](BRAND-IDENTITY.md) - Understand the "why"
3. **Review** `/css/shared.css` - See implementation
4. **Reference** this README when unsure

**Key Takeaway:**
StarryMeet's design is MORE minimal than Cameo. Extreme restraint. Near-monochrome. Small typography. Let celebrities shine.

---

## 📞 Questions?

### Design System Questions
Review [DESIGN-SYSTEM-CURRENT.md](DESIGN-SYSTEM-CURRENT.md) first.
Still stuck? Check the actual implementation in `/css/shared.css`.

### Brand Direction Questions
Review [BRAND-IDENTITY.md](BRAND-IDENTITY.md) first.
Focus on Part 3 (Voice & Tone) and Part 5 (Content Strategy).

### Deprecated Features
If you see references to:
- Gradient cards → REMOVED
- Gradient badges → REMOVED
- Playfair Display font → REMOVED
- #000000 background → CHANGED to #0c0d0e
- 48px headings → REDUCED to 24px max
- 1.6 line-height → CHANGED to 1.5

These are from old v2.0 docs. Use current specs instead.

---

**Document Status:** ✅ Current
**Maintained By:** Claude Code
**Last Review:** 2025-10-18
**Next Review:** When significant design changes occur
