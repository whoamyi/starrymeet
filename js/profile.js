/**
 * Profile Management
 * Handles profile editing, image upload, and password change
 */

class ProfileManager {
    constructor() {
        this.api = new APIClient();
        this.init();
    }

    async init() {
        await this.loadProfile();
        this.setupEventListeners();
    }

    async loadProfile() {
        try {
            const response = await this.api.request('/profile');

            if (response.success && response.data) {
                this.populateForm(response.data);
            }
        } catch (error) {
            console.error('Profile load error:', error);
            this.showError('Failed to load profile');
        }
    }

    populateForm(profile) {
        const fields = {
            'firstName': profile.first_name,
            'lastName': profile.last_name,
            'email': profile.email,
            'phone': profile.phone
        };

        Object.entries(fields).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element && value) {
                element.value = value;
            }
        });

        if (profile.avatar_url) {
            const img = document.getElementById('profileImagePreview');
            if (img) img.src = profile.avatar_url;
        }
    }

    setupEventListeners() {
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.handleProfileSubmit(e));
        }

        const imageInput = document.getElementById('profileImageInput');
        if (imageInput) {
            imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        }

        const passwordForm = document.getElementById('passwordForm');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => this.handlePasswordChange(e));
        }
    }

    async handleProfileSubmit(e) {
        e.preventDefault();

        const formData = {
            first_name: document.getElementById('firstName').value,
            last_name: document.getElementById('lastName').value,
            phone: document.getElementById('phone').value
        };

        try {
            const response = await this.api.request('/profile', {
                method: 'PUT',
                body: JSON.stringify(formData)
            });

            if (response.success) {
                this.showSuccess('Profile updated successfully');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            this.showError('Failed to update profile');
        }
    }

    async handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('starryMeetToken');
            const response = await fetch(`${window.API_BASE_URL || 'https://starrymeet-backend.onrender.com'}/api/profile/upload-image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                const img = document.getElementById('profileImagePreview');
                if (img && result.data.imageUrl) {
                    img.src = result.data.imageUrl;
                }
                this.showSuccess('Profile image updated');
            }
        } catch (error) {
            console.error('Image upload error:', error);
            this.showError('Failed to upload image');
        }
    }

    async handlePasswordChange(e) {
        e.preventDefault();

        const current_password = document.getElementById('currentPassword').value;
        const new_password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (new_password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        try {
            const response = await this.api.request('/profile/password', {
                method: 'PUT',
                body: JSON.stringify({ current_password, new_password })
            });

            if (response.success) {
                this.showSuccess('Password updated successfully');
                e.target.reset();
            }
        } catch (error) {
            console.error('Password change error:', error);
            this.showError(error.message || 'Failed to update password');
        }
    }

    showSuccess(message) {
        this.showToast(message, 'success');
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed; bottom: 100px; right: 20px; padding: 16px 24px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white; border-radius: 12px; font-weight: 600; z-index: 10000;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new ProfileManager();
});
