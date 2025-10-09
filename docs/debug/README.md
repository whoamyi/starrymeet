# Debug Documentation Structure

**Project**: StarryMeet
**Last Updated**: 2025-10-09

---

## Overview

This directory contains all debugging documentation for the StarryMeet project, organized by page and issue type for easy navigation and reference.

---

## Directory Structure

```
docs/debug/
├── README.md                          # This file - structure guide
├── DEBUG-PLAN.md                      # Master debugging framework
├── DEBUG-LOG.md                       # Chronological log of ALL issues (master reference)
├── DEBUG-LOG-COMPLETE.md              # Archived completed debug log
├── COMPONENT-TEMPLATES.md             # Reusable component standards
├── PAGE-STATUS.md                     # Page completion status tracker
├── QUICK-START.md                     # Quick reference guide
├── UPDATE-SUMMARY.md                  # Summary of all updates
├── INTEGRATION-COMPLETE-SUMMARY.md    # Integration completion summary
│
└── pages/                             # Page-specific debug documentation
    ├── dashboard/                     # dashboard.html issues
    │   └── DASHBOARD-SIDEBAR-FIX.md   # Sidebar layout and mobile fixes
    │
    ├── booking/                       # booking.html issues
    │   ├── BOOKING-FIX-SUMMARY.md     # Booking integration summary
    │   └── BOOKING-INTEGRATION.md     # Complete booking integration docs
    │
    ├── celebrity-profile/             # celebrity-profile.html issues
    │   ├── AVAILABILITY-SYNC-FIX.md           # Slot count synchronization
    │   ├── CALENDAR-SLOT-DISPLAY-FIX.md       # Calendar slot indicators
    │   ├── TOTAL-SLOTS-FIX.md                 # Total slots display
    │   ├── LOCATION-AVAILABILITY-INTEGRATION.md # Location-aware booking
    │   └── ISSUES-33-36-SUMMARY.md            # Multiple related fixes
    │
    ├── browse/                        # browse.html issues (none yet)
    │
    └── index/                         # index.html issues (none yet)
```

---

## How to Use This Structure

### When Debugging a Specific Page:

1. **Go directly to the page folder**: `docs/debug/pages/{page-name}/`
2. **Read page-specific issues**: All fixes related to that page are in one place
3. **Reference the master log**: Check `DEBUG-LOG.md` for chronological context

### When Adding New Debug Documentation:

1. **Determine the page**: Which HTML page does this issue affect?
2. **Create/Update page file**: Add to `docs/debug/pages/{page-name}/`
3. **Update DEBUG-LOG.md**: Add entry to master chronological log
4. **Follow the format**: Use the structure defined in `DEBUG-PLAN.md`

### Quick Navigation:

- **Want the debugging framework?** → `DEBUG-PLAN.md`
- **Want to see all issues chronologically?** → `DEBUG-LOG.md`
- **Want dashboard issues?** → `pages/dashboard/`
- **Want booking issues?** → `pages/booking/`
- **Want profile page issues?** → `pages/celebrity-profile/`
- **Want component templates?** → `COMPONENT-TEMPLATES.md`
- **Want page completion status?** → `PAGE-STATUS.md`

---

## File Types

### Framework Files (Root Level):
- **DEBUG-PLAN.md**: Master debugging strategy and workflow
- **DEBUG-LOG.md**: Chronological log of ALL issues across all pages
- **COMPONENT-TEMPLATES.md**: Standardized reusable components
- **PAGE-STATUS.md**: Tracks which pages have been debugged

### Page-Specific Files (pages/ subdirectories):
- Named descriptively (e.g., `DASHBOARD-SIDEBAR-FIX.md`)
- Contains issues related ONLY to that specific page
- Follows the format: Issue → Problem → Solution → Status
- Includes technical details, code snippets, testing checklists

### Summary Files (Root Level):
- **UPDATE-SUMMARY.md**: Overall update summaries
- **INTEGRATION-COMPLETE-SUMMARY.md**: Integration milestones
- **QUICK-START.md**: Quick reference for developers

---

## Issue Numbering

Issues are numbered chronologically across ALL pages in `DEBUG-LOG.md`:
- **Issues #1-#38**: Various pages (see DEBUG-LOG.md)
- **Issues #39-#45**: Dashboard sidebar fixes
- **Future issues**: Continue sequential numbering

Each page-specific file references its issue numbers from the master log.

---

## Standard Debug Entry Format

Every issue follows this structure (defined in `DEBUG-PLAN.md`):

```markdown
### [DATE] [PAGE] - Issue #X: [Brief Description]

**Type**: [HTML/CSS/JavaScript/Accessibility/Performance/SEO/UX]
**Severity**: [Critical/High/Medium/Low]
**Location**: [File:Line or Component]

**Problem**:
[Detailed description of the issue]

**Solution**:
[What was done to fix it]

**Status**: [Fixed/In Progress/Deferred]
**Commit**: [Git commit hash if applicable]
```

---

## Benefits of This Structure

### ✅ Page-Focused Debugging:
- Find all dashboard issues in one place: `pages/dashboard/`
- Find all booking issues in one place: `pages/booking/`
- No need to search through one massive file

### ✅ Easy Navigation:
- Know exactly where to look based on the page you're debugging
- Folder structure mirrors the actual HTML page structure

### ✅ Chronological Reference:
- `DEBUG-LOG.md` still maintains the complete chronological history
- Cross-references to page-specific files for details

### ✅ Scalable:
- Adding new pages is simple: create new folder under `pages/`
- Each page's documentation grows independently
- No single file becomes too large

### ✅ Context Preservation:
- Page-specific files can include technical diagrams, architecture notes
- Framework files (DEBUG-PLAN, COMPONENT-TEMPLATES) stay at root for global reference

---

## Workflow Example

### Scenario: Debugging dashboard.html

1. **Navigate to**: `docs/debug/pages/dashboard/`
2. **Review existing issues**: Read `DASHBOARD-SIDEBAR-FIX.md`
3. **Identify new issue**: Found a new dashboard problem
4. **Document in page file**: Add to existing or create new `.md` file
5. **Update master log**: Add entry to `DEBUG-LOG.md` with next issue number
6. **Commit**: Git commit with reference to issue number

### Scenario: Starting fresh with a new page (e.g., contact.html)

1. **Create folder**: `mkdir docs/debug/pages/contact`
2. **Create debug file**: `touch docs/debug/pages/contact/CONTACT-FORM-FIX.md`
3. **Document issues**: Follow standard format
4. **Update DEBUG-LOG.md**: Add entries with issue numbers
5. **Update PAGE-STATUS.md**: Mark contact.html as "In Progress" or "Done"

---

## File Naming Conventions

### Page Folders:
- Use exact HTML filename without extension: `dashboard/`, `booking/`, `celebrity-profile/`
- Lowercase with hyphens: `celebrity-profile/` (not `CelebrityProfile/`)

### Debug Files:
- ALL CAPS with hyphens: `DASHBOARD-SIDEBAR-FIX.md`
- Descriptive name indicating what was fixed
- Format: `[PAGE/FEATURE]-[ISSUE-TYPE]-[FIX/SUMMARY].md`

Examples:
- ✅ `DASHBOARD-SIDEBAR-FIX.md`
- ✅ `BOOKING-INTEGRATION.md`
- ✅ `CALENDAR-SLOT-DISPLAY-FIX.md`
- ❌ `dashboard_sidebar.md` (wrong case and separator)
- ❌ `fix1.md` (not descriptive)

---

## Migration Notes

**Previous Structure**: All debug files in flat `docs/debug/` directory
**New Structure**: Page-specific folders under `docs/debug/pages/`

**Files Moved**:
- Dashboard: `DASHBOARD-SIDEBAR-FIX.md` → `pages/dashboard/`
- Booking: `BOOKING-*.md` files → `pages/booking/`
- Profile: Availability, calendar, slot files → `pages/celebrity-profile/`

**Files Kept at Root**:
- Framework files (DEBUG-PLAN, DEBUG-LOG, COMPONENT-TEMPLATES, etc.)
- These apply to ALL pages, not specific to one

---

## Quick Reference Commands

```bash
# Find all dashboard issues
ls docs/debug/pages/dashboard/

# Find all booking issues
ls docs/debug/pages/booking/

# Find all profile issues
ls docs/debug/pages/celebrity-profile/

# Search for a specific issue number in master log
grep "Issue #39" docs/debug/DEBUG-LOG.md

# See all page folders
ls docs/debug/pages/

# Count total debug files per page
find docs/debug/pages -type f | wc -l
```

---

## Maintenance

- **Keep DEBUG-LOG.md updated**: Always add entries chronologically
- **Update page files**: When fixing issues on specific pages
- **Don't duplicate**: Page files have details, DEBUG-LOG has summaries
- **Cross-reference**: Link between DEBUG-LOG and page-specific files
- **Follow the framework**: Always use DEBUG-PLAN.md format

---

## Status

**Current Status**: ✅ Reorganized
**Total Pages with Issues**: 3 (dashboard, booking, celebrity-profile)
**Total Issues Tracked**: 45
**Framework Version**: v1.0 (2025-10-09)

---

## Related Documentation

- [../QUICK-REFERENCE.md](../QUICK-REFERENCE.md) - Quick project reference
- [../SITE-ARCHITECTURE.md](../SITE-ARCHITECTURE.md) - Site architecture overview
- [../README.md](../README.md) - Main project documentation
- [DEBUG-PLAN.md](DEBUG-PLAN.md) - Debugging framework

---

**Note**: This structure is designed to scale as the project grows. Add new page folders as needed, always maintaining the same format and workflow.
