/**
 * Realistic Pricing with All 6 Tiers
 *
 * Pricing Structure:
 * - Physical meetings: 5x multiplier from base
 * - Virtual meetings: 2-3x multiplier from base
 *
 * 6 Price Tiers:
 * 1. Virtual Quick Meet (15min) - 2x base
 * 2. Virtual Standard Meet (30min) - 2.5x base
 * 3. Virtual Premium Meet (60min) - 3x base
 * 4. Physical Quick Meet (15min) - 4x base
 * 5. Physical Standard Meet (30min) - 5x base (main price)
 * 6. Physical Premium Meet (60min) - 6x base
 */

import sequelize from '../../config/database';
import Celebrity from '../../models/Celebrity';

const MEGA_CELEBRITIES = [
  'tom-hanks', 'steven-spielberg', 'paul-mccartney', 'bob-dylan',
  'arnold-schwarzenegger', 'bruce-springsteen', 'martin-scorsese',
  'james-cameron', 'george-lucas', 'robert-de-niro', 'denzel-washington',
  'keanu-reeves', 'johnny-depp', 'stephen-king', 'jackie-chan',
  'emma-watson', 'natalie-portman'
];

const WELL_KNOWN_CELEBRITIES = [
  'peter-jackson', 'barbra-streisand', 'kevin-costner', 'dr-dre',
  'dave-grohl', 'william-shatner', 'cher', 'anthony-hopkins',
  'cate-blanchett', 'gary-oldman', 'steven-seagal', 'chris-rock',
  'patrick-stewart', 'tom-cruise', 'nicolas-cage', 'eddie-murphy',
  'clint-eastwood', 'werner-herzog', 'penelope-cruz', 'mariah-carey',
  'jodie-foster', 'sylvester-stallone', 'al-pacino', 'mel-gibson',
  'josh-brolin', 'dustin-hoffman', 'mark-ruffalo', 'christina-aguilera',
  'sandra-bullock', 'sean-penn', 'bjork', 'spike-lee', 'ben-stiller',
  'whoopi-goldberg', 'richard-gere', 'hugh-laurie', 'demi-moore',
  'moby', 'lindsey-vonn', 'andy-lau', 'tom-delonge', 'bill-hader',
  'jenna-jameson', 'aamir-khan', 'leon-lai', 'john-landis',
  'chris-columbus', 'roland-emmerich'
];

const HIGH_VALUE_MARKETS = ['USA', 'United States', 'UK', 'United Kingdom', 'Los Angeles', 'New York', 'London'];

interface PricingTiers {
  virtual_quick_cents: number;
  virtual_standard_cents: number;
  virtual_premium_cents: number;
  physical_quick_cents: number;
  physical_standard_cents: number;
  physical_premium_cents: number;
}

/**
 * Add virtual pricing columns to database
 */
async function addVirtualPricingColumns(): Promise<void> {
  console.log('🔧 Adding virtual pricing columns to database...\n');

  const queries = [
    `ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS virtual_quick_meet_price_cents INTEGER DEFAULT NULL`,
    `ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS virtual_standard_meet_price_cents INTEGER DEFAULT NULL`,
    `ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS virtual_premium_meet_price_cents INTEGER DEFAULT NULL`
  ];

  for (const query of queries) {
    try {
      await sequelize.query(query);
    } catch (error: any) {
      if (!error.message.includes('already exists')) {
        console.error(`⚠️  Warning:`, error.message);
      }
    }
  }

  console.log('✅ Virtual pricing columns added\n');
}

/**
 * Calculate realistic pricing for all 6 tiers
 */
function calculateRealisticPricing(celebrity: any): PricingTiers {
  const slug = celebrity.username.toLowerCase();
  const location = (celebrity.location || '').toLowerCase();
  const isVerified = celebrity.is_verified;
  const isFeatured = celebrity.is_featured;

  let basePrice: number;

  // Determine base price tier
  if (MEGA_CELEBRITIES.includes(slug)) {
    // Mega celebrities: $50k-$250k base for physical standard
    basePrice = Math.floor(Math.random() * (250000 - 50000) + 50000);
  } else if (WELL_KNOWN_CELEBRITIES.includes(slug)) {
    // Well-known: $10k-$50k base for physical standard
    basePrice = Math.floor(Math.random() * (50000 - 10000) + 10000);
  } else if (isVerified && HIGH_VALUE_MARKETS.some(market => location.includes(market.toLowerCase()))) {
    // Verified + High-value market: $3k-$12k base
    basePrice = Math.floor(Math.random() * (12000 - 3000) + 3000);
  } else if (isVerified) {
    // Verified: $1.5k-$4k base
    basePrice = Math.floor(Math.random() * (4000 - 1500) + 1500);
  } else if (isFeatured) {
    // Featured: $800-$2k base
    basePrice = Math.floor(Math.random() * (2000 - 800) + 800);
  } else if (HIGH_VALUE_MARKETS.some(market => location.includes(market.toLowerCase()))) {
    // High-value market: $500-$1.2k base
    basePrice = Math.floor(Math.random() * (1200 - 500) + 500);
  } else {
    // Default: $250-$750 base
    basePrice = Math.floor(Math.random() * (750 - 250) + 250);
  }

  // Calculate all 6 price tiers based on base price
  // Physical Standard = 5x base (this is our reference point)
  const physicalStandard = basePrice * 5;

  return {
    // Virtual pricing (2x-3x base)
    virtual_quick_cents: Math.floor(basePrice * 2 * 100),      // 15min virtual: 2x
    virtual_standard_cents: Math.floor(basePrice * 2.5 * 100), // 30min virtual: 2.5x
    virtual_premium_cents: Math.floor(basePrice * 3 * 100),    // 60min virtual: 3x

    // Physical pricing (4x-6x base)
    physical_quick_cents: Math.floor(basePrice * 4 * 100),     // 15min physical: 4x
    physical_standard_cents: Math.floor(physicalStandard * 100), // 30min physical: 5x (reference)
    physical_premium_cents: Math.floor(basePrice * 6 * 100)    // 60min physical: 6x
  };
}

/**
 * Main repricing function
 */
async function repriceCelebritiesAllTiers(): Promise<void> {
  const startTime = new Date();

  console.log('🚀 Starting realistic repricing with all 6 tiers...\n');
  console.log('='.repeat(60) + '\n');

  try {
    // Connect to database
    console.log('🔌 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Add virtual pricing columns
    await addVirtualPricingColumns();

    // Fetch all celebrities
    console.log('📥 Fetching celebrities from database...');
    const celebrities = await Celebrity.findAll();
    console.log(`✅ Found ${celebrities.length} celebrities\n`);

    // Reprice in batches
    console.log('💰 Calculating realistic prices for all 6 tiers...\n');
    let updated = 0;
    const batchSize = 100;

    for (let i = 0; i < celebrities.length; i += batchSize) {
      const batch = celebrities.slice(i, i + batchSize);

      console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(celebrities.length / batchSize)}...`);

      for (const celebrity of batch) {
        const pricing = calculateRealisticPricing(celebrity);

        await sequelize.query(`
          UPDATE celebrities
          SET
            virtual_quick_meet_price_cents = ${pricing.virtual_quick_cents},
            virtual_standard_meet_price_cents = ${pricing.virtual_standard_cents},
            virtual_premium_meet_price_cents = ${pricing.virtual_premium_cents},
            quick_meet_price_cents = ${pricing.physical_quick_cents},
            standard_meet_price_cents = ${pricing.physical_standard_cents},
            premium_meet_price_cents = ${pricing.physical_premium_cents}
          WHERE id = '${celebrity.id}'
        `);

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

    // Show top 20 most expensive celebrities (physical standard)
    console.log('💰 Top 20 most expensive celebrities (Physical Standard Meet):');
    const topCelebrities = await Celebrity.findAll({
      attributes: ['display_name', 'standard_meet_price_cents'],
      order: [['standard_meet_price_cents', 'DESC']],
      limit: 20
    });

    topCelebrities.forEach((celeb, idx) => {
      const price = (celeb.standard_meet_price_cents || 0) / 100;
      console.log(`  ${idx + 1}. ${celeb.display_name}: $${price.toLocaleString()}`);
    });

    // Show price statistics for all tiers
    console.log('\n📊 Price Statistics Across All Tiers:\n');

    const tiers = [
      { name: 'Virtual Quick (15min)', column: 'virtual_quick_meet_price_cents' },
      { name: 'Virtual Standard (30min)', column: 'virtual_standard_meet_price_cents' },
      { name: 'Virtual Premium (60min)', column: 'virtual_premium_meet_price_cents' },
      { name: 'Physical Quick (15min)', column: 'quick_meet_price_cents' },
      { name: 'Physical Standard (30min)', column: 'standard_meet_price_cents' },
      { name: 'Physical Premium (60min)', column: 'premium_meet_price_cents' }
    ];

    for (const tier of tiers) {
      const stats = await sequelize.query(`
        SELECT
          MIN(${tier.column}) / 100 as min_price,
          MAX(${tier.column}) / 100 as max_price,
          AVG(${tier.column}) / 100 as avg_price,
          PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY ${tier.column}) / 100 as median_price
        FROM celebrities
        WHERE ${tier.column} > 0
      `, { type: 'SELECT' });

      const priceStats = stats[0] as any;
      console.log(`${tier.name}:`);
      console.log(`  Min: $${Number(priceStats.min_price).toLocaleString()}`);
      console.log(`  Max: $${Number(priceStats.max_price).toLocaleString()}`);
      console.log(`  Avg: $${Number(priceStats.avg_price).toLocaleString()}`);
      console.log(`  Median: $${Number(priceStats.median_price).toLocaleString()}\n`);
    }

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
  repriceCelebritiesAllTiers();
}

export default repriceCelebritiesAllTiers;
