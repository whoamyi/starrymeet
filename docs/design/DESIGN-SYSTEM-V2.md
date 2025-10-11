# StarryMeet Design System v2.0
**Cameo-Inspired Luxury Minimal Design**

Version: 2.0.0
Last Updated: 2025-10-11
Status: Production Ready ✅

---

## 🎨 Design Philosophy

### Inspiration
- **Platform**: Cameo (personalized video platform)
- **Aesthetic**: Luxury minimal - sophisticated without "bling bling"
- **Target Feeling**: Premium, elegant, modern, clean

### Core Principles
1. **Minimal Elegance** - Restrained sizing, clean lines, breathing room
2. **Luxury Accents** - Gold for verified, purple for interactive elements
3. **Vibrant Gradients** - Used sparingly for emphasis only
4. **Subtle Interactions** - Gentle animations, smooth transitions
5. **Pure Black Theme** - #000000 with extremely subtle purple-tinted shadows

---

## 🎨 Color Palette

### Primary Colors
```css
--primary: #8B5CF6;              /* Electric Violet */
--primary-dark: #7C3AED;         /* Deep Violet */
--primary-light: #A78BFA;        /* Soft Violet */
--primary-gradient: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
```

### Accent Colors (Luxury Gold)
```css
--accent: #F59E0B;               /* Amber Gold */
--accent-dark: #D97706;          /* Deep Amber */
--accent-light: #FCD34D;         /* Light Gold */
--accent-gradient: linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%);
```

### Neutral Colors (Pure Black Theme)
```css
--black: #000000;                /* Pure black - ONLY background */
--white: #FFFFFF;                /* Pure white - primary text */
--text-primary: #FFFFFF;         /* Headings, important text */
--text-secondary: #B0B0B0;       /* Body text, descriptions */
--text-tertiary: #808080;        /* Subtle labels, helper text */
--text-muted: #505050;           /* Very subtle text */
```

### Border Colors (Subtle Purple Tint)
```css
--border-light: rgba(139, 92, 246, 0.08);    /* Subtle purple borders */
--border-medium: rgba(139, 92, 246, 0.12);   /* Medium borders */
--border-dark: rgba(139, 92, 246, 0.16);     /* Visible borders */
--border-gold: rgba(245, 158, 11, 0.12);     /* Gold accent borders */
```

### Gradient Cards (Cameo-Style)
```css
Purple:  linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)
Pink:    linear-gradient(135deg, #F9A8D4 0%, #EC4899 100%)
Red:     linear-gradient(135deg, #FCA5A5 0%, #EF4444 100%)
Blue:    linear-gradient(135deg, #93C5FD 0%, #3B82F6 100%)
Teal:    linear-gradient(135deg, #5EEAD4 0%, #14B8A6 100%)
Lime:    linear-gradient(135deg, #BEF264 0%, #84CC16 100%)
Orange:  linear-gradient(135deg, #FDBA74 0%, #F97316 100%)
Gold:    linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)
```

---

## ✍️ Typography

### Font Families
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-display: 'Playfair Display', Georgia, serif;
```

**Usage**:
- **Inter**: All UI elements, headings (for modern look), body text
- **Playfair Display**: Available for decorative use (currently not used in Cameo-style)

### Type Scale (Restrained Sizing)
```css
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px - h1 */
--text-6xl: 3.75rem;     /* 60px */
```

### Heading Styles (Cameo-Inspired)
```css
h1: text-5xl (48px), sans-serif, weight 800, line-height 1.1
h2: text-4xl (36px), sans-serif, weight 700, line-height 1.1
h3: text-3xl (30px), sans-serif, weight 700, line-height 1.1
h4: text-2xl (24px), sans-serif, weight 600, line-height 1.1
h5: text-xl (20px), sans-serif, weight 600, line-height 1.1
h6: text-lg (18px), sans-serif, weight 600, line-height 1.1
```

**Key Changes from v1.0**:
- Reduced h1 from 60px → 48px (more restrained)
- Reduced h2 from 48px → 36px (cleaner)
- Tightened line-height from 1.2 → 1.1 (modern)
- Switched to sans-serif for cleaner look
- Reduced font-weights for h4-h6 to 600

### Body Text
```css
p: text-base (16px), line-height 1.6, color text-secondary
```

### Price Elements
```css
.price: white, Inter font, weight 700, size text-2xl (24px), letter-spacing -0.02em
```

---

## 🧩 Component Library

### Buttons

#### Primary Button (Gradient)
```css
.btn-primary {
    background: var(--primary-gradient);
    color: white;
    border-radius: var(--radius-full);  /* Fully rounded */
    padding: var(--space-4) var(--space-8);
    font-weight: 700;
    box-shadow: none;  /* Clean default */
}

.btn-primary:hover {
    transform: translateY(-3px);  /* Gentle lift */
    box-shadow: var(--shadow-glow-md);  /* Subtle glow */
}
```

#### Secondary Button (Ghost)
```css
.btn-secondary {
    background: transparent;
    color: var(--primary);
    border: 2px solid var(--primary);
    border-radius: var(--radius-full);
}

.btn-secondary:hover {
    background: var(--primary);
    color: white;
    transform: translateY(-2px);
}
```

### Cards

#### Standard Card (Dark)
```css
.card {
    background: #000000;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-2xl);
    padding: var(--space-6);
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-glow-sm);
    border-color: var(--border-medium);
}
```

#### Gradient Cards (Cameo-Style)
```html
<div class="card card-gradient-purple">
    <h3>Hollywood Stars</h3>
    <p>150+ celebrities</p>
</div>
```

**Available Variants**:
- `.card-gradient-purple` - Purple gradient
- `.card-gradient-pink` - Pink gradient
- `.card-gradient-red` - Red gradient
- `.card-gradient-blue` - Blue gradient
- `.card-gradient-teal` - Teal gradient
- `.card-gradient-lime` - Lime gradient
- `.card-gradient-orange` - Orange gradient
- `.card-gradient-gold` - Gold gradient

**Features**:
- No borders (clean look)
- White text automatically
- Enhanced hover with lift + glow
- Use sparingly for emphasis only

### Badges

#### Verified Badge (Gold Luxury)
```css
.verified-badge {
    background: var(--accent-gradient);  /* Gold */
    color: white;
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    box-shadow: var(--shadow-gold-glow);
}
```

### Navigation
```css
nav {
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border-light);
    height: 80px;
}
```

### Forms
```css
input, textarea, select {
    background: #000000;
    border: 1px solid var(--border-medium);
    border-radius: var(--radius-lg);
    color: var(--white);
    padding: var(--space-4);
}

input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}
```

---

## 📏 Spacing System

### Scale (4px Base)
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

---

## 🌈 Shadows (Extremely Subtle)

```css
--shadow-xs: 0 0 0 0 transparent;
--shadow-sm: 0 0 0 0 transparent;
--shadow-md: 0 0 8px 0 rgba(139, 92, 246, 0.03);
--shadow-lg: 0 0 12px 0 rgba(139, 92, 246, 0.04);
--shadow-xl: 0 0 16px 0 rgba(139, 92, 246, 0.05);
--shadow-2xl: 0 0 20px 0 rgba(139, 92, 246, 0.06);
--shadow-glow: 0 0 20px rgba(139, 92, 246, 0.08);      /* Purple glow */
--shadow-glow-sm: 0 0 12px rgba(139, 92, 246, 0.06);
--shadow-glow-md: 0 0 16px rgba(139, 92, 246, 0.07);
--shadow-glow-lg: 0 0 24px rgba(139, 92, 246, 0.09);
--shadow-glow-xl: 0 0 32px rgba(139, 92, 246, 0.1);
--shadow-gold-glow: 0 0 20px rgba(245, 158, 11, 0.08);  /* Gold glow */
```

**Usage**: Shadows are extremely subtle - like a mirage. Use sparingly.

---

## 🎬 Animations

### Transitions
```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-bounce: 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Hover Effects
- **Buttons**: translateY(-3px) + subtle glow
- **Cards**: translateY(-4px to -6px) + border glow
- **Badges**: scale(1.05) + enhanced glow

---

## 📱 Responsive Design

### Breakpoints
```css
Mobile: < 768px
Tablet: 768px - 1024px
Desktop: > 1024px
```

### Typography Scaling
```css
@media (max-width: 768px) {
    h1 { font-size: var(--text-4xl); }  /* 48px → 36px */
    h2 { font-size: var(--text-3xl); }  /* 36px → 30px */
    h3 { font-size: var(--text-2xl); }  /* 30px → 24px */
}
```

---

## 🎯 Usage Examples

### Example 1: Category Cards (Cameo-Style)
```html
<div class="categories-grid">
    <div class="category-card card-gradient-purple">
        <div class="category-icon">🎬</div>
        <h3>Hollywood</h3>
        <p class="category-count">150+ celebrities</p>
    </div>
    <div class="category-card card-gradient-pink">
        <div class="category-icon">🎭</div>
        <h3>K-Drama</h3>
        <p class="category-count">80+ celebrities</p>
    </div>
</div>
```

### Example 2: Verified Badge
```html
<span class="verified-badge">✓ Verified</span>
```

### Example 3: Premium Button
```html
<button class="btn btn-primary">Book Meeting</button>
```

---

## 📊 Changes from v1.0

### Typography
- ✅ Reduced h1 size (60px → 48px)
- ✅ Reduced h2 size (48px → 36px)
- ✅ Tightened line-height (1.2 → 1.1)
- ✅ Switched headings to sans-serif
- ✅ Adjusted font-weights for hierarchy

### Buttons
- ✅ Fully rounded corners (border-radius: full)
- ✅ Clean default (no shadow)
- ✅ Enhanced hover lift (translateY(-3px))
- ✅ Subtle glow on hover only

### Cards
- ✅ Added 8 Cameo-style gradient variants
- ✅ No borders on gradient cards
- ✅ White text on all gradient cards
- ✅ Enhanced hover effects

### Badges
- ✅ Gold gradient for verified badges
- ✅ Uppercase styling with tight letter-spacing
- ✅ Subtle gold glow

### Overall
- ✅ More restrained sizing (minimal elegance)
- ✅ Cleaner interactions (less is more)
- ✅ Vibrant gradients used strategically
- ✅ Luxury without "bling bling"

---

## ✅ Validation

### Design Principles Met
- ✅ Minimal elegance (restrained sizing, clean lines)
- ✅ Luxury accents (gold badges, purple interactive)
- ✅ Vibrant gradients (8 variants, used sparingly)
- ✅ Subtle interactions (gentle lifts, soft glows)
- ✅ Pure black theme (#000000 everywhere)

### Cameo Inspiration Applied
- ✅ Gradient occasion cards → Category cards
- ✅ Clean typography → Reduced sizes, sans-serif
- ✅ Rounded buttons → border-radius: full
- ✅ Subtle shadows → Extremely light glows
- ✅ Modern minimalism → Less decoration, more breathing room

---

## 🚀 Next Steps

### Potential Enhancements
- [ ] Add more gradient card use cases (featured content, pricing tiers)
- [ ] Create animation library (entrance, exit, attention)
- [ ] Add skeleton loading states
- [ ] Create component storybook
- [ ] Add dark/light theme toggle (currently dark only)

### Maintenance
- Monitor Cameo design updates for inspiration
- Collect user feedback on new design
- A/B test gradient card effectiveness
- Optimize for performance (CSS bundle size)

---

**Design System Status**: Production Ready ✅
**Last Updated**: 2025-10-11
**Maintained By**: Claude Code
**Version**: 2.0.0
