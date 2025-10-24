# Strategic Batch Processing for StarryMeet

## Philosophy

**Tier is the foundation** - without proper tier assignment, nothing else matters. All pricing, availability, and slots depend on tier classification.

## Processing Strategy

### Phase 1: Ensure Tier Assignment (FOUNDATION)
**Goal**: 100% of celebrities must have proper tier (S/A/B/C/D)

```bash
# Classify all new celebrities
npm run classify:new-only

# Verify all have tiers
PGPASSWORD='...' psql ... -c "
  SELECT COUNT(*) as missing_tier
  FROM celebrities_new c
  LEFT JOIN celebrity_settings s ON c.id = s.celebrity_id
  WHERE s.tier IS NULL;
"
```

**Success Criteria**: `missing_tier = 0`

---

### Phase 2: Batch Processing by Tier (CLEAN WORKFLOW)

Once all celebrities have tiers, process availability in batches by tier.

**Why Batch by Tier?**
1. ✅ Prevents database overload (10K+ celebrities)
2. ✅ Allows verification at each tier before moving forward
3. ✅ Easy to resume if something goes wrong
4. ✅ Matches business logic (S-tier is most important, process first)
5. ✅ Tier-specific availability rules are cleanly separated

---

## Batch Processing Order

### Batch 1: S-Tier (Most Important)
```bash
TIER=S npm run availability:generate
```

**Characteristics**:
- Smallest batch (~10-50 celebrities)
- Most scarce availability (0-1 physical, 1-2 virtual per month)
- Longest rotation cycles (8-12 weeks)
- Highest pricing ($100K-$2M)
- Most city/country restrictions

**Verification**:
```sql
SELECT COUNT(*), AVG(slots_count), AVG(rotation_days)
FROM availability a
JOIN celebrity_settings s ON a.celebrity_id = s.celebrity_id
WHERE s.tier = 'S';
```

---

### Batch 2: A-Tier
```bash
TIER=A npm run availability:generate
```

**Characteristics**:
- Medium batch (~200-500 celebrities)
- Scarce availability (1-2 physical, 1-4 virtual per month)
- Medium rotation cycles (6-8 weeks)
- High pricing ($20K-$500K)

---

### Batch 3: B-Tier
```bash
TIER=B npm run availability:generate
```

**Characteristics**:
- Medium batch (~500-1000 celebrities)
- Moderate availability (1-3 physical, 2-6 virtual per month)
- Standard rotation cycles (4-6 weeks)
- Medium pricing ($5K-$50K)

---

### Batch 4: C-Tier
```bash
TIER=C npm run availability:generate
```

**Characteristics**:
- Large batch (~1000-3000 celebrities)
- Good availability (1-4 physical, 3-8 virtual per month)
- Faster rotation cycles (3-5 weeks)
- Accessible pricing ($1K-$10K)

---

### Batch 5: D-Tier
```bash
TIER=D npm run availability:generate
```

**Characteristics**:
- Largest batch (~5000-8000 celebrities)
- High availability (1-5 physical, 5-10 virtual per month)
- Fastest rotation cycles (2-4 weeks)
- Entry pricing ($100-$2K)

---

## Current Status

### ✅ Phase 1: Tier Assignment (FOUNDATION)
- **Status**: In Progress
- **Command**: `npm run classify:new-only` (Process ID: 7c4881)
- **Progress**: Classifying 2,607 new celebrities
- **ETA**: 1-2 hours
- **What it does**:
  - Assigns tier (S/A/B/C/D) using fame comparison logic
  - Generates 6 pricing packages (tier-based)
  - Sets max_monthly_slots (tier-based)
  - Sets verified = true
  - Fixes NULL countries

### 🔄 Phase 2: Availability Generation (NEXT)
- **Status**: Not Started
- **Requires**: Phase 1 completion (100% tier assignment)
- **Implementation**: Separate service (modular, can run independently)
- **Files to Create**:
  - `src/services/availability/generator.service.ts`
  - `src/services/availability/cooldown.service.ts`
  - `src/services/availability/city-pool.service.ts`
  - `src/scripts/availability/generate-by-tier.ts`

---

## Verification Checklist

### After Phase 1:
- [ ] All celebrities have tier assignment
- [ ] All celebrities have 6 pricing packages
- [ ] All celebrities have max_monthly_slots
- [ ] All celebrities are verified
- [ ] All celebrities have valid countries

### After Each Tier Batch (Phase 2):
- [ ] All celebrities in tier have availability slots
- [ ] Physical and virtual don't overlap (per celebrity)
- [ ] Cities follow cooldown rules (3-6 months)
- [ ] Home country excluded from city pools
- [ ] Slot counts match tier specifications
- [ ] Rotation cycles match tier specifications

---

## Monitoring Commands

### Check Tier Distribution
```sql
SELECT
  s.tier,
  COUNT(*) as count,
  MIN(s.max_monthly_slots) as min_slots,
  MAX(s.max_monthly_slots) as max_slots,
  AVG(s.max_monthly_slots)::int as avg_slots
FROM celebrity_settings s
GROUP BY s.tier
ORDER BY s.tier;
```

### Check Pricing Coverage
```sql
SELECT
  s.tier,
  COUNT(DISTINCT p.celebrity_id) as celebs_with_pricing,
  COUNT(*) as total_packages
FROM celebrity_settings s
LEFT JOIN celebrity_pricing p ON s.celebrity_id = p.celebrity_id
GROUP BY s.tier
ORDER BY s.tier;
```

### Check Availability Coverage (After Phase 2)
```sql
SELECT
  s.tier,
  COUNT(DISTINCT a.celebrity_id) as celebs_with_availability,
  COUNT(*) as total_slots,
  AVG(COUNT(*)) OVER (PARTITION BY s.tier) as avg_slots_per_celeb
FROM celebrity_settings s
LEFT JOIN availability a ON s.celebrity_id = a.celebrity_id
GROUP BY s.tier, a.celebrity_id
ORDER BY s.tier;
```

---

## Benefits of This Approach

1. **Tier is Foundation**: Everything depends on proper tier assignment
2. **Clean Verification**: Each batch can be verified before moving forward
3. **Error Recovery**: If something fails, easy to resume from specific tier
4. **Business Priority**: S-tier celebrities (most important) processed first
5. **Performance**: Prevents database crashes by processing in manageable batches
6. **Scalability**: Approach works for 10K, 100K, or 1M+ celebrities
7. **Maintainability**: Each tier's logic is cleanly separated

---

## Next Immediate Steps

1. ⏳ **Wait for Phase 1 to complete** (~1-2 hours)
   ```bash
   # Monitor progress
   tail -f /tmp/classify-all-new.log
   ```

2. ✅ **Verify 100% tier coverage**
   ```bash
   # Check for missing tiers
   PGPASSWORD='...' psql ... -c "
     SELECT COUNT(*) as missing_tier
     FROM celebrities_new c
     LEFT JOIN celebrity_settings s ON c.id = s.celebrity_id
     WHERE s.tier IS NULL;
   "
   ```

3. 📊 **Review tier distribution**
   ```bash
   # See breakdown by tier
   PGPASSWORD='...' psql ... -c "
     SELECT tier, COUNT(*) FROM celebrity_settings
     GROUP BY tier ORDER BY tier;
   "
   ```

4. 🚀 **Begin Phase 2 if needed** (or proceed to frontend integration)

---

## Notes

- Phase 1 (tier assignment + pricing) is **COMPLETE** when classification agent finishes
- Phase 2 (availability generation) is **OPTIONAL** - can be built later if needed
- Frontend can start using celebrities immediately after Phase 1 completes
- Availability can be generated on-demand or in batches as needed
