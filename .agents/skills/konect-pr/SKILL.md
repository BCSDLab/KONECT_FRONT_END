---
name: konect-pr
description: Create and publish a KONECT_FRONT_END GitHub issue, branch, Korean commits, labels, assignees, and PR from the current worktree. Use when the user asks to create an issue, split work into commits, open a PR, add labels or assignees, or publish current changes using this repository's conventions.
---

# KONECT PR Publish

Turn the current `KONECT_FRONT_END` worktree into a repository-ready GitHub issue and PR.

## Read First

Read these files before acting:

- `AGENTS.md`
- `.github/ISSUE_TEMPLATE/NEW_FEATURE.md`
- `.github/ISSUE_TEMPLATE/BUG_REPORT.md`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `references/conventions.md`

## Do This

1. Inspect `git status --short`, the current branch, and recent commit or PR titles when needed.
2. Detect the work type and use `references/conventions.md` to choose the title prefix, commit type, label, and issue template.
3. Create the issue first so the branch name can include the issue number.
4. Name the branch as `{issue번호}-{type}-{설명-kebab-case}`.
5. Group changes into logical commit units. Do not mix unrelated edits into one commit.
6. Write commit messages in Korean using `type: 설명`.
7. Follow stricter user formatting requests when they override the default pattern.
8. Run `pnpm lint` after changes.
9. Run `pnpm build` when routing, API contracts, or build-related files changed.
10. Push the branch and open the PR with a Korean title and the repository PR template.
11. Add the matching label to both the issue and the PR.
12. Assign both the issue and the PR to the GitHub author when permissions allow.

## Use These Rules

- Prefer `gh` when CLI auth is valid, especially for labels and assignees.
- Use GitHub MCP issue or PR creation tools when they work.
- If GitHub MCP returns `403 Resource not accessible by integration`, fall back to `gh`.
- If network access is blocked, request the required approval and continue.
- Keep issue, commit, and PR text in Korean.
- Match issue and PR titles unless there is a strong reason to differ.
- Include `close #<issue번호>` in the PR body.
- If the worktree contains unrelated changes, stop and confirm scope before publishing.
- Never rewrite or drop user changes outside the intended publish scope.
- If commit messages must be fixed after pushing, rewrite only the intended branch history and use `git push --force-with-lease`.

## Output

Report these items at the end:

- Issue URL
- Branch name
- Commit SHAs and messages
- PR URL
- Applied labels and assignees
