/**
 * Deduplication & Identity Resolution Service
 * Prevents duplicate celebrity profiles
 */

import { CelebrityCandidate, DuplicateCheckResult } from '../types';

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Calculate similarity score between two strings (0-1)
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) {
    return 1.0;
  }

  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

/**
 * Normalize name for comparison
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove special chars
    .replace(/\s+/g, ' ')     // Normalize whitespace
    .trim();
}

/**
 * Check if two candidates have matching external IDs
 */
function checkExternalIDMatch(
  candidate1: Partial<CelebrityCandidate>,
  candidate2: Partial<CelebrityCandidate>
): { match: boolean; matchedId?: string } {
  // Check Wikidata QID
  if (candidate1.wikidata_qid && candidate2.wikidata_qid) {
    if (candidate1.wikidata_qid === candidate2.wikidata_qid) {
      return { match: true, matchedId: `Wikidata: ${candidate1.wikidata_qid}` };
    }
  }

  // Check IMDb ID
  if (candidate1.imdb_id && candidate2.imdb_id) {
    if (candidate1.imdb_id === candidate2.imdb_id) {
      return { match: true, matchedId: `IMDb: ${candidate1.imdb_id}` };
    }
  }

  // Check TMDB ID
  if (candidate1.tmdb_id && candidate2.tmdb_id) {
    if (candidate1.tmdb_id === candidate2.tmdb_id) {
      return { match: true, matchedId: `TMDB: ${candidate1.tmdb_id}` };
    }
  }

  // Check Spotify ID
  if (candidate1.spotify_id && candidate2.spotify_id) {
    if (candidate1.spotify_id === candidate2.spotify_id) {
      return { match: true, matchedId: `Spotify: ${candidate1.spotify_id}` };
    }
  }

  // Check YouTube Channel ID
  if (candidate1.youtube_channel_id && candidate2.youtube_channel_id) {
    if (candidate1.youtube_channel_id === candidate2.youtube_channel_id) {
      return { match: true, matchedId: `YouTube: ${candidate1.youtube_channel_id}` };
    }
  }

  return { match: false };
}

/**
 * Fuzzy match name + birth year + country
 */
function fuzzyMatch(
  candidate1: Partial<CelebrityCandidate>,
  candidate2: Partial<CelebrityCandidate>,
  threshold: number = 0.88
): { match: boolean; score: number } {
  // Normalize names
  const name1 = normalizeName(candidate1.name || '');
  const name2 = normalizeName(candidate2.name || '');

  // Calculate name similarity
  const nameSimilarity = calculateStringSimilarity(name1, name2);

  // If names are very different, not a match
  if (nameSimilarity < 0.7) {
    return { match: false, score: nameSimilarity };
  }

  // Extract birth years
  const birthYear1 = candidate1.birth_date ? new Date(candidate1.birth_date).getFullYear() : null;
  const birthYear2 = candidate2.birth_date ? new Date(candidate2.birth_date).getFullYear() : null;

  // Check birth year match
  let birthYearMatch = false;
  if (birthYear1 && birthYear2) {
    // Allow 1 year difference (data inconsistencies)
    birthYearMatch = Math.abs(birthYear1 - birthYear2) <= 1;
  }

  // Check country match
  const country1 = normalizeName(candidate1.country || '');
  const country2 = normalizeName(candidate2.country || '');
  const countryMatch = country1 === country2 && country1.length > 0;

  // Calculate overall similarity
  let overallScore = nameSimilarity;

  if (birthYearMatch) {
    overallScore = (overallScore + 1.0) / 2; // Boost score
  }

  if (countryMatch) {
    overallScore = (overallScore + 0.9) / 2; // Boost score
  }

  const isMatch = overallScore >= threshold && (birthYearMatch || countryMatch);

  return {
    match: isMatch,
    score: overallScore
  };
}

/**
 * Check if candidate is a duplicate
 */
export function checkDuplicate(
  candidate: Partial<CelebrityCandidate>,
  existingCandidates: Partial<CelebrityCandidate>[]
): DuplicateCheckResult {
  for (const existing of existingCandidates) {
    // Check external ID match (definitive)
    const idMatch = checkExternalIDMatch(candidate, existing);
    if (idMatch.match) {
      return {
        isDuplicate: true,
        existingId: existing.slug,
        matchReason: `External ID match: ${idMatch.matchedId}`,
        similarityScore: 1.0
      };
    }

    // Fuzzy match on name + birth year + country
    const fuzzy = fuzzyMatch(candidate, existing, 0.88);
    if (fuzzy.match) {
      return {
        isDuplicate: true,
        existingId: existing.slug,
        matchReason: `Fuzzy match: ${candidate.name} ≈ ${existing.name} (score: ${fuzzy.score.toFixed(2)})`,
        similarityScore: fuzzy.score
      };
    }
  }

  return {
    isDuplicate: false
  };
}

/**
 * Find potential merge candidates (similar but not exact duplicates)
 */
export function findMergeCandidates(
  candidate: Partial<CelebrityCandidate>,
  existingCandidates: Partial<CelebrityCandidate>[]
): Array<{
  candidateId: string;
  similarityScore: number;
  reason: string;
}> {
  const mergeCandidates: Array<{
    candidateId: string;
    similarityScore: number;
    reason: string;
  }> = [];

  for (const existing of existingCandidates) {
    // Skip if already detected as duplicate
    const dupCheck = checkDuplicate(candidate, [existing]);
    if (dupCheck.isDuplicate) {
      continue;
    }

    // Check for similar names (0.75-0.87 threshold)
    const name1 = normalizeName(candidate.name || '');
    const name2 = normalizeName(existing.name || '');
    const nameSimilarity = calculateStringSimilarity(name1, name2);

    if (nameSimilarity >= 0.75 && nameSimilarity < 0.88) {
      mergeCandidates.push({
        candidateId: existing.slug || 'unknown',
        similarityScore: nameSimilarity,
        reason: `Similar name: ${candidate.name} ≈ ${existing.name}`
      });
    }

    // Check for partial external ID matches
    if (candidate.imdb_id && existing.imdb_id) {
      const imdbSimilarity = calculateStringSimilarity(candidate.imdb_id, existing.imdb_id);
      if (imdbSimilarity >= 0.8) {
        mergeCandidates.push({
          candidateId: existing.slug || 'unknown',
          similarityScore: imdbSimilarity,
          reason: `Similar IMDb ID: ${candidate.imdb_id} ≈ ${existing.imdb_id}`
        });
      }
    }
  }

  // Sort by similarity score (highest first)
  return mergeCandidates.sort((a, b) => b.similarityScore - a.similarityScore);
}

/**
 * Merge two candidate profiles (keep best data from both)
 */
export function mergeCandidates(
  primary: Partial<CelebrityCandidate>,
  secondary: Partial<CelebrityCandidate>
): Partial<CelebrityCandidate> {
  return {
    // Keep primary IDs
    ...primary,

    // Merge external IDs (prefer non-null)
    wikidata_qid: primary.wikidata_qid || secondary.wikidata_qid,
    imdb_id: primary.imdb_id || secondary.imdb_id,
    tmdb_id: primary.tmdb_id || secondary.tmdb_id,
    spotify_id: primary.spotify_id || secondary.spotify_id,
    youtube_channel_id: primary.youtube_channel_id || secondary.youtube_channel_id,

    // Prefer better bio
    short_bio: (primary.short_bio && primary.short_bio.length > 50)
      ? primary.short_bio
      : secondary.short_bio || primary.short_bio,

    // Merge known_for
    known_for: [
      ...(primary.known_for || []),
      ...(secondary.known_for || [])
    ].filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 10), // Dedupe, take top 10

    // Use higher popularity score
    popularity_score: Math.max(
      primary.popularity_score || 0,
      secondary.popularity_score || 0
    ),

    // Use higher metrics
    social_followers: Math.max(
      primary.social_followers || 0,
      secondary.social_followers || 0
    ),
    monthly_listeners: Math.max(
      primary.monthly_listeners || 0,
      secondary.monthly_listeners || 0
    ),
    monthly_views: Math.max(
      primary.monthly_views || 0,
      secondary.monthly_views || 0
    ),

    // Prefer primary image, fallback to secondary
    hero_image_url: primary.hero_image_url || secondary.hero_image_url,
    thumbnail_url: primary.thumbnail_url || secondary.thumbnail_url,

    // Merge image sources
    image_sources: [
      ...(primary.image_sources || []),
      ...(secondary.image_sources || [])
    ]
  };
}

export default {
  checkDuplicate,
  findMergeCandidates,
  mergeCandidates,
  calculateStringSimilarity,
  normalizeName
};
