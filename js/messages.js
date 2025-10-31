/**
 * Messages System
 * Handles user messaging functionality
 */

class MessagesManager {
    constructor() {
        this.api = new APIClient();
        this.messages = [];
        this.currentConversation = null;
        this.init();
    }

    async init() {
        await this.loadMessages();
        this.setupEventListeners();
        this.startPolling();
    }

    async loadMessages() {
        try {
            const response = await this.api.request('/messages');

            if (response.success && response.data) {
                this.messages = response.data;
                this.renderConversations();
            }
        } catch (error) {
            console.error('Messages load error:', error);
            this.showError('Failed to load messages');
        }
    }

    renderConversations() {
        const container = document.getElementById('conversationsContainer');
        if (!container) return;

        const conversations = this.groupByConversation(this.messages);

        if (conversations.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No messages yet</p></div>';
            return;
        }

        container.innerHTML = conversations.map(conv => `
            <div class="conversation-item ${!conv.read_status ? 'unread' : ''}"
                 onclick="messagesManager.openConversation('${conv.id}')">
                <img src="${conv.avatar || '/assets/images/placeholder.jpg'}" alt="${conv.name}" class="conversation-avatar" />
                <div class="conversation-info">
                    <h4>${conv.name}</h4>
                    <p class="conversation-preview">${conv.lastMessage}</p>
                    <span class="conversation-time">${this.formatTime(conv.lastTime)}</span>
                </div>
                ${!conv.read_status ? '<span class="unread-badge"></span>' : ''}
            </div>
        `).join('');
    }

    groupByConversation(messages) {
        const conversations = new Map();
        const userId = this.getUserId();

        messages.forEach(msg => {
            const otherId = msg.from_user_id === userId ? msg.to_user_id : msg.from_user_id;
            const otherName = msg.from_user_id === userId ?
                `${msg.to_first_name || ''} ${msg.to_last_name || ''}`.trim() :
                `${msg.from_first_name || ''} ${msg.from_last_name || ''}`.trim();

            if (!conversations.has(otherId)) {
                conversations.set(otherId, {
                    id: otherId,
                    name: otherName || 'Unknown User',
                    avatar: msg.from_image,
                    lastMessage: msg.message.substring(0, 50),
                    lastTime: msg.created_at,
                    read_status: msg.read_status,
                    messages: []
                });
            }

            conversations.get(otherId).messages.push(msg);
        });

        return Array.from(conversations.values()).sort((a, b) =>
            new Date(b.lastTime) - new Date(a.lastTime)
        );
    }

    getUserId() {
        const token = localStorage.getItem('starryMeetToken');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.userId;
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    setupEventListeners() {
        const sendForm = document.getElementById('sendMessageForm');
        if (sendForm) {
            sendForm.addEventListener('submit', (e) => this.sendMessage(e));
        }
    }

    async sendMessage(e) {
        e.preventDefault();

        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();

        if (!message || !this.currentConversation) return;

        try {
            const response = await this.api.request('/messages', {
                method: 'POST',
                body: JSON.stringify({
                    to_user_id: this.currentConversation,
                    message: message,
                    subject: 'Message'
                })
            });

            if (response.success) {
                messageInput.value = '';
                await this.loadMessages();
            }
        } catch (error) {
            console.error('Send message error:', error);
            this.showError('Failed to send message');
        }
    }

    startPolling() {
        setInterval(() => this.loadMessages(), 30000);
    }

    formatTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        return date.toLocaleDateString();
    }

    showError(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed; bottom: 100px; right: 20px; padding: 16px 24px;
            background: #ef4444; color: white; border-radius: 12px; z-index: 10000;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

let messagesManager;
document.addEventListener('DOMContentLoaded', () => {
    messagesManager = new MessagesManager();
});
