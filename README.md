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

- **Label Sync Script** (`scripts/sync-labels.ts`)
  - TypeScript ops script to sync labels from `labels/labels.json` to all target repos
  - Run with `npm run sync-labels` (executed via `tsx`, no build step)
  - See [`docs/ops.md`](docs/ops.md) for usage instructions

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

- **Source of truth**: `labels/labels.json` contains all label definitions
- **One-time sync**: Run `npm run sync-labels` to propagate labels
- **New repos**: Re-run the script or manually add labels
- **Label changes**: Edit `labels/labels.json`, then re-run script

See [`docs/ops.md`](docs/ops.md) for detailed instructions.

---

## Repository Structure

```text
.github/
├── .github/                      # Auto-applied templates
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug.yml
│   │   ├── feature.yml
│   │   └── config.yml
│   └── pull_request_template.md
├── scripts/                      # Ops scripts (manual run, TypeScript via tsx)
│   └── sync-labels.ts
├── labels/                        # Source of truth
│   ├── labels.json               # Canonical label definitions
│   └── README.md                 # Label taxonomy
├── docs/                          # Ops + governance docs
│   └── ops.md                    # Operations guide
├── CONTRIBUTING.md                # Auto-applied
├── SECURITY.md                    # Auto-applied
├── package.json                   # Dev deps for ops scripts (tsx, typescript, @types/node)
├── tsconfig.json                  # Strict TS config for scripts/
└── README.md                      # This file
```

---

## License

MIT (same as all commerce-atoms projects)
