/**
 * Safety & Legal Filters Service
 * Ensures compliance with legal and ethical guidelines
 */

import { SafetyCheckResult } from '../types';
import { MIN_AGE, EXCLUDED_OCCUPATIONS, CONTROVERSIAL_KEYWORDS } from '../config';
import { calculateAge } from './wikidata.service';

/**
 * Check if person is a minor (under 18)
 */
export function checkMinorStatus(birthDate?: string): SafetyCheckResult {
  if (!birthDate) {
    return {
      allowed: true, // Assume adult if no birth date
      flagForReview: true,
      reason: 'No birth date available'
    };
  }

  const age = calculateAge(birthDate);

  if (age === null) {
    return {
      allowed: true,
      flagForReview: true,
      reason: 'Could not calculate age'
    };
  }

  if (age < MIN_AGE) {
    return {
      allowed: false,
      reason: `Minor (age: ${age})`,
      riskLevel: 'high'
    };
  }

  return {
    allowed: true,
    riskLevel: 'low'
  };
}

/**
 * Check if person has excluded occupation
 */
export function checkOccupation(occupations: string[], wikidataOccupations?: string[]): SafetyCheckResult {
  // Check Wikidata occupation QIDs
  if (wikidataOccupations) {
    for (const occupation of wikidataOccupations) {
      if (EXCLUDED_OCCUPATIONS.includes(occupation)) {
        return {
          allowed: false,
          reason: `Excluded occupation: ${occupation}`,
          riskLevel: 'high'
        };
      }
    }
  }

  // Check text occupations
  const excludedTerms = [
    'head of state',
    'president',
    'prime minister',
    'monarch',
    'pope',
    'cardinal',
    'bishop',
    'religious leader',
    'cult leader',
    'dictator'
  ];

  for (const occupation of occupations) {
    const lower = occupation.toLowerCase();

    for (const term of excludedTerms) {
      if (lower.includes(term)) {
        return {
          allowed: false,
          reason: `Excluded occupation: ${occupation}`,
          riskLevel: 'high'
        };
      }
    }
  }

  return {
    allowed: true,
    riskLevel: 'low'
  };
}

/**
 * Check for sanctioned individuals
 * Note: This is a basic check. In production, integrate with OFAC/sanctions databases
 */
export function checkSanctions(name: string, country?: string): SafetyCheckResult {
  // This is a placeholder - in production, query actual sanctions databases
  // For now, just flag certain high-risk countries for review

  const highRiskCountries = [
    'North Korea',
    'Iran',
    'Syria',
    'Cuba',
    'Russia',
    'Belarus',
    'Venezuela',
    'Myanmar'
  ];

  if (country && highRiskCountries.includes(country)) {
    return {
      allowed: true,
      flagForReview: true,
      reason: `High-risk country: ${country}`,
      riskLevel: 'medium'
    };
  }

  return {
    allowed: true,
    riskLevel: 'low'
  };
}

/**
 * Check for controversial content in bio/description
 */
export function checkControversialContent(text: string): SafetyCheckResult {
  const lowerText = text.toLowerCase();

  for (const keyword of CONTROVERSIAL_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      return {
        allowed: true,
        flagForReview: true,
        reason: `Controversial keyword detected: ${keyword}`,
        riskLevel: 'high'
      };
    }
  }

  // Check for additional risk indicators
  const riskIndicators = [
    'scandal',
    'lawsuit',
    'arrested',
    'indicted',
    'controversy',
    'accused',
    'investigation',
    'fraud',
    'embezzlement'
  ];

  let riskCount = 0;
  for (const indicator of riskIndicators) {
    if (lowerText.includes(indicator)) {
      riskCount++;
    }
  }

  if (riskCount >= 3) {
    return {
      allowed: true,
      flagForReview: true,
      reason: `Multiple risk indicators detected (${riskCount})`,
      riskLevel: 'high'
    };
  } else if (riskCount >= 1) {
    return {
      allowed: true,
      flagForReview: true,
      reason: `Risk indicators detected (${riskCount})`,
      riskLevel: 'medium'
    };
  }

  return {
    allowed: true,
    riskLevel: 'low'
  };
}

/**
 * Check if person is deceased (should be filtered earlier, but double-check)
 */
export function checkDeceased(deathDate?: string): SafetyCheckResult {
  if (deathDate) {
    return {
      allowed: false,
      reason: 'Deceased individual',
      riskLevel: 'high'
    };
  }

  return {
    allowed: true,
    riskLevel: 'low'
  };
}

/**
 * Comprehensive safety check
 */
export function performSafetyCheck(data: {
  name: string;
  birthDate?: string;
  deathDate?: string;
  occupations: string[];
  wikidataOccupations?: string[];
  bio?: string;
  country?: string;
}): SafetyCheckResult {
  // Check deceased status
  const deceasedCheck = checkDeceased(data.deathDate);
  if (!deceasedCheck.allowed) {
    return deceasedCheck;
  }

  // Check minor status
  const minorCheck = checkMinorStatus(data.birthDate);
  if (!minorCheck.allowed) {
    return minorCheck;
  }

  // Check occupation
  const occupationCheck = checkOccupation(data.occupations, data.wikidataOccupations);
  if (!occupationCheck.allowed) {
    return occupationCheck;
  }

  // Check sanctions
  const sanctionsCheck = checkSanctions(data.name, data.country);

  // Check controversial content
  const contentCheck = data.bio ? checkControversialContent(data.bio) : { allowed: true, riskLevel: 'low' as const };

  // Aggregate results
  const flagForReview =
    minorCheck.flagForReview ||
    sanctionsCheck.flagForReview ||
    contentCheck.flagForReview;

  const riskLevel: 'low' | 'medium' | 'high' =
    contentCheck.riskLevel === 'high' || sanctionsCheck.riskLevel === 'high'
      ? 'high'
      : contentCheck.riskLevel === 'medium' || sanctionsCheck.riskLevel === 'medium'
      ? 'medium'
      : 'low';

  const reasons: string[] = [];
  if (minorCheck.reason) reasons.push(minorCheck.reason);
  if (sanctionsCheck.reason) reasons.push(sanctionsCheck.reason);
  if (contentCheck.reason) reasons.push(contentCheck.reason);

  return {
    allowed: true,
    flagForReview,
    riskLevel,
    reason: reasons.length > 0 ? reasons.join('; ') : undefined
  };
}

/**
 * Validate bio meets requirements
 */
export function validateBio(bio?: string): {
  valid: boolean;
  reason?: string;
} {
  if (!bio) {
    return { valid: false, reason: 'Bio is missing' };
  }

  // Check length (max 140 chars as per requirements)
  if (bio.length > 140) {
    return { valid: false, reason: `Bio too long (${bio.length} chars, max 140)` };
  }

  // Check for Wikipedia-style content
  if (bio.includes('born') && bio.includes('is a') && bio.length > 100) {
    return { valid: false, reason: 'Bio appears to be Wikipedia dump' };
  }

  // Check for proper commercial tone
  if (bio.toLowerCase().includes('according to') || bio.toLowerCase().includes('cited')) {
    return { valid: false, reason: 'Bio contains academic/reference style content' };
  }

  return { valid: true };
}

/**
 * Determine if profile should be bookable
 */
export function determineBookable(safetyCheck: SafetyCheckResult, activeStatus?: string): boolean {
  // Not bookable if safety check failed
  if (!safetyCheck.allowed) {
    return false;
  }

  // Not bookable if flagged for high-risk review
  if (safetyCheck.flagForReview && safetyCheck.riskLevel === 'high') {
    return false;
  }

  // Not bookable if posthumous
  if (activeStatus === 'Posthumous') {
    return false;
  }

  return true;
}

export default {
  checkMinorStatus,
  checkOccupation,
  checkSanctions,
  checkControversialContent,
  checkDeceased,
  performSafetyCheck,
  validateBio,
  determineBookable
};
