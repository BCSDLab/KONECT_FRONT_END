# KONECT GitHub Conventions

## Core Files

- `AGENTS.md`
- `.github/ISSUE_TEMPLATE/NEW_FEATURE.md`
- `.github/ISSUE_TEMPLATE/BUG_REPORT.md`
- `.github/PULL_REQUEST_TEMPLATE.md`

## Title And Commit Mapping

| Work type | Issue / PR title prefix | Commit prefix | Default label | Issue template |
| --- | --- | --- | --- | --- |
| feature | `[feat]` | `feat:` | `✨ Feature` | `NEW_FEATURE.md` |
| fix | `[fix]` | `fix:` | `🐞 BugFix` | `BUG_REPORT.md` |
| hotfix | `[hotfix]` | `fix:` | `🐞 BugFix` | `BUG_REPORT.md` |
| refactor | `[refactor]` | `refactor:` | `🔨 Refactor` | `NEW_FEATURE.md` |
| chore | `[chore]` | `chore:` | `⚙️ Setting` | `NEW_FEATURE.md` |
| docs | `[docs]` | `docs:` | `📃 Docs` | `NEW_FEATURE.md` |
| test | `[test]` | `test:` | `✅ Test` | `NEW_FEATURE.md` |
| deploy | `[deploy]` | `chore:` | `🌏 Deploy` | `NEW_FEATURE.md` |
| qa | `[qa]` | `chore:` | `❗QA issue` | `BUG_REPORT.md` |

## Pick The Work Type

- Choose `feature` when the change adds user-visible behavior or a new workflow.
- Choose `fix` when the change corrects broken behavior without adding a new feature.
- Choose `hotfix` when the change is an urgent production-facing fix and the user explicitly frames it that way.
- Choose `refactor` when behavior should stay the same and the main goal is code structure improvement.
- Choose `chore` when the change is mainly settings, tooling, dependency, or environment maintenance.
- Choose `docs` when the change is documentation-only.
- Choose `test` when the change is mainly test code or test setup.
- Choose `deploy` when the change is deployment or release process related.
- Choose `qa` when the work is driven by QA findings or bug verification flow.

## Branch Naming

Use:

```text
{issue번호}-{type}-{설명-kebab-case}
```

Example:

```text
293-feat-일반-단체채팅방-멤버-목록-조회-및-초대-기능-추가
```

## Issue Rules

- Use Korean.
- Keep the title format as `[type] 설명`.
- Use `NEW_FEATURE.md` for feature-like work.
- Use `BUG_REPORT.md` for bug, hotfix, or QA work.
- When the user gives a custom description, preserve it while keeping the repository format.

## Commit Rules

- Use Korean.
- Use exactly `type: 설명`.
- Split commits by logical work units, not by file count.
- Follow stricter user instructions if they override the default pattern.
- If the user wants messages like `feat:` only, rewrite the local branch history to match.
- If the branch was already pushed, use `git push --force-with-lease` after rewriting.

## PR Rules

- Use Korean.
- Reuse the issue title unless there is a clear reason to change it.
- Fill the repository PR template.
- Add `close #<issue번호>` under the issue section.
- Keep the summary short and outcome-focused.

## Label Rules

- Apply the matching default label to both the issue and the PR.
- If the user asks for a different label, follow the user request.

## Assignee Rules

- Assign the GitHub author to both the issue and the PR when possible.
- If permissions block assignee changes, report that clearly.

## Validation Rules

- Always run `pnpm lint`.
- Also run `pnpm build` if routing, API contracts, or build settings changed.

## Common Requests That Should Trigger This Skill

- "지금 변경분 이슈 만들고 PR까지 올려줘"
- "작업물 이슈, 커밋, PR 흐름으로 정리해줘"
- "라벨, assignee까지 붙여서 발행해줘"
- "현재 워크트리 커밋 나눠서 올려줘"
