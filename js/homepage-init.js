/**
 * Homepage Initialization
 * Populates carousels with real celebrity data from CELEBRITIES array
 */

// Initialize homepage
document.addEventListener('DOMContentLoaded', function() {
    loadTopTen();
    loadQuickMeets();
    loadReviews();
    setupSearch();
});

/**
 * Load top 10 trending celebrities
 */
function loadTopTen() {
    const container = document.getElementById('topTenCarousel');
    if (!container) return;

    // Get trending celebrities
    const trending = CELEBRITIES.filter(c => c.trending).slice(0, 10);

    if (trending.length === 0) {
        // Fallback to first 10
        trending.push(...CELEBRITIES.slice(0, 10));
    }

    container.innerHTML = trending.map(celeb => {
        const initials = getInitials(celeb.name);
        const color = getColorForCelebrity(celeb.name);

        // Use image if available, otherwise show colored initials
        const avatarStyle = celeb.imageUrl
            ? `background-image: url('${celeb.imageUrl}'); background-size: cover; background-position: center;`
            : `background: ${color};`;

        return `
            <div class="celebrity-card" onclick="window.location.href='celebrity-profile.html?name=${encodeURIComponent(celeb.name)}'" style="cursor: pointer;">
                <div style="width: 100%; aspect-ratio: 1; ${avatarStyle} border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 700; color: white; margin-bottom: 12px; position: relative;">
                    ${celeb.imageUrl ? '' : initials}
                    ${celeb.verified ? '<span style="position: absolute; top: 6px; right: 6px; background: gold; color: black; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">✓</span>' : ''}
                </div>
                <h4 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${celeb.name}</h4>
                <p style="opacity: 0.6; font-size: 0.875rem; margin-bottom: 8px;">${celeb.mainCategory || celeb.category || ''}</p>
                <p style="font-size: 1.1rem; font-weight: 700; color: var(--primary);">${formatPrice(celeb.price)}</p>
            </div>
        `;
    }).join('');
}

/**
 * Load quick meets / stars near you
 */
function loadQuickMeets() {
    const container = document.getElementById('quickMeetsCarousel');
    if (!container) return;

    // Get a mix of celebrities (different from trending)
    const quickMeets = CELEBRITIES.slice(10, 18);

    container.innerHTML = quickMeets.map(celeb => {
        const initials = getInitials(celeb.name);
        const color = getColorForCelebrity(celeb.name);

        // Use image if available, otherwise show colored initials
        const avatarStyle = celeb.imageUrl
            ? `background-image: url('${celeb.imageUrl}'); background-size: cover; background-position: center;`
            : `background: ${color};`;

        return `
            <div class="celebrity-card" onclick="window.location.href='celebrity-profile.html?name=${encodeURIComponent(celeb.name)}'" style="cursor: pointer;">
                <div style="width: 100%; aspect-ratio: 1; ${avatarStyle} border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 700; color: white; margin-bottom: 12px;">
                    ${celeb.imageUrl ? '' : initials}
                </div>
                <h4 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${celeb.name}</h4>
                <p style="opacity: 0.6; font-size: 0.875rem; margin-bottom: 4px;">${celeb.location}</p>
                <p style="font-size: 1.1rem; font-weight: 700; color: var(--primary);">${formatPrice(celeb.price)}</p>
            </div>
        `;
    }).join('');
}

/**
 * Load recent reviews
 */
function loadReviews() {
    const container = document.getElementById('reviewsCarousel');
    if (!container) return;

    // Generate sample reviews from celebrities
    const reviewCelebrities = CELEBRITIES.slice(0, 4);

    container.innerHTML = reviewCelebrities.map(celeb => {
        const testimonials = generateTestimonialsForCelebrity(celeb.name);
        const testimonial = testimonials[0]; // Get first testimonial

        return `
            <div class="review-card" style="background: rgba(234, 18, 121, 0.05); border: 1px solid rgba(234, 18, 121, 0.2); border-radius: 16px; padding: 24px; min-width: 300px;">
                <div style="display: flex; align-items: center; margin-bottom: 16px;">
                    <div style="width: 48px; height: 48px; background: ${testimonial.color}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 700; color: white; margin-right: 12px;">
                        ${testimonial.initials}
                    </div>
                    <div style="flex: 1;">
                        <h4 style="font-size: 1rem; font-weight: 600; margin-bottom: 4px;">${testimonial.name}</h4>
                        <p style="opacity: 0.6; font-size: 0.875rem;">Met ${celeb.name}</p>
                    </div>
                    <div style="color: gold; font-size: 1rem;">
                        ${'★'.repeat(testimonial.rating)}
                    </div>
                </div>
                <p style="opacity: 0.9; line-height: 1.6; margin-bottom: 12px;">${testimonial.text}</p>
                <p style="opacity: 0.5; font-size: 0.875rem;">${testimonial.date}</p>
            </div>
        `;
    }).join('');
}

/**
 * Setup search functionality
 */
function setupSearch() {
    const searchForm = document.getElementById('heroSearchForm');
    const searchInput = document.getElementById('heroSearchInput');

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `browse.html?search=${encodeURIComponent(query)}`;
            }
        });
    }
}

console.log('Homepage initialized with', CELEBRITIES.length, 'celebrities');
