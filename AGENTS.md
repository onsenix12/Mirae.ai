# Repository Guidelines

This repository is a documentation-only project. Keep changes focused on clarity, structure, and correctness of the written guidance.

## Project Structure & Module Organization

- `PRD.md`: product requirements and goals.
- `PROBLEM.md`: problem statement, constraints, and user needs.
- `SOLUTION.md`: proposed solution details and rationale.

Add new documents only when they represent a distinct artifact (for example, `DECISIONS.md` for architectural decisions) and keep them at the top level.

## Build, Test, and Development Commands

There are no build, test, or runtime commands configured in this repository. Validate updates by reviewing the Markdown rendering in your editor and checking for broken headings, lists, or code fences.

## Coding Style & Naming Conventions

- Use Markdown with ATX headings (`#`, `##`, `###`).
- Keep paragraphs short and use bullet lists for sequences or enumerations.
- Indent nested lists with two spaces; avoid tabs.
- Follow the existing naming pattern for files: uppercase topic names with `.md` (for example, `SOLUTION.md`).
- Use fenced code blocks for commands or examples and specify a language tag when possible.

## Testing Guidelines

No automated tests exist. Perform a manual review for factual accuracy, consistent terminology across documents, and proper Markdown formatting.

## Commit & Pull Request Guidelines

This folder does not include Git history, so there are no established commit conventions to reference. Use clear, imperative commit messages (for example, "Clarify problem constraints") and keep commits scoped to a single doc change.

For pull requests, include:
- A short summary of what changed and why.
- Links to related issues or discussions, if any.
- Notes on downstream docs that may need follow-up edits.
