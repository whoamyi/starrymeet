# Agent-Controlled Workflow

**Project**: StarryMeet Debug Process
**Date**: 2025-10-08
**Purpose**: Ensure quality and adherence to debug plan through automated agent oversight

---

## 🤖 Agent Overview

Two specialized agents have been created to oversee the debug process:

### 1. Process Control Agent (`/process-control`)
**Role**: Workflow Enforcer
**Purpose**: Ensures each step is complete before moving to next
**Blocks**: Progression when requirements not met

### 2. Quality Assurance Agent (`/quality-check`)
**Role**: Quality Inspector
**Purpose**: Reviews completed work for quality standards
**Blocks**: Approval when quality insufficient

---

## 🔄 Integrated Workflow

### Phase 1: Extract Component Templates

```
1. Human: Start extracting templates
2. Claude: Read files, extract templates, update COMPONENT-TEMPLATES.md
3. Human: Run /process-control
4. Process Control Agent: ✅ Verifies templates complete OR ❌ Blocks with requirements
5. If ❌: Claude fixes missing items, Human runs /process-control again
6. If ✅: Human runs /quality-check
7. Quality Agent: ✅ Approves quality OR ⚠️ Requests fixes OR ❌ Rejects
8. If not ✅: Claude fixes issues, Human runs /quality-check again
9. If ✅: Claude commits, moves to next phase
```

### Phase 2: Debug Individual Page

```
1. Human: Start debugging [page.html]
2. Claude: Updates PAGE-STATUS.md to "🟡 In Progress"
3. Claude: Reads page, identifies issues
4. Claude: Logs issues in DEBUG-LOG.md
5. Claude: Fixes issues one by one
6. Claude: Documents fixes in DEBUG-LOG.md
7. Claude: Updates PAGE-STATUS.md with counts
8. Human: Run /process-control
9. Process Control Agent: ✅ Verifies all steps complete OR ❌ Blocks
10. If ❌: Claude completes missing steps, Human runs /process-control again
11. If ✅: Human runs /quality-check
12. Quality Agent: Reviews actual page file for quality
13. Quality Agent: ✅ Approves OR ⚠️ Requests fixes OR ❌ Rejects
14. If not ✅: Claude fixes quality issues, Human runs /quality-check again
15. If ✅: Claude commits changes
16. Claude: Marks page "🟢 Complete" in PAGE-STATUS.md
17. Claude: Updates UPDATE-SUMMARY.md
18. Repeat for next page
```

---

## 📋 When to Run Each Agent

### Run `/process-control` after:
- Completing component template extraction
- Finishing all fixes for a page
- Before marking a page as complete
- Before moving to next page
- When unsure if step is done

### Run `/quality-check` after:
- Process Control Agent approves progression
- Believing a page is complete
- Major fixes are applied
- Before committing completed work
- When you want quality validation

---

## 🎯 Agent Decision Matrix

### Process Control Agent:

| Scenario | Decision | Next Action |
|----------|----------|-------------|
| All checklist items complete | ✅ APPROVE | Run quality-check |
| Missing documentation | ❌ BLOCK | Complete documentation |
| Issues not logged | ❌ BLOCK | Log in DEBUG-LOG.md |
| No git commit | ❌ BLOCK | Commit changes |
| Not all fixes done | ❌ BLOCK | Finish fixes |

### Quality Assurance Agent:

| Scenario | Decision | Next Action |
|----------|----------|-------------|
| All quality standards met | ✅ APPROVE | Commit and proceed |
| Critical issues found | ❌ REJECT | Fix critical issues |
| 1-3 medium issues | ⚠️ NEEDS IMPROVEMENT | Fix medium issues |
| Minor issues only | ✅ APPROVE (with notes) | Optional fixes |
| Inconsistent with templates | ❌ REJECT | Align with templates |

---

## 🚫 What Agents Block

### Process Control Blocks:
- Moving to next page when current page not complete
- Marking page complete without logging all issues
- Skipping documentation updates
- Missing git commits
- Incomplete checklist items
- Not following sequential workflow

### Quality Assurance Blocks:
- Critical HTML/accessibility issues
- Broken functionality
- Major inconsistencies with templates
- Missing required elements (alt text, ARIA labels, etc.)
- Poor code quality
- Incomplete documentation
- Console errors

---

## ✅ What Agents Approve

### Process Control Approves:
- All tracking documents updated
- All issues logged and documented
- Changes committed to git
- Page marked with correct status
- Sequential workflow followed
- Checklist items completed

### Quality Assurance Approves:
- High-quality, semantic HTML
- Excellent accessibility
- Perfect consistency with templates
- All functionality working
- Good SEO implementation
- Optimized performance
- Clear, complete documentation

---

## 📊 Agent Commands

### Available Commands:

```bash
# Check if current step is complete and approved to proceed
/process-control

# Perform quality check on completed work
/quality-check
```

---

## 🔁 Example Session Flow

```bash
# === Start Template Extraction ===
User: "Extract component templates from index.html"
Claude: [Reads files, extracts templates, updates COMPONENT-TEMPLATES.md]

User: "/process-control"
Process Control Agent: "❌ BLOCKED - Templates extracted but CSS classes not documented"

Claude: [Documents CSS classes]

User: "/process-control"
Process Control Agent: "✅ APPROVED - All template extraction requirements met"

User: "/quality-check"
Quality Agent: "⚠️ NEEDS IMPROVEMENT - Templates complete but formatting inconsistent"

Claude: [Fixes formatting]

User: "/quality-check"
Quality Agent: "✅ APPROVED - High quality templates, properly documented"

Claude: [Commits changes]

# === Start Page Debug ===
User: "Start debugging index.html"
Claude: [Updates status, reads page, logs issues, fixes issues]

User: "/process-control"
Process Control Agent: "❌ BLOCKED - Issues fixed but not all documented in DEBUG-LOG.md"

Claude: [Completes documentation]

User: "/process-control"
Process Control Agent: "✅ APPROVED - All process requirements met for index.html"

User: "/quality-check"
Quality Agent: "❌ REJECTED - 2 critical accessibility issues: missing alt text on hero image, no ARIA labels on nav"

Claude: [Fixes critical issues]

User: "/quality-check"
Quality Agent: "✅ APPROVED - Excellent quality, all standards met"

Claude: [Commits, marks complete, updates summaries]

User: "Move to next page"
Claude: [Starts browse.html process]
```

---

## 🎓 Benefits of Agent Oversight

### Ensures:
- ✅ No steps skipped
- ✅ High quality standards maintained
- ✅ Documentation always updated
- ✅ Consistency across all pages
- ✅ Best practices followed
- ✅ Thorough review process
- ✅ Issues caught before commit
- ✅ Progress tracked accurately

### Prevents:
- ❌ Rushing through pages
- ❌ Incomplete work
- ❌ Quality degradation over time
- ❌ Missing documentation
- ❌ Skipping important checks
- ❌ Inconsistency between pages
- ❌ Accumulating technical debt

---

## 📝 Agent Reports Location

Agent reports should be documented in:
- Process Control findings → Add to DEBUG-LOG.md if issues found
- Quality Check findings → Add to DEBUG-LOG.md as new issues
- Both agents' approvals → Note in UPDATE-SUMMARY.md

---

## 🎯 Success Metrics

A page is truly complete when:
- ✅ Process Control Agent approves (all steps done)
- ✅ Quality Assurance Agent approves (high quality)
- ✅ All documentation updated
- ✅ Changes committed to git
- ✅ No blockers or critical issues

---

## ⚠️ Important Notes

1. **Always run /process-control first** before /quality-check
2. **Don't skip agent checks** - they catch issues early
3. **Fix all blockers immediately** - don't accumulate issues
4. **Document agent findings** - add to DEBUG-LOG.md
5. **Commit only after both agents approve** - ensures quality
6. **Run agents between major steps** - not just at end
7. **Trust the agents** - they enforce consistency

---

## 🚀 Quick Command Reference

```bash
# Before moving to next step/page
/process-control

# After process-control approves
/quality-check

# If agents block, fix issues then re-run
# Repeat until both agents approve
```

---

*These agents are your quality gatekeepers. Use them consistently for best results.*
