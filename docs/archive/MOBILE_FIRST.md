# 🚨 MOBILE FIRST - CRITICAL DESIGN PRINCIPLE 🚨

## StarryMeet is a MOBILE-FIRST Internet Service

**ALWAYS read this before creating or fixing ANY feature.**

---

## Core Principle

> **80% of users access StarryMeet on mobile devices.**
> **Every feature MUST be designed for mobile FIRST, then adapted to desktop.**

---

## Mobile UX Commandments

### 1. **Touch Targets**
- Minimum 44x44px (Apple HIG)
- Minimum 48x48px (Android Material Design)
- **Use 48px as standard**
- Add extra padding around clickable elements

### 2. **Thumb-Friendly Design**
- Primary actions at BOTTOM of screen
- Easy to reach with one hand
- Avoid top-right corners for critical actions

### 3. **Native Gestures**
- Swipe to dismiss modals
- Pull to refresh where appropriate
- Swipe between items
- Long press for secondary actions

### 4. **Performance**
- Load time < 2 seconds on 3G
- Smooth 60fps animations
- Lazy load images
- Minimize JavaScript bundle size

### 5. **Visual Clarity**
- Font size minimum 16px (prevent zoom)
- High contrast ratios (WCAG AA minimum)
- Clear visual hierarchy
- Generous spacing (minimum 16px between sections)

### 6. **Forms & Inputs**
- Large input fields (min height 44px)
- Proper keyboard types (email, tel, number)
- Clear labels above fields
- Show validation in real-time

### 7. **Navigation**
- Bottom navigation for main actions
- Hamburger menu only for secondary items
- Clear back buttons
- Breadcrumbs on deep pages

### 8. **Modals & Overlays**
- Bottom sheets > center modals
- Rounded top corners (16-24px)
- Drag handle indicator
- Tap outside or swipe down to dismiss
- Max height 85-90vh (show page behind)

### 9. **Content**
- Single column layout
- Full-width cards
- Large, tappable images
- Concise copy (mobile users scan, don't read)

### 10. **Loading States**
- Skeleton screens > spinners
- Progressive loading
- Optimistic UI updates
- Clear error states with recovery actions

---

## Testing Checklist

Before ANY commit, test on:
- [ ] iPhone SE (smallest modern phone - 375px)
- [ ] Standard phone (390-430px)
- [ ] Large phone (> 430px)
- [ ] Portrait orientation
- [ ] Landscape orientation
- [ ] Slow 3G network
- [ ] Touch with thumb (one-handed)

---

## Common Mobile Mistakes to AVOID

❌ Tiny touch targets (< 44px)
❌ Actions in top corners
❌ Horizontal scrolling (unless intentional carousel)
❌ Fixed headers that take too much space
❌ Center modals that block screen
❌ Hover states (no hover on mobile!)
❌ Tiny font sizes (< 14px)
❌ Infinite scroll without loading indicator
❌ Auto-playing videos
❌ Pop-ups on page load

---

## Quick Reference: Mobile Breakpoints

```css
/* Mobile First - Start here */
/* Default styles = Mobile (< 768px) */

/* Tablet */
@media (min-width: 768px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Large Desktop */
@media (min-width: 1440px) { }
```

---

## Filter System (Example of Mobile-First Excellence)

### Mobile:
- Bottom sheet (slides from bottom)
- 85vh height (shows page behind)
- Drag handle (swipe down to close)
- Large touch targets (48px minimum)
- Fixed "Done" button at bottom
- Dark overlay (tap to close)
- Smooth native-feeling animation

### Desktop:
- Sidebar (always visible)
- Sticky positioning
- Hover states
- Smaller touch targets OK
- Mouse-optimized

---

## Remember:

**"If it doesn't work perfectly on a phone held in one hand while standing on a bus, it doesn't work."**

---

Last Updated: 2025-10-18
Created by: Claude Code
Purpose: Never forget mobile-first principle
