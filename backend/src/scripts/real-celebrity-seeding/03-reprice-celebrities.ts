/**
 * Quick Repricing Script
 * Recalculates prices for already-imported celebrities
 * Uses heuristics based on existing data instead of missing API metrics
 */

import sequelize from '../../config/database';
import Celebrity from '../../models/Celebrity';
import { PriceTier } from './types';

/**
 * Heuristic-based pricing tiers
 * Since API metrics are missing, use what we have:
 * - is_verified (has TMDB/Spotify data)
 * - known names (hardcoded list of A-listers)
 * - location (major markets)
 * - category (some are more valuable)
 */

const WELL_KNOWN_CELEBRITIES = [
  'tom-hanks', 'arnold-schwarzenegger', 'steven-spielberg', 'paul-mccartney',
  'bruce-springsteen', 'bob-dylan', 'peter-jackson', 'barbra-streisand',
  'kevin-costner', 'dr-dre', 'dave-grohl', 'william-shatner', 'cher',
  'anthony-hopkins', 'cate-blanchett', 'gary-oldman', 'steven-seagal',
  'chris-rock', 'patrick-stewart', 'tom-cruise', 'nicolas-cage',
  'robert-de-niro', 'emma-watson', 'keanu-reeves', 'denzel-washington',
  'eddie-murphy', 'martin-scorsese', 'james-cameron', 'stephen-king',
  'natalie-portman', 'clint-eastwood', 'werner-herzog', 'george-lucas',
  'penelope-cruz', 'bud-cort', 'john-cale', 'richard-linklater',
  'mariah-carey', 'jodie-foster', 'julie-bowen', 'sylvester-stallone',
  'johnny-depp', 'al-pacino', 'mel-gibson', 'josh-brolin',
  'dustin-hoffman', 'mark-ruffalo', 'christina-aguilera', 'sandra-bullock',
  'jackie-chan', 'sean-penn', 'bjork', 'roman-polanski', 'spike-lee',
  'james-ivory', 'ben-stiller', 'dario-argento', 'whoopi-goldberg',
  'richard-gere', 'hugh-laurie', 'm-night-shyamalan', 'matt-stone',
  'kevin-james', 'demi-moore', 'trey-parker', 'peter-handke',
  'moby', 'lindsey-vonn', 'andy-lau', 'tom-delonge', 'bill-hader',
  'jenna-jameson', 'aamir-khan', 'leon-lai', 'john-landis',
  'chris-columbus', 'roland-emmerich'
];

const MEGA_CELEBRITIES = [
  'tom-hanks', 'steven-spielberg', 'paul-mccartney', 'bob-dylan',
  'arnold-schwarzenegger', 'bruce-springsteen', 'martin-scorsese',
  'james-cameron', 'george-lucas', 'robert-de-niro', 'denzel-washington',
  'keanu-reeves', 'johnny-depp', 'stephen-king', 'jackie-chan',
  'emma-watson', 'natalie-portman'
];

const HIGH_VALUE_MARKETS = ['USA', 'United States', 'UK', 'United Kingdom', 'Los Angeles', 'New York', 'London'];

interface PricingResult {
  tier: PriceTier;
  price_cents: number;
}

/**
 * Calculate price based on heuristics
 */
function calculateHeuristicPrice(celebrity: any): PricingResult {
  const slug = celebrity.username.toLowerCase();
  const location = (celebrity.location || '').toLowerCase();
  const isVerified = celebrity.is_verified;
  const isFeatured = celebrity.is_featured;

  // Mega celebrities (A+ tier) - $10,000+
  if (MEGA_CELEBRITIES.includes(slug)) {
    return {
      tier: 'Exclusive',
      price_cents: Math.floor(Math.random() * (20000 - 10000) + 10000) * 100 // $10k-$20k
    };
  }

  // Well-known celebrities (A tier) - $2,000-$8,000
  if (WELL_KNOWN_CELEBRITIES.includes(slug)) {
    return {
      tier: 'Elite',
      price_cents: Math.floor(Math.random() * (8000 - 2000) + 2000) * 100
    };
  }

  // Verified + High-value market (B tier) - $800-$2,000
  if (isVerified && HIGH_VALUE_MARKETS.some(market => location.includes(market.toLowerCase()))) {
    return {
      tier: 'A-Lister',
      price_cents: Math.floor(Math.random() * (2000 - 800) + 800) * 100
    };
  }

  // Verified (C tier) - $300-$800
  if (isVerified) {
    return {
      tier: 'B-Lister',
      price_cents: Math.floor(Math.random() * (800 - 300) + 300) * 100
    };
  }

  // Featured (D tier) - $150-$300
  if (isFeatured) {
    return {
      tier: 'C-Lister',
      price_cents: Math.floor(Math.random() * (300 - 150) + 150) * 100
    };
  }

  // High-value market (Rising) - $100-$200
  if (HIGH_VALUE_MARKETS.some(market => location.includes(market.toLowerCase()))) {
    return {
      tier: 'Rising',
      price_cents: Math.floor(Math.random() * (200 - 100) + 100) * 100
    };
  }

  // Default (Emerging) - $50-$150
  return {
    tier: 'Emerging',
    price_cents: Math.floor(Math.random() * (150 - 50) + 50) * 100
  };
}

/**
 * Reprice all celebrities in database
 */
async function repriceCelebrities(): Promise<void> {
  const startTime = new Date();

  console.log('🔄 Starting celebrity repricing...\n');

  try {
    // Connect to database
    console.log('🔌 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Fetch all celebrities
    console.log('📥 Fetching celebrities from database...');
    const celebrities = await Celebrity.findAll();
    console.log(`✅ Found ${celebrities.length} celebrities\n`);

    // Reprice in batches
    let updated = 0;
    const batchSize = 100;

    for (let i = 0; i < celebrities.length; i += batchSize) {
      const batch = celebrities.slice(i, i + batchSize);

      console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(celebrities.length / batchSize)}...`);

      for (const celebrity of batch) {
        const pricing = calculateHeuristicPrice(celebrity);

        await celebrity.update({
          standard_meet_price_cents: pricing.price_cents
        });

        updated++;
      }

      console.log(`  ✅ Updated ${updated}/${celebrities.length} celebrities`);
    }

    const endTime = new Date();
    const durationSeconds = (endTime.getTime() - startTime.getTime()) / 1000;

    console.log('\n' + '='.repeat(60));
    console.log('✅ REPRICING COMPLETE!');
    console.log('='.repeat(60));
    console.log(`⏱️  Duration: ${durationSeconds.toFixed(1)} seconds`);
    console.log(`📊 Total updated: ${updated} celebrities`);
    console.log('='.repeat(60) + '\n');

    // Show price distribution
    console.log('💰 Sample price distribution:');
    const samples = await Celebrity.findAll({
      attributes: ['display_name', 'standard_meet_price_cents'],
      order: [['standard_meet_price_cents', 'DESC']],
      limit: 20
    });

    samples.forEach((celeb, idx) => {
      const price = (celeb.standard_meet_price_cents || 0) / 100;
      console.log(`  ${idx + 1}. ${celeb.display_name}: $${price.toLocaleString()}`);
    });

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run if executed directly
if (require.main === module) {
  repriceCelebrities();
}

export default repriceCelebrities;
