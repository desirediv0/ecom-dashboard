const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    getAuthHeaders() {
        const token = localStorage.getItem('partnerToken');
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getAuthHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    }

    // Auth APIs
    async login(credentials) {
        return this.request('/api/partner/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    async getProfile() {
        return this.request('/api/partner/profile');
    }

    // Coupon APIs
    async getCoupons() {
        return this.request('/api/partner/coupons');
    }

    // Earnings APIs
    async getEarnings(period = 'all') {
        return this.request(`/api/partner/earnings?period=${period}`);
    }

    async getEarningsStats(period = 'all') {
        return this.request(`/api/partner/earnings/stats?period=${period}`);
    }

    // Dashboard APIs
    async getDashboardStats() {
        return this.request('/api/partner/dashboard');
    }
}

export default new ApiService();
