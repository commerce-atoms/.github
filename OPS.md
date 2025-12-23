# Operations Guide

> **One-off operations and maintenance tasks for commerce-atoms organization.**

This document describes how to perform organization-level operations, primarily label synchronization across repositories.

---

## Label Synchronization

### Overview

The label sync script copies labels from a **source repository** (`shoppy`) to all **target repositories** in the organization. This ensures consistent labeling across all commerce-atoms projects.

**Behavior:**
- ✅ Creates missing labels in target repos
- ✅ Updates color/description if different
- ❌ **Never deletes** existing labels (non-destructive)

### Prerequisites

1. **GitHub CLI installed**
   ```bash
   # macOS
   brew install gh
   
   # Or download from: https://cli.github.com/
   ```

2. **GitHub CLI authenticated**
   ```bash
   gh auth login
   ```
   
   Follow the prompts to authenticate. You'll need:
   - GitHub account with access to `commerce-atoms` organization
   - Appropriate permissions (write access to repositories)

3. **Verify authentication**
   ```bash
   gh auth status
   ```

### Running the Sync

⚠️ **Warning:** Do not run label sync from forks. Always run from the main `commerce-atoms/.github` repository.

1. **Navigate to the `.github` repository**
   ```bash
   cd ~/Projects/commerce-atoms/.github
   ```

2. **Run the sync script**
   ```bash
   node scripts/sync-labels.mjs
   ```

3. **Review the output**
   
   The script will:
   - Fetch labels from `commerce-atoms/shoppy` (source)
   - Sync to each target repo: `agents`, `hydrogen-storefront-starter`, `mcp-hydrogen-kit`
   - Show progress for each label (created, updated, or skipped)
   - Display a summary at the end

### Example Output

```
🚀 Label Sync Script

Source: commerce-atoms/shoppy
Targets: agents, hydrogen-storefront-starter, mcp-hydrogen-kit

📦 Syncing labels to commerce-atoms/agents...
  ✅ Created: bug
  ✅ Created: enhancement
  🔄 Updated: documentation
  ⏭️  Skipped: good first issue (already in sync)

  Summary for agents:
    ✅ Created: 8
    🔄 Updated: 2
    ⏭️  Skipped: 3

...

✨ Sync Complete!

Total across all repos:
  ✅ Created: 24
  🔄 Updated: 6
  ⏭️  Skipped: 9

💡 Note: This script never deletes labels. Remove labels manually if needed.
```

### When to Run

Run the sync script:

- **Once initially** to set up labels across all repos
- **When adding a new repository** to the organization
- **When updating the label taxonomy** in the source repo (`shoppy`)
- **After manually adding labels** to `shoppy` that should be propagated

### Customizing Target Repos

To add or remove target repositories, edit `scripts/sync-labels.mjs`:

```javascript
const TARGET_REPOS = [
  'agents',
  'hydrogen-storefront-starter',
  'mcp-hydrogen-kit',
  'your-new-repo',  // Add here
];
```

### Changing the Source Repo

To use a different source repository, edit `scripts/sync-labels.mjs`:

```javascript
const SOURCE_REPO = 'your-source-repo';  // Change this
```

---

## Standard Label Set

The recommended label set for commerce-atoms projects:

### Type Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `refactor` - Code refactoring
- `performance` - Performance improvements
- `chore` - Maintenance tasks

### Priority Labels

- `priority: high` - High priority
- `priority: medium` - Medium priority
- `priority: low` - Low priority

### Status Labels

- `status: needs-triage` - Needs review/triage
- `status: in-progress` - Work in progress
- `status: blocked` - Blocked by something
- `status: on-hold` - Temporarily on hold

### Community Labels

- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed

### Scope Labels (Optional)

- `scope: breaking` - Breaking change
- `scope: package:variants` - Affects specific package
- `scope: cross-package` - Affects multiple packages

### Colors

Use consistent colors across labels:
- **Type labels**: Blue (`#0e8a16` for bug, `#a2eeef` for enhancement, etc.)
- **Priority labels**: Red/Orange (`#d93f0b` for high, `#fbca04` for medium, etc.)
- **Status labels**: Yellow (`#fef2c0` for in-progress, etc.)
- **Community labels**: Green (`#0e8a16` for good first issue, etc.)

---

## Troubleshooting

### "GitHub CLI not authenticated"

```bash
gh auth login
```

### "Source repository not found"

- Verify the repository exists: `gh repo view commerce-atoms/shoppy`
- Check your access permissions
- Ensure you're using the correct organization name

### "Failed to create/update label"

- Check your write permissions on the target repository
- Verify the label name doesn't conflict with GitHub's reserved labels
- Some labels might already exist (this is handled gracefully)

### Labels not syncing

- Check that the source repo (`shoppy`) has labels
- Verify target repos exist and are accessible
- Review the script output for specific error messages

---

## Manual Label Management

If you need to manually manage labels:

### Using GitHub CLI

```bash
# List labels in a repo
gh label list --repo commerce-atoms/shoppy

# Create a label
gh label create "my-label" --repo commerce-atoms/shoppy --color "#ff0000" --description "My label description"

# Update a label
gh label edit "my-label" --repo commerce-atoms/shoppy --color "#00ff00" --description "Updated description"

# Delete a label (use with caution)
gh label delete "my-label" --repo commerce-atoms/shoppy
```

### Using GitHub Web UI

1. Go to repository → **Issues** → **Labels**
2. Click **New label** or edit existing labels
3. Set color and description
4. Save

---

## Best Practices

1. **Standardize first**: Create labels in the source repo (`shoppy`) first
2. **Sync regularly**: Run sync when adding new repos or updating labels
3. **Document changes**: If you add new label categories, update this document
4. **Non-destructive**: The script never deletes labels — remove manually if needed
5. **Review output**: Always review the sync output to catch any issues

---

## Future Improvements

Potential enhancements to the sync script:

- [ ] Dry-run mode (preview changes without applying)
- [ ] Config file for target repos (instead of hardcoded)
- [ ] Support for label deletion (with confirmation)
- [ ] Sync in reverse (from targets to source)
- [ ] Label validation (check for reserved names, invalid colors)

---

## Questions?

- **Script issues**: Open an issue in the `.github` repository
- **Label taxonomy**: Discuss in organization discussions
- **Permissions**: Contact organization admins

