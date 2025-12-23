# commerce-atoms/.github

> **Organization-level GitHub defaults for commerce-atoms projects.**

This repository contains shared templates, policies, and tooling that automatically apply to all repositories in the `commerce-atoms` organization.

**Note:** This repository contains no runtime code and is not published to npm.

---

## What's Here

### Templates & Policies (Auto-applied)

These files are automatically inherited by all repos in the organization:

- **Issue Templates** (`.github/ISSUE_TEMPLATE/`)

  - `bug.yml` - Bug report template
  - `feature.yml` - Feature request template
  - `config.yml` - Issue template configuration

- **Pull Request Template** (`pull_request_template.md`)

- **Contributing Guidelines** (`CONTRIBUTING.md`)

- **Security Policy** (`SECURITY.md`)

### Tooling

- **Label Sync Script** (`scripts/sync-labels.mjs`)
  - One-off script to sync labels from a source repo to all other repos
  - See [`OPS.md`](OPS.md) for usage instructions

---

## How It Works

GitHub automatically looks for these files in the `.github` repository:

- **Templates**: Any repo without its own templates will use these
- **Policies**: CONTRIBUTING.md and SECURITY.md are linked from repo pages
- **Labels**: Must be synced manually using the provided script

---

## Maintenance

### Templates & Policies

- **Update once here** → automatically applies to all repos
- Individual repos can override by adding their own files

### Labels

- **One-time sync**: Run `scripts/sync-labels.mjs` to propagate labels
- **New repos**: Re-run the script or manually add labels
- **Label changes**: Update source repo (`shoppy`), then re-run script

See [`OPS.md`](OPS.md) for detailed instructions.

---

## Repository Structure

```text
.github/
├── .github/
│   └── ISSUE_TEMPLATE/
│       ├── bug.yml
│       ├── feature.yml
│       └── config.yml
├── scripts/
│   └── sync-labels.mjs
├── CONTRIBUTING.md
├── SECURITY.md
├── pull_request_template.md
├── OPS.md
└── README.md (this file)
```

---

## License

MIT (same as all commerce-atoms projects)
