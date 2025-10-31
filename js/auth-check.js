/**
 * Auth Check Utility
 * Shared authentication helper for protected pages
 */

function getToken() {
    return localStorage.getItem('starryMeetToken') || getCookie('token');
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

async function checkAuth() {
    const token = getToken();
    if (!token) {
        window.location.href = 'auth.html';
        return false;
    }

    try {
        const response = await fetch(`${window.API_BASE_URL || 'https://starrymeet-backend.onrender.com'}/api/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            localStorage.removeItem('starryMeetToken');
            window.location.href = 'auth.html';
            return false;
        }

        return true;
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = 'auth.html';
        return false;
    }
}

// Note: Auto-check disabled to prevent redirect loops
// Pages should call checkAuth() explicitly if needed
// Dashboard.js already handles auth checking in its init() method

// Export for use in other scripts
window.authHelpers = {
    getToken,
    getCookie,
    checkAuth
};
