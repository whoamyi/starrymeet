/**
 * Celebrity Profile - UI Interaction Functions
 * Instagram-style social features
 */

// Follow toggle
let isFollowing = false;

function toggleFollow() {
    const btn = document.getElementById('follow-btn');
    isFollowing = !isFollowing;

    if (isFollowing) {
        btn.classList.add('following');
        btn.querySelector('.btn-text').textContent = 'Following';
    } else {
        btn.classList.remove('following');
        btn.querySelector('.btn-text').textContent = 'Follow';
    }
}

// Bio expand/collapse
function toggleBio() {
    const bio = document.getElementById('bio');
    const btn = document.getElementById('bio-expand');

    if (bio.classList.contains('collapsed')) {
        bio.classList.remove('collapsed');
        btn.textContent = 'less';
    } else {
        bio.classList.add('collapsed');
        btn.textContent = 'more';
    }
}

// Share profile
function shareProfile() {
    const url = window.location.href;
    const name = document.getElementById('celebrity-name').textContent;

    if (navigator.share) {
        navigator.share({
            title: `${name} - StarryMeet`,
            text: `Check out ${name}'s profile on StarryMeet`,
            url: url
        }).catch(err => console.log('Share failed:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            showToast('Link copied to clipboard!');
        });
    }
}

// Check if bio needs expand button
function checkBioLength() {
    const bio = document.getElementById('bio');
    const expandBtn = document.getElementById('bio-expand');

    if (!bio || !expandBtn) return;

    // Check if content is longer than 2 lines
    const lineHeight = parseFloat(window.getComputedStyle(bio).lineHeight);
    const maxHeight = lineHeight * 2;

    bio.classList.add('collapsed');
    const scrollHeight = bio.scrollHeight;

    if (scrollHeight > maxHeight) {
        expandBtn.style.display = 'block';
    } else {
        expandBtn.style.display = 'none';
        bio.classList.remove('collapsed');
    }
}

// Initialize after profile loads
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(checkBioLength, 500);
});

// Make functions global
window.toggleFollow = toggleFollow;
window.toggleBio = toggleBio;
window.shareProfile = shareProfile;
