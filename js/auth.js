/**
 * StarryMeet Authentication - Frontend
 */

(function() {
  'use strict';

  // ===================================
  // CONFIGURATION
  // ===================================

  // Environment-aware API URL configuration
  const getAPIBaseURL = () => {
    // Check if we're in development (localhost)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000/api';
    }

    // Production - Render backend URL
    return 'https://starrymeet-backend.onrender.com/api';
  };

  const API_BASE_URL = getAPIBaseURL();
  const SESSION_STORAGE_KEY = 'starrymeet_session';
  const USER_STORAGE_KEY = 'starrymeet_user';

  // ===================================
  // INITIALIZATION
  // ===================================

  function init() {
    setupEventListeners();
    checkExistingSession();
    preventZoomOnFocus();
  }

  // ===================================
  // PREVENT ZOOM ON INPUT FOCUS (Mobile)
  // ===================================

  function preventZoomOnFocus() {
    // Ensure inputs are at least 16px to prevent iOS zoom
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      const fontSize = window.getComputedStyle(input).fontSize;
      if (parseInt(fontSize) < 16) {
        input.style.fontSize = '16px';
      }
    });
  }

  // ===================================
  // FORM SWITCHING
  // ===================================

  window.showSignIn = function() {
    hideAllForms();
    document.getElementById('signinForm').classList.add('active');
  };

  window.showSignUp = function() {
    hideAllForms();
    document.getElementById('signupForm').classList.add('active');
  };

  window.showForgotPassword = function() {
    hideAllForms();
    document.getElementById('forgotPasswordForm').classList.add('active');
  };

  function hideAllForms() {
    document.querySelectorAll('.auth-form').forEach(form => {
      form.classList.remove('active');
    });
  }

  // ===================================
  // PASSWORD VISIBILITY TOGGLE
  // ===================================

  window.togglePasswordVisibility = function(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
      input.type = 'text';
    } else {
      input.type = 'password';
    }
  };

  // Alias for new HTML structure
  window.togglePassword = window.togglePasswordVisibility;

  // ===================================
  // PASSWORD STRENGTH
  // ===================================

  function setupPasswordStrength() {
    const passwordInput = document.getElementById('signup-password');
    const strengthIndicator = document.getElementById('password-strength');
    const strengthBar = document.getElementById('strength-bar-fill');
    const strengthText = document.getElementById('strength-text');

    if (passwordInput) {
      passwordInput.addEventListener('input', (e) => {
        const password = e.target.value;

        if (password.length === 0) {
          strengthIndicator.classList.remove('active');
          return;
        }

        strengthIndicator.classList.add('active');

        // Calculate strength
        const strength = calculatePasswordStrength(password);

        // Update UI
        strengthBar.className = 'strength-bar-fill';
        strengthText.className = 'strength-text';

        if (strength < 40) {
          strengthBar.classList.add('weak');
          strengthText.classList.add('weak');
          strengthText.textContent = 'Weak password';
        } else if (strength < 70) {
          strengthBar.classList.add('medium');
          strengthText.classList.add('medium');
          strengthText.textContent = 'Medium strength';
        } else {
          strengthBar.classList.add('strong');
          strengthText.classList.add('strong');
          strengthText.textContent = 'Strong password';
        }
      });
    }
  }

  function calculatePasswordStrength(password) {
    let strength = 0;

    // Length
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;

    // Lowercase
    if (/[a-z]/.test(password)) strength += 15;

    // Uppercase
    if (/[A-Z]/.test(password)) strength += 15;

    // Numbers
    if (/[0-9]/.test(password)) strength += 15;

    // Special characters
    if (/[^a-zA-Z0-9]/.test(password)) strength += 15;

    return Math.min(strength, 100);
  }

  // ===================================
  // SIGN IN
  // ===================================

  window.handleSignIn = async function(event) {
    event.preventDefault();

    const email = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // Clear errors
    clearFormErrors('signin');

    // Validate
    if (!email || !password) {
      showToast('error', 'Error', 'Please fill in all fields');
      return;
    }

    // Show loading
    const btn = document.getElementById('signin-btn');
    btn.classList.add('loading');
    btn.disabled = true;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign in failed');
      }

      // Store session
      storeSession(data.session, data.user);

      // Show success
      showToast('success', 'Welcome back!', 'Redirecting to dashboard...');

      // Redirect
      setTimeout(() => {
        const redirect = new URLSearchParams(window.location.search).get('redirect');
        window.location.href = redirect || 'dashboard.html';
      }, 1000);

    } catch (error) {
      console.error('Sign in error:', error);
      showToast('error', 'Sign in failed', error.message);

      // Show field errors if available
      if (error.fields) {
        Object.keys(error.fields).forEach(field => {
          showFieldError('signin', field, error.fields[field]);
        });
      }
    } finally {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  };

  // ===================================
  // SIGN UP
  // ===================================

  window.handleSignUp = async function(event) {
    event.preventDefault();

    const firstName = document.getElementById('signup-firstname').value.trim();
    const lastName = document.getElementById('signup-lastname').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const termsAgree = document.getElementById('terms-agree').checked;

    // Clear errors
    clearFormErrors('signup');

    // Validate
    let hasError = false;

    if (!firstName) {
      showFieldError('signup', 'firstname', 'First name is required');
      hasError = true;
    }

    if (!lastName) {
      showFieldError('signup', 'lastname', 'Last name is required');
      hasError = true;
    }

    if (!email || !isValidEmail(email)) {
      showFieldError('signup', 'email', 'Valid email is required');
      hasError = true;
    }

    if (!password || password.length < 8) {
      showFieldError('signup', 'password', 'Password must be at least 8 characters');
      hasError = true;
    }

    if (password !== confirmPassword) {
      showFieldError('signup', 'confirm-password', 'Passwords do not match');
      hasError = true;
    }

    if (!termsAgree) {
      showToast('error', 'Error', 'You must agree to the terms and conditions');
      hasError = true;
    }

    if (hasError) return;

    // Show loading
    const btn = document.getElementById('signup-btn');
    btn.classList.add('loading');
    btn.disabled = true;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign up failed');
      }

      // Store session
      storeSession(data.session, data.user);

      // Show success
      showToast('success', 'Account created!', 'Welcome to StarryMeet');

      // Redirect
      setTimeout(() => {
        const redirect = new URLSearchParams(window.location.search).get('redirect');
        window.location.href = redirect || 'dashboard.html';
      }, 1000);

    } catch (error) {
      console.error('Sign up error:', error);
      showToast('error', 'Sign up failed', error.message);

      // Show field errors if available
      if (error.fields) {
        Object.keys(error.fields).forEach(field => {
          showFieldError('signup', field, error.fields[field]);
        });
      }
    } finally {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  };

  // ===================================
  // FORGOT PASSWORD
  // ===================================

  window.handleForgotPassword = async function(event) {
    event.preventDefault();

    const email = document.getElementById('forgot-email').value.trim();

    // Clear errors
    clearFormErrors('forgot');

    // Validate
    if (!email || !isValidEmail(email)) {
      showFieldError('forgot', 'email', 'Valid email is required');
      return;
    }

    // Show loading
    const btn = document.getElementById('forgot-btn');
    btn.classList.add('loading');
    btn.disabled = true;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      // Show success
      showToast('success', 'Email sent!', 'Check your inbox for the reset link');

      // Switch back to sign in
      setTimeout(() => {
        showSignIn();
      }, 2000);

    } catch (error) {
      console.error('Forgot password error:', error);
      showToast('error', 'Request failed', error.message);
    } finally {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  };

  // ===================================
  // SOCIAL AUTH
  // ===================================

  window.signInWithGoogle = function() {
    showToast('info', 'Coming soon', 'Google sign in will be available soon');
  };

  window.signUpWithGoogle = function() {
    showToast('info', 'Coming soon', 'Google sign up will be available soon');
  };

  window.signInWithApple = function() {
    showToast('info', 'Coming soon', 'Apple sign in will be available soon');
  };

  window.signUpWithApple = function() {
    showToast('info', 'Coming soon', 'Apple sign up will be available soon');
  };

  // ===================================
  // SESSION MANAGEMENT
  // ===================================

  function storeSession(session, user) {
    // Store session token (for auth.js compatibility)
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

    // Store user data (for auth.js compatibility)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

    // ALSO store in format expected by dashboard/api-client
    localStorage.setItem('starryMeetToken', session.token);
    localStorage.setItem('starryMeetUser', JSON.stringify(user));
  }

  function getSession() {
    try {
      const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  function getUser() {
    try {
      const userData = localStorage.getItem(USER_STORAGE_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  function clearSession() {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    // Also clear dashboard/api-client tokens
    localStorage.removeItem('starryMeetToken');
    localStorage.removeItem('starryMeetUser');
  }

  function checkExistingSession() {
    const session = getSession();

    if (session && session.token) {
      // Check if session is still valid
      verifySession(session.token).then(isValid => {
        if (isValid) {
          // Redirect to intended destination if already logged in
          const currentPath = window.location.pathname;
          if (currentPath.includes('auth.html') || currentPath.includes('login.html')) {
            const redirect = new URLSearchParams(window.location.search).get('redirect');
            window.location.href = redirect || 'dashboard.html';
          }
        } else {
          clearSession();
        }
      });
    }
  }

  async function verifySession(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Session verification error:', error);
      return false;
    }
  }

  // ===================================
  // HELPERS
  // ===================================

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function clearFormErrors(formType) {
    document.querySelectorAll(`#${formType}Form .form-group`).forEach(group => {
      group.classList.remove('error');
    });

    document.querySelectorAll(`#${formType}Form .form-error`).forEach(error => {
      error.textContent = '';
    });
  }

  function showFieldError(formType, field, message) {
    const input = document.getElementById(`${formType}-${field}`);
    const errorSpan = document.getElementById(`${formType}-${field}-error`);

    if (input && errorSpan) {
      const formGroup = input.closest('.form-group');
      if (formGroup) {
        formGroup.classList.add('error');
      }
      errorSpan.textContent = message;
    }
  }

  // ===================================
  // TOAST NOTIFICATIONS
  // ===================================

  function showToast(type, title, message) {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toast-icon');
    const titleEl = document.getElementById('toast-title');
    const messageEl = document.getElementById('toast-message');

    // Set content
    titleEl.textContent = title;
    messageEl.textContent = message;

    // Set type
    toast.className = 'toast active ' + type;

    // Set icon
    if (type === 'success') {
      icon.textContent = '✓';
    } else if (type === 'error') {
      icon.textContent = '✕';
    } else {
      icon.textContent = 'ℹ';
    }

    // Auto hide after 5 seconds
    setTimeout(() => {
      closeToast();
    }, 5000);
  }

  window.closeToast = function() {
    document.getElementById('toast').classList.remove('active');
  };

  // ===================================
  // EVENT LISTENERS
  // ===================================

  function setupEventListeners() {
    setupPasswordStrength();

    // Handle keyboard on mobile
    if ('visualViewport' in window) {
      window.visualViewport.addEventListener('resize', handleViewportResize);
    }
  }

  function handleViewportResize() {
    // Adjust page when keyboard shows/hides
    const viewport = window.visualViewport;
    if (viewport) {
      document.documentElement.style.height = `${viewport.height}px`;
    }
  }

  // ===================================
  // EXPORT FOR OTHER PAGES
  // ===================================

  window.StarryAuth = {
    getSession,
    getUser,
    clearSession,
    verifySession,

    isAuthenticated: function() {
      return !!getSession();
    },

    requireAuth: async function(redirectUrl = 'auth.html') {
      const session = getSession();

      if (!session || !session.token) {
        const currentUrl = window.location.pathname + window.location.search;
        window.location.href = redirectUrl + '?redirect=' + encodeURIComponent(currentUrl);
        return false;
      }

      const isValid = await verifySession(session.token);

      if (!isValid) {
        clearSession();
        const currentUrl = window.location.pathname + window.location.search;
        window.location.href = redirectUrl + '?redirect=' + encodeURIComponent(currentUrl);
        return false;
      }

      return true;
    },

    logout: async function() {
      const session = getSession();

      if (session && session.token) {
        try {
          await fetch(`${API_BASE_URL}/auth/signout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.token}`
            }
          });
        } catch (error) {
          console.error('Logout error:', error);
        }
      }

      clearSession();
      window.location.href = 'index.html';
    }
  };

  // ===================================
  // INIT
  // ===================================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
