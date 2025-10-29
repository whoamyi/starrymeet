/**
 * StarryMeet Dashboard - JavaScript
 */

(function() {
  'use strict';
  
  // ===================================
  // INITIALIZATION
  // ===================================
  
  function init() {
    loadUserData();
    updateDateTime();
    loadDashboardData();
    setupEventListeners();
    
    // Update time every minute
    setInterval(updateDateTime, 60000);
  }
  
  // ===================================
  // USER DATA
  // ===================================
  
  function loadUserData() {
    // Get user from localStorage or API
    const user = {
      name: 'John Doe',
      firstName: 'John',
      email: 'john@example.com',
      avatar: 'https://via.placeholder.com/100'
    };
    
    // Update UI
    document.querySelectorAll('#userName').forEach(el => {
      el.textContent = user.name;
    });
    
    document.querySelectorAll('#userEmail').forEach(el => {
      el.textContent = user.email;
    });
    
    document.querySelectorAll('#welcomeName').forEach(el => {
      el.textContent = user.firstName;
    });
    
    document.querySelectorAll('#userAvatar').forEach(el => {
      el.src = user.avatar;
    });
  }
  
  // ===================================
  // DATE & TIME
  // ===================================
  
  function updateDateTime() {
    const now = new Date();
    
    // Time
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    
    const timeString = `${displayHours}:${displayMinutes} ${ampm}`;
    document.getElementById('currentTime').textContent = timeString;
    
    // Date
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dateString = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
    document.getElementById('currentDate').textContent = dateString;
  }
  
  // ===================================
  // DASHBOARD DATA
  // ===================================
  
  function loadDashboardData() {
    // In production, fetch from API
    // For now, use mock data or localStorage
    
    const dashboardData = {
      totalMeetings: 0,
      upcomingCount: 0,
      totalSpent: 0,
      favoritesCount: 0,
      upcomingMeetings: [],
      favorites: [],
      recentActivity: []
    };
    
    // Update stats
    document.getElementById('totalMeetings').textContent = dashboardData.totalMeetings;
    document.getElementById('upcomingCount').textContent = dashboardData.upcomingCount;
    document.getElementById('totalSpent').textContent = `$${dashboardData.totalSpent.toLocaleString()}`;
    document.getElementById('favoritesCount').textContent = dashboardData.favoritesCount;
    
    // Show/hide empty states
    toggleEmptyState('upcomingMeetings', 'emptyMeetings', dashboardData.upcomingMeetings.length === 0);
    toggleEmptyState('favoritesList', 'emptyFavorites', dashboardData.favorites.length === 0);
    toggleEmptyState('activityTimeline', 'emptyActivity', dashboardData.recentActivity.length === 0);
  }
  
  function toggleEmptyState(listId, emptyId, isEmpty) {
    const list = document.getElementById(listId);
    const empty = document.getElementById(emptyId);
    
    if (list && empty) {
      if (isEmpty) {
        list.querySelectorAll(':scope > *:not(#' + emptyId + ')').forEach(el => {
          el.style.display = 'none';
        });
        empty.style.display = 'block';
      } else {
        empty.style.display = 'none';
      }
    }
  }
  
  // ===================================
  // PROFILE MENU
  // ===================================
  
  window.toggleProfileMenu = function() {
    const menu = document.getElementById('profileMenu');
    menu.classList.toggle('active');
  };
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('profileMenu');
    const trigger = document.querySelector('.profile-trigger');
    
    if (menu && trigger && 
        !menu.contains(e.target) && 
        !trigger.contains(e.target)) {
      menu.classList.remove('active');
    }
  });
  
  // ===================================
  // LOGOUT
  // ===================================
  
  window.logout = function() {
    if (confirm('Are you sure you want to log out?')) {
      // Clear user data
      localStorage.removeItem('starryMeetUser');
      
      // Redirect to login
      window.location.href = 'login.html';
    }
  };
  
  // ===================================
  // EVENT LISTENERS
  // ===================================
  
  function setupEventListeners() {
    // Add any additional event listeners here
  }
  
  // ===================================
  // INIT
  // ===================================
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();
