
### StarryMeet – Frontend Framework Draft

The goal here is to let users explore, interact, and book without drowning in data, while still showing all the scarcity, rotation, and exclusivity we built.

# 1️⃣ Profile Structure: Static + Variable
Every celebrity profile has two main layers:
A) Static (always visible)
Name, category, country of origin
Bio (short, punchy)
Picture / gallery
Tier indicator (optional visual, like stars or badges)
Social proof (followers, awards, press mentions – optional)
B) Variable (interactive section)
Two main panels: Physical Meetings and Virtual Meetings
Each panel is a dynamic, collapsible section
Slots are displayed per city, not all at once
Users click to expand city → see available dates & durations
Think: “House with doors” metaphor – easy entry & exit, no confusion

# 2️⃣ Interactive Availability Panels
Panel Features:
City picker
Shows current rotation of cities
Displays number of slots per city
Cities greyed out if unavailable (expired/cooldown)
Date picker per city
Shows only the available rotation window
Visual cues for scarcity (e.g., 1 slot left → red indicator)
Time & Duration
Expandable dropdown per selected date
Shows available durations (15 / 30 / 60 min)
Tier-based visual scarcity
Example: S-tier → only 1 city visible, very limited slots
D-tier → more cities, more slots
Virtual vs Physical panels separated
Prevents cognitive overload
Color-coded for easy distinction
Physical: map icon + city name
Virtual: globe icon + city name

# 3️⃣ UX Considerations
Expandable/Collapsible Sections:
Default view: collapsed, only city names + number of slots
Expand city → see dates, times, durations
Quick Exit / Back Navigation:
Users can collapse city/date/time back at any point
Always visible “Back to Cities” or “Close Panel”
Scarcity Cues:
Color coding: green (plenty), yellow (few slots), red (last slot)
Tooltip or microcopy: “High demand – only 1 slot left!”
Randomized Rotation Display:
Even if multiple celebrities are bookable in the same city/day, panels rotate display order to avoid repetition
Booking Button:
Appears only after user selects city → date → duration
Clicking → passes selection to booking system

# 4️⃣ Example Flow – Cha Eun-Woo
User clicks profile → sees photo, bio, tier
Two panels: Physical / Virtual (collapsed)
Click Physical Meetings → see 2 cities: London, Toronto
Click London → expand → see available dates & durations
Select 30-min slot → book button activates
Return to city list → Toronto is still expandable
Switch to Virtual Meetings → separate panel, different dates/times
Always keeps the interface uncluttered, interactive, and consistent

# 5️⃣ Backend-Frontend Integration
API endpoints return:
Celebrity static info (name, bio, picture, tier)
Availability per meeting type (city, date, time, duration, slots remaining)
Frontend renders dynamically:
Collapsible city sections
Scarcity indicators
Rotation randomness handled at backend → frontend only visualizes
Slot selection triggers booking → updates DB, adjusts remaining slots

# 6️⃣ Optional Enhancements
Map visualization:
For physical meetings, show pins for cities with available slots
Clicking a pin expands city → dates & times
Search / Filter:
Filter by meeting type, tier, city, or availability window
Notifications / Alerts:
Users can “watch” a celebrity → alerted when new slot appears in rotation

✅ Summary
Frontend goals achieved:
Clean separation of static vs dynamic data
Interactive panels mimic real-world scarcity
Avoids overwhelming the user despite 7k+ celebrities
Handles physical/virtual separately while respecting backend rules
Easy expansion (maps, filters, notifications) without breaking UX