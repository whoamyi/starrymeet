import { Celebrity } from '../models';

const CELEBRITIES_DATA = [
  // Hollywood
  { username: 'emmawatson', display_name: 'Emma Watson', category: 'Hollywood', location: 'London, UK', quick_meet_price_cents: 150000, standard_meet_price_cents: 300000, premium_meet_price_cents: 500000, average_rating: 4.9, total_reviews: 128, is_featured: true },
  { username: 'chrishemsworth', display_name: 'Chris Hemsworth', category: 'Hollywood', location: 'Sydney, Australia', quick_meet_price_cents: 225000, standard_meet_price_cents: 450000, premium_meet_price_cents: 750000, average_rating: 4.8, total_reviews: 95, is_featured: true },
  { username: 'zendaya', display_name: 'Zendaya', category: 'Hollywood', location: 'Los Angeles, USA', quick_meet_price_cents: 180000, standard_meet_price_cents: 360000, premium_meet_price_cents: 600000, average_rating: 4.9, total_reviews: 156, is_featured: true },
  { username: 'tomholland', display_name: 'Tom Holland', category: 'Hollywood', location: 'New York, USA', quick_meet_price_cents: 165000, standard_meet_price_cents: 330000, premium_meet_price_cents: 550000, average_rating: 4.7, total_reviews: 89 },
  { username: 'margotrobbie', display_name: 'Margot Robbie', category: 'Hollywood', location: 'Sydney, Australia', quick_meet_price_cents: 195000, standard_meet_price_cents: 390000, premium_meet_price_cents: 650000, average_rating: 4.8, total_reviews: 112, is_featured: true },
  { username: 'ryanreynolds', display_name: 'Ryan Reynolds', category: 'Hollywood', location: 'Vancouver, Canada', quick_meet_price_cents: 240000, standard_meet_price_cents: 480000, premium_meet_price_cents: 800000, average_rating: 4.9, total_reviews: 143 },
  { username: 'scarlettjohansson', display_name: 'Scarlett Johansson', category: 'Hollywood', location: 'New York, USA', quick_meet_price_cents: 210000, standard_meet_price_cents: 420000, premium_meet_price_cents: 700000, average_rating: 4.7, total_reviews: 98 },
  { username: 'timotheechalamet', display_name: 'Timothée Chalamet', category: 'Hollywood', location: 'Paris, France', quick_meet_price_cents: 165000, standard_meet_price_cents: 330000, premium_meet_price_cents: 550000, average_rating: 4.8, total_reviews: 134, is_featured: true },
  { username: 'florencepugh', display_name: 'Florence Pugh', category: 'Hollywood', location: 'London, UK', quick_meet_price_cents: 135000, standard_meet_price_cents: 270000, premium_meet_price_cents: 450000, average_rating: 4.6, total_reviews: 76 },
  { username: 'michaelbjordan', display_name: 'Michael B. Jordan', category: 'Hollywood', location: 'Atlanta, USA', quick_meet_price_cents: 180000, standard_meet_price_cents: 360000, premium_meet_price_cents: 600000, average_rating: 4.8, total_reviews: 102 },
  { username: 'therock', display_name: 'Dwayne Johnson', category: 'Hollywood', location: 'Miami, USA', quick_meet_price_cents: 450000, standard_meet_price_cents: 900000, premium_meet_price_cents: 1500000, average_rating: 4.9, total_reviews: 211, is_featured: true },
  { username: 'galgadot', display_name: 'Gal Gadot', category: 'Hollywood', location: 'Tel Aviv, Israel', quick_meet_price_cents: 210000, standard_meet_price_cents: 420000, premium_meet_price_cents: 700000, average_rating: 4.7, total_reviews: 87 },
  { username: 'robertdowneyjr', display_name: 'Robert Downey Jr.', category: 'Hollywood', location: 'Los Angeles, USA', quick_meet_price_cents: 360000, standard_meet_price_cents: 720000, premium_meet_price_cents: 1200000, average_rating: 4.9, total_reviews: 178 },
  { username: 'jenniferlawrence', display_name: 'Jennifer Lawrence', category: 'Hollywood', location: 'New York, USA', quick_meet_price_cents: 255000, standard_meet_price_cents: 510000, premium_meet_price_cents: 850000, average_rating: 4.8, total_reviews: 145 },
  { username: 'bradpitt', display_name: 'Brad Pitt', category: 'Hollywood', location: 'Los Angeles, USA', quick_meet_price_cents: 300000, standard_meet_price_cents: 600000, premium_meet_price_cents: 1000000, average_rating: 4.9, total_reviews: 198 },

  // K-Drama Stars
  { username: 'parkseojoon', display_name: 'Park Seo-joon', category: 'K-Drama', location: 'Seoul, South Korea', quick_meet_price_cents: 120000, standard_meet_price_cents: 240000, premium_meet_price_cents: 400000, average_rating: 4.8, total_reviews: 203, is_featured: true },
  { username: 'songhyekyo', display_name: 'Song Hye-kyo', category: 'K-Drama', location: 'Seoul, South Korea', quick_meet_price_cents: 135000, standard_meet_price_cents: 270000, premium_meet_price_cents: 450000, average_rating: 4.7, total_reviews: 167 },
  { username: 'leeminho', display_name: 'Lee Min-ho', category: 'K-Drama', location: 'Seoul, South Korea', quick_meet_price_cents: 150000, standard_meet_price_cents: 300000, premium_meet_price_cents: 500000, average_rating: 4.9, total_reviews: 234, is_featured: true },
  { username: 'iu', display_name: 'IU (Lee Ji-eun)', category: 'K-Drama', location: 'Seoul, South Korea', quick_meet_price_cents: 180000, standard_meet_price_cents: 360000, premium_meet_price_cents: 600000, average_rating: 4.9, total_reviews: 289, is_featured: true },
  { username: 'kimsoohyun', display_name: 'Kim Soo-hyun', category: 'K-Drama', location: 'Seoul, South Korea', quick_meet_price_cents: 165000, standard_meet_price_cents: 330000, premium_meet_price_cents: 550000, average_rating: 4.8, total_reviews: 198 },

  // Business Leaders
  { username: 'elonmusk', display_name: 'Elon Musk', category: 'Business', location: 'San Francisco, USA', quick_meet_price_cents: 1500000, standard_meet_price_cents: 3000000, premium_meet_price_cents: 5000000, average_rating: 4.6, total_reviews: 67, is_featured: true },
  { username: 'jeffbezos', display_name: 'Jeff Bezos', category: 'Business', location: 'Seattle, USA', quick_meet_price_cents: 1350000, standard_meet_price_cents: 2700000, premium_meet_price_cents: 4500000, average_rating: 4.5, total_reviews: 45 },
  { username: 'billgates', display_name: 'Bill Gates', category: 'Business', location: 'Seattle, USA', quick_meet_price_cents: 1200000, standard_meet_price_cents: 2400000, premium_meet_price_cents: 4000000, average_rating: 4.7, total_reviews: 89 },
  { username: 'markzuckerberg', display_name: 'Mark Zuckerberg', category: 'Business', location: 'Palo Alto, USA', quick_meet_price_cents: 1050000, standard_meet_price_cents: 2100000, premium_meet_price_cents: 3500000, average_rating: 4.3, total_reviews: 54 },
  { username: 'oprah', display_name: 'Oprah Winfrey', category: 'Business', location: 'Chicago, USA', quick_meet_price_cents: 900000, standard_meet_price_cents: 1800000, premium_meet_price_cents: 3000000, average_rating: 4.9, total_reviews: 156, is_featured: true },

  // Athletes
  { username: 'cristiano', display_name: 'Cristiano Ronaldo', category: 'Athletes', location: 'Riyadh, Saudi Arabia', quick_meet_price_cents: 750000, standard_meet_price_cents: 1500000, premium_meet_price_cents: 2500000, average_rating: 4.9, total_reviews: 312, is_featured: true },
  { username: 'leomessi', display_name: 'Lionel Messi', category: 'Athletes', location: 'Miami, USA', quick_meet_price_cents: 900000, standard_meet_price_cents: 1800000, premium_meet_price_cents: 3000000, average_rating: 4.9, total_reviews: 398, is_featured: true },
  { username: 'kingjames', display_name: 'LeBron James', category: 'Athletes', location: 'Los Angeles, USA', quick_meet_price_cents: 600000, standard_meet_price_cents: 1200000, premium_meet_price_cents: 2000000, average_rating: 4.8, total_reviews: 267, is_featured: true },
  { username: 'serenawilliams', display_name: 'Serena Williams', category: 'Athletes', location: 'Miami, USA', quick_meet_price_cents: 540000, standard_meet_price_cents: 1080000, premium_meet_price_cents: 1800000, average_rating: 4.8, total_reviews: 189 },
  { username: 'tombrady', display_name: 'Tom Brady', category: 'Athletes', location: 'Tampa, USA', quick_meet_price_cents: 660000, standard_meet_price_cents: 1320000, premium_meet_price_cents: 2200000, average_rating: 4.7, total_reviews: 201 },

  // Musicians
  { username: 'taylorswift', display_name: 'Taylor Swift', category: 'Musicians', location: 'Nashville, USA', quick_meet_price_cents: 600000, standard_meet_price_cents: 1200000, premium_meet_price_cents: 2000000, average_rating: 4.9, total_reviews: 421, is_featured: true },
  { username: 'beyonce', display_name: 'Beyoncé', category: 'Musicians', location: 'Houston, USA', quick_meet_price_cents: 750000, standard_meet_price_cents: 1500000, premium_meet_price_cents: 2500000, average_rating: 4.9, total_reviews: 378, is_featured: true },
  { username: 'edsheeran', display_name: 'Ed Sheeran', category: 'Musicians', location: 'London, UK', quick_meet_price_cents: 450000, standard_meet_price_cents: 900000, premium_meet_price_cents: 1500000, average_rating: 4.8, total_reviews: 256 },
  { username: 'arianagrande', display_name: 'Ariana Grande', category: 'Musicians', location: 'Los Angeles, USA', quick_meet_price_cents: 540000, standard_meet_price_cents: 1080000, premium_meet_price_cents: 1800000, average_rating: 4.9, total_reviews: 334, is_featured: true },
  { username: 'bts', display_name: 'BTS (Group)', category: 'Musicians', location: 'Seoul, South Korea', quick_meet_price_cents: 1050000, standard_meet_price_cents: 2100000, premium_meet_price_cents: 3500000, average_rating: 4.9, total_reviews: 567, is_featured: true }
];

export async function seedCelebrities() {
  try {
    console.log('🌱 Seeding celebrities...');

    // Check if celebrities already exist
    const count = await Celebrity.count();
    if (count > 0) {
      console.log(`ℹ️  Database already has ${count} celebrities. Skipping seed.`);
      return;
    }

    // Create all celebrities
    await Celebrity.bulkCreate(
      CELEBRITIES_DATA.map(celeb => ({
        ...celeb,
        bio: `Verified celebrity profile for ${celeb.display_name}. Book a meeting for an unforgettable experience!`,
        is_verified: true,
        is_active: true
      }))
    );

    console.log(`✅ Successfully seeded ${CELEBRITIES_DATA.length} celebrities`);
  } catch (error) {
    console.error('❌ Error seeding celebrities:', error);
    throw error;
  }
}
