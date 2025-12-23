#!/usr/bin/env node

/**
 * Label Sync Script
 *
 * Syncs labels from labels.json (source of truth) to target repositories in the commerce-atoms organization.
 *
 * Usage:
 *   node scripts/sync-labels.mjs
 *   # Future: node scripts/sync-labels.mjs --dry-run  (preview changes without applying)
 *
 * Requirements:
 *   - GitHub CLI (gh) installed and authenticated
 *   - Run: gh auth login
 *
 * Behavior:
 *   - Creates missing labels in target repos
 *   - Updates color/description if different
 *   - Never deletes existing labels (non-destructive)
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ORG = "commerce-atoms";
const LABELS_FILE = join(__dirname, "..", "labels", "labels.json");
const TARGET_REPOS = [
  "shoppy",
  "agents",
  "hydrogen-storefront-starter",
  "mcp-hydrogen-kit",
];

/**
 * Load labels from labels.json (source of truth)
 */
function loadLabels() {
  try {
    const content = readFileSync(LABELS_FILE, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error(
      `❌ Failed to load labels from ${LABELS_FILE}:`,
      error.message
    );
    process.exit(1);
  }
}

/**
 * Fetch labels from a repository
 */
async function fetchLabels(owner, repo) {
  const { execSync } = await import("child_process");

  try {
    const output = execSync(`gh api repos/${owner}/${repo}/labels --paginate`, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return JSON.parse(output);
  } catch (error) {
    console.error(
      `❌ Failed to fetch labels from ${owner}/${repo}:`,
      error.message
    );
    process.exit(1);
  }
}

/**
 * Create a label in a repository
 */
async function createLabel(owner, repo, label) {
  const { execSync } = await import("child_process");

  try {
    execSync(
      `gh api repos/${owner}/${repo}/labels -X POST -f name="${
        label.name
      }" -f color="${label.color}" -f description="${label.description || ""}"`,
      { encoding: "utf-8", stdio: "pipe" }
    );
    return true;
  } catch (error) {
    // Label might already exist, try updating instead
    if (
      error.message.includes("already exists") ||
      error.message.includes("422")
    ) {
      return false;
    }
    console.error(
      `❌ Failed to create label "${label.name}" in ${owner}/${repo}:`,
      error.message
    );
    return false;
  }
}

/**
 * Update a label in a repository
 */
async function updateLabel(owner, repo, label) {
  const { execSync } = await import("child_process");

  try {
    // URL encode the label name
    const encodedName = encodeURIComponent(label.name);
    execSync(
      `gh api repos/${owner}/${repo}/labels/${encodedName} -X PATCH -f color="${
        label.color
      }" -f description="${label.description || ""}"`,
      { encoding: "utf-8", stdio: "pipe" }
    );
    return true;
  } catch (error) {
    console.error(
      `❌ Failed to update label "${label.name}" in ${owner}/${repo}:`,
      error.message
    );
    return false;
  }
}

/**
 * Check if two labels are different (color or description)
 */
function labelsDiffer(source, target) {
  return (
    source.color.toLowerCase() !== target.color.toLowerCase() ||
    (source.description || "") !== (target.description || "")
  );
}

/**
 * Sync labels from source to target repository
 */
async function syncLabelsToRepo(targetRepo) {
  console.log(`\n📦 Syncing labels to ${ORG}/${targetRepo}...`);

  const sourceLabels = loadLabels();
  const targetLabels = await fetchLabels(ORG, targetRepo);

  // Create a map of existing target labels by name
  const targetLabelMap = new Map(
    targetLabels.map((label) => [label.name.toLowerCase(), label])
  );

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const sourceLabel of sourceLabels) {
    const targetLabel = targetLabelMap.get(sourceLabel.name.toLowerCase());

    if (!targetLabel) {
      // Label doesn't exist, create it
      const success = await createLabel(ORG, targetRepo, sourceLabel);
      if (success) {
        console.log(`  ✅ Created: ${sourceLabel.name}`);
        created++;
      } else {
        // Creation failed, try update (might be a race condition)
        const updateSuccess = await updateLabel(ORG, targetRepo, sourceLabel);
        if (updateSuccess) {
          console.log(`  🔄 Updated: ${sourceLabel.name} (created via update)`);
          updated++;
        } else {
          console.log(
            `  ⚠️  Skipped: ${sourceLabel.name} (creation/update failed)`
          );
          skipped++;
        }
      }
    } else if (labelsDiffer(sourceLabel, targetLabel)) {
      // Label exists but differs, update it
      const success = await updateLabel(ORG, targetRepo, sourceLabel);
      if (success) {
        console.log(`  🔄 Updated: ${sourceLabel.name}`);
        updated++;
      } else {
        console.log(`  ⚠️  Skipped: ${sourceLabel.name} (update failed)`);
        skipped++;
      }
    } else {
      // Label exists and matches, skip
      console.log(`  ⏭️  Skipped: ${sourceLabel.name} (already in sync)`);
      skipped++;
    }
  }

  console.log(`\n  Summary for ${targetRepo}:`);
  console.log(`    ✅ Created: ${created}`);
  console.log(`    🔄 Updated: ${updated}`);
  console.log(`    ⏭️  Skipped: ${skipped}`);

  return { created, updated, skipped };
}

/**
 * Main execution
 */
async function main() {
  console.log("🚀 Label Sync Script");
  console.log(`\nSource: labels/labels.json (source of truth)`);
  console.log(`Targets: ${TARGET_REPOS.join(", ")}`);

  // TODO: Add --dry-run flag support to preview changes without applying
  // const args = process.argv.slice(2);
  // const dryRun = args.includes('--dry-run');

  // Check if gh is installed and authenticated
  const { execSync } = await import("child_process");
  try {
    execSync("gh auth status", { encoding: "utf-8", stdio: "pipe" });
  } catch (error) {
    console.error("\n❌ GitHub CLI not authenticated.");
    console.error("   Please run: gh auth login");
    process.exit(1);
  }

  // Verify labels file exists
  try {
    readFileSync(LABELS_FILE, "utf-8");
  } catch (error) {
    console.error(`\n❌ Labels file not found: ${LABELS_FILE}`);
    process.exit(1);
  }

  const totals = { created: 0, updated: 0, skipped: 0 };

  for (const targetRepo of TARGET_REPOS) {
    // Verify target repo exists
    try {
      execSync(`gh repo view ${ORG}/${targetRepo}`, {
        encoding: "utf-8",
        stdio: "pipe",
      });
    } catch (error) {
      console.log(
        `\n⚠️  Skipping ${targetRepo} (repository not found or not accessible)`
      );
      continue;
    }

    const result = await syncLabelsToRepo(targetRepo);
    totals.created += result.created;
    totals.updated += result.updated;
    totals.skipped += result.skipped;
  }

  console.log("\n" + "=".repeat(50));
  console.log("✨ Sync Complete!");
  console.log(`\nTotal across all repos:`);
  console.log(`  ✅ Created: ${totals.created}`);
  console.log(`  🔄 Updated: ${totals.updated}`);
  console.log(`  ⏭️  Skipped: ${totals.skipped}`);
  console.log(
    "\n💡 Note: This script never deletes labels. Remove labels manually if needed."
  );
}

main().catch((error) => {
  console.error("\n❌ Fatal error:", error);
  process.exit(1);
});
