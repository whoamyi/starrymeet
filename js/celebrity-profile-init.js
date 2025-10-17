/**
 * Celebrity Profile Page Initialization
 * Loads real celebrity data from CELEBRITIES array
 */

// Get celebrity name from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const celebrityName = urlParams.get('name');

if (!celebrityName) {
    // Redirect to browse if no celebrity specified
    window.location.href = 'browse.html';
} else {
    // Load celebrity data from shared.js CELEBRITIES array
    const celebrity = getCelebrityByName(celebrityName);

    if (!celebrity) {
        // Celebrity not found - show error
        document.body.innerHTML = `
            <nav role="navigation" aria-label="Main navigation" id="navbar">
                <div class="nav-container">
                    <a href="index.html" class="logo" style="color: #ffffff;">StarryMeet</a>
                </div>
            </nav>
            <div style="text-align: center; padding: 200px 20px; color: white;">
                <h1 style="font-size: 3rem; margin-bottom: 20px;">Celebrity Not Found</h1>
                <p style="font-size: 1.2rem; margin-bottom: 40px; opacity: 0.8;">Sorry, we couldn't find that celebrity.</p>
                <a href="browse.html" class="btn btn-primary" style="padding: 16px 32px; font-size: 1rem;">Browse All Celebrities</a>
            </div>
        `;
    } else {
        // Populate page with real celebrity data
        document.addEventListener('DOMContentLoaded', function() {
            // Update hero section
            const heroNameElement = document.querySelector('.profile-hero h1');
            if (heroNameElement) {
                heroNameElement.textContent = celebrity.name;
            }

            const heroCategoryElement = document.querySelector('.profile-hero .category-tag');
            if (heroCategoryElement) {
                heroCategoryElement.textContent = celebrity.category;
            }

            const heroLocationElement = document.querySelector('.profile-hero .location');
            if (heroLocationElement) {
                heroLocationElement.textContent = celebrity.location;
            }

            // Update pricing
            const priceElements = document.querySelectorAll('.price-amount, .hero-price');
            priceElements.forEach(el => {
                el.textContent = formatPrice(celebrity.price);
            });

            // Generate and display testimonials
            const testimonials = generateTestimonialsForCelebrity(celebrity.name);
            const testimonialsContainer = document.getElementById('testimonialsContainer');
            if (testimonialsContainer && testimonials.length > 0) {
                testimonialsContainer.innerHTML = testimonials.map(t => `
                    <div class="testimonial-card">
                        <div class="testimonial-header">
                            <div class="testimonial-avatar" style="background: ${t.color}">
                                ${t.initials}
                            </div>
                            <div class="testimonial-author">
                                <h4>${t.name}</h4>
                                <p>${t.location}</p>
                            </div>
                            <div class="testimonial-rating">
                                ${'★'.repeat(t.rating)}
                            </div>
                        </div>
                        <p class="testimonial-text">${t.text}</p>
                        <p class="testimonial-date">${t.date}</p>
                    </div>
                `).join('');
            }

            // Update all "Request to book" buttons with celebrity context
            const bookingButtons = document.querySelectorAll('.request-booking-btn, .sticky-booking-btn, [onclick*="requestBooking"]');
            bookingButtons.forEach(btn => {
                btn.onclick = function(e) {
                    e.preventDefault();
                    handleRequestBooking();
                };
            });

            // Check if user has favorited this celebrity
            updateFavoriteButton();
        });

        // Handle booking request
        function handleRequestBooking() {
            // Save celebrity to booking context
            saveCurrentBooking({
                celebrityName: celebrity.name,
                category: celebrity.category,
                price: celebrity.price,
                location: celebrity.city,
                country: celebrity.country
            });

            // Check if user is logged in
            if (!isAuthenticated()) {
                sessionStorage.setItem('authReturnUrl', `booking.html?celebrity=${encodeURIComponent(celebrity.name)}`);
                openAuthModal('login');
                return;
            }

            // Redirect to booking
            window.location.href = `booking.html?celebrity=${encodeURIComponent(celebrity.name)}`;
        }

        // Handle add to favorites
        function handleAddToFavorites() {
            if (!isAuthenticated()) {
                sessionStorage.setItem('authReturnUrl', window.location.href);
                openAuthModal('login');
                return;
            }

            const user = getCurrentUser();
            const isFav = isFavorite(user.id, celebrity.name);

            if (isFav) {
                removeFromFavorites(user.id, celebrity.name);
                showSuccessMessage('Removed from favorites');
            } else {
                addToFavorites(user.id, celebrity.name);
                showSuccessMessage('Added to favorites');
            }

            updateFavoriteButton();
        }

        // Update favorite button state
        function updateFavoriteButton() {
            const favoriteBtn = document.getElementById('favoriteBtn');
            if (!favoriteBtn) return;

            const user = getCurrentUser();
            if (!user) {
                favoriteBtn.innerHTML = '♡ Add to Favorites';
                favoriteBtn.onclick = handleAddToFavorites;
                return;
            }

            const isFav = isFavorite(user.id, celebrity.name);
            favoriteBtn.innerHTML = isFav ? '♥ Favorited' : '♡ Add to Favorites';
            favoriteBtn.onclick = handleAddToFavorites;
            favoriteBtn.style.color = isFav ? 'var(--primary)' : 'inherit';
        }

        // Make functions globally available
        window.handleRequestBooking = handleRequestBooking;
        window.handleAddToFavorites = handleAddToFavorites;
    }
}

console.log('Celebrity Profile initialized for:', celebrityName);
