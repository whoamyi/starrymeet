# Organization Agents

**Category**: organization
**Purpose**: Organize files, folders, and maintain project structure
**Location**: `docs/agents/organization/`

---

## Overview

This folder contains agents that ensure proper organization of files and folders throughout the project. These agents enforce naming conventions, create folder structures, and maintain organizational consistency.

---

## Agents in This Category

### File Organization Agent
**File**: [file-organization-agent.md](file-organization-agent.md)
**Version**: 1.0.0
**Status**: ✅ Active
**Created**: 2025-10-09

**Purpose**: Automatically organize debug files into correct page-specific folders

**Invoke When**:
- Creating new debug documentation
- Unsure where to place a file
- Need to update DEBUG-LOG automatically
- Creating new page folder

**What It Does**:
- Analyzes file context (page, type, severity)
- Determines correct location (page folder vs. root)
- Enforces naming conventions
- Updates page README automatically
- Updates DEBUG-LOG.md with issue numbers
- Creates missing folder structures
- Verifies organization

---

### Agent Organization Agent
**File**: [agent-organization-agent.md](agent-organization-agent.md)
**Version**: 1.0.0
**Status**: ✅ Active
**Created**: 2025-10-09

**Purpose**: Automatically organize agent files into correct category folders

**Invoke When**:
- Creating new agent
- Unsure which category agent belongs to
- Need to reorganize existing agents
- Adding new agent category

**What It Does**:
- Analyzes agent purpose
- Determines correct category (documentation, organization, debugging, workflow)
- Enforces agent naming conventions
- Updates category README automatically
- Updates main agents README
- Creates missing categories if needed
- Verifies agent organization

---

## Common Use Cases

### When to Use Organization Agents

1. **Creating New Debug File**
   - Invoke File Organization Agent
   - Agent places file in correct page folder

2. **Creating New Agent**
   - Invoke Agent Organization Agent
   - Agent places agent in correct category

3. **Restructuring Project**
   - Use organization agents to maintain consistency
   - Ensures all files follow structure

4. **Onboarding New Developers**
   - Organization agents ensure they place files correctly
   - Maintains structure even with new contributors

---

## Workflow

```
1. Create new file (debug doc or agent)
   ↓
2. INVOKE: Appropriate Organization Agent
   ↓ (File Org for debug, Agent Org for agents)
   ↓
3. Agent analyzes context
   ↓
4. Agent places file correctly
   ↓
5. Agent updates all READMEs
   ↓
6. Agent verifies structure
   ↓
7. Commit organized files
```

---

## Related Categories

- [Documentation Agents](../documentation/) - Doc maintenance and sync
- [Debugging Agents](../debugging/) - QA and testing
- [Workflow Agents](../workflow/) - Process automation

---

## Future Agents (Potential)

- **code-organization-agent.md** - Organizes code files (JS, CSS, HTML)
- **asset-organization-agent.md** - Organizes images, fonts, media
- **config-organization-agent.md** - Organizes configuration files
- **cleanup-agent.md** - Removes orphaned/unused files

---

**Last Updated**: 2025-10-09
**Total Agents**: 2
**Category Status**: ✅ Active
