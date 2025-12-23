# Security Policy

## Supported Versions

We provide security updates for the following versions:

| Version        | Supported          |
| -------------- | ------------------ |
| Latest release | :white_check_mark: |

**Current Status**: Most packages are in development (0.x versions). Security updates are provided for the latest published version. Once packages reach 1.0.0, we will follow semantic versioning with support for the latest minor release within each major version.

---

## Reporting a Vulnerability

**Do not open a public issue for security vulnerabilities.**

If you discover a security vulnerability, please report it privately using one of these methods:

### Option 1: GitHub Security Advisories (Recommended)

1. Go to the repository's Security tab
2. Click "Report a vulnerability"
3. Or visit: `https://github.com/commerce-atoms/REPO_NAME/security/advisories/new`

### Option 2: Email (If Available)

If the repository lists a security email, you can email: `security@commerce-atoms.org`

---

## What to Include

When reporting a vulnerability, please include:

- **Description** of the vulnerability
- **Steps to reproduce** the issue
- **Potential impact** (what could an attacker do?)
- **Suggested fix** (if you have one)
- **Affected versions** (if known)

---

## Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity and complexity

We will:

- Acknowledge receipt of your report within 48 hours
- Keep you informed of progress toward fixing the vulnerability
- Notify you when the vulnerability has been fixed
- Credit you in the security advisory (unless you prefer to remain anonymous)

---

## Disclosure Policy

- We will work with you to understand and resolve the issue quickly
- We will not disclose the vulnerability publicly until a fix is available
- We will coordinate with you on the disclosure timeline
- We will credit you in the security advisory (unless you prefer anonymity)

---

## Security Best Practices

When using commerce-atoms packages:

- **Always use the latest stable version**
- **Review dependency updates regularly**
- **Follow secure coding practices** in your application
- **Do not commit sensitive data** (API keys, tokens, etc.) to version control
- **Keep dependencies up to date** using `npm audit` or similar tools

---

## Known Security Considerations

### Design Principles

commerce-atoms packages are designed with security in mind:

- **No runtime dependencies**: Packages are designed to be dependency-free to minimize attack surface
- **Pure functions**: All functions are pure (no side effects), reducing risk of injection attacks
- **Type safety**: TypeScript strict mode helps prevent type-related vulnerabilities
- **Explicit APIs**: No magic imports or hidden behavior reduces attack surface

### Package-Specific Considerations

- **@commerce-atoms/urlstate**: Handles URL parsing — ensure inputs are validated in your application
- **@commerce-atoms/metafield**: Parses JSON metafields — validate JSON structure in your application
- **@commerce-atoms/money**: Formats currency — ensure currency codes are validated

---

## Security Updates

Security updates are released as:

- **Patch releases** (e.g., `0.1.0` → `0.1.1`) for non-breaking security fixes
- **Minor releases** (e.g., `0.1.0` → `0.2.0`) for security fixes that require API changes
- **Major releases** (e.g., `0.x.x` → `1.0.0`) for breaking security changes

---

## Thank You

Thank you for helping keep commerce-atoms and its users safe! Security researchers and contributors who responsibly disclose vulnerabilities are greatly appreciated.

