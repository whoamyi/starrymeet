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
            // Update hero image with photo or initials
            const heroImage = document.querySelector('.hero-image');
            if (heroImage) {
                if (celebrity.imageUrl) {
                    // Use celebrity photo if available
                    heroImage.style.backgroundImage = `url('${celebrity.imageUrl}')`;
                    heroImage.style.backgroundSize = 'cover';
                    heroImage.style.backgroundPosition = 'center';
                    heroImage.textContent = '';
                } else {
                    // Fallback to colored initials
                    const initials = getInitials(celebrity.name);
                    const color = getColorForCelebrity(celebrity.name);
                    heroImage.textContent = initials;
                    heroImage.style.background = color;
                }
            }

            // Update hero section
            const heroNameElement = document.querySelector('.celebrity-name');
            if (heroNameElement) {
                heroNameElement.textContent = celebrity.name;
            }

            const categoryBadge = document.querySelector('.category-badge');
            if (categoryBadge) {
                categoryBadge.textContent = celebrity.mainCategory || celebrity.category || '';
            }

            // Update bio if available
            const bioElement = document.querySelector('.bio');
            if (bioElement && celebrity.bio) {
                bioElement.textContent = celebrity.bio;
            }

            // Update rating
            const ratingElement = document.querySelector('.rating span:last-child');
            if (ratingElement) {
                ratingElement.textContent = `${celebrity.rating || 4.9} (${celebrity.reviews || 127} reviews)`;
            }

            // Update quick stats
            const statsContainer = document.querySelector('.quick-stats');
            if (statsContainer && celebrity.meetings) {
                const statValues = statsContainer.querySelectorAll('.stat-value');
                if (statValues.length >= 2) {
                    // Update meetings count
                    statValues[0].textContent = `${celebrity.meetings}+`;
                    // Update rating value
                    statValues[1].textContent = `${celebrity.rating || 4.9}★`;
                }
            }

            // Update pricing
            const priceElements = document.querySelectorAll('.price-display, #selectedPrice');
            priceElements.forEach(el => {
                el.textContent = formatPrice(celebrity.price);
            });

            // Update sticky price
            const stickyPrice = document.getElementById('stickyPrice');
            if (stickyPrice) {
                stickyPrice.textContent = formatPrice(celebrity.price);
            }

            // Generate dynamic meeting options based on celebrity price
            generateMeetingOptions(celebrity.price);

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
            // Get currently selected meeting option data from the page's bookingState
            const selectedPrice = window.bookingState?.price || celebrity.price;
            const selectedMeetingType = window.bookingState?.meetingType || 'Standard Meet';
            const selectedDuration = window.bookingState?.duration || '30 minutes';

            // Save celebrity and selected meeting option to booking context
            saveCurrentBooking({
                celebrityName: celebrity.name,
                mainCategory: celebrity.mainCategory || celebrity.category,
                subCategory: celebrity.subCategory,
                price: selectedPrice,
                meetingType: selectedMeetingType,
                duration: selectedDuration,
                location: celebrity.city,
                country: celebrity.country
            });

            // Check if user is logged in
            if (!isAuthenticated()) {
                sessionStorage.setItem('authReturnUrl', `booking.html?celebrity=${encodeURIComponent(celebrity.name)}`);
                openAuthModal('login');
                return;
            }

            // Redirect to booking page
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

        // Generate dynamic meeting options based on celebrity's base price
        function generateMeetingOptions(basePrice) {
            const meetingOptionsContainer = document.querySelector('.meeting-options');
            if (!meetingOptionsContainer) return;

            // Calculate tier prices based on celebrity's base price
            // Quick Meet: 30-40% of base price
            // Standard Meet: Base price (100%)
            // Premium Experience: 200-250% of base price
            const quickPrice = Math.round(basePrice * 0.35);
            const standardPrice = basePrice;
            const premiumPrice = Math.round(basePrice * 2.2);

            meetingOptionsContainer.innerHTML = `
                <div class="meeting-option" onclick="selectOption(this, ${quickPrice})">
                    <div class="option-left">
                        <div class="option-name">Quick Meet</div>
                        <div class="option-duration">15 minutes</div>
                        <div class="option-features">
                            <span class="feature-tag">Quick chat</span>
                            <span class="feature-tag">1-2 photos</span>
                            <span class="feature-tag">Autograph</span>
                        </div>
                    </div>
                    <div class="option-right">
                        <div class="option-price">${formatPrice(quickPrice)}</div>
                    </div>
                </div>

                <div class="meeting-option selected" onclick="selectOption(this, ${standardPrice})">
                    <div class="option-left">
                        <div class="option-name">Standard Meet</div>
                        <div class="option-duration">30 minutes</div>
                        <div class="option-features">
                            <span class="feature-tag">Extended Q&A</span>
                            <span class="feature-tag">Multiple photos</span>
                            <span class="feature-tag">Signed memorabilia</span>
                            <span class="feature-tag">Personal message</span>
                        </div>
                    </div>
                    <div class="option-right">
                        <div class="option-price">${formatPrice(standardPrice)}</div>
                    </div>
                </div>

                <div class="meeting-option" onclick="selectOption(this, ${premiumPrice})">
                    <div class="option-left">
                        <div class="option-name">Premium Experience</div>
                        <div class="option-duration">60 minutes</div>
                        <div class="option-features">
                            <span class="feature-tag">In-depth conversation</span>
                            <span class="feature-tag">Professional photos</span>
                            <span class="feature-tag">Exclusive merchandise</span>
                            <span class="feature-tag">Behind-the-scenes access</span>
                            <span class="feature-tag">Video message</span>
                        </div>
                    </div>
                    <div class="option-right">
                        <div class="option-price">${formatPrice(premiumPrice)}</div>
                    </div>
                </div>
            `;

            // Update the sidebar price to show standard price by default
            const priceDisplay = document.getElementById('selectedPrice');
            if (priceDisplay) {
                priceDisplay.textContent = formatPrice(standardPrice);
            }
        }

        // Make functions globally available
        window.handleRequestBooking = handleRequestBooking;
        window.handleAddToFavorites = handleAddToFavorites;
        window.generateMeetingOptions = generateMeetingOptions;
    }
}

console.log('Celebrity Profile initialized for:', celebrityName);
