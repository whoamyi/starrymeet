# Shared Components System

**Edit Once, Apply Everywhere** - Manage navbar, footer, and mobile menu from a single location instead of editing 14+ HTML files.

---

## How It Works

1. **Component Files** (`/components/`):
   - `navbar.html` - Main navigation header
   - `footer.html` - Site footer
   - `mobile-menu.html` - Mobile menu overlay and sidebar

2. **Loader Script** (`/js/components.js`):
   - Automatically loads components
   - Injects them into placeholder elements
   - Works on all pages

---

## Using Components in HTML Pages

### Method 1: Placeholder Elements (Recommended)

Replace existing navbar/footer with placeholder divs:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
    <link rel="stylesheet" href="css/shared.css">
    <!-- Load components.js BEFORE closing head or early in body -->
    <script src="js/components.js"></script>
</head>
<body>
    <!-- Navbar Placeholder -->
    <div data-component="navbar" data-component-placeholder></div>

    <!-- Your page content -->
    <main>
        <h1>Page Content</h1>
    </main>

    <!-- Mobile Menu Placeholder -->
    <div data-component="mobile-menu" data-component-placeholder></div>

    <!-- Footer Placeholder -->
    <div data-component="footer" data-component-placeholder></div>

    <!-- Other scripts -->
    <script src="js/shared.js"></script>
</body>
</html>
```

### Method 2: Keep Existing Elements, Update Content

If you want to keep existing `<nav>` and `<footer>` tags:

```html
<!-- Navbar will be injected inside this nav -->
<nav data-component="navbar"></nav>

<!-- Footer will be injected inside this footer -->
<footer data-component="footer"></footer>
```

---

## Editing Components

### To Update the Navbar:

1. Edit `/components/navbar.html`
2. Save
3. Refresh any page - changes appear everywhere

### To Update the Footer:

1. Edit `/components/footer.html`
2. Save
3. Refresh any page - changes appear everywhere

### To Update Mobile Menu:

1. Edit `/components/mobile-menu.html`
2. Save
3. Refresh any page - changes appear everywhere

---

## Benefits

✅ **Single Source of Truth**: Edit once, update everywhere
✅ **No Build Step**: Pure HTML/JS, works immediately
✅ **Backward Compatible**: Pages without placeholders still work
✅ **Fast**: Components load asynchronously
✅ **Maintainable**: Easier to update 3 files than 14 HTML files

---

## Implementation Status

**Created**: 2025-10-20

**Components Ready**:
- ✅ navbar.html
- ✅ footer.html
- ✅ mobile-menu.html
- ✅ components.js (loader)

**Next Steps**:
1. Update HTML pages to use placeholders
2. Test across all pages
3. Remove duplicate navbar/footer code from HTML files

---

## Example Migration

**Before** (browse.html):
```html
<body>
    <nav>
        <!-- 50+ lines of navbar HTML -->
    </nav>
    <div class="mobile-menu">
        <!-- 30+ lines of mobile menu HTML -->
    </div>
    <!-- ... -->
    <footer>
        <!-- 70+ lines of footer HTML -->
    </footer>
</body>
```

**After** (browse.html):
```html
<body>
    <div data-component="navbar" data-component-placeholder></div>
    <div data-component="mobile-menu" data-component-placeholder></div>
    <!-- ... -->
    <div data-component="footer" data-component-placeholder></div>
</body>
```

**Result**: 150+ lines → 3 lines, same functionality

---

## Troubleshooting

**Components not loading?**
- Check browser console for errors
- Ensure `/components/` folder is accessible
- Verify `components.js` is loaded before placeholders
- Check network tab to see if component files are found

**Styling issues?**
- Ensure `shared.css` is loaded before components
- Check that component HTML matches existing structure

---

**Maintainer**: Update component files when making site-wide navigation or footer changes
