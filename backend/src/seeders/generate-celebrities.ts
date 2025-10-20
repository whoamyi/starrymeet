/**
 * Main Celebrity Generator
 * Generates 20,000+ celebrities with complete data
 */

import {
  CATEGORY_TAXONOMY,
  LOCATIONS,
  FIRST_NAMES,
  LAST_NAMES,
  randomElement,
  randomInt,
  generateCelebrityCode,
  generateSlug,
  generatePricing,
  generateResponseTime,
  generateReviews
} from './celebrity-generator';
import { generateBio } from './bio-generator';

interface CelebrityRecord {
  username: string;
  display_name: string;
  celebrity_code: string;
  category: string;
  subcategory: string;
  niche_category: string;
  bio: string;
  location: string;
  quick_meet_price_cents: number;
  standard_meet_price_cents: number;
  premium_meet_price_cents: number;
  response_time_hours: number;
  average_rating: number;
  total_reviews: number;
  is_verified: boolean;
  is_active: boolean;
  is_featured: boolean;
}

// Distribution of celebrities per niche (increased to reach 20,000+)
const DISTRIBUTION_PER_NICHE = {
  'Mega-Star': 5,
  'A-List': 15,
  'B-List': 40,
  'Rising/Niche': 70
};

// Get all location regions as flat array
function getAllLocations(): string[] {
  return Object.values(LOCATIONS).flat();
}

// Get location based on category (some categories have geographic preferences)
function getLocationForCategory(category: string, subcategory: string): string {
  const allLocs = getAllLocations();

  // Category-specific location preferences
  if (category === 'Music') {
    if (subcategory.includes('K-Pop') || subcategory.includes('J-Pop') || subcategory.includes('C-Pop')) {
      return randomElement(LOCATIONS['Asia']);
    }
    if (subcategory.includes('Latin')) {
      return randomElement(LOCATIONS['Latin America']);
    }
    if (subcategory.includes('Afro')) {
      return randomElement(LOCATIONS['Africa']);
    }
  }

  if (category === 'Film & Television') {
    if (subcategory.includes('Bollywood')) {
      return 'Mumbai, India';
    }
    if (subcategory.includes('Hollywood')) {
      return randomElement(['Los Angeles, USA', 'New York, USA']);
    }
  }

  if (category === 'Sports') {
    if (subcategory.includes('Soccer') || subcategory.includes('Football')) {
      return randomElement([...LOCATIONS['Europe'], ...LOCATIONS['Latin America']]);
    }
  }

  // Default: random from all locations
  return randomElement(allLocs);
}

// Get name based on location/region
function generateName(location: string): { firstName: string; lastName: string; gender: 'male' | 'female' } {
  const gender = randomElement(['male', 'female'] as const);

  // Determine name pool based on location
  let firstNamePool = FIRST_NAMES[gender];
  let lastNamePool: string[];

  if (location.includes('Seoul') || location.includes('Tokyo') || location.includes('Shanghai') ||
      location.includes('Mumbai') || location.includes('Bangkok') || location.includes('Hong Kong') ||
      location.includes('Manila') || location.includes('Singapore')) {
    lastNamePool = LAST_NAMES.asian;
  } else if (location.includes('Mexico') || location.includes('São Paulo') || location.includes('Buenos Aires') ||
             location.includes('Bogotá') || location.includes('Santiago') || location.includes('Lima')) {
    lastNamePool = LAST_NAMES.latin;
  } else if (location.includes('Lagos') || location.includes('Johannesburg') || location.includes('Accra') ||
             location.includes('Nairobi')) {
    lastNamePool = LAST_NAMES.african;
  } else {
    lastNamePool = LAST_NAMES.western;
  }

  return {
    firstName: randomElement(firstNamePool),
    lastName: randomElement(lastNamePool),
    gender
  };
}

// Generate celebrities for a specific niche
function generateCelebritiesForNiche(
  category: string,
  categoryCode: string,
  subcategory: string,
  subcategoryCode: string,
  niche: string,
  nicheIndex: number,
  existingSlugs: Set<string>,
  globalCounter: { value: number }
): CelebrityRecord[] {
  const celebrities: CelebrityRecord[] = [];

  // Generate celebrities for each tier
  for (const [tier, count] of Object.entries(DISTRIBUTION_PER_NICHE)) {
    for (let i = 0; i < count; i++) {
      globalCounter.value++;

      // Get location
      const location = getLocationForCategory(category, subcategory);

      // Generate name
      const { firstName, lastName } = generateName(location);

      // Generate unique slug
      let slug = generateSlug(firstName, lastName);
      let slugAttempt = 0;
      while (existingSlugs.has(slug) && slugAttempt < 100) {
        slug = generateSlug(firstName, lastName, String(randomInt(1, 9999)));
        slugAttempt++;
      }
      existingSlugs.add(slug);

      // Generate celebrity code using global counter
      const celebrityCode = generateCelebrityCode(categoryCode, subcategoryCode, globalCounter.value);

      // Generate pricing
      const pricing = generatePricing(tier as keyof typeof DISTRIBUTION_PER_NICHE);

      // Generate reviews
      const reviews = generateReviews(tier as keyof typeof DISTRIBUTION_PER_NICHE);

      // Generate response time
      const responseTime = generateResponseTime(tier as keyof typeof DISTRIBUTION_PER_NICHE);

      // Generate bio
      const bio = generateBio({
        firstName,
        lastName,
        category,
        subcategory,
        tier,
        location
      });

      // Determine if featured (only top tier)
      const isFeatured = tier === 'Mega-Star' && randomInt(1, 100) > 30;

      celebrities.push({
        username: slug,
        display_name: `${firstName} ${lastName}`,
        celebrity_code: celebrityCode,
        category,
        subcategory,
        niche_category: niche,
        bio,
        location,
        ...pricing,
        response_time_hours: responseTime,
        average_rating: parseFloat(reviews.average_rating),
        total_reviews: reviews.total_reviews,
        is_verified: tier === 'Mega-Star' || tier === 'A-List' || randomInt(1, 100) > 50,
        is_active: true,
        is_featured: isFeatured
      });
    }
  }

  return celebrities;
}

/**
 * Generate all celebrities
 */
export function generateAllCelebrities(): CelebrityRecord[] {
  console.log('🌟 Starting celebrity generation...');

  const allCelebrities: CelebrityRecord[] = [];
  const existingSlugs = new Set<string>();
  let nicheIndex = 0;
  const globalCounter = { value: 0 };

  // Iterate through category taxonomy
  for (const [category, categoryData] of Object.entries(CATEGORY_TAXONOMY)) {
    console.log(`📂 Generating ${category}...`);

    for (const [subcategory, subcategoryData] of Object.entries(categoryData.subcategories)) {
      console.log(`  📁 ${subcategory}...`);

      for (const niche of subcategoryData.niches) {
        nicheIndex++;

        const celebrities = generateCelebritiesForNiche(
          category,
          categoryData.code,
          subcategory,
          subcategoryData.code,
          niche,
          nicheIndex,
          existingSlugs,
          globalCounter
        );

        allCelebrities.push(...celebrities);

        console.log(`    ✓ Generated ${celebrities.length} celebrities for "${niche}"`);
      }
    }
  }

  console.log(`\n✅ Total celebrities generated: ${allCelebrities.length}`);
  console.log(`📊 Breakdown by tier:`);

  // Count by tier
  const tierCounts = allCelebrities.reduce((acc, celeb) => {
    const tier =
      celeb.standard_meet_price_cents >= 200000 ? 'Mega-Star' :
      celeb.standard_meet_price_cents >= 100000 ? 'A-List' :
      celeb.standard_meet_price_cents >= 50000 ? 'B-List' : 'Rising/Niche';
    acc[tier] = (acc[tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(tierCounts).forEach(([tier, count]) => {
    console.log(`   ${tier}: ${count}`);
  });

  return allCelebrities;
}

/**
 * Export as SQL seed file
 */
export function generateSQLSeed(celebrities: CelebrityRecord[]): string {
  const values: string[] = [];

  celebrities.forEach((celeb) => {
    const escapedBio = celeb.bio.replace(/'/g, "''");
    const escapedName = celeb.display_name.replace(/'/g, "''");

    values.push(`(
  gen_random_uuid(),
  '${celeb.username}',
  '${escapedName}',
  '${celeb.celebrity_code}',
  '${celeb.category}',
  '${celeb.subcategory}',
  '${celeb.niche_category}',
  '${escapedBio}',
  '${celeb.location}',
  ${celeb.quick_meet_price_cents},
  ${celeb.standard_meet_price_cents},
  ${celeb.premium_meet_price_cents},
  ${celeb.response_time_hours},
  ${celeb.average_rating},
  ${celeb.total_reviews},
  ${celeb.is_verified},
  ${celeb.is_active},
  ${celeb.is_featured},
  NOW(),
  NOW()
)`);
  });

  const sql = `
-- Celebrity Database Seed
-- Generated: ${new Date().toISOString()}
-- Total Celebrities: ${celebrities.length}

-- Ensure uuid-ossp extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clear existing data (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE celebrities CASCADE;

-- Insert celebrities
INSERT INTO celebrities (
  id,
  username,
  display_name,
  celebrity_code,
  category,
  subcategory,
  niche_category,
  bio,
  location,
  quick_meet_price_cents,
  standard_meet_price_cents,
  premium_meet_price_cents,
  response_time_hours,
  average_rating,
  total_reviews,
  is_verified,
  is_active,
  is_featured,
  created_at,
  updated_at
) VALUES
${values.join(',\n')}
ON CONFLICT (username) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_celebrities_category ON celebrities(category);
CREATE INDEX IF NOT EXISTS idx_celebrities_subcategory ON celebrities(subcategory);
CREATE INDEX IF NOT EXISTS idx_celebrities_niche ON celebrities(niche_category);
CREATE INDEX IF NOT EXISTS idx_celebrities_code ON celebrities(celebrity_code);
CREATE INDEX IF NOT EXISTS idx_celebrities_featured ON celebrities(is_featured);
CREATE INDEX IF NOT EXISTS idx_celebrities_price ON celebrities(standard_meet_price_cents);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Successfully seeded % celebrities!', (SELECT COUNT(*) FROM celebrities);
END $$;
`;

  return sql;
}

// Run if executed directly
if (require.main === module) {
  const celebrities = generateAllCelebrities();

  const sql = generateSQLSeed(celebrities);

  // Write to file
  const fs = require('fs');
  const path = require('path');

  const outputPath = path.join(__dirname, '../../database/seeds/celebrities-comprehensive.sql');

  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, sql, 'utf8');

  console.log(`\n📝 SQL seed file written to: ${outputPath}`);
  console.log(`📦 File size: ${(sql.length / 1024 / 1024).toFixed(2)} MB`);
}

export default generateAllCelebrities;
