/**
 * StarryMeet Layout Injection System
 * Dynamically loads shared header, navbar, and footer components
 * Ensures consistent layout across all pages
 */

async function injectComponent(selector, filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    const element = document.querySelector(selector);
    if (element) {
      element.innerHTML = html;
    } else {
      console.warn(`Selector "${selector}" not found in DOM`);
    }
  } catch (error) {
    console.error(`Failed to load ${filePath}:`, error);
  }
}

// Initialize layout components when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  // Use relative paths for GitHub Pages compatibility
  await Promise.all([
    injectComponent('nav', 'components/navbar.html'),
    injectComponent('footer', 'components/footer.html')
  ]);

  // Re-initialize any interactive elements after injection
  if (typeof initializeNav === 'function') {
    initializeNav();
  }

  if (typeof initializeFooter === 'function') {
    initializeFooter();
  }
});
