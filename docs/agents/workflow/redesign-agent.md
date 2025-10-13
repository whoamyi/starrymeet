# Redesign Agent

**Version**: 2.1.0 - Museum-Quality Standards
**Category**: Workflow
**Purpose**: Systematic approach to major design/styling overhauls
**Last Updated**: 2025-10-13

---

## 🎯 Mission & Invocation

**When to Invoke This Agent**:
- User requests "redesign the frontend"
- User says "make it look premium/professional/elegant"
- User requests "update the styling"
- User wants to match another platform's aesthetics (e.g., "like Cameo")
- Major visual overhaul needed

**Trigger Phrases**:
- "redesign the website"
- "make it look premium"
- "update the styling to match [platform]"
- "the design looks cheap, improve it"
- "create a new design system"

---

## 📐 Design Overhaul Standards (v2.1.0)

### 1. Analysis Phase
Before starting any redesign, MUST complete:

**✅ Current State Analysis**:
- [ ] Read current CSS files (shared.css, page-specific styles)
- [ ] Read design-principles.css for current standards
- [ ] Identify design issues (typography, colors, spacing, shadows)
- [ ] List specific problems (e.g., "generic fonts", "weak shadows", "no brand personality")
- [ ] Screenshot/document current look (for comparison later)

**✅ Requirements Gathering**:
- [ ] What platform to model after? (e.g., Cameo, Airbnb, Stripe)
- [ ] Target audience feel? (luxury, modern, playful, professional)
- [ ] Brand colors to maintain or change?
- [ ] Any specific elements to preserve?
- [ ] Performance constraints? (file size, animations)

**✅ Design System Planning (v2.1.0 Standards)**:
- [ ] Color palette - **95% gray/black/white, 5% purple accent**
- [ ] Typography scale - **H1 max 24px, body 16px, line-height 1.5**
- [ ] Spacing system - **Golden ratio proportions**
- [ ] Shadow system - **Extremely subtle (mirage-like)**
- [ ] Border radius scale - **var(--radius-lg) for mobile**
- [ ] Animation/transition strategy - **Apple-style cubic-bezier easing**

### 2. Implementation Order (v2.1.0)
MUST follow this sequence:

**Phase 1: Foundation (shared.css) - REFINED STANDARDS**
```
1. CSS Variables/Design Tokens (v2.1.0 SPEC)
   Colors:
   - Primary: #8B5CF6 (Electric Violet) - USE SPARINGLY
   - Accent: #F59E0B (Luxury Gold) - MINIMAL USE
   - Black: #000000 (Pure black - ONLY background)
   - Text Primary: #FFFFFF (All headings)
   - Text Secondary: #C0C0C0 (Body text - WCAG AAA)
   - Text Tertiary: #909090 (Subtle text - WCAG AAA)
   - Borders: rgba(139, 92, 246, 0.14) - Subtle purple tint

   Typography (STRICT):
   - Font: 'Inter' ONLY (no serifs)
   - H1: 24px max (18px mobile) - weight 600
   - H2: 24px - weight 600
   - H3: 18px - weight 600
   - Body: 16px - weight 400, line-height 1.5
   - Small: 14px (prices, labels) - weight 600 for prices
   - Tiny: 12px - weight 400

   Spacing (Golden Ratio):
   - Card gap: var(--space-6)
   - Card padding: var(--space-5)
   - Mobile carousel: var(--space-3)
   - Price top padding: var(--space-4)

   Shadows (Extremely Subtle):
   - Default: none
   - Hover: var(--shadow-glow-sm)
   - Card hover: translateY(-4px) with shadow

   Border Radius:
   - Desktop cards: var(--radius-2xl)
   - Mobile cards: var(--radius-lg)
   - Buttons: var(--radius-full)

   Transitions (Apple-Style):
   - Duration: 0.3s
   - Easing: cubic-bezier(0.4, 0, 0.2, 1)
   - No jarring movements

2. Typography System (v2.1.0)
   - Import: Google Fonts Inter with display=swap
   - Preconnect: https://fonts.googleapis.com
   - Fallbacks: 'Helvetica Neue', sans-serif
   - H1-H6: weight 600 (NEVER 700+)
   - Body: line-height 1.5 (NOT 1.6)
   - Letter-spacing: -0.01em for headings

3. Component Library (v2.1.0 REFINED)
   Navigation:
   - Background: rgba(0, 0, 0, 0.85) - 85% transparent
   - Backdrop-filter: blur(32px) saturate(200%)
   - Border: rgba(139, 92, 246, 0.08) - barely visible
   - Logo: 18px on mobile

   Buttons:
   - Primary: Purple gradient (ONLY CTA use)
   - Secondary: Transparent with border
   - Hover: translateY(-2px) scale(1.01)
   - Focus: 2px outline, 3px offset

   Cards:
   - Background: #000000
   - Border: 1px solid var(--border-light)
   - Hover: translateY(-4px) with cubic-bezier
   - Shadow: Extremely subtle

   Badges (MINIMAL GRAY ONLY):
   - Background: transparent
   - Border: 1px solid var(--border-medium)
   - Color: var(--text-secondary)
   - Font-weight: 600
   - NO gold gradients
   - NO colorful backgrounds

   Forms:
   - Background: #000000
   - Border: var(--border-medium)
   - Focus: Purple outline
   - Placeholder: var(--text-tertiary)

4. Utility Classes (v2.1.0)
   - Skeleton loaders with shimmer animation
   - Heartbeat animation for favorites
   - Focus indicators (WCAG AAA)
   - Reduced motion support
```

**Phase 2: Page-Specific Updates (v2.1.0 STANDARDS)**
```
1. Homepage (index.html)
   - Hero h1: 24px (18px mobile)
   - Celebrity cards: 4rem initials with texture overlay
   - Badges: Minimal gray only
   - Price: 14px, white, weight 600
   - Footer: Centered 60% purple gradient divider

2. Browse Page (browse.html)
   - Apply same card standards
   - Filter buttons: Ghost style
   - Search: Modern with purple focus
   - Grid: var(--space-6) gap

3. Profile Pages (celebrity-profile.html)
   - Header: 24px max
   - Pricing: 14px with purple border-top
   - Reviews: Consistent typography
   - CTA: Purple gradient button only

4. Booking Flow (booking.html)
   - Step indicator: Minimal design
   - Form: WCAG AAA contrast
   - Payment: Purple accent sparingly
   - Progress: Subtle animations

5. Dashboard (dashboard.html)
   - Sidebar: 18px text max
   - Stats: Minimal cards
   - Tables: Subtle borders
   - Tabs: Purple accent on active
```

**Phase 3: Premium Touches (v2.1.0 MICRO-INTERACTIONS)**
```
1. Micro-interactions (Apple-Style)
   - Card hover: translateY(-4px), 0.3s cubic-bezier
   - Button hover: translateY(-2px) scale(1.01)
   - Watchlist: Heartbeat animation scale(1.15)
   - Input focus: Smooth border glow
   - All transitions: cubic-bezier(0.4, 0, 0.2, 1)

2. Celebrity Cards (v2.1.0 REFINED)
   - Initials: 4rem (larger, dramatic)
   - Font-weight: 700 (not 900)
   - Letter-spacing: 0.05em
   - Texture overlay: Radial gradients mix-blend-mode
   - Z-index: overlay(1) → initials(2) → badges(3)

3. Price Display (v2.1.0 SPEC)
   - Font-size: 14px (0.875rem) - EXACT
   - Font-weight: 600
   - Color: #FFFFFF (pure white)
   - Border-top: rgba(139, 92, 246, 0.1)
   - Padding-top: var(--space-4)

4. Accessibility (WCAG AAA)
   - Text secondary: #C0C0C0 (5.8:1 contrast)
   - Text tertiary: #909090 (4.8:1 contrast)
   - Focus: 2px solid primary, 3px offset
   - Keyboard: Full navigation support
   - Screen readers: Proper ARIA labels

5. Performance (v2.1.0 OPTIMIZED)
   - Font preconnect in <head>
   - Display: swap to prevent FOUT
   - Skeleton loaders: Shimmer animation
   - Image lazy loading
   - CSS file: <100KB gzipped
```

---

## 🔄 Execution Workflow (v2.1.0)

### Step 0: Read Design Principles
**FIRST ACTION - ALWAYS**:
```
1. Read /css/design-principles.css
2. Understand current v2.1.0 standards
3. Follow ALL specifications exactly
4. Do NOT deviate from documented rules
```

### Step 1: Create Design System Document (v2.1.0)
**Before any code changes**, verify design spec matches v2.1.0:

```markdown
# StarryMeet Design System v2.1.0

## Philosophy
"True luxury whispers, it never shouts."

## Core Principles (STRICT)
1. Color: 95% gray/black/white, 5% purple
2. Typography: 18-24px headings, 16px body, line-height 1.5
3. Badges: Minimal gray with border ONLY
4. Price: 14px, white, weight 600
5. Navigation: 85% transparent, 32px blur
6. Micro-interactions: Apple-style cubic-bezier
7. Accessibility: WCAG AAA contrast
8. Mobile: App-like compact feel

## Typography (EXACT SPEC)
H1: 24px (18px mobile), weight 600
H2: 24px, weight 600
H3: 18px, weight 600
Body: 16px, line-height 1.5
Price: 14px, weight 600, color #FFFFFF
Small: 14px
Tiny: 12px

## Color Palette (USE SPARINGLY)
Primary Purple: #8B5CF6 (CTA buttons ONLY)
Black: #000000 (backgrounds)
White: #FFFFFF (headings)
Text Secondary: #C0C0C0 (body)
Text Tertiary: #909090 (subtle)
Border: rgba(139, 92, 246, 0.14)

## Badges (MINIMAL ONLY)
Background: transparent
Border: 1px solid var(--border-medium)
Color: var(--text-secondary)
Font-weight: 600
NO gradients, NO colors

## Micro-Interactions (APPLE-STYLE)
Card hover: translateY(-4px)
Button hover: translateY(-2px) scale(1.01)
Easing: cubic-bezier(0.4, 0, 0.2, 1)
Duration: 0.3s
```

**File**: Save as `/docs/design/DESIGN-SYSTEM-V2.1.md`

### Step 2: Update CSS Foundation (v2.1.0 STANDARDS)
**Order of operations**:
1. Read current shared.css
2. Read design-principles.css for v2.1.0 spec
3. Update shared.css following v2.1.0:
   - Import fonts with display=swap
   - Define CSS variables (EXACT v2.1.0 values)
   - Typography: line-height 1.5, weight 600 for headings
   - Navigation: 85% transparent, 32px blur
   - Badges: Minimal gray only
   - Price: 14px, white, weight 600
   - Animations: Apple-style easing
   - Accessibility: WCAG AAA colors
4. Test on index.html first

### Step 3: Update Page Styles (v2.1.0 COMPLIANT)
**For each page**:
1. Read current page HTML
2. Apply v2.1.0 standards:
   - H1 max 24px (18px mobile)
   - Body 16px, line-height 1.5
   - Badges: transparent with gray border
   - Price: 14px white
   - Cards: 4rem initials with texture
   - Hover: -4px lift with cubic-bezier
3. Remove any gold gradients from badges
4. Ensure purple is ONLY on CTA buttons
5. Test responsive (18px logo on mobile)
6. Commit: `git commit -m "style: Update [page] to v2.1.0 museum standards"`

### Step 4: Visual QA Checklist (v2.1.0)
**Before marking redesign complete**:

**✅ v2.1.0 Compliance**:
- [ ] H1 is 24px max (18px mobile)
- [ ] Body text is 16px with line-height 1.5
- [ ] Price is 14px, white, weight 600
- [ ] Badges are minimal gray (no gradients)
- [ ] Purple is ONLY on CTA buttons
- [ ] Card hover is -4px with cubic-bezier
- [ ] Navigation is 85% transparent with 32px blur
- [ ] Celebrity initials are 4rem with texture
- [ ] Text contrast meets WCAG AAA
- [ ] Mobile logo is 18px

**✅ Interaction States**:
- [ ] Buttons: translateY(-2px) scale(1.01) hover
- [ ] Cards: translateY(-4px) hover with shadow
- [ ] Watchlist: Heartbeat animation
- [ ] Focus: 2px outline, 3px offset
- [ ] All transitions: 0.3s cubic-bezier(0.4, 0, 0.2, 1)

**✅ Responsive Design**:
- [ ] Mobile: 18px logo, var(--radius-lg) cards
- [ ] H1: 18px on mobile
- [ ] Carousel gap: var(--space-3) on mobile
- [ ] Touch targets: ≥44px
- [ ] Borders: Less rounded on mobile

**✅ Accessibility (WCAG AAA)**:
- [ ] Text secondary: #C0C0C0 (5.8:1)
- [ ] Text tertiary: #909090 (4.8:1)
- [ ] Focus indicators: 2px solid, 3px offset
- [ ] Keyboard navigation: Full support
- [ ] Screen readers: ARIA labels present

**✅ Performance**:
- [ ] Font preconnect in <head>
- [ ] Display: swap on fonts
- [ ] Skeleton loaders implemented
- [ ] CSS <100KB gzipped
- [ ] No FOUT (flash of unstyled text)

---

## 🎯 v2.1.0 CRITICAL RULES

### MUST FOLLOW (No Exceptions):

**Typography**:
- ✅ H1 max 24px (18px mobile)
- ✅ Body 16px, line-height 1.5
- ✅ Headings: weight 600 (NEVER 700+)
- ✅ Font: Inter only (no serifs)

**Colors**:
- ✅ Purple ONLY for CTA buttons
- ✅ 95% gray/black/white throughout
- ✅ Text secondary: #C0C0C0
- ✅ Text tertiary: #909090

**Badges**:
- ✅ Background: transparent
- ✅ Border: 1px solid var(--border-medium)
- ✅ Color: var(--text-secondary)
- ✅ NO gold gradients
- ✅ NO colorful backgrounds

**Price**:
- ✅ Font-size: 14px (0.875rem)
- ✅ Font-weight: 600
- ✅ Color: #FFFFFF
- ✅ Border-top: rgba(139, 92, 246, 0.1)

**Navigation**:
- ✅ Background: rgba(0, 0, 0, 0.85)
- ✅ Backdrop-filter: blur(32px) saturate(200%)
- ✅ Logo: 18px on mobile

**Micro-Interactions**:
- ✅ Card hover: translateY(-4px)
- ✅ Button hover: translateY(-2px) scale(1.01)
- ✅ Easing: cubic-bezier(0.4, 0, 0.2, 1)
- ✅ Duration: 0.3s

**Celebrity Cards**:
- ✅ Initials: 4rem, weight 700
- ✅ Letter-spacing: 0.05em
- ✅ Texture overlay: radial gradients
- ✅ Z-index: overlay(1) → initials(2) → badges(3)

**Accessibility**:
- ✅ WCAG AAA contrast (5.8:1 min)
- ✅ Focus: 2px solid, 3px offset
- ✅ Keyboard navigation supported

**Mobile**:
- ✅ Logo: 18px
- ✅ H1: 18px
- ✅ Border-radius: var(--radius-lg)
- ✅ Carousel gap: var(--space-3)
- ✅ App-like compact feel

---

## ✅ Validation Checklist (v2.1.0)

### Before Completing Redesign

**Design System**:
- [ ] Read design-principles.css before starting
- [ ] All v2.1.0 specs followed exactly
- [ ] CSS variables match v2.1.0 values
- [ ] No deviations from documented standards
- [ ] Component library matches v2.1.0

**Implementation**:
- [ ] All pages follow v2.1.0 typography
- [ ] Badges are minimal gray (no gradients)
- [ ] Price displays are 14px white
- [ ] Purple is ONLY on CTA buttons
- [ ] Micro-interactions use Apple easing
- [ ] Navigation is 85% transparent
- [ ] Mobile logo is 18px

**Documentation**:
- [ ] Design system v2.1.0 documented
- [ ] Component usage examples match standards
- [ ] Migration guide notes v2.1.0 changes
- [ ] README references v2.1.0

**Handoff**:
- [ ] Before/after screenshots provided
- [ ] v2.1.0 compliance verified
- [ ] All critical rules followed
- [ ] Known issues documented

---

## 🚨 Common Pitfalls to Avoid (v2.1.0)

### Don't:
❌ Skip reading design-principles.css
❌ Use gold gradients on badges
❌ Make headings larger than 24px
❌ Use line-height 1.6 for body text
❌ Use purple on non-CTA elements
❌ Make price smaller than 14px
❌ Use font-weight 700+ for headings
❌ Make mobile logo larger than 18px
❌ Use arbitrary animation easing
❌ Ignore WCAG AAA contrast requirements

### Do:
✅ Read design-principles.css FIRST
✅ Follow v2.1.0 specs exactly
✅ Use minimal gray badges only
✅ Keep H1 at 24px max (18px mobile)
✅ Use line-height 1.5 for body
✅ Reserve purple for CTAs only
✅ Make price 14px white weight 600
✅ Use weight 600 for all headings
✅ Make mobile logo 18px
✅ Use cubic-bezier(0.4, 0, 0.2, 1)
✅ Ensure WCAG AAA contrast

---

## 📊 Success Criteria (v2.1.0)

### Redesign is Complete When:

**v2.1.0 Compliance**:
- [ ] All typography matches v2.1.0 spec
- [ ] Color usage is 95% gray, 5% purple
- [ ] Badges are minimal gray only
- [ ] Price displays are 14px white
- [ ] Micro-interactions use Apple easing
- [ ] Navigation follows glassmorphism spec
- [ ] Accessibility meets WCAG AAA
- [ ] Mobile follows app-like standards

**User Experience**:
- [ ] Site feels museum-quality
- [ ] Visual hierarchy is perfect
- [ ] Interactions feel premium
- [ ] Everything whispers, nothing shouts

**Technical**:
- [ ] All pages use v2.1.0 standards
- [ ] No console errors
- [ ] Performance maintained
- [ ] Cross-browser compatible
- [ ] Lighthouse score 90+

**Documentation**:
- [ ] v2.1.0 compliance documented
- [ ] Components reference standards
- [ ] Migration notes created
- [ ] Changelog updated

---

## 📝 File Outputs (v2.1.0)

### This Agent Creates:
1. `/docs/design/DESIGN-SYSTEM-V2.1.md` - v2.1.0 spec
2. `/docs/design/REDESIGN-QA-CHECKLIST-V2.1.md` - v2.1.0 QA
3. Updated `css/shared.css` - v2.1.0 compliant
4. Updated HTML pages - v2.1.0 classes
5. Git commits - Incremental v2.1.0 updates

### This Agent Updates:
1. `/css/design-principles.css` - If new standards emerge
2. `/docs/SITE-ARCHITECTURE.md` - Visual description
3. `/docs/QUICK-REFERENCE.md` - v2.1.0 components
4. `/README.md` - v2.1.0 reference

---

## 🔄 Version History

**v2.1.0** (2025-10-13) - Museum-Quality Standards
- Added v2.1.0 specifications throughout
- Enforced 24px max H1 (18px mobile)
- Required 14px price display
- Mandated minimal gray badges only
- Specified Apple-style cubic-bezier easing
- Required WCAG AAA contrast (#C0C0C0)
- Added glassmorphism navigation specs
- Specified 4rem celebrity initials
- Required 85% transparent nav
- Added texture overlay specifications
- Documented all micro-interactions
- Required line-height 1.5 for body

**v1.0.0** (2025-10-10)
- Initial redesign agent created
- Established systematic workflow
- Defined quality standards
- Created handoff protocols

---

**Agent Status**: Active ✅ (v2.1.0 Compliant)
**Maintenance**: Update when v2.2.0 standards emerge
**Next Review**: After v2.1.0 site-wide implementation
**Philosophy**: "True luxury whispers, it never shouts."
