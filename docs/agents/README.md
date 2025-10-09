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
| Documentation Agent | Documentation | ✅ Active | 1.0.0 |
| Organization Agent | Organization | ✅ Active | 2.0.0 (Consolidated) |

For full documentation, see category READMEs.

## Recent Updates (2025-10-10)

**Agent Consolidation & Cleanup**: Simplified agent structure by consolidating and archiving redundant agents.

**Consolidation**:
- Merged file-organization-agent + agent-organization-agent → organization-agent (v2.0.0)
- Renamed documentation-sync-agent → documentation-agent (for consistency)

**Archive**:
- Archived debugging category legacy agents (process-control, quality-check)
- Archived corresponding slash commands to `.claude/commands/archive/`
- Functionality now handled by organization-agent and documentation-agent
