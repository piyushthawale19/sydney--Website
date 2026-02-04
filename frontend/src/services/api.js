import axios from 'axios';
import API_URL from '../config';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Events API
export const eventsAPI = {
    getAll: (params) => api.get('/events', { params }),
    getOne: (id) => api.get(`/events/${id}`),
    create: (data) => api.post('/events', data),
    update: (id, data) => api.put(`/events/${id}`, data),
    import: (id, notes) => api.patch(`/events/${id}/import`, { importNotes: notes }),
    delete: (id) => api.delete(`/events/${id}`),
    getStats: () => api.get('/events/stats/overview'),
};

// Auth API
export const authAPI = {
    verifyToken: (token) => api.post('/auth/verify', { token }),
    getMe: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
};

// Interest API
export const interestAPI = {
    record: (data) => api.post('/interest', data),
    getAll: (params) => api.get('/interest', { params }),
    getStats: () => api.get('/interest/stats'),
};

export default api;
