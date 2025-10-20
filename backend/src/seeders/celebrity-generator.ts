/**
 * Celebrity Database Generator
 * Generates 20,000+ celebrities with unique bios, hierarchical categories, and pricing tiers
 */

// Category Taxonomy - User-intuitive (how fans think)
export const CATEGORY_TAXONOMY = {
  'Film & Television': {
    code: 'FTV',
    subcategories: {
      'Hollywood': {
        code: 'HOL',
        niches: ['A-List Stars', 'Action Heroes', 'Comedy Legends', 'Drama Masters', 'Character Actors']
      },
      'International Cinema': {
        code: 'INT',
        niches: ['Bollywood', 'European Cinema', 'Latin American', 'African Cinema', 'Middle Eastern']
      },
      'TV Series': {
        code: 'TVS',
        niches: ['Breaking Bad Cast', 'Friends Cast', 'Game of Thrones Cast', 'The Office Cast', 'Stranger Things Cast']
      },
      'Animation & Voice Acting': {
        code: 'ANI',
        niches: ['Disney Voices', 'Anime Voice Actors', 'Cartoon Legends', 'Video Game Voices']
      },
      'Directors & Producers': {
        code: 'DIR',
        niches: ['Film Directors', 'TV Showrunners', 'Producers', 'Cinematographers']
      }
    }
  },
  'Music': {
    code: 'MUS',
    subcategories: {
      'Pop': {
        code: 'POP',
        niches: ['Pop Icons', 'Teen Pop', 'Dance Pop', 'Indie Pop']
      },
      'Rock': {
        code: 'ROK',
        niches: ['Classic Rock', 'Alternative', 'Punk Rock', 'Metal', 'Indie Rock']
      },
      'Hip-Hop & Rap': {
        code: 'HIP',
        niches: ['Mainstream Rap', 'Underground Hip-Hop', 'Trap', 'Old School']
      },
      'K-Pop': {
        code: 'KPO',
        niches: ['BTS Members', 'BLACKPINK Members', 'Solo Artists', 'K-Pop Groups', 'Producers']
      },
      'Electronic & DJ': {
        code: 'EDM',
        niches: ['EDM Producers', 'House DJs', 'Techno', 'Dubstep']
      },
      'R&B & Soul': {
        code: 'RNB',
        niches: ['Contemporary R&B', 'Neo-Soul', 'Classic Soul']
      },
      'Country': {
        code: 'COU',
        niches: ['Modern Country', 'Classic Country', 'Country Rock']
      },
      'Latin Music': {
        code: 'LAT',
        niches: ['Reggaeton', 'Latin Pop', 'Regional Mexican', 'Salsa']
      },
      'World Music': {
        code: 'WRL',
        niches: ['Afrobeats', 'J-Pop', 'C-Pop', 'Arabic Music', 'Indian Classical']
      }
    }
  },
  'Sports': {
    code: 'SPT',
    subcategories: {
      'Football/Soccer': {
        code: 'SOC',
        niches: ['Premier League', 'La Liga', 'Serie A', 'Champions League Stars', 'World Cup Legends']
      },
      'Basketball': {
        code: 'NBA',
        niches: ['NBA All-Stars', 'NBA Legends', 'WNBA', 'College Basketball']
      },
      'American Football': {
        code: 'NFL',
        niches: ['NFL Quarterbacks', 'NFL Legends', 'College Football']
      },
      'Tennis': {
        code: 'TEN',
        niches: ['Grand Slam Champions', 'ATP Stars', 'WTA Stars']
      },
      'Combat Sports': {
        code: 'COM',
        niches: ['Boxing Champions', 'UFC Fighters', 'Wrestling Legends']
      },
      'Baseball': {
        code: 'MLB',
        niches: ['MLB Stars', 'World Series Champions']
      },
      'Olympics & Athletics': {
        code: 'OLY',
        niches: ['Olympic Gold Medalists', 'Track & Field', 'Swimming', 'Gymnastics']
      },
      'Motorsports': {
        code: 'MOT',
        niches: ['Formula 1', 'NASCAR', 'MotoGP']
      }
    }
  },
  'Digital Creators': {
    code: 'DIG',
    subcategories: {
      'YouTube': {
        code: 'YTB',
        niches: ['Gaming YouTubers', 'Vloggers', 'Comedy Creators', 'Tech Reviewers', 'Beauty Gurus']
      },
      'TikTok': {
        code: 'TIK',
        niches: ['Dance Creators', 'Comedy TikTokers', 'Lifestyle Influencers']
      },
      'Instagram': {
        code: 'IGG',
        niches: ['Lifestyle Influencers', 'Travel Bloggers', 'Fitness Influencers']
      },
      'Gaming & Esports': {
        code: 'GAM',
        niches: ['Twitch Streamers', 'Esports Pro Players', 'Game Developers', 'Content Creators']
      },
      'Podcasters': {
        code: 'POD',
        niches: ['Comedy Podcasts', 'True Crime', 'Business Podcasts', 'Interview Shows']
      }
    }
  },
  'Business & Tech': {
    code: 'BIZ',
    subcategories: {
      'Tech Leaders': {
        code: 'TEC',
        niches: ['CEOs', 'Founders', 'Innovators', 'Engineers']
      },
      'Entrepreneurs': {
        code: 'ENT',
        niches: ['Startup Founders', 'Serial Entrepreneurs', 'E-commerce']
      },
      'Finance': {
        code: 'FIN',
        niches: ['Investors', 'Crypto Leaders', 'Wall Street']
      },
      'Marketing & Media': {
        code: 'MKT',
        niches: ['Marketing Gurus', 'Social Media Experts', 'Brand Strategists']
      }
    }
  },
  'Comedy & Entertainment': {
    code: 'COM',
    subcategories: {
      'Stand-Up Comedy': {
        code: 'STC',
        niches: ['Netflix Specials', 'Comedy Club Legends', 'Roast Masters']
      },
      'Late Night & Talk Shows': {
        code: 'TLK',
        niches: ['Talk Show Hosts', 'Panel Show Stars']
      },
      'Sketch & Improv': {
        code: 'SKT',
        niches: ['SNL Cast', 'Improv Legends', 'Sketch Groups']
      }
    }
  },
  'Fashion & Beauty': {
    code: 'FSH',
    subcategories: {
      'Models': {
        code: 'MOD',
        niches: ['Runway Models', 'Victoria Secret', 'Male Models', 'Plus-Size Models']
      },
      'Fashion Designers': {
        code: 'DES',
        niches: ['Haute Couture', 'Streetwear', 'Sustainable Fashion']
      },
      'Beauty Experts': {
        code: 'BEA',
        niches: ['Makeup Artists', 'Hairstylists', 'Beauty Influencers']
      },
      'Fashion Influencers': {
        code: 'INF',
        niches: ['Style Icons', 'Fashion Bloggers']
      }
    }
  },
  'Authors & Intellectuals': {
    code: 'AUT',
    subcategories: {
      'Fiction Writers': {
        code: 'FIC',
        niches: ['Fantasy Authors', 'Sci-Fi Writers', 'Romance Novelists', 'Mystery Writers']
      },
      'Non-Fiction': {
        code: 'NFC',
        niches: ['Biographers', 'Self-Help Authors', 'Historians', 'Journalists']
      },
      'Academics & Scientists': {
        code: 'SCI',
        niches: ['Astrophysicists', 'Psychologists', 'Educators', 'Researchers']
      },
      'Motivational Speakers': {
        code: 'MOT',
        niches: ['Life Coaches', 'Keynote Speakers', 'Thought Leaders']
      }
    }
  },
  'Reality TV & Lifestyle': {
    code: 'REA',
    subcategories: {
      'Reality Stars': {
        code: 'RTV',
        niches: ['Survivor', 'The Bachelor', 'Real Housewives', 'Love Island']
      },
      'Lifestyle Experts': {
        code: 'LIF',
        niches: ['Chefs & Food', 'Home Design', 'Wellness Coaches']
      }
    }
  },
  'Activism & Leadership': {
    code: 'ACT',
    subcategories: {
      'Social Activists': {
        code: 'SOC',
        niches: ['Environmental', 'Human Rights', 'Political Activists']
      },
      'Political Figures': {
        code: 'POL',
        niches: ['Former Leaders', 'Political Commentators']
      }
    }
  }
};

// Pricing tiers based on fame level (in cents)
export const PRICING_TIERS = {
  'Mega-Star': {
    min: 200000, max: 500000,
    quick_multiplier: 0.5, standard_multiplier: 1.0, premium_multiplier: 1.8
  },
  'A-List': {
    min: 100000, max: 200000,
    quick_multiplier: 0.5, standard_multiplier: 1.0, premium_multiplier: 1.6
  },
  'B-List': {
    min: 50000, max: 100000,
    quick_multiplier: 0.5, standard_multiplier: 1.0, premium_multiplier: 1.5
  },
  'Rising/Niche': {
    min: 10000, max: 50000,
    quick_multiplier: 0.5, standard_multiplier: 1.0, premium_multiplier: 1.4
  }
};

// Geographic distribution
export const LOCATIONS = {
  'North America': ['New York, USA', 'Los Angeles, USA', 'Toronto, Canada', 'Miami, USA', 'Chicago, USA', 'Vancouver, Canada', 'Austin, USA', 'Atlanta, USA'],
  'Europe': ['London, UK', 'Paris, France', 'Berlin, Germany', 'Madrid, Spain', 'Rome, Italy', 'Amsterdam, Netherlands', 'Stockholm, Sweden', 'Dublin, Ireland'],
  'Asia': ['Seoul, South Korea', 'Tokyo, Japan', 'Shanghai, China', 'Mumbai, India', 'Bangkok, Thailand', 'Singapore', 'Hong Kong', 'Manila, Philippines'],
  'Latin America': ['Mexico City, Mexico', 'São Paulo, Brazil', 'Buenos Aires, Argentina', 'Bogotá, Colombia', 'Santiago, Chile', 'Lima, Peru'],
  'Africa': ['Lagos, Nigeria', 'Johannesburg, South Africa', 'Cairo, Egypt', 'Nairobi, Kenya', 'Accra, Ghana'],
  'Middle East': ['Dubai, UAE', 'Tel Aviv, Israel', 'Istanbul, Turkey', 'Riyadh, Saudi Arabia', 'Beirut, Lebanon']
};

// First names database (diverse and global)
export const FIRST_NAMES = {
  male: ['James', 'Michael', 'David', 'John', 'Robert', 'William', 'Chris', 'Alex', 'Daniel', 'Matt', 'Ryan', 'Tom', 'Jake', 'Luke', 'Ben', 'Sam', 'Max', 'Leo', 'Oscar', 'Felix', 'Noah', 'Liam', 'Ethan', 'Mason', 'Lucas', 'Logan', 'Oliver', 'Sebastian', 'Jack', 'Aiden',
    // Asian names
    'Jin', 'Min', 'Tae', 'Joon', 'Hyun', 'Yuki', 'Hiro', 'Ken', 'Ryu', 'Wei', 'Ming', 'Chen', 'Li', 'Raj', 'Arjun', 'Vikram', 'Rohan', 'Amit',
    // Latin names
    'Carlos', 'Diego', 'Luis', 'Miguel', 'Juan', 'Pablo', 'Marco', 'Rafael', 'Javier', 'Fernando',
    // African names
    'Kofi', 'Kwame', 'Chidi', 'Ade', 'Oluwaseun', 'Zuberi', 'Jabari'],
  female: ['Emma', 'Olivia', 'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Abigail', 'Emily', 'Elizabeth', 'Sofia', 'Avery', 'Ella', 'Scarlett', 'Grace', 'Chloe', 'Victoria', 'Riley', 'Aria', 'Luna', 'Lily', 'Hannah', 'Zoe',
    // Asian names
    'Yuki', 'Sakura', 'Hana', 'Mei', 'Ji-woo', 'Soo-jin', 'Min-ji', 'Yuna', 'Priya', 'Aarav', 'Diya', 'Anika',
    // Latin names
    'Maria', 'Sofia', 'Valentina', 'Camila', 'Isabella', 'Lucia', 'Elena', 'Carmen', 'Ana', 'Paula',
    // African names
    'Amara', 'Zara', 'Nala', 'Nia', 'Kaya', 'Aisha', 'Zuri']
};

export const LAST_NAMES = {
  western: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Clark', 'Lewis', 'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Nelson', 'Carter', 'Mitchell'],
  asian: ['Kim', 'Park', 'Lee', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Tanaka', 'Watanabe', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Wang', 'Zhang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao', 'Wu', 'Kumar', 'Singh', 'Sharma', 'Patel', 'Gupta'],
  latin: ['Fernandez', 'Ramirez', 'Torres', 'Rivera', 'Gomez', 'Diaz', 'Cruz', 'Morales', 'Reyes', 'Gutierrez', 'Ortiz', 'Silva', 'Santos', 'Mendoza', 'Vargas'],
  african: ['Okonkwo', 'Adebayo', 'Mensah', 'Nkosi', 'Okafor', 'Mwangi', 'Okeke', 'Eze']
};

// Helper to generate random element from array
function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to generate random number in range
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate celebrity code
function generateCelebrityCode(categoryCode: string, subcategoryCode: string, index: number): string {
  return `${categoryCode}-${subcategoryCode}-${String(index).padStart(4, '0')}`;
}

// Generate unique slug
function generateSlug(firstName: string, lastName: string, suffix?: string): string {
  const base = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`.replace(/[^a-z0-9-]/g, '');
  return suffix ? `${base}-${suffix}` : base;
}

// Generate pricing for celebrity
function generatePricing(tier: keyof typeof PRICING_TIERS) {
  const tierData = PRICING_TIERS[tier];
  const basePrice = randomInt(tierData.min, tierData.max);

  return {
    quick_meet_price_cents: Math.round(basePrice * tierData.quick_multiplier),
    standard_meet_price_cents: basePrice,
    premium_meet_price_cents: Math.round(basePrice * tierData.premium_multiplier)
  };
}

// Generate response time (1-72 hours, weighted toward faster responses for higher tiers)
function generateResponseTime(tier: keyof typeof PRICING_TIERS): number {
  const weights = {
    'Mega-Star': [1, 4],      // 1-4 hours
    'A-List': [2, 12],         // 2-12 hours
    'B-List': [4, 24],         // 4-24 hours
    'Rising/Niche': [6, 72]    // 6-72 hours
  };
  const [min, max] = weights[tier];
  return randomInt(min, max);
}

// Generate review stats
function generateReviews(tier: keyof typeof PRICING_TIERS) {
  const ranges = {
    'Mega-Star': { count: [200, 500], rating: [4.7, 5.0] },
    'A-List': { count: [100, 300], rating: [4.5, 4.9] },
    'B-List': { count: [50, 150], rating: [4.3, 4.8] },
    'Rising/Niche': { count: [10, 100], rating: [4.0, 4.7] }
  };

  const range = ranges[tier];
  return {
    total_reviews: randomInt(range.count[0], range.count[1]),
    average_rating: (Math.random() * (range.rating[1] - range.rating[0]) + range.rating[0]).toFixed(2)
  };
}

export { randomElement, randomInt, generateCelebrityCode, generateSlug, generatePricing, generateResponseTime, generateReviews };
