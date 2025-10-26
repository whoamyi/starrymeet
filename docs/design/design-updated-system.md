
🧩 STARPYMEET CSS RESTRUCTURE — DEVELOPER EXECUTION CHECKLIST

GOAL:
Rebuild the StarryMeet CSS codebase into a clean, scalable, dark–light–gold minimalist system.
No overwrites, no conflicting selectors, no redundant color tokens.


---

🔧 1. Create Folder Structure

Action:

/css
│
├── base/
│   ├── _reset.css
│   ├── _variables.css
│   ├── _layout.css
│   ├── _typography.css
│   └── _utilities.css
│
├── components/
│   ├── buttons.css
│   ├── cards.css
│   ├── nav.css
│   ├── footer.css
│   └── forms.css
│
├── themes/
│   ├── dark.css
│   ├── light.css
│   └── gold-accent.css
│
├── pages/
│   ├── home.css
│   ├── browse.css
│   ├── celebrity-profile.css
│   └── dashboard.css
│
└── main.css


---

⚙️ 2. Move and Split Existing Files

Old File	New Destination	Notes

shared.css	/base/_variables.css, /base/_layout.css, /base/_utilities.css	Extract all reusable tokens, spacing, and utilities
design-principles.css	/base/_typography.css	Keep only text, hierarchy, and font rules
celebrity-card-luxury.css + celebrity-cards-modern.css	/components/cards.css	Merge into one unified celebrity card system
footer.css	/components/footer.css	Clean and simplify layout, typography only
skeleton-loader.css	/components/loader.css	Optional; rename to match component format
theme.css	/themes/gold-accent.css	Convert variables to the new black–white–gold system



---

🎨 3. Define New Visual System in /base/_variables.css

Action:
Keep only these groups of variables:

:root {
  /* Core Brand */
  --color-primary: #C6A34F; /* Gold */
  --color-primary-dark: #8B6F2C;
  --color-primary-light: #E8C45B;

  /* Base Backgrounds */
  --color-bg-primary: #0A0A0A;
  --color-bg-secondary: #121212;
  --color-bg-tertiary: #181818;

  /* Text */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #C0C0C0;
  --color-text-muted: #808080;

  /* States */
  --color-success: #3FBF77;
  --color-error: #E04F5F;
  --color-info: #4FA7E0;

  /* Layout */
  --radius: 14px;
  --space-unit: 8px;
  --max-width: 1280px;
}


---

🏗️ 4. Create and Organize Base Layer

Tasks:

1. _reset.css

Apply box-sizing, margin, padding reset.

Use scroll-behavior: smooth;



2. _layout.css

Define .container, .grid, .section, .flex, .gap-* utilities.

Set section spacing using variables (e.g., margin-top: var(--space-unit)*4).



3. _typography.css

Import Inter font.

Define heading levels: h1–h4, p, small.

Font weights: 400, 600, 700 only.



4. _utilities.css

Add small helpers: .hidden, .text-center, .align-center, .z-top.





---

🧩 5. Rebuild Components

For Each Component File:

buttons.css

.btn-primary: solid gold, white text

.btn-outline: transparent with gold border

.btn-ghost: white text, opacity hover

Remove all shadows and gradients


cards.css

Merge luxury + modern card styles

Uniform card dimensions

Rounded corners: var(--radius)

Subtle hover scale (transform: scale(1.02))


nav.css

Minimal header

Use backdrop blur (blur(20px))

Mobile collapsible menu

Logo left, search bar center, buttons right


footer.css

Single column on mobile, grid on desktop

Gold icons hover effect


forms.css

Transparent input fields

Gold border on focus

Red or green for validation




---

🌗 6. Apply Theming

Dark Theme (/themes/dark.css)

body {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}

Light Theme (/themes/light.css)

body {
  background-color: #FAFAFA;
  color: #111;
}

Gold Accent (/themes/gold-accent.css)

a, .highlight, .verified-badge {
  color: var(--color-primary);
}


---

🧭 7. Page-Level Layouts

Rules:

Only layout rules per page (grids, alignments, hero section).

Import components inside page CSS only if unique per page.


Example:

/* browse.css */
@import '../components/cards.css';
.filters-panel { ... }
.pagination { ... }


---

🧹 8. Cleaning & Transition Plan

1. Freeze old CSS.


2. Move piece-by-piece following this structure.


3. Delete unused selectors after each page migration.


4. Use PurgeCSS or CSS-linter to remove dead code.


5. Keep only one main.css as the entry file for all imports.




---

⚡ 9. Import Order (main.css)

@import url('./base/_reset.css');
@import url('./base/_variables.css');
@import url('./base/_layout.css');
@import url('./base/_typography.css');
@import url('./base/_utilities.css');

@import url('./components/buttons.css');
@import url('./components/cards.css');
@import url('./components/nav.css');
@import url('./components/footer.css');
@import url('./components/forms.css');

@import url('./themes/dark.css');
@import url('./themes/gold-accent.css');


---

#Single-token rule — change only variables
Put these variables in /base/_variables.css (replace any existing color tokens to point here):
:root{ --bg-primary: #0f0f10; /* main page background (near-black, not pure #000) */ --bg-secondary: #141416; /* sections, cards backgrounds */ --bg-panel: #1b1b1d; /* panels, modals */ --text-primary: #ffffff; /* all primary text */ --text-secondary: #cfcfcf; /* muted text */ --muted: #9a9a9a; /* secondary hints */ --accent-gold: #C6A34F; /* gold accent */ --accent-gold-dark: #8B6F2C; /* dark gold hover */ --success: #2ecc71; /* confirmations */ --error: #e04f5f; /* failures */ --info: #4fa7e0; /* info states */ --radius: 14px; --gap: 16px; } 
Rule: Never hardcode colors elsewhere — reference these vars only.

#Global text/background rule
Global body: body { background: var(--bg-primary); color: var(--text-primary); } 
Everywhere else: if you see color: #333 or similar — replace with var(--text-primary) or var(--text-secondary) depending on role.
Principle: ALL visible copy = white (--text-primary). Use --text-secondary for less important text.

#Accent use — gold is precious
Use --accent-gold only for: 
Primary CTAs (.btn-primary background)
Price highlights and verified badges
Active pagination / selected filter chips
Hover/tap states use --accent-gold-dark.
Never use gradient splashes or full-card gold backgrounds. Accent = sparing.

#Borders → spacing / soft shadows
Remove heavy borders. Replace with spacing or subtle contrast: .card { background: var(--bg-secondary); border-radius: var(--radius); box-shadow: 0 6px 18px rgba(0,0,0,0.5); } 
If you must separate sections, use padding and gap — not border-bottom.

#Muted states and inputs
Inputs / placeholders: color: var(--muted) and borders rgba(255,255,255,0.06).
Focus ring: outline: 2px solid rgba(198,163,79,0.14) (soft gold halo).

#Semantic colors
Success: --success, Error: --error, Info: --info. Use these only for statuses and validation UIs.

# How to implement safely (step-by-step)
Update /base/_variables.css with tokens above.
Run a targeted search-and-replace in CSS: 
Replace color hexes (search common ones like #fff, #000, #111, #222, purples) with variables — do not delete entire files.
Example replacements: 
color: #fff → color: var(--text-primary)
background: #000 → background: var(--bg-primary)
border-color: #eee → border-color: rgba(255,255,255,0.06)
For each component file (buttons/cards/nav/footer), run visual smoke tests on staging.
If any element looks wrong, inspect which variable it's using — adjust role (primary vs secondary text).
After all components pass, remove obsolete color tokens and run PurgeCSS.

# Small cheat-sheet for Claude/dev
If color is used for text → --text-primary or --text-secondary.
If background → --bg-primary / --bg-secondary / --bg-panel.
If highlight or interactive → --accent-gold.
If status (ok/error/info) → --success / --error / --info.

✅ 10. End Validation Checklist

[ ] No purple or blue remnants.

[ ] No color declared outside variables.

[ ] All components inherit from :root tokens.

[ ] Minimal visual separators.

[ ] Buttons and cards consistent across pages.

[ ] Mobile-first responsive design.

[ ] Clean, black-white-gold tone throughout.

[ ] CSS load under 150KB (after minify).



---