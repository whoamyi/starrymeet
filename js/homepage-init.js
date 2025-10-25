/**
 * Homepage Initialization
 * Loads celebrities from API and populates carousels
 */

// Initialize homepage
document.addEventListener('DOMContentLoaded', async function() {
    await loadSharedComponents();
    await loadTopTen();
    await loadQuickMeets();
    loadReviews();
    setupSearch();
});

/**
 * Load top 10 featured celebrities
 */
async function loadTopTen() {
    const container = document.getElementById('topTenCarousel');
    if (!container) return;

    try {
        const response = await window.api.getFeaturedCelebrities(10);

        if (!response.success || !response.data || !response.data.celebrities) {
            throw new Error('Failed to load featured celebrities');
        }

        const celebrities = response.data.celebrities;

        container.innerHTML = celebrities.map(celeb => {
            const initials = getInitials(celeb.name);
            const color = getColorForCelebrity(celeb.name);

            // Use image if available, otherwise show colored initials
            const avatarStyle = celeb.picture_url
                ? `background-image: url('${celeb.picture_url}'); background-size: cover; background-position: center;`
                : `background: ${color};`;

            const price = celeb.min_price ? parseFloat(celeb.min_price) * 100 : 0;

            return `
                <div class="celebrity-card" onclick="window.location.href='celebrity-profile.html?slug=${encodeURIComponent(celeb.slug)}'" style="cursor: pointer;">
                    <div style="width: 100%; aspect-ratio: 1; ${avatarStyle} border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 700; color: white; margin-bottom: 12px; position: relative;">
                        ${celeb.picture_url ? '' : initials}
                        ${celeb.verified ? '<span style="position: absolute; top: 6px; right: 6px; background: gold; color: black; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">✓</span>' : ''}
                    </div>
                    <h4 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${celeb.name}</h4>
                    <p style="opacity: 0.6; font-size: 0.875rem; margin-bottom: 4px;">${celeb.category || 'Celebrity'}</p>
                    <p style="opacity: 0.6; font-size: 0.875rem;">From ${formatPrice(price)}</p>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error loading featured celebrities:', error);
        container.innerHTML = '<p style="opacity: 0.6; padding: 24px; text-align: center;">Unable to load celebrities</p>';
    }
}

/**
 * Load quick meets / more celebrities
 */
async function loadQuickMeets() {
    const container = document.getElementById('quickMeetsCarousel');
    if (!container) return;

    try {
        // Get different set of celebrities (offset 10, limit 8)
        const response = await window.api.getCelebrityCards({ limit: 8, offset: 10 });

        if (!response.success || !response.data || !response.data.celebrities) {
            throw new Error('Failed to load celebrities');
        }

        const celebrities = response.data.celebrities;

        container.innerHTML = celebrities.map(celeb => {
            const initials = getInitials(celeb.name);
            const color = getColorForCelebrity(celeb.name);

            // Use image if available, otherwise show colored initials
            const avatarStyle = celeb.picture_url
                ? `background-image: url('${celeb.picture_url}'); background-size: cover; background-position: center;`
                : `background: ${color};`;

            const price = celeb.min_price ? parseFloat(celeb.min_price) * 100 : 0;

            return `
                <div class="celebrity-card" onclick="window.location.href='celebrity-profile.html?slug=${encodeURIComponent(celeb.slug)}'" style="cursor: pointer;">
                    <div style="width: 100%; aspect-ratio: 1; ${avatarStyle} border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 700; color: white; margin-bottom: 12px;">
                        ${celeb.picture_url ? '' : initials}
                    </div>
                    <h4 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${celeb.name}</h4>
                    <p style="opacity: 0.6; font-size: 0.875rem; margin-bottom: 4px;">${celeb.country || ''}</p>
                    <p style="opacity: 0.6; font-size: 0.875rem;">From ${formatPrice(price)}</p>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error loading quick meets:', error);
        container.innerHTML = '<p style="opacity: 0.6; padding: 24px; text-align: center;">Unable to load celebrities</p>';
    }
}

/**
 * Load recent reviews (placeholder until we have real reviews)
 */
function loadReviews() {
    const container = document.getElementById('reviewsCarousel');
    if (!container) return;

    // Sample reviews for now
    const reviews = [
        { name: 'Sarah M.', celebrity: 'Featured Celebrity', rating: 5, text: 'Amazing experience! Worth every penny. So professional and friendly.', date: '2 days ago', initials: 'SM', color: '#EA1279' },
        { name: 'John D.', celebrity: 'Featured Celebrity', rating: 5, text: 'Dream come true! Can\'t believe I got to meet them in person.', date: '5 days ago', initials: 'JD', color: '#9333EA' },
        { name: 'Emma L.', celebrity: 'Featured Celebrity', rating: 5, text: 'The best birthday gift ever! They were so kind and took time to chat.', date: '1 week ago', initials: 'EL', color: '#06B6D4' },
        { name: 'Mike R.', celebrity: 'Featured Celebrity', rating: 5, text: 'Incredible! They made my day. Highly recommend booking through StarryMeet.', date: '2 weeks ago', initials: 'MR', color: '#F59E0B' }
    ];

    container.innerHTML = reviews.map(review => {
        return `
            <div class="review-card" style="background: rgba(234, 18, 121, 0.05); border: 1px solid rgba(234, 18, 121, 0.2); border-radius: 16px; padding: 24px; min-width: 300px;">
                <div style="display: flex; align-items: center; margin-bottom: 16px;">
                    <div style="width: 48px; height: 48px; background: ${review.color}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 700; color: white; margin-right: 12px;">
                        ${review.initials}
                    </div>
                    <div style="flex: 1;">
                        <h4 style="font-size: 1rem; font-weight: 600; margin-bottom: 4px;">${review.name}</h4>
                        <p style="opacity: 0.6; font-size: 0.875rem;">Met ${review.celebrity}</p>
                    </div>
                    <div style="color: gold; font-size: 1rem;">
                        ${'★'.repeat(review.rating)}
                    </div>
                </div>
                <p style="opacity: 0.9; line-height: 1.6; margin-bottom: 12px;">${review.text}</p>
                <p style="opacity: 0.5; font-size: 0.875rem;">${review.date}</p>
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
