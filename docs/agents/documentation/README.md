# Documentation Agents

**Category**: documentation
**Purpose**: Maintain, sync, and update all project documentation
**Location**: `docs/agents/documentation/`

---

## Overview

This folder contains agents that are responsible for keeping documentation accurate, synchronized, and up-to-date. These agents ensure that when code changes, documentation reflects those changes automatically.

---

## Agents in This Category

### Documentation Sync Agent
**File**: [documentation-sync-agent.md](documentation-sync-agent.md)
**Version**: 1.0.0
**Status**: ✅ Active
**Created**: 2025-10-09

**Purpose**: Automatically synchronize site documentation when major issues are fixed

**Invoke When**:
- Fixed Critical or High severity issue
- Fixed 3+ related issues
- Made significant feature changes
- Reorganized documentation structure

**What It Does**:
- Updates docs/README.md
- Updates docs/QUICK-REFERENCE.md
- Updates docs/SITE-ARCHITECTURE.md
- Updates docs/COMPLETE-PROJECT-SUMMARY.md
- Adds "Recent Updates" sections
- Maintains version numbers
- Creates cross-references
- Verifies consistency across all docs

---

## Common Use Cases

### When to Use Documentation Agents

1. **After Major Feature Implementation**
   - Invoke Documentation Sync Agent
   - Updates all site docs with new feature details

2. **After Fixing Multiple Bugs**
   - If 3+ bugs fixed, invoke Documentation Sync Agent
   - Ensures documentation reflects all fixes

3. **After Reorganization**
   - Invoke Documentation Sync Agent
   - Updates structure diagrams and navigation

4. **Version Increments**
   - Documentation Sync Agent handles version numbers
   - Maintains consistent versioning across docs

---

## Workflow

```
1. Make significant code/doc changes
   ↓
2. INVOKE: Documentation Sync Agent
   ↓
3. Agent detects changes
   ↓
4. Agent updates all relevant docs
   ↓
5. Agent verifies consistency
   ↓
6. Commit synced documentation
```

---

## Related Categories

- [Organization Agents](../organization/) - File/folder organization
- [Debugging Agents](../debugging/) - QA and testing
- [Workflow Agents](../workflow/) - Process automation

---

## Future Agents (Potential)

- **documentation-link-checker-agent.md** - Validates all links in documentation
- **documentation-metrics-agent.md** - Tracks doc coverage and quality
- **documentation-generator-agent.md** - Auto-generates docs from code
- **changelog-agent.md** - Maintains CHANGELOG.md automatically

---

**Last Updated**: 2025-10-09
**Total Agents**: 1
**Category Status**: ✅ Active
