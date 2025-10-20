/**
 * StarryMeet Component Loader
 * Dynamically loads shared components (navbar, footer, mobile menu)
 * This allows editing from a single file instead of updating all HTML pages
 */

(function() {
    'use strict';

    /**
     * Load a component from /components/ directory and inject into target element
     * @param {string} componentName - Name of the component file (without .html)
     * @param {string} targetSelector - CSS selector for target element or placeholder
     */
    async function loadComponent(componentName, targetSelector) {
        try {
            const response = await fetch(`/components/${componentName}.html`);

            if (!response.ok) {
                console.warn(`Failed to load component: ${componentName}`);
                return;
            }

            const html = await response.text();
            const target = document.querySelector(targetSelector);

            if (target) {
                // If target is a placeholder, replace it
                if (target.hasAttribute('data-component-placeholder')) {
                    target.outerHTML = html;
                } else {
                    // Otherwise, inject inside
                    target.innerHTML = html;
                }
            } else {
                console.warn(`Target not found for component ${componentName}: ${targetSelector}`);
            }
        } catch (error) {
            console.error(`Error loading component ${componentName}:`, error);
        }
    }

    /**
     * Initialize all components
     * Runs when DOM is ready
     */
    function initComponents() {
        // Load navbar if placeholder exists
        const navbarPlaceholder = document.querySelector('[data-component="navbar"]');
        if (navbarPlaceholder) {
            loadComponent('navbar', '[data-component="navbar"]');
        }

        // Load mobile menu if placeholder exists
        const mobileMenuPlaceholder = document.querySelector('[data-component="mobile-menu"]');
        if (mobileMenuPlaceholder) {
            loadComponent('mobile-menu', '[data-component="mobile-menu"]');
        }

        // Load footer if placeholder exists
        const footerPlaceholder = document.querySelector('[data-component="footer"]');
        if (footerPlaceholder) {
            loadComponent('footer', '[data-component="footer"]');
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initComponents);
    } else {
        initComponents();
    }
})();
