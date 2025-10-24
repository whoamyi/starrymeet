You are tasked with fully managing the backend and frontend integration for StarryMeet, including generating unique celebrity profiles, cards, and linking them dynamically. Follow these instructions precisely.

---

## 1️⃣ Backend – Celebrity Profile Creation

For each celebrity in the database:

1. Generate a unique slug based on name + optional unique ID.
2. Create a backend record in celebrity_profile table with these fields:
   - id (unique)
   - name
   - slug
   - picture_url
   - category
   - bio
   - verified (boolean)
   - min_price
   - review_rate
   - review_count
   - physical_locations (array of cities/countries for card display)
   - virtual_available (boolean)
   - Internal fields for availability agent: tier, rotation logic, cooldowns, max slots

3. Run the availability agent to populate:
   - physical_availability: array of cities/dates/times/duration
   - virtual_availability: array of online dates/times/duration
   - Respect tier caps, cooldowns, rotation frequency, and scarcity
   - Avoid assigning home city/country
   - Randomize cities/dates to reduce coincidence among celebrities
   - Ensure physical and virtual slots do not overlap in date/time

---

## 2️⃣ Card Generation – Unique for Each Celebrity

1. For each celebrity record, generate a dynamic product card data:
   - name, picture_url
   - Physical signal → location(s) (city if 1, countries if multiple)
   - Virtual signal → globe/online icon if available
   - category
   - Social proof → review rate + count
   - min_price
   - Verified badge

2. Cards must link to the unique profile via slug: /celebrity/:slug
3. Ensure cards display minimal teaser info, no full availability, no tier label, no "slots remaining" language
4. Cards should dynamically render for desktop and mobile, support lazy-loading/pagination for 7k+ celebrities

---

## 3️⃣ Profile Page Template

1. Use a single dynamic profile page template for all celebrities
2. Fetch full backend record via slug:
   - Static: name, picture, bio, category, verified, social proof, min_price
   - Dynamic: availability agent data for physical and virtual meetings
3. Display logic:
   - Physical availability → collapsible panels per city (dates, time slots, duration)
   - Virtual availability → collapsible panels with dates/times/duration
   - Panels dynamically update in real time based on backend availability
4. Luxury experience tone:
   - Physical → only display location (city or countries) on card, full cities in profile
   - Virtual → globe/online icon
   - No salesy language
   - Cards act as “first door,” profiles as “immersive experience room”

---

## 4️⃣ Backend-Frontend Data Flow

1. Backend generates unique celebrity record + availability agent data
2. Cards API fetches minimal info + availability summary
3. Card click → profile slug → profile API fetches full data
4. Frontend dynamically renders:
   - Cards in browse grid
   - Profile page panels for static + dynamic availability
5. Any backend update (rotation, cooldown, scarcity) automatically updates profile in real time

---

## 5️⃣ Unique & Scalable Requirements

- Each celebrity must have:
   - One unique card
   - One unique profile
   - No static templates reused across multiple celebrities
- Cards and profiles dynamically fetch backend data; frontend is lightweight and responsive
- Availability agent manages all rotations, scarcity, cooldowns → frontend reflects automatically
- System scales cleanly to 7k+ celebrities
- Avoid home city/country in physical availability
- Randomize location/date assignments to reduce repetition across celebrities
- Ensure physical and virtual slots never overlap at the same date/time

---

## 6️⃣ Output Expectations for Claude
1. Populate backend celebrity_profile table with all 7k+ celebrities, including static + dynamic availability data
2. Generate unique product cards dynamically linked to profiles
3. Ensure profile page template dynamically fetches data from backend
4. Maintain real-time data reflection for availability
5. Cards and profiles should support desktop and mobile, pagination/lazy-loading
6. Adhere to luxury, experience-first design principles:
   - No salesy language
   - Physical meetings signaled only by location
   - Virtual meetings indicated with icon
   - Teasers on cards, immersive detail on profiles

---

Execute this process step by step, ensuring each celebrity is unique, cards and profile pages are linked, and availability agent data is fully integrated. The frontend should dynamically render all information without storing static data locally.