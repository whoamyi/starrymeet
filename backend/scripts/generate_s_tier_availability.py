#!/usr/bin/env python3
"""
Generate random availability for S-tier celebrities.

For Physical Meetings:
- Cities: exclusive locations
- Date: next 30-90 days
- Time: business hours
- Duration: from pricing table
- Slots: 0-1 (randomly some get 0)

For Virtual Meetings:
- Date: next 30-90 days
- Time: business hours
- Duration: from pricing table
- Slots: 1-2
"""

import psycopg2
import random
from datetime import datetime, timedelta, time
import uuid

# Database connection
DB_CONFIG = {
    'host': 'ep-autumn-haze-adth19vt-pooler.c-2.us-east-1.aws.neon.tech',
    'user': 'neondb_owner',
    'password': 'npg_Bw8Nn5oiaCgT',
    'database': 'neondb',
    'sslmode': 'require'
}

# Configuration
EXCLUSIVE_CITIES = [
    ('New York', 'United States', 'America/New_York'),
    ('Los Angeles', 'United States', 'America/Los_Angeles'),
    ('Paris', 'France', 'Europe/Paris'),
    ('London', 'United Kingdom', 'Europe/London'),
    ('Tokyo', 'Japan', 'Asia/Tokyo'),
    ('Dubai', 'United Arab Emirates', 'Asia/Dubai'),
    ('Milan', 'Italy', 'Europe/Rome'),
    ('Monaco', 'Monaco', 'Europe/Monaco'),
    ('Seoul', 'South Korea', 'Asia/Seoul'),
    ('Hong Kong', 'Hong Kong', 'Asia/Hong_Kong'),
]

BUSINESS_HOURS = [(9, 0), (10, 0), (11, 0), (14, 0), (15, 0), (16, 0), (17, 0), (18, 0), (19, 0), (20, 0)]

def get_random_date(start_days=7, end_days=90):
    """Get a random date between start_days and end_days from now."""
    days_offset = random.randint(start_days, end_days)
    return datetime.now().date() + timedelta(days=days_offset)

def get_random_time():
    """Get a random business hour time."""
    hour, minute = random.choice(BUSINESS_HOURS)
    return time(hour, minute)

def get_expires_at(date_obj):
    """Calculate expiration date (30 days after the meeting date)."""
    meeting_datetime = datetime.combine(date_obj, time(23, 59, 59))
    return meeting_datetime + timedelta(days=30)

def generate_physical_availability(celebrity_id, pricing_data, tier):
    """Generate random physical meeting availability."""
    availabilities = []

    # 30% chance of having no physical availability
    if random.random() < 0.3:
        return availabilities

    # Pick 1-2 random cities for S-tier
    num_cities = random.randint(1, 2)
    selected_cities = random.sample(EXCLUSIVE_CITIES, num_cities)

    for city, country, timezone_str in selected_cities:
        # Get physical pricing for this celebrity
        physical_pricing = [p for p in pricing_data if p['meeting_type'] == 'physical']

        if not physical_pricing:
            continue

        # Pick 1-2 random durations
        num_slots = random.randint(1, 2)
        selected_pricing = random.sample(physical_pricing, min(num_slots, len(physical_pricing)))

        for pricing in selected_pricing:
            # Random date
            date_obj = get_random_date()
            time_obj = get_random_time()

            # Slots: 0 or 1 (50% chance each for S-tier)
            slots_remaining = random.randint(0, 1)

            availability = {
                'celebrity_id': celebrity_id,
                'meeting_type': 'physical',
                'duration': pricing['duration'],
                'city': city,
                'country': country,
                'date': date_obj,
                'time': time_obj,
                'timezone': timezone_str,
                'slots_remaining': slots_remaining,
                'price_cents': pricing['price_cents'],
                'tier': tier,
                'status': 'active',
                'rotation_id': str(uuid.uuid4()),
                'expires_at': get_expires_at(date_obj)
            }
            availabilities.append(availability)

    return availabilities

def generate_virtual_availability(celebrity_id, pricing_data, tier):
    """Generate random virtual meeting availability."""
    availabilities = []

    # 20% chance of having no virtual availability
    if random.random() < 0.2:
        return availabilities

    # Get virtual pricing for this celebrity
    virtual_pricing = [p for p in pricing_data if p['meeting_type'] == 'virtual']

    if not virtual_pricing:
        return availabilities

    # Pick 2-4 random slots for S-tier
    num_slots = random.randint(2, 4)

    for i in range(num_slots):
        # Pick random duration
        pricing = random.choice(virtual_pricing)

        # Random date
        date_obj = get_random_date()
        time_obj = get_random_time()

        # Slots: 1 or 2 for virtual
        slots_remaining = random.randint(1, 2)

        availability = {
            'celebrity_id': celebrity_id,
            'meeting_type': 'virtual',
            'duration': pricing['duration'],
            'city': 'Virtual',
            'country': 'Online',
            'date': date_obj,
            'time': time_obj,
            'timezone': 'UTC',
            'slots_remaining': slots_remaining,
            'price_cents': pricing['price_cents'],
            'tier': tier,
            'status': 'active',
            'rotation_id': str(uuid.uuid4()),
            'expires_at': get_expires_at(date_obj)
        }
        availabilities.append(availability)

    return availabilities

def main():
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    try:
        # Set search path
        cur.execute("SET search_path TO public")
        conn.commit()
        # Get all S-tier celebrities
        cur.execute("""
            SELECT c.id, c.name, cs.tier
            FROM celebrities_new c
            JOIN celebrity_settings cs ON c.id = cs.celebrity_id
            WHERE cs.tier = 'S' AND c.status = 'active'
        """)

        s_tier_celebs = cur.fetchall()
        print(f"Found {len(s_tier_celebs)} S-tier celebrities")

        total_slots_created = 0
        # Track used combinations to avoid duplicates
        used_combinations = set()

        for celeb_id, celeb_name, tier in s_tier_celebs:
            # Get pricing for this celebrity
            cur.execute("""
                SELECT meeting_type, duration, price_cents
                FROM celebrity_pricing
                WHERE celebrity_id = %s AND is_active = true
            """, (celeb_id,))

            pricing_data = []
            for row in cur.fetchall():
                pricing_data.append({
                    'meeting_type': row[0],
                    'duration': row[1],
                    'price_cents': row[2]
                })

            if not pricing_data:
                print(f"⚠️  No pricing for {celeb_name}, skipping...")
                continue

            # Generate availabilities
            physical_avail = generate_physical_availability(celeb_id, pricing_data, tier)
            virtual_avail = generate_virtual_availability(celeb_id, pricing_data, tier)

            all_availabilities = physical_avail + virtual_avail

            # Insert into database (check for duplicates)
            for avail in all_availabilities:
                # Create unique key
                unique_key = (
                    str(avail['celebrity_id']),
                    str(avail['date']),
                    str(avail['time']),
                    avail['meeting_type']
                )

                # Skip if already used
                if unique_key in used_combinations:
                    continue

                used_combinations.add(unique_key)

                cur.execute("""
                    INSERT INTO availability (
                        celebrity_id, meeting_type, duration, city, country,
                        date, time, timezone, slots_remaining, price_cents,
                        tier, status, rotation_id, expires_at,
                        created_at, updated_at
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, NOW(), NOW()
                    )
                """, (
                    avail['celebrity_id'], avail['meeting_type'], avail['duration'],
                    avail['city'], avail['country'], avail['date'], avail['time'],
                    avail['timezone'], avail['slots_remaining'], avail['price_cents'],
                    avail['tier'], avail['status'], avail['rotation_id'],
                    avail['expires_at']
                ))
                total_slots_created += 1

            physical_count = len(physical_avail)
            virtual_count = len(virtual_avail)
            total_slots = sum(a['slots_remaining'] for a in all_availabilities)

            print(f"✅ {celeb_name}: {physical_count} physical, {virtual_count} virtual ({total_slots} total slots)")

        conn.commit()
        print(f"\n🎉 Successfully created {total_slots_created} availability entries for {len(s_tier_celebs)} S-tier celebrities")

    except Exception as e:
        conn.rollback()
        print(f"❌ Error: {e}")
        raise
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    main()
