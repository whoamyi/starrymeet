/**
 * Wikidata Service
 * Fetches real celebrity data from Wikidata using SPARQL queries
 */

import axios from 'axios';
import { WikidataEntity } from '../types';
import { API_CONFIG, WIKIDATA_OCCUPATIONS, EXCLUDED_OCCUPATIONS } from '../config';

/**
 * Rate limiter for Wikidata API
 */
class RateLimiter {
  private queue: Array<() => void> = [];
  private lastCallTime = 0;
  private readonly minInterval: number;

  constructor(requestsPerSecond: number) {
    this.minInterval = 1000 / requestsPerSecond;
  }

  async throttle(): Promise<void> {
    return new Promise((resolve) => {
      const now = Date.now();
      const timeSinceLastCall = now - this.lastCallTime;

      if (timeSinceLastCall >= this.minInterval) {
        this.lastCallTime = now;
        resolve();
      } else {
        const delay = this.minInterval - timeSinceLastCall;
        setTimeout(() => {
          this.lastCallTime = Date.now();
          resolve();
        }, delay);
      }
    });
  }
}

const wikidataRateLimiter = new RateLimiter(API_CONFIG.wikidata.rateLimit);

/**
 * Build SPARQL query for celebrities
 */
function buildCelebritySPARQL(occupation: string, limit: number = 100, offset: number = 0): string {
  return `
SELECT DISTINCT ?person ?personLabel ?birthDate ?country ?countryLabel
       ?imdbId ?tmdbId ?spotifyId ?youtubeId
WHERE {
  ?person wdt:P106 wd:${occupation} .  # occupation

  # Must be human
  ?person wdt:P31 wd:Q5 .

  # Must NOT be dead (exclude posthumous)
  FILTER NOT EXISTS { ?person wdt:P570 ?death }

  # Optional: birth date
  OPTIONAL { ?person wdt:P569 ?birthDate }

  # Optional: country of citizenship
  OPTIONAL {
    ?person wdt:P27 ?country .
  }

  # External IDs
  OPTIONAL { ?person wdt:P345 ?imdbId }          # IMDb
  OPTIONAL { ?person wdt:P4985 ?tmdbId }         # TMDB
  OPTIONAL { ?person wdt:P1902 ?spotifyId }      # Spotify artist ID
  OPTIONAL { ?person wdt:P2397 ?youtubeId }      # YouTube channel ID

  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT ${limit}
OFFSET ${offset}
  `.trim();
}

/**
 * Execute SPARQL query against Wikidata
 */
async function executeSPARQL(query: string): Promise<any> {
  await wikidataRateLimiter.throttle();

  try {
    const response = await axios.get(API_CONFIG.wikidata.endpoint, {
      params: {
        query,
        format: 'json'
      },
      headers: {
        'User-Agent': 'StarryMeet Celebrity Seeder/1.0 (contact@starrymeet.com)',
        'Accept': 'application/json'
      },
      timeout: 30000
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ Wikidata SPARQL error:', error.message);
    throw error;
  }
}

/**
 * Parse Wikidata SPARQL results into WikidataEntity
 */
function parseWikidataResults(results: any): WikidataEntity[] {
  const bindings = results.results?.bindings || [];

  return bindings.map((binding: any) => {
    const entity: WikidataEntity = {
      qid: binding.person?.value?.split('/').pop() || '',
      name: binding.personLabel?.value || '',
      birthDate: binding.birthDate?.value,
      deathDate: undefined,  // Filtered out by query
      occupation: [],  // Will be enriched later
      country: binding.countryLabel?.value,
      imdbId: binding.imdbId?.value,
      tmdbId: binding.tmdbId?.value ? parseInt(binding.tmdbId.value) : undefined,
      spotifyId: binding.spotifyId?.value,
      youtubeChannelId: binding.youtubeId?.value,
      awards: [],
      notableWorks: []
    };

    return entity;
  });
}

/**
 * Fetch celebrities by occupation from Wikidata
 */
export async function fetchCelebritiesByOccupation(
  occupationQID: string,
  limit: number = 100,
  offset: number = 0
): Promise<WikidataEntity[]> {
  console.log(`📥 Fetching ${limit} celebrities with occupation ${occupationQID} (offset: ${offset})...`);

  try {
    const query = buildCelebritySPARQL(occupationQID, limit, offset);
    const results = await executeSPARQL(query);
    const entities = parseWikidataResults(results);

    console.log(`✅ Fetched ${entities.length} celebrities from Wikidata`);
    return entities;

  } catch (error: any) {
    console.error(`❌ Failed to fetch celebrities for occupation ${occupationQID}:`, error.message);
    return [];
  }
}

/**
 * Fetch all celebrities from Wikidata based on occupation mapping
 */
export async function fetchAllCelebrities(
  targetCount: number = 12500
): Promise<WikidataEntity[]> {
  console.log(`\n🌍 Starting Wikidata celebrity fetch (target: ${targetCount})...\n`);

  const allCelebrities: WikidataEntity[] = [];
  const occupations = Object.keys(WIKIDATA_OCCUPATIONS).filter(
    qid => !EXCLUDED_OCCUPATIONS.includes(qid)
  );

  const perOccupationTarget = Math.ceil(targetCount / occupations.length);

  for (const occupationQID of occupations) {
    const occupationName = WIKIDATA_OCCUPATIONS[occupationQID as keyof typeof WIKIDATA_OCCUPATIONS];
    console.log(`\n📂 Fetching ${occupationName} (${occupationQID})...`);

    let offset = 0;
    let fetchedForOccupation = 0;
    const batchSize = 100;

    while (fetchedForOccupation < perOccupationTarget) {
      try {
        const batch = await fetchCelebritiesByOccupation(occupationQID, batchSize, offset);

        if (batch.length === 0) {
          console.log(`  ℹ️  No more results for ${occupationName}`);
          break;
        }

        allCelebrities.push(...batch);
        fetchedForOccupation += batch.length;
        offset += batchSize;

        console.log(`  ✓ Fetched ${fetchedForOccupation} ${occupationName}s so far...`);

        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error: any) {
        console.error(`  ❌ Error fetching ${occupationName} at offset ${offset}:`, error.message);
        break;
      }
    }

    console.log(`✅ Total ${occupationName}s fetched: ${fetchedForOccupation}`);
  }

  console.log(`\n🎉 Wikidata fetch complete! Total celebrities: ${allCelebrities.length}`);
  return allCelebrities;
}

/**
 * Enrich entity with additional Wikidata information
 */
export async function enrichWikidataEntity(qid: string): Promise<Partial<WikidataEntity>> {
  console.log(`🔍 Enriching Wikidata entity ${qid}...`);

  const enrichmentQuery = `
SELECT ?occupation ?occupationLabel ?award ?awardLabel ?work ?workLabel
WHERE {
  wd:${qid} wdt:P106 ?occupation .

  OPTIONAL { wd:${qid} wdt:P166 ?award }
  OPTIONAL { wd:${qid} wdt:P800 ?work }

  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 50
  `.trim();

  try {
    const results = await executeSPARQL(enrichmentQuery);
    const bindings = results.results?.bindings || [];

    const enrichment: Partial<WikidataEntity> = {
      occupation: [],
      awards: [],
      notableWorks: []
    };

    bindings.forEach((binding: any) => {
      if (binding.occupationLabel?.value && !enrichment.occupation?.includes(binding.occupationLabel.value)) {
        enrichment.occupation?.push(binding.occupationLabel.value);
      }
      if (binding.awardLabel?.value && !enrichment.awards?.includes(binding.awardLabel.value)) {
        enrichment.awards?.push(binding.awardLabel.value);
      }
      if (binding.workLabel?.value && !enrichment.notableWorks?.includes(binding.workLabel.value)) {
        enrichment.notableWorks?.push(binding.workLabel.value);
      }
    });

    return enrichment;

  } catch (error: any) {
    console.error(`❌ Failed to enrich ${qid}:`, error.message);
    return {};
  }
}

/**
 * Calculate age from birth date
 */
export function calculateAge(birthDate: string): number | null {
  try {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  } catch {
    return null;
  }
}

export default {
  fetchCelebritiesByOccupation,
  fetchAllCelebrities,
  enrichWikidataEntity,
  calculateAge
};
