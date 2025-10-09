# Agent Organization Agent

**Agent Name**: Agent Organization Agent
**Category**: Organization
**Purpose**: Ensures new agents are properly categorized and placed in correct agent category folders
**Status**: Active
**Version**: 1.0.0
**Created**: 2025-10-09

---

## Agent Role

This meta-agent is responsible for organizing OTHER AGENTS into the proper category structure. When a new agent is created, this agent ensures it's placed in the correct category folder based on its purpose and functionality.

---

## Agent Categories

### 1. Documentation Agents (`docs/agents/documentation/`)

**Purpose**: Agents that maintain, sync, and update documentation

**Examples**:
- `documentation-sync-agent.md` - Syncs site docs with changes
- (Future) documentation-link-checker-agent.md
- (Future) documentation-metrics-agent.md

**When to Place Here**:
- Agent updates README files
- Agent synchronizes documentation
- Agent generates documentation
- Agent validates documentation structure

---

### 2. Organization Agents (`docs/agents/organization/`)

**Purpose**: Agents that organize files, folders, and structure

**Examples**:
- `file-organization-agent.md` - Organizes debug files
- `agent-organization-agent.md` - THIS AGENT (organizes other agents)
- (Future) code-organization-agent.md

**When to Place Here**:
- Agent moves/organizes files
- Agent creates folder structures
- Agent enforces naming conventions
- Agent categorizes content

---

### 3. Debugging Agents (`docs/agents/debugging/`)

**Purpose**: Agents that assist with debugging, testing, and quality assurance

**Examples**:
- (Legacy) AGENT-WORKFLOW.md - Process control for debugging
- (Legacy) AGENT-SETUP-COMPLETE.md - QA for debug setup
- (Future) test-runner-agent.md
- (Future) bug-reporter-agent.md

**When to Place Here**:
- Agent runs tests
- Agent finds bugs
- Agent validates code quality
- Agent enforces debug workflow
- Agent checks for issues

---

### 4. Workflow Agents (`docs/agents/workflow/`)

**Purpose**: Agents that manage development workflows and processes

**Examples**:
- (Future) git-commit-agent.md
- (Future) deployment-agent.md
- (Future) pr-review-agent.md

**When to Place Here**:
- Agent manages git operations
- Agent handles CI/CD
- Agent coordinates multi-step processes
- Agent enforces workflow rules

---

## When to Invoke This Agent

**ALWAYS invoke when**:
- Creating a new agent
- Unsure which category an agent belongs to
- Need to reorganize existing agents
- Adding a new agent category

**DO NOT invoke if**:
- Only updating existing agent content (no new agents)
- Working with non-agent files

---

## Agent Responsibilities

### 1. Analyze New Agent Context

When a new agent is created, determine:
- **What does it do?** (documentation, organization, debugging, workflow)
- **What files does it work with?** (docs, code, tests, config)
- **What's its primary purpose?** (maintain, organize, test, automate)
- **Does it fit existing categories or need a new one?**

### 2. Determine Correct Category

Use this decision tree:

```
New agent created?
│
├─ Does it update/sync/generate DOCUMENTATION?
│  └─> YES: docs/agents/documentation/
│
├─ Does it ORGANIZE files/folders/structure?
│  └─> YES: docs/agents/organization/
│
├─ Does it DEBUG/TEST/QA code?
│  └─> YES: docs/agents/debugging/
│
├─ Does it manage WORKFLOW/PROCESS?
│  └─> YES: docs/agents/workflow/
│
└─ None of the above?
   └─> CREATE NEW CATEGORY or ask for clarification
```

### 3. File Naming Convention

Ensure agent files follow standard naming:

**Pattern**: `[purpose]-agent.md`

**Examples**:
- ✅ `documentation-sync-agent.md`
- ✅ `file-organization-agent.md`
- ✅ `agent-organization-agent.md`
- ✅ `test-runner-agent.md`
- ❌ `agent1.md` (not descriptive)
- ❌ `helper.md` (not clear it's an agent)
- ❌ `DocSync.md` (wrong case)

**Requirements**:
- Lowercase with hyphens
- Ends with `-agent.md`
- Descriptive of function
- Unique name

### 4. Update Category README

After placing agent, update the category's README.md:

```markdown
# [Category] Agents

## Agents in This Category

### [Agent Name]
**File**: [agent-name.md](agent-name.md)
**Purpose**: Brief description
**Invoke When**: Use cases
**Status**: Active/Inactive/Legacy
```

### 5. Update Main Agents README

Update `docs/agents/README.md` to include:
- Agent in category listing
- Quick reference entry
- Total agent count

---

## Category README Template

When creating a new category folder:

```markdown
# [Category Name] Agents

**Category**: [category-name]
**Purpose**: [What this category of agents does]
**Location**: `docs/agents/[category-name]/`

---

## Overview

This folder contains agents that [describe category purpose].

---

## Agents in This Category

### [Agent Name]
**File**: [agent-file.md](agent-file.md)
**Version**: X.X.X
**Status**: ✅ Active / 📚 Legacy / ⏸️ Inactive
**Created**: YYYY-MM-DD

**Purpose**: Brief description

**Invoke When**:
- Use case 1
- Use case 2

**What It Does**:
- Action 1
- Action 2

---

## Common Use Cases

- When to use agents in this category
- Examples

---

## Related Categories

- [Other Category](../other-category/) - When to use instead

---

**Last Updated**: YYYY-MM-DD
**Total Agents**: X
```

---

## Decision Matrix

Use this matrix to categorize agents:

| Agent Type | Primary Action | Works With | Category |
|------------|---------------|------------|----------|
| Syncs documentation | Update/Sync | Docs files | **Documentation** |
| Generates docs | Create | Docs files | **Documentation** |
| Validates doc structure | Verify | Docs files | **Documentation** |
| Organizes files | Move/Place | Any files | **Organization** |
| Creates folders | Create | File system | **Organization** |
| Enforces naming | Validate | File names | **Organization** |
| Runs tests | Execute | Code/Tests | **Debugging** |
| Finds bugs | Analyze | Code | **Debugging** |
| Quality checks | Validate | Code | **Debugging** |
| Git operations | Automate | Git | **Workflow** |
| CI/CD | Deploy | Pipeline | **Workflow** |
| Process coordination | Manage | Multiple | **Workflow** |

---

## Checklist for Agent Organization

When organizing a new agent:

- [ ] **Identify purpose**: What does this agent do?
- [ ] **Determine category**: Which category does it fit?
- [ ] **Check folder exists**: Does `docs/agents/[category]/` exist?
- [ ] **Create if needed**: Create category folder + README
- [ ] **Verify naming**: File follows `[purpose]-agent.md` pattern?
- [ ] **Place agent**: Move agent file to category folder
- [ ] **Update category README**: Add agent to category's README
- [ ] **Update main README**: Add to `docs/agents/README.md`
- [ ] **Update debug README**: Update if referenced from `docs/debug/README.md`
- [ ] **Cross-reference**: Add links as needed
- [ ] **Verify structure**: Run verification commands

---

## Verification Commands

```bash
# List all agent categories
ls docs/agents/

# List agents in each category
find docs/agents -name "*-agent.md" | sort

# Verify each category has README
find docs/agents -type d -mindepth 1 -maxdepth 1 -exec ls {}/README.md \;

# Count agents per category
echo "Documentation:"; ls docs/agents/documentation/*-agent.md 2>/dev/null | wc -l
echo "Organization:"; ls docs/agents/organization/*-agent.md 2>/dev/null | wc -l
echo "Debugging:"; ls docs/agents/debugging/*-agent.md 2>/dev/null | wc -l
echo "Workflow:"; ls docs/agents/workflow/*-agent.md 2>/dev/null | wc -l

# Check for agents in root (should be none except README)
ls docs/agents/*.md 2>/dev/null | grep -v README
```

---

## Example Organization: New Agent Created

### Scenario: Test Runner Agent

**Situation**: Created `test-runner-agent.md` that automatically runs tests after code changes

**Steps**:

1. ✅ **Analyze**: Agent runs tests, validates code quality
2. ✅ **Categorize**: Primary purpose is DEBUGGING/TESTING
3. ✅ **Check**: `docs/agents/debugging/` exists
4. ✅ **Verify naming**: `test-runner-agent.md` ✅ (correct pattern)
5. ✅ **Place**: `git mv test-runner-agent.md docs/agents/debugging/`
6. ✅ **Update category README**: Add to `docs/agents/debugging/README.md`
7. ✅ **Update main README**: Add to `docs/agents/README.md` under Debugging
8. ✅ **Result**: Properly categorized and documented

---

## Creating New Categories

If a new agent doesn't fit existing categories:

### Steps to Create New Category

1. **Identify need**: Agent type not covered by existing categories
2. **Name category**: Use lowercase-hyphen format (e.g., `testing`, `deployment`)
3. **Create folder**: `mkdir docs/agents/[category-name]`
4. **Create README**: Use template above
5. **Move agent**: Place agent in new category
6. **Update main README**: Add new category section
7. **Document**: Explain when to use this category

### Examples of Potential New Categories:

- **testing/** - Test-specific agents (if different from debugging)
- **deployment/** - Deployment and release agents
- **security/** - Security scanning and validation agents
- **performance/** - Performance monitoring agents
- **analytics/** - Usage and metrics agents

---

## Integration with Other Agents

This agent works with:

### File Organization Agent
```
File Organization Agent organizes DEBUG FILES
Agent Organization Agent organizes AGENT FILES
```

Both use similar logic but operate on different file types.

### Documentation Sync Agent
```
When new agent is created:
1. Agent Organization Agent places it
2. Documentation Sync Agent updates main docs (if major)
```

---

## Agent Output Format

When this agent completes:

```markdown
## Agent Organization Complete

**Agent**: [agent-name.md]
**Placed in**: docs/agents/[category]/
**Category**: [Category Name]
**Reason**: [Why this category]

**Updates Made**:
✅ Agent moved to category folder
✅ Category README updated
✅ Main agents README updated
✅ Cross-references added
✅ Structure verified

**Verification**:
- Agent location: docs/agents/[category]/[agent-name].md ✅
- Category README: Updated ✅
- Main README: Updated ✅
- Naming convention: Correct ✅

**Quick Links**:
- Agent: [link]
- Category: [link]
- Main README: [link]
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Placing agents in wrong category
```
WRONG: documentation-sync-agent.md in organization/
RIGHT: documentation-sync-agent.md in documentation/
```

### ❌ Mistake 2: Agents in root folder
```
WRONG: docs/agents/my-agent.md
RIGHT: docs/agents/[category]/my-agent.md
```

### ❌ Mistake 3: Not updating READMEs
Every agent placement must update both category and main README.

### ❌ Mistake 4: Creating folders without README
Every category folder MUST have a README explaining its purpose.

### ❌ Mistake 5: Poor agent naming
```
WRONG: helper.md, agent1.md, utils.md
RIGHT: documentation-sync-agent.md, test-runner-agent.md
```

---

## Success Criteria

Agent organization succeeds when:

✅ Agent in correct category folder
✅ File naming follows convention
✅ Category README updated
✅ Main README updated
✅ Cross-references in place
✅ Structure verification passes
✅ Easy to find agent when needed
✅ Clear category purpose

---

## Future Enhancements

Potential improvements:

- [ ] Auto-detect agent category from content
- [ ] Suggest similar existing agents
- [ ] Validate agent format/structure
- [ ] Generate agent from template
- [ ] Track agent usage statistics
- [ ] Deprecate unused agents

---

## Maintenance

Review and update when:
- New agent categories needed
- Category definitions evolve
- Naming conventions change
- Structure improvements identified

---

**Agent Version**: 1.0.0
**Last Updated**: 2025-10-09
**Status**: Active
**Maintained By**: Development Team
**Meta Level**: This agent organizes other agents
