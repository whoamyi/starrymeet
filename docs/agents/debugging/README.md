# Debugging Agents

**Category**: debugging
**Purpose**: Assist with debugging, testing, and quality assurance
**Location**: `docs/agents/debugging/`

---

## Overview

This folder contains agents that help with the debugging process, enforce quality standards, and manage testing workflows. These agents ensure code quality and proper debug procedures are followed.

---

## Agents in This Category

### Process Control Agent (Legacy)
**File**: [AGENT-WORKFLOW.md](AGENT-WORKFLOW.md)
**Version**: 1.0.0
**Status**: 📚 Legacy (Reference Only)
**Created**: 2025-10-08

**Purpose**: Workflow enforcer for systematic debugging process

**Original Use**:
- Ensured each debug step completed before next
- Blocked progression when requirements not met
- Enforced DEBUG-PLAN.md framework

**Note**: Historical reference for original debug workflow. Modern workflow uses organization and documentation agents instead.

---

### Quality Assurance Agent (Legacy)
**File**: [AGENT-SETUP-COMPLETE.md](AGENT-SETUP-COMPLETE.md)
**Version**: 1.0.0
**Status**: 📚 Legacy (Reference Only)
**Created**: 2025-10-08

**Purpose**: Quality inspector for debug setup completion

**Original Use**:
- Reviewed completed debug work for quality
- Blocked approval when quality insufficient
- Validated debug checklist completion

**Note**: Historical reference. Quality is now maintained through documentation sync and file organization agents.

---

## Common Use Cases

### Historical Context (Legacy Agents)

These agents were part of the original debug workflow:

1. **Systematic Debugging**
   - Process Control Agent enforced step-by-step workflow
   - Quality Assurance Agent validated each phase

2. **Quality Gates**
   - Agents prevented moving forward with incomplete work
   - Ensured all checklist items completed

---

## Current Debugging Workflow

Modern debugging uses:
- **File Organization Agent** (organization category) - Organizes debug files
- **Documentation Sync Agent** (documentation category) - Syncs docs with fixes
- **DEBUG-PLAN.md** framework - Manual process adherence

---

## Workflow Evolution

```
OLD (2025-10-08):
1. Process Control Agent checks readiness
2. Do debugging work
3. Quality Assurance Agent validates
4. Move to next phase

NEW (2025-10-09):
1. Do debugging work following DEBUG-PLAN
2. File Organization Agent organizes debug docs
3. Documentation Sync Agent syncs site docs
4. Commit with organized structure
```

---

## Related Categories

- [Organization Agents](../organization/) - File/folder organization
- [Documentation Agents](../documentation/) - Doc maintenance
- [Workflow Agents](../workflow/) - Process automation

---

## Future Agents (Potential)

- **test-runner-agent.md** - Automatically runs tests after changes
- **bug-reporter-agent.md** - Creates structured bug reports
- **code-quality-agent.md** - Validates code standards
- **regression-test-agent.md** - Checks for regression issues
- **performance-test-agent.md** - Monitors performance metrics

---

**Last Updated**: 2025-10-09
**Total Agents**: 2 (Legacy)
**Category Status**: 📚 Reference (Legacy agents preserved for historical context)
