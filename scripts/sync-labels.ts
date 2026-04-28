#!/usr/bin/env tsx
/**
 * Label Sync Script
 *
 * Syncs labels from labels.json (source of truth) to target repositories
 * in the commerce-atoms organization.
 *
 * Usage:
 *   npm run sync-labels
 *   # or directly: npx tsx scripts/sync-labels.ts
 *
 * Requirements:
 *   - GitHub CLI (gh) installed and authenticated (`gh auth login`)
 *
 * Behavior:
 *   - Creates missing labels in target repos
 *   - Updates color/description if different
 *   - Never deletes existing labels (non-destructive)
 */

import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';
import {execSync} from 'node:child_process';
import process from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ORG = 'commerce-atoms';
const LABELS_FILE = join(__dirname, '..', 'labels', 'labels.json');

const TARGET_REPOS: readonly string[] = [
  'shoppy',
  'agents',
  'hydrogen-storefront-starter',
] as const;

interface Label {
  readonly name: string;
  readonly color: string;
  readonly description?: string;
}

interface SyncCounts {
  created: number;
  updated: number;
  skipped: number;
}

function isLabel(value: unknown): value is Label {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v['name'] === 'string' && typeof v['color'] === 'string';
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return String(error);
}

function runGh(args: string): string {
  return execSync(`gh ${args}`, {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
}

function loadLabels(): Label[] {
  let content: string;
  try {
    content = readFileSync(LABELS_FILE, 'utf-8');
  } catch (error) {
    console.error(
      `❌ Failed to read labels from ${LABELS_FILE}: ${errorMessage(error)}`,
    );
    process.exit(1);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    console.error(
      `❌ ${LABELS_FILE} is not valid JSON: ${errorMessage(error)}`,
    );
    process.exit(1);
  }

  if (!Array.isArray(parsed) || !parsed.every(isLabel)) {
    console.error(
      `❌ ${LABELS_FILE} must be an array of {name, color, description?} objects.`,
    );
    process.exit(1);
  }

  return parsed;
}

function fetchLabels(owner: string, repo: string): Label[] {
  let output: string;
  try {
    output = runGh(`api repos/${owner}/${repo}/labels --paginate`);
  } catch (error) {
    console.error(
      `❌ Failed to fetch labels from ${owner}/${repo}: ${errorMessage(error)}`,
    );
    process.exit(1);
  }

  const parsed: unknown = JSON.parse(output);
  if (!Array.isArray(parsed) || !parsed.every(isLabel)) {
    console.error(
      `❌ Unexpected payload shape when fetching labels from ${owner}/${repo}.`,
    );
    process.exit(1);
  }
  return parsed;
}

function createLabel(owner: string, repo: string, label: Label): boolean {
  try {
    runGh(
      `api repos/${owner}/${repo}/labels -X POST ` +
        `-f name="${label.name}" ` +
        `-f color="${label.color}" ` +
        `-f description="${label.description ?? ''}"`,
    );
    return true;
  } catch (error) {
    const msg = errorMessage(error);
    if (msg.includes('already exists') || msg.includes('422')) {
      return false;
    }
    console.error(
      `❌ Failed to create label "${label.name}" in ${owner}/${repo}: ${msg}`,
    );
    return false;
  }
}

function updateLabel(owner: string, repo: string, label: Label): boolean {
  try {
    const encodedName = encodeURIComponent(label.name);
    runGh(
      `api repos/${owner}/${repo}/labels/${encodedName} -X PATCH ` +
        `-f color="${label.color}" ` +
        `-f description="${label.description ?? ''}"`,
    );
    return true;
  } catch (error) {
    console.error(
      `❌ Failed to update label "${label.name}" in ${owner}/${repo}: ${errorMessage(error)}`,
    );
    return false;
  }
}

function labelsDiffer(source: Label, target: Label): boolean {
  return (
    source.color.toLowerCase() !== target.color.toLowerCase() ||
    (source.description ?? '') !== (target.description ?? '')
  );
}

function syncLabelsToRepo(
  sourceLabels: readonly Label[],
  targetRepo: string,
): SyncCounts {
  console.log(`\n📦 Syncing labels to ${ORG}/${targetRepo}...`);

  const targetLabels = fetchLabels(ORG, targetRepo);
  const targetLabelMap = new Map<string, Label>(
    targetLabels.map((label) => [label.name.toLowerCase(), label]),
  );

  const counts: SyncCounts = {created: 0, updated: 0, skipped: 0};

  for (const sourceLabel of sourceLabels) {
    const targetLabel = targetLabelMap.get(sourceLabel.name.toLowerCase());

    if (!targetLabel) {
      if (createLabel(ORG, targetRepo, sourceLabel)) {
        console.log(`  ✅ Created: ${sourceLabel.name}`);
        counts.created++;
        continue;
      }
      if (updateLabel(ORG, targetRepo, sourceLabel)) {
        console.log(`  🔄 Updated: ${sourceLabel.name} (created via update)`);
        counts.updated++;
        continue;
      }
      console.log(
        `  ⚠️  Skipped: ${sourceLabel.name} (creation/update failed)`,
      );
      counts.skipped++;
      continue;
    }

    if (labelsDiffer(sourceLabel, targetLabel)) {
      if (updateLabel(ORG, targetRepo, sourceLabel)) {
        console.log(`  🔄 Updated: ${sourceLabel.name}`);
        counts.updated++;
      } else {
        console.log(`  ⚠️  Skipped: ${sourceLabel.name} (update failed)`);
        counts.skipped++;
      }
      continue;
    }

    console.log(`  ⏭️  Skipped: ${sourceLabel.name} (already in sync)`);
    counts.skipped++;
  }

  console.log(`\n  Summary for ${targetRepo}:`);
  console.log(`    ✅ Created: ${counts.created}`);
  console.log(`    🔄 Updated: ${counts.updated}`);
  console.log(`    ⏭️  Skipped: ${counts.skipped}`);

  return counts;
}

function repoExists(owner: string, repo: string): boolean {
  try {
    runGh(`repo view ${owner}/${repo}`);
    return true;
  } catch {
    return false;
  }
}

function ghAuthenticated(): boolean {
  try {
    runGh('auth status');
    return true;
  } catch {
    return false;
  }
}

function main(): void {
  console.log('🚀 Label Sync Script');
  console.log('\nSource: labels/labels.json (source of truth)');
  console.log(`Targets: ${TARGET_REPOS.join(', ')}`);

  if (!ghAuthenticated()) {
    console.error('\n❌ GitHub CLI not authenticated.');
    console.error('   Please run: gh auth login');
    process.exit(1);
  }

  const sourceLabels = loadLabels();

  const totals: SyncCounts = {created: 0, updated: 0, skipped: 0};

  for (const targetRepo of TARGET_REPOS) {
    if (!repoExists(ORG, targetRepo)) {
      console.log(
        `\n⚠️  Skipping ${targetRepo} (repository not found or not accessible)`,
      );
      continue;
    }

    const result = syncLabelsToRepo(sourceLabels, targetRepo);
    totals.created += result.created;
    totals.updated += result.updated;
    totals.skipped += result.skipped;
  }

  console.log('\n' + '='.repeat(50));
  console.log('✨ Sync Complete!');
  console.log('\nTotal across all repos:');
  console.log(`  ✅ Created: ${totals.created}`);
  console.log(`  🔄 Updated: ${totals.updated}`);
  console.log(`  ⏭️  Skipped: ${totals.skipped}`);
  console.log(
    '\n💡 Note: This script never deletes labels. Remove labels manually if needed.',
  );
}

main();
