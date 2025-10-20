/**
 * Bio Generation System
 * Creates unique 50-150 word bios for celebrities based on their category and achievements
 */

import { randomElement, randomInt } from './celebrity-generator';

// Achievement templates by category
const ACHIEVEMENTS = {
  'Film & Television': {
    awards: ['Academy Award', 'Golden Globe', 'Emmy Award', 'BAFTA', 'SAG Award', 'Critics Choice Award', 'Independent Spirit Award'],
    works: ['blockbuster films', 'critically acclaimed series', 'independent cinema', 'streaming hits', 'award-winning performances'],
    descriptions: ['captivated audiences worldwide', 'delivered unforgettable performances', 'transformed the industry', 'brought complex characters to life', 'redefined storytelling', 'became a household name'],
    specialties: ['dramatic range', 'comedic timing', 'action sequences', 'method acting', 'character depth', 'versatility']
  },
  'Music': {
    awards: ['Grammy Award', 'Billboard Music Award', 'MTV VMA', 'American Music Award', 'Brit Award', 'BET Award', 'Latin Grammy'],
    works: ['chart-topping albums', 'platinum records', 'sold-out world tours', 'viral hits', 'groundbreaking collaborations'],
    descriptions: ['dominated the charts', 'revolutionized the genre', 'inspired millions', 'broke streaming records', 'created anthems', 'shaped modern music'],
    specialties: ['vocal prowess', 'songwriting genius', 'stage presence', 'production skills', 'lyrical depth', 'genre fusion']
  },
  'Sports': {
    awards: ['Championship titles', 'MVP awards', 'All-Star selections', 'Hall of Fame induction', 'Olympic medals', 'World Cup victories'],
    works: ['record-breaking performances', 'legendary matches', 'historic seasons', 'comeback victories', 'championship runs'],
    descriptions: ['dominated the sport', 'redefined excellence', 'inspired generations', 'broke multiple records', 'led teams to victory', 'became a legend'],
    specialties: ['athletic excellence', 'leadership', 'clutch performances', 'technical mastery', 'competitive spirit', 'dedication']
  },
  'Digital Creators': {
    awards: ['Streamy Award', 'Shorty Award', 'Webby Award', 'Creator of the Year', 'Platform milestones'],
    works: ['viral content', 'millions of followers', 'brand partnerships', 'original series', 'trendsetting posts'],
    descriptions: ['built a massive following', 'revolutionized digital content', 'engaged global audiences', 'set viral trends', 'created authentic connections', 'pioneered new formats'],
    specialties: ['content creation', 'audience engagement', 'brand building', 'storytelling', 'authenticity', 'creativity']
  },
  'Business & Tech': {
    awards: ['Forbes recognition', 'Industry awards', 'Innovation prizes', 'Business Person of the Year', 'Tech Pioneer awards'],
    works: ['successful ventures', 'industry disruption', 'groundbreaking innovations', 'market leadership', 'transformative products'],
    descriptions: ['transformed industries', 'pioneered innovation', 'built billion-dollar companies', 'disrupted markets', 'shaped the future', 'led revolutions'],
    specialties: ['strategic vision', 'innovation', 'leadership', 'execution', 'market insight', 'transformation']
  },
  'Comedy & Entertainment': {
    awards: ['Emmy Award', 'Comedy Central recognition', 'Netflix specials', 'Stand-up awards', 'Late night hosting'],
    works: ['sold-out shows', 'viral sketches', 'streaming specials', 'comedy albums', 'roast performances'],
    descriptions: ['made audiences roar with laughter', 'became a comedy icon', 'perfected the craft', 'tackled important issues with humor', 'built a comedy empire'],
    specialties: ['timing', 'storytelling', 'observational humor', 'satire', 'improvisation', 'relatability']
  },
  'Fashion & Beauty': {
    awards: ['CFDA Award', 'Fashion Icon Award', 'Model of the Year', 'Designer of the Year', 'Beauty Innovation Award'],
    works: ['runway shows', 'major campaigns', 'fashion weeks', 'brand collaborations', 'trendsetting collections'],
    descriptions: ['defined fashion trends', 'graced countless covers', 'revolutionized style', 'became a global icon', 'set beauty standards', 'inspired millions'],
    specialties: ['signature style', 'versatility', 'innovation', 'trendsetting', 'elegance', 'bold vision']
  },
  'Authors & Intellectuals': {
    awards: ['Pulitzer Prize', 'National Book Award', 'Booker Prize', 'Nobel Prize', 'bestseller status', 'Literary honors'],
    works: ['bestselling books', 'groundbreaking research', 'influential papers', 'acclaimed publications', 'thought-provoking works'],
    descriptions: ['shaped public discourse', 'challenged conventional thinking', 'educated millions', 'pioneered new ideas', 'became a thought leader'],
    specialties: ['insightful analysis', 'compelling narratives', 'research excellence', 'clear communication', 'expertise', 'wisdom']
  },
  'Reality TV & Lifestyle': {
    awards: ['Reality TV awards', 'People Choice Award', 'Social media influence', 'Brand partnerships', 'Fan favorites'],
    works: ['hit reality shows', 'lifestyle brands', 'social media empire', 'product lines', 'media presence'],
    descriptions: ['captured hearts on screen', 'built a lifestyle empire', 'became a fan favorite', 'leveraged fame authentically', 'created lasting impact'],
    specialties: ['authenticity', 'relatability', 'entrepreneurship', 'media savvy', 'personal brand', 'connection']
  },
  'Activism & Leadership': {
    awards: ['Humanitarian awards', 'Peace prizes', 'Recognition for service', 'Impact awards', 'Leadership honors'],
    works: ['advocacy campaigns', 'policy changes', 'awareness movements', 'charitable foundations', 'grassroots organizing'],
    descriptions: ['championed important causes', 'drove meaningful change', 'inspired action', 'gave voice to the voiceless', 'made lasting impact'],
    specialties: ['advocacy', 'leadership', 'courage', 'dedication', 'vision', 'impact']
  }
};

// Career stages
const CAREER_STAGES = {
  'Legend': {
    years: '30+ years',
    prefixes: ['Legendary', 'Iconic', 'Veteran', 'Hall of Fame', 'Pioneering'],
    context: ['pioneered the genre', 'laid the foundation', 'set the standard', 'paved the way', 'defined an era']
  },
  'Established': {
    years: '15-30 years',
    prefixes: ['Acclaimed', 'Renowned', 'Award-winning', 'Celebrated', 'Distinguished'],
    context: ['consistently delivered excellence', 'built an impressive legacy', 'earned critical acclaim', 'established dominance', 'proved staying power']
  },
  'Current Star': {
    years: '5-15 years',
    prefixes: ['Rising superstar', 'Chart-topping', 'Breakout', 'In-demand', 'Trending'],
    context: ['taking the world by storm', 'rapidly ascending', 'making waves', 'capturing global attention', 'defining the current era']
  },
  'Rising Talent': {
    years: '1-5 years',
    prefixes: ['Emerging', 'Up-and-coming', 'Fresh', 'Promising', 'Next-generation'],
    context: ['making a mark', 'showing immense potential', 'gaining recognition', 'building momentum', 'emerging as a force']
  }
};

// Bio structures (templates)
const BIO_STRUCTURES = [
  // Structure 1: Achievement → Description → Specialty
  (data: any) => {
    const { name, category, stage, achievement, work, description, specialty } = data;
    return `${stage.prefix} ${category} star ${name} has ${description} with ${work}. With ${randomInt(5, 25)} years in the industry, ${name.split(' ')[0]} has earned ${achievement} and is celebrated for ${specialty}. Known for delivering exceptional experiences, ${name.split(' ')[0]} continues to inspire fans worldwide.`;
  },

  // Structure 2: Work → Impact → Recognition
  (data: any) => {
    const { name, category, achievement, work, description, specialty, location } = data;
    return `Based in ${location}, ${name} is a ${category} powerhouse who has ${description}. Recognized with ${achievement}, ${name.split(' ')[0]}'s ${work} showcase ${specialty}. Fans worldwide connect with ${name.split(' ')[0]}'s authentic approach and dedication to the craft.`;
  },

  // Structure 3: Introduction → Journey → Current Status
  (data: any) => {
    const { name, category, stage, work, description, specialty } = data;
    return `${name} stands as a ${stage.prefix} figure in ${category}. ${stage.context} and ${description}, ${name.split(' ')[0]}'s ${work} demonstrate ${specialty}. With a dedicated global fanbase, ${name.split(' ')[0]} represents excellence in every project undertaken.`;
  },

  // Structure 4: Specialty → Achievements → Impact
  (data: any) => {
    const { name, category, specialty, achievement, work, description } = data;
    return `Renowned for ${specialty}, ${name} has become one of ${category}'s most influential figures. ${name.split(' ')[0]} has ${description} through ${work}, earning ${achievement} along the way. Fans value ${name.split(' ')[0]}'s commitment to excellence and genuine connection.`;
  },

  // Structure 5: Current impact → Background → Future
  (data: any) => {
    const { name, category, work, description, specialty, achievement } = data;
    return `${name} continues to ${description.toLowerCase()} in the world of ${category}. With ${work} that exemplify ${specialty}, ${name.split(' ')[0]} has secured ${achievement} and maintains a strong connection with audiences. Meeting ${name.split(' ')[0]} offers rare insight into excellence at the highest level.`;
  }
];

/**
 * Generate unique bio for celebrity
 */
export function generateBio(params: {
  firstName: string;
  lastName: string;
  category: string;
  subcategory: string;
  tier: string;
  location: string;
}): string {
  const { firstName, lastName, category, subcategory, tier, location } = params;
  const fullName = `${firstName} ${lastName}`;

  // Select career stage based on tier
  let stageKey: keyof typeof CAREER_STAGES;
  if (tier === 'Mega-Star') stageKey = randomElement(['Legend', 'Established'] as const);
  else if (tier === 'A-List') stageKey = randomElement(['Established', 'Current Star'] as const);
  else if (tier === 'B-List') stageKey = 'Current Star';
  else stageKey = 'Rising Talent';

  const stage = CAREER_STAGES[stageKey];

  // Get category-specific content
  const achievementData = ACHIEVEMENTS[category as keyof typeof ACHIEVEMENTS] || ACHIEVEMENTS['Film & Television'];

  const bioData = {
    name: fullName,
    category: subcategory || category,
    stage: {
      prefix: randomElement(stage.prefixes),
      context: randomElement(stage.context)
    },
    achievement: randomElement(achievementData.awards),
    work: randomElement(achievementData.works),
    description: randomElement(achievementData.descriptions),
    specialty: randomElement(achievementData.specialties),
    location: location
  };

  // Select random bio structure and generate
  const structure = randomElement(BIO_STRUCTURES);
  return structure(bioData);
}
