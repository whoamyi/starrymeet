// Authentication System for StarryMeet
// Handles login, signup, OAuth, and session management

// Auth Modal Management
function openAuthModal(mode = 'login') {
    const modal = document.getElementById('authModal');
    const loginView = document.getElementById('loginView');
    const signupView = document.getElementById('signupView');

    if (mode === 'login') {
        loginView.style.display = 'block';
        signupView.style.display = 'none';
    } else {
        loginView.style.display = 'none';
        signupView.style.display = 'block';
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';

    // Clear form inputs
    document.querySelectorAll('.auth-modal input').forEach(input => input.value = '');
    document.querySelectorAll('.auth-error').forEach(error => error.style.display = 'none');
}

function switchToSignup() {
    document.getElementById('loginView').style.display = 'none';
    document.getElementById('signupView').style.display = 'block';
}

function switchToLogin() {
    document.getElementById('signupView').style.display = 'none';
    document.getElementById('loginView').style.display = 'block';
}

// Email/Password Login
function handleEmailLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    // Basic validation
    if (!email || !password) {
        showError(errorDiv, 'Please enter both email and password');
        return;
    }

    if (!isValidEmail(email)) {
        showError(errorDiv, 'Please enter a valid email address');
        return;
    }

    // Simulate API call (replace with actual backend)
    showLoading('loginBtn');

    setTimeout(() => {
        // For demo: accept any email/password
        // In production: validate against backend
        const userData = {
            email: email,
            name: email.split('@')[0],
            loginMethod: 'email'
        };

        loginSuccess(userData);
    }, 1000);
}

// Email/Password Signup
function handleEmailSignup(event) {
    event.preventDefault();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const errorDiv = document.getElementById('signupError');

    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showError(errorDiv, 'Please fill in all fields');
        return;
    }

    if (!isValidEmail(email)) {
        showError(errorDiv, 'Please enter a valid email address');
        return;
    }

    if (password.length < 8) {
        showError(errorDiv, 'Password must be at least 8 characters');
        return;
    }

    if (password !== confirmPassword) {
        showError(errorDiv, 'Passwords do not match');
        return;
    }

    // Simulate API call
    showLoading('signupBtn');

    setTimeout(() => {
        const userData = {
            name: name,
            email: email,
            loginMethod: 'email'
        };

        loginSuccess(userData);
    }, 1000);
}

// OAuth Handlers (Google, Apple, Facebook)
function handleGoogleLogin() {
    showLoading('googleLoginBtn');

    // In production: Initialize Google OAuth
    // window.google.accounts.id.initialize({...})

    setTimeout(() => {
        const userData = {
            name: 'Demo User',
            email: 'demo@gmail.com',
            loginMethod: 'google',
            avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=EA1279&color=fff'
        };

        loginSuccess(userData);
    }, 1500);
}

function handleAppleLogin() {
    showLoading('appleLoginBtn');

    // In production: Initialize Apple Sign In
    // AppleID.auth.init({...})

    setTimeout(() => {
        const userData = {
            name: 'Demo User',
            email: 'demo@icloud.com',
            loginMethod: 'apple',
            avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=000&color=fff'
        };

        loginSuccess(userData);
    }, 1500);
}

function handleFacebookLogin() {
    showLoading('facebookLoginBtn');

    // In production: Initialize Facebook Login
    // FB.login(...)

    setTimeout(() => {
        const userData = {
            name: 'Demo User',
            email: 'demo@facebook.com',
            loginMethod: 'facebook',
            avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=1877F2&color=fff'
        };

        loginSuccess(userData);
    }, 1500);
}

// Login Success Handler
function loginSuccess(userData) {
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');

    // Close modal
    closeAuthModal();

    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}

// Logout Handler
function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    window.location.href = 'index.html';
}

// Check Auth State
function checkAuthState() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const currentPage = window.location.pathname.split('/').pop();

    // Redirect to dashboard if already logged in and trying to access auth modal
    if (isAuthenticated && currentPage === 'index.html') {
        const loginButtons = document.querySelectorAll('[onclick*="openAuthModal"]');
        loginButtons.forEach(btn => {
            btn.setAttribute('onclick', "window.location.href='dashboard.html'");
            btn.textContent = 'Dashboard';
        });
    }

    // Protect dashboard page
    if (currentPage === 'dashboard.html' && !isAuthenticated) {
        window.location.href = 'index.html';
    }

    // Update user display if logged in
    if (isAuthenticated) {
        const userData = JSON.parse(localStorage.getItem('user'));
        updateUserDisplay(userData);
    }
}

function updateUserDisplay(userData) {
    // Update nav to show user info instead of login
    const loginBtns = document.querySelectorAll('.nav-links li:last-child');
    loginBtns.forEach(btn => {
        btn.innerHTML = `<a href="dashboard.html">${userData.name}</a>`;
    });
}

// Utility Functions
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(errorDiv, message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function showLoading(btnId) {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.disabled = true;
        btn.style.opacity = '0.6';
        btn.innerHTML = '<span style="display:inline-block;width:16px;height:16px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:spin 0.6s linear infinite;"></span>';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthState();

    // Close modal on outside click
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAuthModal();
            }
        });
    }
});

// Add spinner animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
