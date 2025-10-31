/**
 * Payment Methods Management
 * Handles Stripe payment method CRUD operations
 */

class PaymentMethodsManager {
    constructor() {
        this.api = new APIClient();
        this.stripe = null;
        this.cardElement = null;
        this.init();
    }

    async init() {
        await this.initStripe();
        await this.loadPaymentMethods();
        this.setupEventListeners();
    }

    async initStripe() {
        const stripeKey = document.querySelector('meta[name="stripe-key"]')?.content;
        if (stripeKey && window.Stripe) {
            this.stripe = Stripe(stripeKey);
        }
    }

    async loadPaymentMethods() {
        try {
            const response = await this.api.request('/payment-methods');

            if (response.success && response.data) {
                this.renderPaymentMethods(response.data);
            }
        } catch (error) {
            console.error('Payment methods load error:', error);
            this.showError('Failed to load payment methods');
        }
    }

    renderPaymentMethods(methods) {
        const container = document.getElementById('paymentMethodsContainer');
        if (!container) return;

        if (methods.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No payment methods added</p>
                    <button class="btn-primary" onclick="paymentManager.showAddCardModal()">Add Payment Method</button>
                </div>
            `;
            return;
        }

        container.innerHTML = methods.map(method => `
            <div class="payment-card ${method.is_default ? 'default' : ''}" data-id="${method.id}">
                <div class="card-icon">💳</div>
                <div class="card-info">
                    <h4>${method.card_brand || 'Card'} •••• ${method.card_last4}</h4>
                    <p>Expires ${method.card_exp_month}/${method.card_exp_year}</p>
                    ${method.is_default ? '<span class="badge-default">Default</span>' : ''}
                </div>
                <div class="card-actions">
                    ${!method.is_default ? `
                        <button class="btn-small" onclick="paymentManager.setDefault('${method.id}')">Set Default</button>
                    ` : ''}
                    <button class="btn-small btn-delete" onclick="paymentManager.deleteMethod('${method.id}')">Remove</button>
                </div>
            </div>
        `).join('');
    }

    showAddCardModal() {
        const modal = document.getElementById('addCardModal');
        if (modal) {
            modal.style.display = 'flex';
            this.mountStripeCard();
        }
    }

    hideAddCardModal() {
        const modal = document.getElementById('addCardModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    async mountStripeCard() {
        if (!this.stripe) return;

        const elements = this.stripe.elements();
        this.cardElement = elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#ffffff',
                    '::placeholder': { color: '#6b7280' }
                }
            }
        });

        this.cardElement.mount('#card-element');
    }

    async handleAddCard(e) {
        e.preventDefault();

        if (!this.stripe || !this.cardElement) {
            this.showError('Stripe not initialized');
            return;
        }

        const isDefault = document.getElementById('setAsDefault')?.checked || false;

        try {
            const { error, paymentMethod } = await this.stripe.createPaymentMethod({
                type: 'card',
                card: this.cardElement
            });

            if (error) throw new Error(error.message);

            const response = await this.api.request('/payment-methods', {
                method: 'POST',
                body: JSON.stringify({
                    stripe_payment_method_id: paymentMethod.id,
                    card_last4: paymentMethod.card.last4,
                    card_brand: paymentMethod.card.brand,
                    card_exp_month: paymentMethod.card.exp_month,
                    card_exp_year: paymentMethod.card.exp_year,
                    is_default: isDefault
                })
            });

            if (response.success) {
                this.showSuccess('Payment method added successfully');
                this.hideAddCardModal();
                await this.loadPaymentMethods();
            }
        } catch (error) {
            console.error('Add card error:', error);
            this.showError(error.message);
        }
    }

    async setDefault(methodId) {
        try {
            const response = await this.api.request(`/payment-methods/${methodId}/default`, {
                method: 'PATCH'
            });

            if (response.success) {
                this.showSuccess('Default payment method updated');
                await this.loadPaymentMethods();
            }
        } catch (error) {
            console.error('Set default error:', error);
            this.showError('Failed to update default payment method');
        }
    }

    async deleteMethod(methodId) {
        if (!confirm('Are you sure you want to remove this payment method?')) return;

        try {
            const response = await this.api.request(`/payment-methods/${methodId}`, {
                method: 'DELETE'
            });

            if (response.success) {
                this.showSuccess('Payment method removed');
                await this.loadPaymentMethods();
            }
        } catch (error) {
            console.error('Delete payment method error:', error);
            this.showError('Failed to remove payment method');
        }
    }

    setupEventListeners() {
        const addCardBtn = document.getElementById('addPaymentMethodBtn');
        if (addCardBtn) {
            addCardBtn.addEventListener('click', () => this.showAddCardModal());
        }

        const addCardForm = document.getElementById('addCardForm');
        if (addCardForm) {
            addCardForm.addEventListener('submit', (e) => this.handleAddCard(e));
        }

        const closeModalBtn = document.getElementById('closeCardModal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.hideAddCardModal());
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
            color: white; border-radius: 12px; z-index: 10000;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

let paymentManager;
document.addEventListener('DOMContentLoaded', () => {
    paymentManager = new PaymentMethodsManager();
});
