# Contributing to commerce-atoms

Thank you for your interest in contributing to commerce-atoms! This document provides guidelines for contributing across all projects in the organization.

---

## Organization Principles

All commerce-atoms projects follow these core principles:

- **Composable by design** — small units, no monoliths
- **Pure business logic** — no UI, no framework assumptions
- **Zero runtime dependencies** — predictable, auditable, tree-shakable
- **Explicit APIs** — no barrels, no magic imports
- **TypeScript-first** — strict, structural typing
- **Delete-able** — safe to remove without rewrites
- **ESM-only** — modern, future-facing tooling

---

## Getting Started

1. **Fork the repository** you want to contribute to
2. **Clone your fork** locally
3. **Create a branch** for your changes (`git checkout -b feature/your-feature-name`)
4. **Make your changes** following the project's guidelines
5. **Test your changes** (run `npm run ci` or equivalent)
6. **Commit your changes** with clear, descriptive messages
7. **Push to your fork** and open a pull request

---

## Project-Specific Guidelines

Each repository has its own detailed contributing guidelines:

- **[shoppy](https://github.com/commerce-atoms/shoppy/blob/main/CONTRIBUTING.md)** — Commerce utilities monorepo
- **[hydrogen-storefront-starter](https://github.com/commerce-atoms/hydrogen-storefront-starter/blob/main/CONTRIBUTING.md)** — Hydrogen storefront reference implementation
- **[mcp-hydrogen-kit](https://github.com/commerce-atoms/mcp-hydrogen-kit)** — MCP tools for Hydrogen
- **[agents](https://github.com/commerce-atoms/agents)** — AI assistance rules and personas

**Please read the project-specific CONTRIBUTING.md** for detailed guidelines on:
- Development setup
- Code standards
- Testing requirements
- Architectural constraints
- Release process

---

## General Contribution Guidelines

### Code Quality

- **TypeScript**: Use strict mode, prefer `interface` over `type` for objects
- **Testing**: Add tests for new features and bug fixes
- **Documentation**: Update docs when adding features or changing behavior
- **Linting**: Ensure all lint checks pass before submitting

### Commit Messages

Use clear, descriptive commit messages:

```bash
# Good
git commit -m "Add variant selection logic for unavailable options"
git commit -m "Fix: Money formatting for zero values"
git commit -m "Docs: Update API examples in README"

# Bad
git commit -m "updates"
git commit -m "fix stuff"
```

### Pull Requests

- **Use the PR template** provided in each repository
- **Link related issues** using "Closes #123" or "Fixes #123"
- **Keep PRs focused** — one feature or fix per PR
- **Ensure all checks pass** before requesting review
- **Request review** from maintainers when ready

---

## What to Contribute

### ✅ Welcome

- Bug fixes
- New features that align with project principles
- Documentation improvements
- Performance optimizations
- Test coverage improvements
- Code refactoring

### ❌ Out of Scope

- UI component libraries
- Framework abstractions
- Runtime state managers
- Opinionated app architecture
- Vendor lock-in layers

---

## Reporting Issues

### Bug Reports

Use the [bug report template](.github/ISSUE_TEMPLATE/bug.yml) and include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment information (OS, Node version, package version)
- Code examples or error messages

### Feature Requests

Use the [feature request template](.github/ISSUE_TEMPLATE/feature.yml) and include:

- Problem statement and use case
- Proposed solution
- Examples of how it would be used
- Willingness to implement (if applicable)

---

## Security

**Do not open public issues for security vulnerabilities.**

Instead, report them via:
- [GitHub Security Advisories](https://github.com/commerce-atoms/REPO_NAME/security/advisories/new)
- Or email security@commerce-atoms.org (if available)

See [SECURITY.md](SECURITY.md) for our security policy.

---

## Code of Conduct

- Be respectful and professional
- Focus on the code and architecture, not individuals
- Provide constructive feedback
- Help maintain code quality
- Follow the project's architectural principles

---

## Questions?

- **Project-specific questions**: Check the repository's README and CONTRIBUTING.md
- **General questions**: Open a [GitHub Discussion](https://github.com/commerce-atoms/REPO_NAME/discussions)
- **Architecture questions**: See project documentation

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).

---

## Thank You!

Your contributions help make commerce-atoms better for everyone building modern commerce applications. 🚀

