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
async function handleEmailLogin(event) {
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

    // Authenticate user with backend API
    showLoading('loginBtn');

    try {
        const response = await window.api.login(email, password);

        if (response.success) {
            closeAuthModal();
            showSuccessMessage(`Welcome back, ${response.data.user.first_name}!`);

            const returnUrl = sessionStorage.getItem('authReturnUrl') || 'dashboard.html';
            sessionStorage.removeItem('authReturnUrl');
            setTimeout(() => {
                window.location.href = returnUrl;
            }, 1000);
        } else {
            document.getElementById('loginBtn').disabled = false;
            document.getElementById('loginBtn').style.opacity = '1';
            document.getElementById('loginBtn').innerHTML = 'Log in';
            showError(errorDiv, response.error?.message || 'Login failed');
        }
    } catch (error) {
        document.getElementById('loginBtn').disabled = false;
        document.getElementById('loginBtn').style.opacity = '1';
        document.getElementById('loginBtn').innerHTML = 'Log in';
        showError(errorDiv, error.message || 'Login failed. Please try again.');
    }
}

// Email/Password Signup
async function handleEmailSignup(event) {
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

    // Create user account with backend API
    showLoading('signupBtn');

    try {
        // Split name into first_name and last_name
        const nameParts = name.trim().split(' ');
        const first_name = nameParts[0];
        const last_name = nameParts.slice(1).join(' ') || nameParts[0];

        const response = await window.api.register({
            email: email,
            password: password,
            first_name: first_name,
            last_name: last_name
        });

        if (response.success) {
            closeAuthModal();
            showSuccessMessage('Account created successfully!');

            // Redirect based on context
            const returnUrl = sessionStorage.getItem('authReturnUrl') || 'dashboard.html';
            sessionStorage.removeItem('authReturnUrl');
            setTimeout(() => {
                window.location.href = returnUrl;
            }, 1000);
        } else {
            document.getElementById('signupBtn').disabled = false;
            document.getElementById('signupBtn').style.opacity = '1';
            document.getElementById('signupBtn').innerHTML = 'Create account';
            showError(errorDiv, response.error?.message || 'Registration failed');
        }
    } catch (error) {
        document.getElementById('signupBtn').disabled = false;
        document.getElementById('signupBtn').style.opacity = '1';
        document.getElementById('signupBtn').innerHTML = 'Create account';
        showError(errorDiv, error.message || 'Registration failed. Please try again.');
    }
}

// OAuth Handlers (Google, Apple, Facebook)
function handleGoogleLogin() {
    showLoading('googleLoginBtn');

    // In production: Initialize Google OAuth
    // window.google.accounts.id.initialize({...})

    setTimeout(() => {
        try {
            // For demo: create unique Google account
            const email = 'google_' + Date.now() + '@gmail.com';
            const user = createUser({
                name: 'Google User',
                email: email,
                password: 'google_oauth_' + Date.now(),
                avatar: 'https://ui-avatars.com/api/?name=Google+User&background=EA1279&color=fff'
            });

            closeAuthModal();
            showSuccessMessage(`Welcome, ${user.name}!`);

            const returnUrl = sessionStorage.getItem('authReturnUrl') || 'dashboard.html';
            sessionStorage.removeItem('authReturnUrl');
            setTimeout(() => {
                window.location.href = returnUrl;
            }, 1000);
        } catch (error) {
            console.error('Google login failed:', error);
            alert('Login failed. Please try again.');
        }
    }, 1500);
}

function handleAppleLogin() {
    showLoading('appleLoginBtn');

    // In production: Initialize Apple Sign In
    // AppleID.auth.init({...})

    setTimeout(() => {
        try {
            const email = 'apple_' + Date.now() + '@icloud.com';
            const user = createUser({
                name: 'Apple User',
                email: email,
                password: 'apple_oauth_' + Date.now(),
                avatar: 'https://ui-avatars.com/api/?name=Apple+User&background=000&color=fff'
            });

            closeAuthModal();
            showSuccessMessage(`Welcome, ${user.name}!`);

            const returnUrl = sessionStorage.getItem('authReturnUrl') || 'dashboard.html';
            sessionStorage.removeItem('authReturnUrl');
            setTimeout(() => {
                window.location.href = returnUrl;
            }, 1000);
        } catch (error) {
            console.error('Apple login failed:', error);
            alert('Login failed. Please try again.');
        }
    }, 1500);
}

function handleFacebookLogin() {
    showLoading('facebookLoginBtn');

    // In production: Initialize Facebook Login
    // FB.login(...)

    setTimeout(() => {
        try {
            const email = 'facebook_' + Date.now() + '@facebook.com';
            const user = createUser({
                name: 'Facebook User',
                email: email,
                password: 'facebook_oauth_' + Date.now(),
                avatar: 'https://ui-avatars.com/api/?name=Facebook+User&background=1877F2&color=fff'
            });

            closeAuthModal();
            showSuccessMessage(`Welcome, ${user.name}!`);

            const returnUrl = sessionStorage.getItem('authReturnUrl') || 'dashboard.html';
            sessionStorage.removeItem('authReturnUrl');
            setTimeout(() => {
                window.location.href = returnUrl;
            }, 1000);
        } catch (error) {
            console.error('Facebook login failed:', error);
            alert('Login failed. Please try again.');
        }
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
    logoutUser(); // Uses new shared.js function
    showSuccessMessage('Logged out successfully');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Check Auth State
function checkAuthState() {
    const user = getCurrentUser();
    const currentPage = window.location.pathname.split('/').pop();

    // Redirect to dashboard if already logged in and on homepage
    if (user && currentPage === 'index.html') {
        const loginButtons = document.querySelectorAll('[onclick*="openAuthModal"]');
        loginButtons.forEach(btn => {
            btn.setAttribute('onclick', "window.location.href='dashboard.html'");
            btn.textContent = 'Dashboard';
        });
    }

    // Protect dashboard page
    if (currentPage === 'dashboard.html' && !user) {
        sessionStorage.setItem('authReturnUrl', 'dashboard.html');
        window.location.href = 'index.html';
        // Show auth modal after redirect
        setTimeout(() => {
            if (typeof openAuthModal === 'function') {
                openAuthModal('login');
            }
        }, 500);
    }

    // Update user display if logged in
    if (user) {
        updateUserDisplay(user);
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
