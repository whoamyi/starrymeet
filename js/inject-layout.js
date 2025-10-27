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

async function injectNavbarWithMobileMenu() {
  try {
    const response = await fetch('components/navbar.html');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();

    // Create a temporary container to parse the HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Extract the nav content (everything except mobile menu)
    const navContent = temp.querySelector('.nav-container');
    const mobileMenu = temp.querySelector('.mobile-menu');

    // Inject nav content into nav element
    const navElement = document.querySelector('nav');
    if (navElement && navContent) {
      navElement.innerHTML = navContent.outerHTML;
    }

    // Inject mobile menu into body (at the end)
    if (mobileMenu) {
      document.body.appendChild(mobileMenu);
    }
  } catch (error) {
    console.error('Failed to load navbar:', error);
  }
}

// Initialize mobile menu functionality
function initializeMobileMenu() {
  const menu = document.querySelector('.mobile-menu');
  const openBtn = document.querySelector('.menu-toggle');
  const closeBtn = document.querySelector('.mobile-menu-close');

  if (openBtn && menu) {
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      menu.classList.add('active');
    });
  }

  if (closeBtn && menu) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      menu.classList.remove('active');
    });
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
    injectNavbarWithMobileMenu(),
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

  // Add layout-ready class to enable smooth transitions
  // Small delay to ensure layout calculations are complete
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.add('layout-ready');
    });
  });
});
