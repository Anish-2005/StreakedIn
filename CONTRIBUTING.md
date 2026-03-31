# Contributing to StreakedIn

Thanks for contributing. This document defines the expected workflow for issues, code changes, and pull requests.

## Ground Rules

- Keep changes scoped and focused.
- Prefer clear, maintainable code over clever code.
- Do not include secrets, API keys, or credentials in commits.
- Discuss breaking changes in an issue before opening a PR.

## Ways to Contribute

- Report bugs
- Suggest improvements
- Improve docs
- Submit feature or fix pull requests

## Development Setup

1. Fork and clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Start local server:

```bash
npm run dev
```

## Branching and Commits

- Branch from `main`.
- Use descriptive branch names:
  - `feat/dashboard-search`
  - `fix/goal-progress-sync`
  - `docs/readme-refresh`
- Prefer Conventional Commit style:
  - `feat: add reminder snooze action`
  - `fix: handle null due date in tasks`
  - `docs: update setup instructions`

## Pull Request Checklist

Before opening a PR, ensure:

- `npm run build` passes.
- Your change is tested manually in relevant screens.
- You updated docs for behavior/config changes.
- You included screenshots or short screen recordings for UI changes.
- Your PR description explains:
  - what changed
  - why it changed
  - how it was tested

## Code Style Expectations

- Use TypeScript consistently.
- Reuse shared components from `src/components/common`.
- Keep components small and composable.
- Avoid introducing `any` unless unavoidable and justified.

## Reporting Bugs

When opening a bug report, include:

- Expected behavior
- Actual behavior
- Steps to reproduce
- Browser/OS details
- Screenshots or logs (if available)

## Security

If you discover a security issue, please do not open a public issue with exploit details. Share details privately with the maintainers first.

## License

By contributing, you agree that your contributions are licensed under the MIT License in this repository.
