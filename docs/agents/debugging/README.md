# Debugging Agents

**Category**: debugging
**Purpose**: Assist with debugging, testing, and quality assurance
**Location**: `docs/agents/debugging/`

---

## Overview

This category is reserved for future debugging, testing, and quality assurance agents. Historical agents have been archived as their functionality is now handled by the organization and documentation agents.

---

## Active Agents

**None currently** - This category is prepared for future debugging tools.

---

## Archive

Legacy agents (archived 2025-10-10):

### Process Control Agent
**File**: [archive/AGENT-WORKFLOW.md](archive/AGENT-WORKFLOW.md)
**Slash Command**: `/process-control` (archived in `.claude/commands/archive/`)
**Status**: 📦 Archived
**Reason**: Functionality replaced by organization-agent.md

**Original Purpose**: Workflow enforcer for systematic debugging process
- Ensured each debug step completed before next
- Blocked progression when requirements not met

### Quality Assurance Agent
**File**: [archive/AGENT-SETUP-COMPLETE.md](archive/AGENT-SETUP-COMPLETE.md)
**Slash Command**: `/quality-check` (archived in `.claude/commands/archive/`)
**Status**: 📦 Archived
**Reason**: Functionality replaced by documentation-agent.md

**Original Purpose**: Quality inspector for debug completion
- Reviewed completed debug work for quality
- Validated debug checklist completion

---

## Current Debugging Workflow

Modern debugging uses agents from other categories:
- **Organization Agent** (organization category) - Organizes debug files into page folders
- **Documentation Agent** (documentation category) - Syncs site docs with fixes
- **DEBUG-PLAN.md** framework - Structured debugging approach

---

## Workflow Evolution

```
OLD (2025-10-08):
1. /process-control checks readiness
2. Do debugging work
3. /quality-check validates
4. Move to next phase

CURRENT (2025-10-10):
1. Do debugging work following DEBUG-PLAN
2. Invoke Organization Agent to organize debug docs
3. Invoke Documentation Agent to sync site docs
4. Commit with organized structure
```

**Why the Change?**: Consolidation simplified the agent system. Instead of specialized debugging agents, the general-purpose organization and documentation agents now handle debug workflow automatically.

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

**Last Updated**: 2025-10-10
**Total Active Agents**: 0
**Total Archived Agents**: 2
**Category Status**: 🔮 Ready for Future Agents
