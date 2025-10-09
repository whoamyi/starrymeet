# Debug Agents

**Purpose**: Automated agents to maintain documentation organization and synchronization
**Location**: `docs/debug/agents/`
**Created**: 2025-10-09
**Status**: Active

---

## Overview

This folder contains specialized agents that help maintain the quality, organization, and synchronization of the StarryMeet debug documentation. These agents should be invoked during the development workflow to ensure consistency and proper structure.

---

## Available Agents

### 1. File Organization Agent
**File**: [file-organization-agent.md](file-organization-agent.md)
**Status**: ✅ Active
**Version**: 1.0.0

**Purpose**:
Ensures all new debug files are properly categorized and placed in the correct page-specific folders following the established structure.

**Invoke When**:
- Creating a new debug documentation file
- Documenting a new issue or fix
- Adding any file to `docs/debug/`
- Unsure where a new file should be placed

**Key Responsibilities**:
- Analyze new file context (which page, what type, severity)
- Determine correct location (page folder vs. root)
- Enforce file naming conventions
- Update related files (DEBUG-LOG, page README)
- Create missing folder structure
- Verify organization

**Output**:
- File placed in correct location
- Page README updated
- DEBUG-LOG updated
- Structure verified
- Cross-references added

---

### 2. Documentation Sync Agent
**File**: [documentation-sync-agent.md](documentation-sync-agent.md)
**Status**: ✅ Active
**Version**: 1.0.0

**Purpose**:
Ensures all site-level documentation is updated when major issues are solved and new debug documentation is created.

**Invoke When**:
- A major issue is solved (Critical/High severity)
- A new page-specific debug file is created
- Multiple related issues fixed (3+ issues)
- Significant feature changes to a page
- Debug documentation reorganized

**Key Responsibilities**:
- Detect significant documentation changes
- Identify affected site documentation files
- Update README.md, QUICK-REFERENCE.md, SITE-ARCHITECTURE.md, COMPLETE-PROJECT-SUMMARY.md
- Maintain version numbers
- Add "Recent Updates" sections
- Create cross-references
- Verify consistency

**Output**:
- All site docs updated
- Dates synchronized
- Versions incremented
- Cross-references added
- Verification complete

---

## Agent Workflow

### Typical Development Flow

```
1. Fix Issue in Code
   ↓
2. Create Debug Documentation
   ↓
3. INVOKE: File Organization Agent
   ↓ (Places file, updates DEBUG-LOG)
   ↓
4. Check: Is it Major?
   ↓
5. YES → INVOKE: Documentation Sync Agent
   ↓      (Updates all site docs)
   ↓
6. Commit Changes
   ↓ (Organized structure + synced docs)
   ↓
7. Done ✅
```

### When to Invoke Both Agents

**Sequential Invocation** (Recommended):
```bash
# After creating new debug file

# Step 1: Organize the file
"Invoke File Organization Agent to place this file correctly"

# Step 2: Sync if major
"This is a major fix. Invoke Documentation Sync Agent to update site docs"
```

**Agent Cooperation**:
- File Organization Agent runs FIRST
- Places file and updates DEBUG-LOG
- Documentation Sync Agent runs SECOND (if major)
- Updates site documentation based on DEBUG-LOG changes

---

## Quick Decision Guide

### Should I Invoke File Organization Agent?

✅ **YES** if:
- Created any new `.md` file in debug folder
- Not sure where to place a file
- Want to ensure proper naming
- Need to update DEBUG-LOG

❌ **NO** if:
- Only editing existing files
- Working outside debug documentation

---

### Should I Invoke Documentation Sync Agent?

✅ **YES** if:
- Fixed Critical or High severity issue
- Fixed 3+ related issues
- Changed page architecture/layout
- Implemented new integration
- Reorganized documentation structure
- Added significant features

❌ **NO** if:
- Fixed Low severity cosmetic issue
- Fixed typos or minor text
- Work in progress (not committed)
- Only 1-2 minor issues

**Use the Decision Matrix** in the agent file if unsure.

---

## Agent Files

### Current Agents

| Agent | File | Version | Status | Created |
|-------|------|---------|--------|---------|
| File Organization | file-organization-agent.md | 1.0.0 | ✅ Active | 2025-10-09 |
| Documentation Sync | documentation-sync-agent.md | 1.0.0 | ✅ Active | 2025-10-09 |

### Legacy Agent Files

| File | Purpose | Status |
|------|---------|--------|
| AGENT-WORKFLOW.md | Original agent workflow | 📚 Reference |
| AGENT-SETUP-COMPLETE.md | Original agent setup | 📚 Reference |

---

## How to Invoke Agents

### Method 1: Direct Request (Recommended)

Simply state your request clearly:

```
"Invoke the File Organization Agent to place this new debug file correctly"

"This is a major fix. Invoke the Documentation Sync Agent to update all site docs"
```

### Method 2: Sequential (For Both)

```
"I've created a new debug file for the dashboard sidebar fix.
Please invoke:
1. File Organization Agent to place it correctly
2. Documentation Sync Agent to update site docs (this is a major fix with 7 issues)"
```

### Method 3: Implicit (Context-Aware)

During development, simply mention:
```
"I've fixed the dashboard sidebar and documented it.
Please organize the documentation and sync with site docs."
```

The assistant should recognize the need for both agents.

---

## Agent Outputs

### File Organization Agent Output

```markdown
## File Organization Complete

**File**: DASHBOARD-SIDEBAR-FIX.md
**Placed in**: docs/debug/pages/dashboard/

**Updates Made**:
✅ File created in correct location
✅ Page README updated
✅ DEBUG-LOG.md updated with Issues #39-#45
✅ Cross-references added

**Verification**:
- Location: docs/debug/pages/dashboard/DASHBOARD-SIDEBAR-FIX.md ✅
- DEBUG-LOG entry: Issues #39-#45 ✅
- Page README: Updated ✅
```

### Documentation Sync Agent Output

```markdown
## Documentation Sync Complete

**Trigger**: Dashboard sidebar fix (7 issues, High severity)

**Files Updated**:
✅ docs/README.md
✅ docs/QUICK-REFERENCE.md
✅ docs/SITE-ARCHITECTURE.md
✅ docs/COMPLETE-PROJECT-SUMMARY.md

**Verification**:
✅ All dates: 2025-10-09
✅ Version: 1.1.0
✅ Issue numbers: #39-#45
✅ All links working
```

---

## Examples

### Example 1: Minor Fix (Organization Only)

**Scenario**: Fixed typo in FAQ answer

**Action**:
```
Created: docs/debug/pages/faq/FAQ-TYPO-FIX.md

Invoke: File Organization Agent
Result: File placed, DEBUG-LOG updated

Skip: Documentation Sync Agent (too minor)
```

### Example 2: Major Fix (Both Agents)

**Scenario**: Fixed 7 dashboard sidebar issues

**Action**:
```
Created: docs/debug/pages/dashboard/DASHBOARD-SIDEBAR-FIX.md

1. Invoke: File Organization Agent
   Result: File organized, DEBUG-LOG updated with #39-#45

2. Invoke: Documentation Sync Agent
   Result: All site docs updated with recent changes
```

### Example 3: New Page Debug (Both Agents)

**Scenario**: Starting to debug contact.html (new page folder)

**Action**:
```
Created: docs/debug/pages/contact/CONTACT-FORM-FIX.md

1. Invoke: File Organization Agent
   Result: Created folder, README, placed file, updated DEBUG-LOG

2. Invoke: Documentation Sync Agent
   Result: Updated site docs to reference new contact page debugging
```

---

## Agent Maintenance

### Version Updates

Agents should be updated when:
- Debug structure changes
- New file types introduced
- Naming conventions evolve
- New documentation files added
- Workflow improvements identified

### Review Schedule

- **After Each Use**: Check agent output for accuracy
- **Monthly**: Review agent effectiveness
- **Quarterly**: Update agents with lessons learned

---

## Benefits of Using Agents

### File Organization Agent Benefits

✅ **Consistency**: All files follow same naming and placement rules
✅ **Findability**: Easy to locate files by page
✅ **Completeness**: No missing README or DEBUG-LOG updates
✅ **Scalability**: Easy to add new pages
✅ **Quality**: Enforces documentation standards

### Documentation Sync Agent Benefits

✅ **Accuracy**: Site docs always reflect current state
✅ **Completeness**: No missing updates to main docs
✅ **Discoverability**: Major changes visible from any entry point
✅ **Professionalism**: Comprehensive, up-to-date documentation
✅ **Traceability**: Clear version history and change log

### Combined Benefits

✅ **Saved Time**: Automated checks prevent manual work
✅ **Reduced Errors**: Agents catch missing updates
✅ **Better Onboarding**: New developers find organized docs
✅ **Maintenance Ease**: Structure stays clean over time
✅ **Professional Quality**: Documentation always polished

---

## Success Metrics

Track agent effectiveness:

### File Organization Agent
- ✅ All files in correct locations
- ✅ All page folders have README
- ✅ DEBUG-LOG has entry for every file
- ✅ File naming consistent
- ✅ Structure verification passes

### Documentation Sync Agent
- ✅ Site docs updated within same commit as debug doc
- ✅ Version numbers consistent
- ✅ No information gaps
- ✅ All cross-references working
- ✅ Dates synchronized

---

## Troubleshooting

### Agent Doesn't Run

**Problem**: Agent not invoked when needed

**Solution**: Explicitly request agent invocation:
```
"Please invoke the [Agent Name] to [action]"
```

### Incomplete Updates

**Problem**: Agent missed some updates

**Solution**: Review agent checklist and run manually:
- Check agent's checklist section
- Verify each item completed
- Run verification commands

### Wrong Categorization

**Problem**: File placed in wrong location

**Solution**:
- Move file to correct location
- Update references in README and DEBUG-LOG
- Re-run File Organization Agent for verification

---

## Future Agents (Ideas)

Potential additional agents:

- **Link Verification Agent**: Check all links in documentation
- **Metrics Update Agent**: Update statistics across all docs
- **Archive Agent**: Archive old "Recent Updates" sections
- **Cross-Reference Agent**: Ensure bidirectional links
- **Format Consistency Agent**: Enforce markdown formatting

---

## Quick Reference

### File Organization Agent
📄 **File**: [file-organization-agent.md](file-organization-agent.md)
🎯 **Use**: When creating new debug files
✅ **Output**: File organized, README updated, DEBUG-LOG updated

### Documentation Sync Agent
📄 **File**: [documentation-sync-agent.md](documentation-sync-agent.md)
🎯 **Use**: When major issues fixed
✅ **Output**: All site docs updated and synchronized

---

**Last Updated**: 2025-10-09
**Total Agents**: 2 Active
**Status**: Operational ✅
