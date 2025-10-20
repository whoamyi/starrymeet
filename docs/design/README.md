# Design Documentation

**StarryMeet Design System - All design documentation in one place**

Last Updated: 2025-10-20
Status: ✅ Active

---

## 📋 Documentation Structure

### Main Documentation

| Document | Purpose | Status |
|----------|---------|--------|
| **[DESIGN-SYSTEM.md](DESIGN-SYSTEM.md)** | **Complete design system** - Brand identity, colors, typography, components, everything | ✅ **CURRENT** - Single source of truth |
| [REDESIGN-QA-CHECKLIST.md](REDESIGN-QA-CHECKLIST.md) | Quality assurance checklist for design implementations | ✅ Operational |

### Archives

All historical and deprecated design documentation has been moved to `/archive/`:
- BRAND-IDENTITY.md → Merged into DESIGN-SYSTEM.md
- DESIGN-SYSTEM-CURRENT.md → Merged into DESIGN-SYSTEM.md
- DESIGN-SYSTEM-V2.md → Deprecated, archived
- CAMEO-BRAND-ANALYSIS.md → Historical reference, archived
- DESIGN-IMPLEMENTATION-PLAN.md → Completed, archived
- MIGRATION-GUIDE.md → No longer relevant, archived

---

## 🎯 Quick Access

### Need to know...

**Colors?** → [DESIGN-SYSTEM.md#part-3-color-system](DESIGN-SYSTEM.md#part-3-color-system)
- Background: `#0c0d0e` (NOT #000000)
- Primary: `#8B5CF6` (purple)
- Text: `#FFFFFF`, `#C0C0C0`, `#909090`

**Typography?** → [DESIGN-SYSTEM.md#part-4-typography](DESIGN-SYSTEM.md#part-4-typography)
- Font: Inter exclusively
- Headings: 18-24px
- Body: 14-15px

**Components?** → [DESIGN-SYSTEM.md#part-6-components](DESIGN-SYSTEM.md#part-6-components)
- Buttons, cards, inputs, badges, filters

**Spacing?** → [DESIGN-SYSTEM.md#part-5-spacing-system](DESIGN-SYSTEM.md#part-5-spacing-system)
- 4px increments (4, 8, 12, 16, 20, 24...)

---

## 🏗️ Implementation

### For Developers

1. **Read**: [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) - Understand the system
2. **Use**: CSS variables from `css/shared.css`
3. **Check**: [REDESIGN-QA-CHECKLIST.md](REDESIGN-QA-CHECKLIST.md) before shipping

### For Designers

1. **Follow**: Principles in Part 2 of DESIGN-SYSTEM.md
2. **Use**: Color palette from Part 3
3. **Reference**: Component examples in Part 6

---

## 📊 Design System Stats

- **Last Major Update**: Oct 20, 2025 (Documentation consolidation)
- **Version**: 3.1.0
- **Files Consolidated**: 6 → 1
- **Total Components Documented**: 20+
- **CSS Variables**: 40+
- **Color Palette**: 15 colors (90% monochrome)

---

## 🔄 Recent Changes

### Oct 20, 2025 - Documentation Consolidation
- Merged 6 design documents into single DESIGN-SYSTEM.md
- Moved historical/deprecated docs to archive
- Updated README with clear structure
- **Goal**: Single source of truth, less file proliferation

### Oct 18, 2025 - Typography & Spacing Updates
- Optimized line-heights for readability
- Improved card spacing (60/40 image/info ratio)
- Updated celebrity card specifications

### Oct 15, 2025 - Background Color Standardization
- Changed all backgrounds from #000000 to #0c0d0e
- Cameo's exact "dark paper" color

### Oct 13, 2025 - Drastic Simplification
- Removed all gradient card variants
- Removed colorful badges
- Removed serif fonts
- Adopted extreme minimal aesthetic

---

## ❓ FAQ

**Q: Where is the old DESIGN-SYSTEM-CURRENT.md?**
A: Merged into DESIGN-SYSTEM.md, moved to archive for history

**Q: Why consolidate?**
A: Single source of truth reduces confusion and maintenance burden

**Q: Can I still reference old docs?**
A: Yes, they're in `/archive/` but consider them deprecated

**Q: What if I need to add new design guidelines?**
A: Update DESIGN-SYSTEM.md directly. It's comprehensive and organized by sections.

---

**Maintainer**: Update when design system changes
**Contact**: Design team for questions or clarifications
