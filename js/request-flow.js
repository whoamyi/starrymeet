/**
 * StarryMeet Request Flow - JavaScript
 * 3-Step Process with Dynamic Data
 */

(function() {
  'use strict';

  // ===================================
  // STATE MANAGEMENT
  // ===================================

  const requestState = {
    currentStep: 1,
    celebrityData: null,
    selectedSlot: null,
    formData: {},
    promoApplied: false
  };

  // Color palettes for celebrity initials
  const colorPalettes = [
    'linear-gradient(135deg, #667eea, #764ba2)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #fa709a, #fee140)',
    'linear-gradient(135deg, #30cfd0, #330867)',
    'linear-gradient(135deg, #a8edea, #fed6e3)',
    'linear-gradient(135deg, #ff9a9e, #fecfef)',
    'linear-gradient(135deg, #ffecd2, #fcb69f)',
    'linear-gradient(135deg, #ff6e7f, #bfe9ff)'
  ];

  // ===================================
  // INITIALIZATION
  // ===================================

  function init() {
    loadCelebrityData();
    setupEventListeners();
    updateProgress();
  }

  // ===================================
  // LOAD CELEBRITY DATA (DYNAMIC)
  // ===================================

  async function loadCelebrityData() {
    // Get celebrity slug and slot from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const celebSlug = urlParams.get('celebrity');
    const slotId = urlParams.get('slot');

    if (!celebSlug || !slotId) {
      // No celebrity or slot selected - redirect
      console.warn('No celebrity or slot specified, redirecting to browse page');
      window.location.href = 'browse.html';
      return;
    }

    try {
      // Load celebrity profile from API
      if (!window.api || !window.api.getCelebrityProfile) {
        throw new Error('API not initialized');
      }

      const response = await window.api.getCelebrityProfile(celebSlug);

      if (!response.success || !response.data || !response.data.profile) {
        throw new Error(response.error || 'Celebrity not found');
      }

      const celebrity = response.data.profile;

      // Find the specific slot from availability data
      const allAvailability = [
        ...(celebrity.availability?.physical || []),
        ...(celebrity.availability?.virtual || [])
      ];

      const slot = allAvailability.find(s => s.id == slotId);

      if (!slot) {
        throw new Error('Selected time slot not found');
      }

      requestState.celebrityData = celebrity;
      requestState.selectedSlot = slot;

      // Populate celebrity info throughout the form
      populateCelebrityInfo(celebrity, slot);

    } catch (error) {
      console.error('❌ Error loading celebrity data:', error);
      alert(`Failed to load meeting details: ${error.message}. Redirecting to browse page.`);
      setTimeout(() => {
        window.location.href = 'browse.html';
      }, 2000);
    }
  }

  function getInitials(name) {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  function getColorForCelebrity(name) {
    if (!name) return colorPalettes[0];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colorPalettes[index % colorPalettes.length];
  }

  function populateCelebrityInfo(celebrity, slot) {
    // Celebrity name and info
    const celebName = celebrity.name || 'Celebrity';
    const celebCategory = celebrity.category || 'Entertainment';
    const celebInitials = getInitials(celebName);
    const celebGradient = getColorForCelebrity(celebName);

    document.querySelectorAll('#celebName, #summaryCelebName, #successCelebName, #successCelebNameFull, #celebNameInline2, #celebNameInline3').forEach(el => {
      el.textContent = celebName;
    });

    document.querySelectorAll('#celebCategory, #summaryCelebCategory, #successCategory').forEach(el => {
      el.textContent = celebCategory;
    });

    document.querySelectorAll('#celebAvatar, #summaryAvatar, #successAvatar').forEach(el => {
      el.textContent = celebInitials;
      el.style.background = celebGradient;
    });

    // Slot details
    const formattedDate = formatDate(slot.date);
    const formattedTime = formatTime(slot.time);
    const fullLocation = `${slot.city}, ${slot.country}`;

    document.querySelectorAll('#selectedDateTime, #summaryDateTime, #successDateTime').forEach(el => {
      el.textContent = `${formattedDate} • ${formattedTime}`;
    });

    document.querySelectorAll('#selectedLocation, #summaryLocation, #successLocation').forEach(el => {
      el.textContent = fullLocation;
    });

    document.querySelectorAll('#selectedDuration, #summaryDuration').forEach(el => {
      el.textContent = `${slot.duration} minutes`;
    });

    // Pricing
    const meetingPrice = slot.price_cents ? (slot.price_cents / 100) : 0;
    const serviceFee = Math.round(meetingPrice * 0.05); // 5% service fee

    document.getElementById('meetingPrice').textContent = `$${meetingPrice.toLocaleString()}`;
    document.getElementById('pricingMeeting').textContent = `$${meetingPrice.toLocaleString()}`;
    document.getElementById('pricingService').textContent = `$${serviceFee}`;

    updateTotalPrice();
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  // ===================================
  // NAVIGATION
  // ===================================

  window.goToStep = function(stepNumber) {
    // Hide current step
    document.querySelectorAll('.request-step').forEach(step => {
      step.classList.remove('active');
    });

    // Show target step
    document.getElementById(`step${stepNumber}`).classList.add('active');

    // Update progress
    requestState.currentStep = stepNumber;
    updateProgress();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.validateAndGoToStep = function(stepNumber) {
    if (stepNumber === 3) {
      // Validate step 2 form
      if (validateStep2()) {
        goToStep(stepNumber);
      }
    } else {
      goToStep(stepNumber);
    }
  };

  function updateProgress() {
    const progressPercentage = (requestState.currentStep / 3) * 100;

    document.getElementById('progressFill').dataset.progress =
      requestState.currentStep === 1 ? '33' :
      requestState.currentStep === 2 ? '66' : '100';

    // Update step indicators
    document.querySelectorAll('.progress-step').forEach(step => {
      const stepNum = parseInt(step.dataset.step);

      step.classList.remove('active', 'completed');

      if (stepNum === requestState.currentStep) {
        step.classList.add('active');
      } else if (stepNum < requestState.currentStep) {
        step.classList.add('completed');
      }
    });
  }

  // ===================================
  // FORM VALIDATION
  // ===================================

  function validateStep2() {
    let isValid = true;

    // Clear previous errors
    document.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('error');
    });
    document.querySelectorAll('.form-error').forEach(err => {
      err.style.display = 'none';
    });

    // First Name
    const firstName = document.getElementById('firstName').value.trim();
    if (!firstName) {
      showError('firstName', 'firstNameError');
      isValid = false;
    }

    // Last Name
    const lastName = document.getElementById('lastName').value.trim();
    if (!lastName) {
      showError('lastName', 'lastNameError');
      isValid = false;
    }

    // Email
    const email = document.getElementById('email').value.trim();
    if (!email || !isValidEmail(email)) {
      showError('email', 'emailError');
      isValid = false;
    }

    // Phone
    const phone = document.getElementById('phone').value.trim();
    if (!phone) {
      showError('phone', 'phoneError');
      isValid = false;
    }

    // Purpose
    const purpose = document.getElementById('purpose').value.trim();
    if (!purpose || purpose.length < 50) {
      showError('purpose', 'purposeError');
      isValid = false;
    }

    // Topics
    const topics = document.getElementById('topics').value.trim();
    if (!topics || topics.length < 30) {
      showError('topics', 'topicsError');
      isValid = false;
    }

    // Background
    const background = document.getElementById('background').value;
    if (!background) {
      showError('background', 'backgroundError');
      isValid = false;
    }

    // Terms checkbox
    const terms = document.getElementById('termsAgree').checked;
    if (!terms) {
      document.getElementById('termsError').style.display = 'block';
      isValid = false;
    }

    // Cancellation checkbox
    const cancellation = document.getElementById('cancellationAgree').checked;
    if (!cancellation) {
      document.getElementById('cancellationError').style.display = 'block';
      isValid = false;
    }

    if (!isValid) {
      // Scroll to first error
      const firstError = document.querySelector('.form-group.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      // Save form data
      requestState.formData = {
        firstName,
        lastName,
        email,
        phone,
        purpose,
        topics,
        background,
        instagram: document.getElementById('instagram').value.trim(),
        linkedin: document.getElementById('linkedin').value.trim()
      };
    }

    return isValid;
  }

  function showError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    if (input && error) {
      input.closest('.form-group').classList.add('error');
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ===================================
  // EVENT LISTENERS
  // ===================================

  function setupEventListeners() {
    // Character counters
    ['purpose', 'topics'].forEach(id => {
      const textarea = document.getElementById(id);
      const counter = document.getElementById(`${id}Count`);

      if (textarea && counter) {
        textarea.addEventListener('input', () => {
          counter.textContent = textarea.value.length;
        });
      }
    });

    // Card input formatters
    setupCardFormatting();
  }

  function setupCardFormatting() {
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
      cardNumber.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s/g, '');
        let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formatted;
      });
    }

    const cardExpiry = document.getElementById('cardExpiry');
    if (cardExpiry) {
      cardExpiry.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
          value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
      });
    }
  }

  // ===================================
  // PROMO CODE
  // ===================================

  window.togglePromo = function() {
    const toggle = document.querySelector('.promo-toggle');
    const group = document.getElementById('promoGroup');

    toggle.classList.toggle('active');
    group.classList.toggle('active');
  };

  window.applyPromo = function() {
    const code = document.getElementById('promoCode').value.trim().toUpperCase();
    const error = document.getElementById('promoError');
    const success = document.getElementById('promoSuccess');

    // Hide previous messages
    error.style.display = 'none';
    success.classList.remove('active');

    // Validate promo code (mock validation - replace with real API call)
    if (code === 'FIRST50') {
      requestState.promoApplied = true;
      success.classList.add('active');
      document.getElementById('promoRow').style.display = 'flex';
      updateTotalPrice();
    } else {
      error.style.display = 'block';
    }
  };

  function updateTotalPrice() {
    const slot = requestState.selectedSlot;
    if (!slot) return;

    const meetingFee = slot.price_cents ? (slot.price_cents / 100) : 0;
    const serviceFee = Math.round(meetingFee * 0.05);
    const promoDiscount = requestState.promoApplied ? 50 : 0;

    const total = meetingFee + serviceFee - promoDiscount;

    document.getElementById('pricingTotal').textContent = `$${total.toLocaleString()}`;
    document.getElementById('successAmount').textContent = `$${total.toLocaleString()}`;

    if (requestState.promoApplied) {
      document.getElementById('pricingPromo').textContent = `-$${promoDiscount}`;
    }
  }

  // ===================================
  // SUBMIT REQUEST
  // ===================================

  window.submitRequest = async function() {
    // Validate payment form
    if (!validatePaymentForm()) {
      return;
    }

    const btn = document.querySelector('.btn-nav--primary');
    btn.classList.add('loading');

    try {
      // Prepare request data
      const requestData = {
        celebrity_id: requestState.celebrityData.id,
        slot_id: requestState.selectedSlot.id,
        ...requestState.formData,
        promo_code: requestState.promoApplied ? 'FIRST50' : null
      };

      // TODO: Replace with actual API call
      // const response = await fetch('/api/meeting-requests', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(requestData)
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      btn.classList.remove('loading');

      // Generate reference number
      const refNumber = 'SM-' + new Date().getFullYear() + '-' +
                       Math.floor(Math.random() * 900000 + 100000);
      document.getElementById('referenceNumber').textContent = refNumber;

      // Hide step 3, show success
      document.getElementById('step3').style.display = 'none';
      document.getElementById('stepSuccess').style.display = 'block';

      // Update progress to 100%
      requestState.currentStep = 3;
      updateProgress();

      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      btn.classList.remove('loading');
      console.error('Error submitting request:', error);
      alert('Failed to submit request. Please try again.');
    }
  };

  function validatePaymentForm() {
    // Simple validation for demo
    let isValid = true;

    // Clear previous errors
    document.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('error');
    });

    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardExpiry = document.getElementById('cardExpiry').value;
    const cardCVC = document.getElementById('cardCVC').value;
    const cardName = document.getElementById('cardName').value.trim();

    if (!cardNumber || cardNumber.length < 13) {
      document.getElementById('cardNumber').closest('.form-group').classList.add('error');
      isValid = false;
    }

    if (!cardExpiry || cardExpiry.length < 5) {
      document.getElementById('cardExpiry').closest('.form-group').classList.add('error');
      isValid = false;
    }

    if (!cardCVC || cardCVC.length < 3) {
      document.getElementById('cardCVC').closest('.form-group').classList.add('error');
      isValid = false;
    }

    if (!cardName) {
      document.getElementById('cardName').closest('.form-group').classList.add('error');
      isValid = false;
    }

    if (!isValid) {
      const firstError = document.querySelector('.form-group.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    return isValid;
  }

  // ===================================
  // MODAL
  // ===================================

  window.showCancellationPolicy = function() {
    document.getElementById('cancellationModal').classList.add('active');
  };

  window.closeCancellationModal = function() {
    document.getElementById('cancellationModal').classList.remove('active');
  };

  // ===================================
  // UTILITY
  // ===================================

  window.getCelebParam = function() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('celebrity') || '';
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
