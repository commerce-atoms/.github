# Label Taxonomy

This directory contains the canonical label definitions for all commerce-atoms repositories.

## Source of Truth

`labels.json` is the **source of truth** for all labels across the organization. The label sync script (`../scripts/sync-labels.mjs`) reads from this file to ensure consistency.

## Label Categories

### Type Labels

Labels that categorize the nature of the issue or PR:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `refactor` - Code refactoring
- `performance` - Performance improvements
- `chore` - Maintenance tasks

### Priority Labels

Labels that indicate urgency:

- `priority: high` - High priority
- `priority: medium` - Medium priority
- `priority: low` - Low priority

### Status Labels

Labels that track workflow state:

- `status: needs-triage` - Needs review/triage
- `status: in-progress` - Work in progress
- `status: blocked` - Blocked by something
- `status: on-hold` - Temporarily on hold

### Community Labels

Labels for contributor engagement:

- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed

### Scope Labels

Labels that indicate the scope of changes:

- `scope: breaking` - Breaking change
- `scope: cross-package` - Affects multiple packages

## Adding or Modifying Labels

1. **Edit `labels.json`** in this directory
2. **Run the sync script** to propagate changes:

   ```bash
   node scripts/sync-labels.mjs
   ```

## Color Guidelines

- **Type labels**: Standard GitHub colors (blue, green, purple, etc.)
- **Priority labels**: Red/Orange for high, yellow for medium, green for low
- **Status labels**: Yellow tones for in-progress states
- **Community labels**: Green tones
- **Scope labels**: Red for breaking, blue for cross-package

## Package-Specific Labels

For labels specific to a single package (e.g., `scope: package:variants`), add them directly to that repository. They don't need to be in this central list.
