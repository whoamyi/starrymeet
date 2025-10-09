# Workflow Agents

**Category**: workflow
**Purpose**: Manage development workflows and automate multi-step processes
**Location**: `docs/agents/workflow/`

---

## Overview

This folder contains agents that coordinate development workflows, manage git operations, handle deployments, and automate multi-step processes. These agents streamline the development lifecycle.

---

## Agents in This Category

Currently empty - ready for future workflow agents.

---

## Future Agents (Potential)

### Git Workflow Agents

- **git-commit-agent.md** - Generates structured commit messages
- **git-branch-agent.md** - Manages branch naming and creation
- **pr-review-agent.md** - Automates PR review checklist

### Deployment Agents

- **deployment-agent.md** - Handles deployment process
- **release-agent.md** - Manages version releases
- **rollback-agent.md** - Coordinates rollback procedures

### Process Coordination Agents

- **build-agent.md** - Manages build process
- **ci-cd-agent.md** - Coordinates CI/CD pipeline
- **dependency-update-agent.md** - Manages dependency updates

---

## Common Use Cases (Future)

### When to Use Workflow Agents

1. **Git Operations**
   - Invoke git-commit-agent for standardized commits
   - Invoke pr-review-agent before creating PRs

2. **Deployment**
   - Invoke deployment-agent for production releases
   - Invoke release-agent for version management

3. **Multi-Step Processes**
   - Invoke build-agent for build coordination
   - Invoke ci-cd-agent for pipeline management

---

## Planned Workflow

```
Future Example:
1. Code changes complete
   ↓
2. INVOKE: git-commit-agent
   ↓ (Generates structured commit)
   ↓
3. INVOKE: pr-review-agent
   ↓ (Validates PR requirements)
   ↓
4. Create PR
   ↓
5. INVOKE: deployment-agent (when merged)
   ↓ (Handles deployment)
   ↓
6. Done
```

---

## Related Categories

- [Organization Agents](../organization/) - File/folder organization
- [Documentation Agents](../documentation/) - Doc maintenance
- [Debugging Agents](../debugging/) - QA and testing

---

## Development Notes

This category is prepared for future workflow automation needs. As development workflows become more complex, agents can be added here to automate repetitive processes and enforce best practices.

---

**Last Updated**: 2025-10-09
**Total Agents**: 0 (Category prepared for future use)
**Category Status**: 📋 Planned
