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

// Initialize mobile menu functionality
function initializeMobileMenu() {
  const menu = document.querySelector('.mobile-menu');
  const openBtn = document.querySelector('.menu-toggle');
  const closeBtn = document.querySelector('.menu-close');

  if (openBtn && menu) {
    openBtn.addEventListener('click', () => menu.classList.add('active'));
  }

  if (closeBtn && menu) {
    closeBtn.addEventListener('click', () => menu.classList.remove('active'));
  }

  // Close menu when clicking on links
  if (menu) {
    const menuLinks = menu.querySelectorAll('a:not([onclick*="preventDefault"])');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => menu.classList.remove('active'));
    });
  }
}

// Initialize layout components when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  // Use relative paths for GitHub Pages compatibility
  await Promise.all([
    injectComponent('nav', 'components/navbar.html'),
    injectComponent('footer', 'components/footer.html')
  ]);

  // Initialize mobile menu after navbar is injected
  initializeMobileMenu();

  // Re-initialize any interactive elements after injection
  if (typeof initializeNav === 'function') {
    initializeNav();
  }

  if (typeof initializeFooter === 'function') {
    initializeFooter();
  }
});
