/**
 * Settings Management
 * Handles user preferences and account settings
 */

class SettingsManager {
    constructor() {
        this.api = new APIClient();
        this.init();
    }

    async init() {
        await this.loadSettings();
        this.setupEventListeners();
    }

    async loadSettings() {
        try {
            const response = await this.api.request('/settings');

            if (response.success && response.data) {
                this.populateSettings(response.data);
            }
        } catch (error) {
            console.error('Settings load error:', error);
            this.showError('Failed to load settings');
        }
    }

    populateSettings(settings) {
        const checkboxFields = ['emailNotifications', 'smsNotifications', 'marketingEmails'];
        const selectFields = ['currency', 'timezone', 'language'];

        checkboxFields.forEach(field => {
            const element = document.getElementById(field);
            const settingKey = field.replace(/([A-Z])/g, '_$1').toLowerCase();
            if (element) element.checked = settings[settingKey];
        });

        selectFields.forEach(field => {
            const element = document.getElementById(field);
            if (element && settings[field]) element.value = settings[field];
        });
    }

    setupEventListeners() {
        const settingsForm = document.getElementById('settingsForm');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => this.handleSettingsSubmit(e));
        }

        const deleteAccountBtn = document.getElementById('deleteAccountBtn');
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', () => this.handleDeleteAccount());
        }
    }

    async handleSettingsSubmit(e) {
        e.preventDefault();

        const formData = {
            email_notifications: document.getElementById('emailNotifications').checked,
            sms_notifications: document.getElementById('smsNotifications').checked,
            marketing_emails: document.getElementById('marketingEmails').checked,
            currency: document.getElementById('currency').value,
            timezone: document.getElementById('timezone').value,
            language: document.getElementById('language').value
        };

        try {
            const response = await this.api.request('/settings', {
                method: 'PUT',
                body: JSON.stringify(formData)
            });

            if (response.success) {
                this.showSuccess('Settings updated successfully');
            }
        } catch (error) {
            console.error('Settings update error:', error);
            this.showError('Failed to update settings');
        }
    }

    async handleDeleteAccount() {
        const confirmation = prompt('Type "DELETE" to confirm account deletion:');

        if (confirmation !== 'DELETE') {
            this.showError('Account deletion cancelled');
            return;
        }

        try {
            const response = await this.api.request('/settings/account', {
                method: 'DELETE'
            });

            if (response.success) {
                localStorage.removeItem('starryMeetToken');
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Account deletion error:', error);
            this.showError('Failed to delete account');
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

document.addEventListener('DOMContentLoaded', () => {
    new SettingsManager();
});
