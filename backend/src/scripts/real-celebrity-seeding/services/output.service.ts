/**
 * Output Service
 * Generates CSV files, JSONL samples, and summary reports
 */

import * as fs from 'fs';
import * as path from 'path';
import { CelebrityCandidate, SummaryReport, PriceTier } from '../types';
import { OUTPUT_PATHS } from '../config';

/**
 * Ensure output directory exists
 */
function ensureOutputDir(): void {
  const dirs = [
    OUTPUT_PATHS.baseDir,
    OUTPUT_PATHS.logsDir
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

/**
 * Convert candidate to CSV row
 */
function candidateToCSVRow(candidate: CelebrityCandidate): string[] {
  return [
    candidate.slug || '',
    candidate.name || '',
    candidate.universal_category || '',
    candidate.professional_class || '',
    candidate.country || '',
    candidate.region || '',
    (candidate.base_price_cents / 100).toString(),
    candidate.price_tier || '',
    candidate.popularity_score.toString(),
    candidate.is_verified.toString(),
    candidate.is_featured.toString(),
    candidate.bookable.toString(),
    candidate.short_bio || '',
    (candidate.known_for || []).join('; '),
    candidate.wikidata_qid || '',
    candidate.tmdb_id?.toString() || '',
    candidate.spotify_id || '',
    candidate.youtube_channel_id || ''
  ];
}

/**
 * Escape CSV value
 */
function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('\n') || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Write successful imports to CSV
 */
export function writeSuccessCSV(candidates: CelebrityCandidate[]): void {
  console.log('\n📝 Writing successful imports CSV...');

  const headers = [
    'slug',
    'name',
    'category',
    'professional_class',
    'country',
    'region',
    'price_usd',
    'price_tier',
    'popularity_score',
    'is_verified',
    'is_featured',
    'bookable',
    'bio',
    'known_for',
    'wikidata_qid',
    'tmdb_id',
    'spotify_id',
    'youtube_id'
  ];

  const rows = [headers.join(',')];

  for (const candidate of candidates) {
    const row = candidateToCSVRow(candidate);
    rows.push(row.map(escapeCSV).join(','));
  }

  ensureOutputDir();
  fs.writeFileSync(OUTPUT_PATHS.successCSV, rows.join('\n'), 'utf8');

  console.log(`✅ Wrote ${candidates.length} successful imports to: ${OUTPUT_PATHS.successCSV}`);
}

/**
 * Write failed imports to CSV
 */
export function writeFailedCSV(
  failed: Array<{ entity: any; errors: string[] }>
): void {
  if (failed.length === 0) {
    console.log('ℹ️  No failed imports to write');
    return;
  }

  console.log('\n📝 Writing failed imports CSV...');

  const headers = ['name', 'wikidata_qid', 'errors'];
  const rows = [headers.join(',')];

  for (const item of failed) {
    const row = [
      item.entity.name || '',
      item.entity.qid || '',
      item.errors.join('; ')
    ];
    rows.push(row.map(escapeCSV).join(','));
  }

  ensureOutputDir();
  fs.writeFileSync(OUTPUT_PATHS.failedCSV, rows.join('\n'), 'utf8');

  console.log(`✅ Wrote ${failed.length} failed imports to: ${OUTPUT_PATHS.failedCSV}`);
}

/**
 * Write merge candidates to CSV
 */
export function writeMergeCandidatesCSV(
  mergeCandidates: Array<{
    candidate1: string;
    candidate2: string;
    similarity: number;
    reason: string;
  }>
): void {
  if (mergeCandidates.length === 0) {
    console.log('ℹ️  No merge candidates to write');
    return;
  }

  console.log('\n📝 Writing merge candidates CSV...');

  const headers = ['candidate_1', 'candidate_2', 'similarity_score', 'reason'];
  const rows = [headers.join(',')];

  for (const merge of mergeCandidates) {
    const row = [
      merge.candidate1,
      merge.candidate2,
      merge.similarity.toFixed(2),
      merge.reason
    ];
    rows.push(row.map(escapeCSV).join(','));
  }

  ensureOutputDir();
  fs.writeFileSync(OUTPUT_PATHS.mergeCandidatesCSV, rows.join('\n'), 'utf8');

  console.log(`✅ Wrote ${mergeCandidates.length} merge candidates to: ${OUTPUT_PATHS.mergeCandidatesCSV}`);
}

/**
 * Write top 500 pending price review to CSV
 */
export function writeTop500ReviewCSV(candidates: CelebrityCandidate[]): void {
  const top500 = candidates
    .filter(c => c.pending_review_for_price)
    .sort((a, b) => b.base_price_cents - a.base_price_cents)
    .slice(0, 500);

  if (top500.length === 0) {
    console.log('ℹ️  No candidates pending price review');
    return;
  }

  console.log('\n📝 Writing top 500 pending review CSV...');

  const headers = [
    'slug',
    'name',
    'price_usd',
    'popularity_score',
    'category',
    'country'
  ];
  const rows = [headers.join(',')];

  for (const candidate of top500) {
    const row = [
      candidate.slug || '',
      candidate.name || '',
      (candidate.base_price_cents / 100).toString(),
      candidate.popularity_score.toString(),
      candidate.universal_category || '',
      candidate.country || ''
    ];
    rows.push(row.map(escapeCSV).join(','));
  }

  ensureOutputDir();
  fs.writeFileSync(OUTPUT_PATHS.top500ReviewCSV, rows.join('\n'), 'utf8');

  console.log(`✅ Wrote ${top500.length} candidates pending review to: ${OUTPUT_PATHS.top500ReviewCSV}`);
}

/**
 * Write sample profiles to JSONL
 */
export function writeSampleProfilesJSONL(
  candidates: CelebrityCandidate[],
  sampleSize: number = 200
): void {
  console.log('\n📝 Writing sample profiles JSONL...');

  // Random sample
  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  const sample = shuffled.slice(0, sampleSize);

  const jsonlLines = sample.map(candidate => JSON.stringify(candidate));

  ensureOutputDir();
  fs.writeFileSync(OUTPUT_PATHS.sampleProfiles, jsonlLines.join('\n'), 'utf8');

  console.log(`✅ Wrote ${sample.length} sample profiles to: ${OUTPUT_PATHS.sampleProfiles}`);
}

/**
 * Generate summary report
 */
export function generateSummaryReport(
  candidates: CelebrityCandidate[],
  failed: number,
  apiStats: any,
  startTime: Date,
  endTime: Date
): SummaryReport {
  console.log('\n📊 Generating summary report...');

  // Tier distribution
  const tierDistribution: Record<PriceTier, number> = {
    'Exclusive': 0,
    'Ultra-Elite': 0,
    'Elite': 0,
    'A-Lister': 0,
    'B-Lister': 0,
    'C-Lister': 0,
    'Rising': 0,
    'Emerging': 0
  };

  candidates.forEach(c => {
    if (c.price_tier in tierDistribution) {
      tierDistribution[c.price_tier]++;
    }
  });

  // Region distribution
  const regionDistribution: Record<string, number> = {};
  candidates.forEach(c => {
    const region = c.region || 'Other';
    regionDistribution[region] = (regionDistribution[region] || 0) + 1;
  });

  // Price statistics
  const prices = candidates.map(c => c.base_price_cents).sort((a, b) => a - b);
  const priceStats = {
    average: prices.reduce((sum, p) => sum + p, 0) / prices.length / 100,
    median: prices[Math.floor(prices.length / 2)] / 100,
    min: prices[0] / 100,
    max: prices[prices.length - 1] / 100,
    top100Expensive: candidates
      .sort((a, b) => b.base_price_cents - a.base_price_cents)
      .slice(0, 100)
      .map(c => ({
        name: c.name,
        price: c.base_price_cents / 100,
        tier: c.price_tier
      }))
  };

  // Duration
  const durationMinutes = (endTime.getTime() - startTime.getTime()) / 1000 / 60;

  const report: SummaryReport = {
    timestamp: new Date().toISOString(),
    totalProcessed: candidates.length + failed,
    totalImported: candidates.length,
    totalFailed: failed,
    tierDistribution,
    regionDistribution,
    priceStats,
    apiStats,
    processingTime: {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      durationMinutes: Math.round(durationMinutes * 100) / 100
    }
  };

  ensureOutputDir();
  fs.writeFileSync(
    OUTPUT_PATHS.summaryReport,
    JSON.stringify(report, null, 2),
    'utf8'
  );

  console.log(`✅ Summary report written to: ${OUTPUT_PATHS.summaryReport}`);

  // Print summary to console
  console.log('\n' + '='.repeat(60));
  console.log('📊 SEEDING SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Processed: ${report.totalProcessed.toLocaleString()}`);
  console.log(`Successfully Imported: ${report.totalImported.toLocaleString()}`);
  console.log(`Failed: ${report.totalFailed.toLocaleString()}`);
  console.log(`Duration: ${report.processingTime.durationMinutes} minutes`);
  console.log('\nTier Distribution:');
  Object.entries(tierDistribution).forEach(([tier, count]) => {
    console.log(`  ${tier}: ${count.toLocaleString()}`);
  });
  console.log('\nRegion Distribution:');
  Object.entries(regionDistribution).forEach(([region, count]) => {
    console.log(`  ${region}: ${count.toLocaleString()}`);
  });
  console.log('\nPrice Statistics:');
  console.log(`  Average: $${priceStats.average.toLocaleString()}`);
  console.log(`  Median: $${priceStats.median.toLocaleString()}`);
  console.log(`  Min: $${priceStats.min.toLocaleString()}`);
  console.log(`  Max: $${priceStats.max.toLocaleString()}`);
  console.log('='.repeat(60) + '\n');

  return report;
}

/**
 * Generate all output files
 */
export function generateAllOutputs(
  successful: CelebrityCandidate[],
  failed: Array<{ entity: any; errors: string[] }>,
  apiStats: any,
  startTime: Date,
  endTime: Date
): void {
  writeSuccessCSV(successful);
  writeFailedCSV(failed);
  writeTop500ReviewCSV(successful);
  writeSampleProfilesJSONL(successful);
  generateSummaryReport(successful, failed.length, apiStats, startTime, endTime);
}

export default {
  writeSuccessCSV,
  writeFailedCSV,
  writeMergeCandidatesCSV,
  writeTop500ReviewCSV,
  writeSampleProfilesJSONL,
  generateSummaryReport,
  generateAllOutputs
};
