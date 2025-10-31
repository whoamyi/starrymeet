/**
 * Celebrity Interactions
 * Handles save/unsave functionality across all pages
 */

class CelebrityInteractions {
    constructor() {
        this.savedCelebrities = new Set();
        this.init();
    }

    async init() {
        await this.loadSavedCelebrities();
        this.setupEventListeners();
    }

    getToken() {
        return localStorage.getItem('starryMeetToken') || this.getCookie('token');
    }

    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    async loadSavedCelebrities() {
        try {
            const token = this.getToken();
            if (!token) return;

            const response = await fetch(`${window.API_BASE_URL || ''}/api/saved`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) return;

            const result = await response.json();
            const saved = result.data || result;
            this.savedCelebrities = new Set(saved.map(c => c.celebrity_id || c.id));
            this.updateSaveButtons();
        } catch (error) {
            console.error('Load saved celebrities error:', error);
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const saveBtn = e.target.closest('.save-celebrity-btn');
            if (saveBtn) {
                e.preventDefault();
                e.stopPropagation();
                const celebrityId = saveBtn.dataset.celebrityId;
                if (celebrityId) {
                    this.toggleSave(celebrityId, saveBtn);
                }
            }
        });
    }

    async toggleSave(celebrityId, button) {
        const isSaved = this.savedCelebrities.has(celebrityId);

        try {
            if (isSaved) {
                await this.unsaveCelebrity(celebrityId);
                this.savedCelebrities.delete(celebrityId);
                button.classList.remove('saved');
                button.innerHTML = this.getUnsavedIcon();
                this.showToast('Removed from saved');
            } else {
                await this.saveCelebrity(celebrityId);
                this.savedCelebrities.add(celebrityId);
                button.classList.add('saved');
                button.innerHTML = this.getSavedIcon();
                this.showToast('Saved to favorites');
            }
        } catch (error) {
            console.error('Toggle save error:', error);
            this.showToast('Failed to update', 'error');
        }
    }

    async saveCelebrity(celebrityId) {
        const response = await fetch(`${window.API_BASE_URL || ''}/api/saved`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ celebrity_id: celebrityId })
        });

        if (!response.ok) throw new Error('Failed to save');
    }

    async unsaveCelebrity(celebrityId) {
        const response = await fetch(`${window.API_BASE_URL || ''}/api/saved/${celebrityId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.getToken()}`
            }
        });

        if (!response.ok) throw new Error('Failed to unsave');
    }

    updateSaveButtons() {
        document.querySelectorAll('.save-celebrity-btn').forEach(btn => {
            const celebrityId = btn.dataset.celebrityId;
            if (this.savedCelebrities.has(celebrityId)) {
                btn.classList.add('saved');
                btn.innerHTML = this.getSavedIcon();
            } else {
                btn.classList.remove('saved');
                btn.innerHTML = this.getUnsavedIcon();
            }
        });
    }

    getSavedIcon() {
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
        </svg>`;
    }

    getUnsavedIcon() {
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
        </svg>`;
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed; bottom: 100px; right: 20px; padding: 16px 24px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white; border-radius: 10px; z-index: 10000;
            font-weight: 600; animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
}

// Initialize on all pages
document.addEventListener('DOMContentLoaded', () => {
    window.celebrityInteractions = new CelebrityInteractions();
});
