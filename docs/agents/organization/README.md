# Organization Agents

**Category**: organization
**Purpose**: Organize files, folders, and maintain project structure
**Location**: `docs/agents/organization/`

---

## Overview

This folder contains the Organization Agent that ensures proper organization of all files throughout the project. This consolidated agent handles debug files, agent files, and future code/asset organization.

---

## Active Agent

### Organization Agent
**File**: [organization-agent.md](organization-agent.md)
**Version**: 3.0.0
**Status**: ✅ Active
**Created**: 2025-10-10 (Consolidated from file-organization-agent + agent-organization-agent)
**Updated**: 2025-10-10 (v3.0.0 - Added comprehensive workflow)

**Purpose**: Organize ALL project files into proper folder structures

**Invoke When**:
- Creating new debug documentation
- Creating new agent
- Creating any new file that needs organization
- Unsure where a file should be placed
- Need to reorganize existing files

**What It Does**:
- Organizes debug files into page-specific folders
- Organizes agent files into category folders
- Enforces naming conventions
- Updates all READMEs automatically
- Updates DEBUG-LOG.md with issue numbers
- Creates missing folder structures
- Verifies organization

**Handles**:
- Debug files → `docs/debug/pages/{page-name}/`
- Agent files → `docs/agents/{category}/`
- Future: Code files, assets, configs

---

## Common Use Cases

### When to Use Organization Agent

1. **Creating New Debug File**
   - Invoke Organization Agent
   - Agent analyzes which page and places in correct folder
   - Updates page README and DEBUG-LOG

2. **Creating New Agent**
   - Invoke Organization Agent
   - Agent determines category and places correctly
   - Updates category README and main agents README

3. **Restructuring Project**
   - Use Organization Agent to maintain consistency
   - Ensures all files follow structure

4. **Onboarding New Developers**
   - Organization Agent ensures they place files correctly
   - Maintains structure even with new contributors

---

## Workflow

```
1. Create new file (any type)
   ↓
2. INVOKE: Organization Agent
   ↓
3. Agent analyzes file type and context
   ↓
4. Agent determines correct location
   ↓
5. Agent places file correctly
   ↓
6. Agent updates all relevant READMEs
   ↓
7. Agent verifies structure
   ↓
8. Commit organized files
```

---

## Decision Trees

### Debug Files
```
New debug file?
│
├─ Relates to specific page?
│  ├─ YES → docs/debug/pages/{page-name}/
│  └─ NO → docs/debug/ (root)
│
└─ Update DEBUG-LOG.md
```

### Agent Files
```
New agent file?
│
├─ What does it do?
│  ├─ Documentation → docs/agents/documentation/
│  ├─ Organization → docs/agents/organization/
│  ├─ Debugging → docs/agents/debugging/
│  └─ Workflow → docs/agents/workflow/
│
└─ Update category and main README
```

---

## Related Categories

- [Documentation Agents](../documentation/) - Doc maintenance and sync
- [Debugging Agents](../debugging/) - QA and testing
- [Workflow Agents](../workflow/) - Process automation

---

## Archive

Previous versions consolidated into v2.0.0:
- [file-organization-agent.md](archive/file-organization-agent.md) (v1.0.0)
- [agent-organization-agent.md](archive/agent-organization-agent.md) (v1.0.0)

---

## Future Capabilities (Planned)

- **Code organization** - Organize JS, CSS, HTML files
- **Asset organization** - Organize images, fonts, media
- **Config organization** - Organize configuration files
- **Cleanup** - Remove orphaned/unused files

---

**Last Updated**: 2025-10-10
**Total Agents**: 1 (Consolidated)
**Category Status**: ✅ Active
