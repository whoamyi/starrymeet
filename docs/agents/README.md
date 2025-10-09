# StarryMeet Agents

**Purpose**: Automated agents organized by category
**Location**: `docs/agents/`
**Last Updated**: 2025-10-09

## Agent Categories

📝 [Documentation](documentation/) - Doc maintenance
📁 [Organization](organization/) - File/folder organization  
🐛 [Debugging](debugging/) - Testing and QA
⚙️ [Workflow](workflow/) - Process automation

## Quick Directory

| Agent | Category | Status | Version |
|-------|----------|--------|---------|
| Debugging Agent | Debugging | ✅ Active | 2.0.0 (Workflow) |
| Documentation Agent | Documentation | ✅ Active | 2.0.0 (Workflow) |
| Organization Agent | Organization | ✅ Active | 3.0.0 (Workflow) |

**All agents now follow comprehensive workflow format** - Each agent includes:
- 🎯 Mission & invocation triggers
- 📐 Standards & framework
- 🔄 Phase-by-phase execution workflow
- ✅ Validation checklist
- 🔁 Agent handoff protocol
- 🎯 Example executions

For full documentation, see category READMEs.

## Recent Updates (2025-10-10)

**Major Update: Comprehensive Workflow Integration** 🎯

All agents now include embedded standards, execution workflows, and automatic handoff protocols:

**New Debugging Agent (v2.0.0)**:
- Integrated DEBUG-PLAN.md framework directly into agent
- 6-phase systematic debugging workflow
- 45+ quality checklist items
- Automatic handoff to Organization & Documentation agents
- DEBUG-PLAN.md archived (now embedded in agent)

**Organization Agent (v3.0.0)**:
- Added comprehensive 6-phase workflow
- Naming conventions and decision trees embedded
- Automatic README and master log updates
- Handoff protocols defined

**Documentation Agent (v2.0.0)**:
- Added 7-phase documentation sync workflow
- Update thresholds and version management embedded
- Cross-file consistency validation
- Handoff protocols defined

**Why This Change?**:
- No need to reference separate plan files
- Each agent is self-contained with its own standards
- Agents know when to hand off to other agents
- Validation and quality gates built into each agent
- Easier to invoke - just refer to one agent file

**Previous Updates**:
- Merged file-organization-agent + agent-organization-agent → organization-agent
- Archived debugging legacy agents (process-control, quality-check)
- Archived slash commands to `.claude/commands/archive/`
