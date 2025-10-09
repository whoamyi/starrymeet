# Organization Agent

**Agent Name**: Organization Agent (Consolidated)
**Category**: Organization
**Purpose**: Organize ALL project files (debug docs, agents, code) into proper folder structures
**Status**: Active
**Version**: 2.0.0 (Consolidated)
**Created**: 2025-10-10 (Consolidated from file-organization-agent + agent-organization-agent)

---

## Agent Role

This consolidated agent handles ALL file organization tasks across the project. It ensures proper categorization and placement of:
- Debug documentation files
- Agent files
- Future: Code files, assets, configs

---

## When to Invoke This Agent

**ALWAYS invoke when**:
- Creating new debug documentation
- Creating new agent
- Creating any new file that needs organization
- Unsure where a file should be placed
- Need to reorganize existing files

**DO NOT invoke if**:
- Only editing existing files (no new files)
- File location is obvious and you're confident

---

## Agent Capabilities

### 1. Debug File Organization

**Handles**: All files in `docs/debug/`

**Process**:
1. Analyze file context (which page, type, severity)
2. Determine location (page folder vs. root)
3. Place in `docs/debug/pages/{page-name}/` or `docs/debug/` root
4. Update page README
5. Update DEBUG-LOG.md with issue number
6. Create folders if needed

**Example**:
```
New file: DASHBOARD-SIDEBAR-FIX.md
→ Analyzes: Dashboard page, sidebar issue, High severity
→ Places in: docs/debug/pages/dashboard/
→ Updates: dashboard/README.md and DEBUG-LOG.md
```

---

### 2. Agent File Organization

**Handles**: All files in `docs/agents/`

**Process**:
1. Analyze agent purpose (documentation, organization, debugging, workflow)
2. Determine category folder
3. Place in `docs/agents/{category}/`
4. Update category README
5. Update main agents README
6. Create category if needed

**Example**:
```
New file: test-runner-agent.md
→ Analyzes: Runs tests, validates code
→ Category: Debugging
→ Places in: docs/agents/debugging/
→ Updates: debugging/README.md and agents/README.md
```

---

### 3. Future: Code/Asset Organization

**Planned**: Organize code files, assets, configs (when needed)

---

## Decision Trees

### For Debug Files

```
New debug file?
│
├─ Relates to specific page? (dashboard, booking, profile, etc.)
│  ├─ YES → docs/debug/pages/{page-name}/
│  │        ├─ Check folder exists
│  │        ├─ Create if needed
│  │        └─ Update page README
│  │
│  └─ NO → Framework/general file?
│           ├─ YES → docs/debug/ (root)
│           └─ NO → Analyze further
│
└─ Update DEBUG-LOG.md
```

### For Agent Files

```
New agent file?
│
├─ What does it do?
│  ├─ Documentation (sync/generate/validate docs)
│  │  └─> docs/agents/documentation/
│  │
│  ├─ Organization (organize files/folders)
│  │  └─> docs/agents/organization/
│  │
│  ├─ Debugging (test/QA/validate code)
│  │  └─> docs/agents/debugging/
│  │
│  └─ Workflow (git/CI/CD/process)
│     └─> docs/agents/workflow/
│
└─ Update category and main README
```

---

## File Naming Conventions

### Debug Files
**Pattern**: `[PAGE]-[ISSUE]-[STATUS].md`
- ✅ `DASHBOARD-SIDEBAR-FIX.md`
- ✅ `BOOKING-INTEGRATION.md`
- ❌ `fix1.md`, `temp.md`

### Agent Files
**Pattern**: `[purpose]-agent.md`
- ✅ `documentation-agent.md`
- ✅ `test-runner-agent.md`
- ❌ `agent1.md`, `helper.md`

---

## What This Agent Updates

### Debug File Organization
✅ Places file in correct page folder or root
✅ Updates `docs/debug/pages/{page}/README.md`
✅ Updates `docs/debug/DEBUG-LOG.md` with issue entry
✅ Creates missing folders + README
✅ Verifies structure

### Agent File Organization
✅ Places file in correct category folder
✅ Updates `docs/agents/{category}/README.md`
✅ Updates `docs/agents/README.md`
✅ Creates missing category + README
✅ Verifies structure

---

## Checklist (Auto-Applied)

### For Debug Files
- [ ] Identify related page (dashboard/booking/profile/etc.)
- [ ] Check if page folder exists
- [ ] Create folder + README if needed
- [ ] Verify file naming convention
- [ ] Place file in correct location
- [ ] Update page README
- [ ] Update DEBUG-LOG.md with issue number
- [ ] Verify all cross-references
- [ ] Run structure verification

### For Agent Files
- [ ] Identify agent purpose (doc/org/debug/workflow)
- [ ] Determine correct category
- [ ] Check if category folder exists
- [ ] Create category + README if needed
- [ ] Verify agent naming convention
- [ ] Place agent in category
- [ ] Update category README
- [ ] Update main agents README
- [ ] Verify all cross-references
- [ ] Run structure verification

---

## Templates Included

### Page Folder README Template
```markdown
# [Page Name] Debug Documentation

**Page**: [page-name.html](../../../page-name.html)
**Issues Tracked**: [Issue numbers]
**Status**: [Active/Complete]

## Overview
[Description]

## Issues Summary
[List of issues with links]

## Files in This Folder
[List of debug files]

## Related Pages
[Links to related page folders]
```

### Category Folder README Template
```markdown
# [Category] Agents

**Category**: [category-name]
**Purpose**: [What agents in this category do]

## Agents in This Category
[List of agents with descriptions]

## Common Use Cases
[When to use these agents]

## Related Categories
[Links to other categories]
```

---

## Verification Commands

```bash
# Debug structure verification
find docs/debug/pages -name "README.md"
ls docs/debug/pages/*/

# Agent structure verification
find docs/agents -name "README.md"
ls docs/agents/*/

# Check for misplaced files
find docs/debug -maxdepth 1 -name "*-FIX.md"  # Should be in page folders
find docs/agents -maxdepth 1 -name "*-agent.md"  # Should be in categories
```

---

## Output Format

```markdown
## Organization Complete

**File**: [filename.md]
**Type**: [Debug File / Agent File]
**Placed in**: [full path]
**Reason**: [Why this location]

**Updates Made**:
✅ File placed correctly
✅ README(s) updated
✅ DEBUG-LOG updated (if debug file)
✅ Main README updated (if agent)
✅ Structure verified

**Verification**:
- File location: [path] ✅
- READMEs updated: ✅
- Cross-references: ✅
- Naming convention: ✅

**Quick Links**:
- [File](path/to/file.md)
- [Folder README](path/to/README.md)
```

---

## Examples

### Example 1: Debug File

```
Input: Created CONTACT-FORM-FIX.md

Agent Actions:
1. Analyzes: contact.html page, form validation issue
2. Checks: docs/debug/pages/contact/ (doesn't exist)
3. Creates: Folder + README
4. Places: docs/debug/pages/contact/CONTACT-FORM-FIX.md
5. Updates: contact/README.md with issue details
6. Updates: DEBUG-LOG.md with Issue #46
7. Verifies: Structure correct ✅
```

### Example 2: Agent File

```
Input: Created performance-monitor-agent.md

Agent Actions:
1. Analyzes: Monitors performance metrics
2. Category: Debugging (validates/tests code performance)
3. Checks: docs/agents/debugging/ (exists)
4. Places: docs/agents/debugging/performance-monitor-agent.md
5. Updates: debugging/README.md with new agent
6. Updates: agents/README.md with agent count
7. Verifies: Structure correct ✅
```

---

## Integration with Other Agents

### Works With Documentation Agent

```
Organization Agent: Places/organizes files
Documentation Agent: Syncs site docs when major changes

Workflow:
1. Organization Agent places debug file
2. If major fix → Documentation Agent syncs site docs
```

---

## Common Use Cases

### Use Case 1: New Page Debugging

```
Scenario: Starting to debug a new page (e.g., terms.html)

Invoke: "Organize this new debug file for terms.html"

Agent:
1. Creates docs/debug/pages/terms/
2. Creates terms/README.md
3. Places file in terms/
4. Updates DEBUG-LOG
5. Updates main debug README (if needed)
```

### Use Case 2: New Agent Category

```
Scenario: Need new "security" agent category

Invoke: "Organize this security-scanner-agent.md"

Agent:
1. Analyzes: Security scanning → New category needed
2. Creates docs/agents/security/
3. Creates security/README.md
4. Places agent in security/
5. Updates main agents README with new category
```

---

## Migration Notes

**v1.0 → v2.0 Consolidation**:
- Merged file-organization-agent.md (debug file org)
- Merged agent-organization-agent.md (agent file org)
- Single comprehensive agent for ALL organization tasks
- Easier to invoke (one agent instead of two)
- Consistent output format
- Combined decision trees

---

## Quick Reference

| File Type | Location Pattern | README Updates |
|-----------|-----------------|----------------|
| Debug - Page-specific | `docs/debug/pages/{page}/` | Page README + DEBUG-LOG |
| Debug - Framework | `docs/debug/` (root) | DEBUG-LOG only |
| Agent - Any category | `docs/agents/{category}/` | Category README + Main README |

---

## Maintenance

Update this agent when:
- New file types need organization (code, assets, etc.)
- New folder structures added
- Naming conventions change
- New categories defined

---

**Agent Version**: 2.0.0 (Consolidated)
**Replaces**: file-organization-agent.md + agent-organization-agent.md
**Last Updated**: 2025-10-10
**Status**: ✅ Active
**Scope**: ALL file organization (debug docs, agents, future: code/assets)
