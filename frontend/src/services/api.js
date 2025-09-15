import axios from 'axios';
import { authService } from './auth';
import { toast } from 'react-toastify';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth headers
apiClient.interceptors.request.use(
  (config) => {
    const authHeaders = authService.getAuthHeader();
    config.headers = { ...config.headers, ...authHeaders };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please check your connection.');
    }
    return Promise.reject(error);
  }
);

// Tourist API endpoints
export const touristAPI = {
  // Get tourist dashboard data
  getDashboard: async () => {
    const response = await apiClient.get('/tourist/dashboard');
    return response.data;
  },

  // Update location
  updateLocation: async (locationData) => {
    const response = await apiClient.post('/tourist/location', locationData);
    return response.data;
  },

  // Send SOS alert
  sendSOSAlert: async (alertData) => {
    const response = await apiClient.post('/tourist/sos', alertData);
    return response.data;
  },

  // Get safety zones
  getSafetyZones: async () => {
    const response = await apiClient.get('/tourist/safety-zones');
    return response.data;
  },

  // Safety check-in
  safetyCheckIn: async (checkInData) => {
    const response = await apiClient.post('/tourist/check-in', checkInData);
    return response.data;
  },

  // Get QR code data
  getQRData: async () => {
    const response = await apiClient.get('/tourist/qr-data');
    return response.data;
  },

  // Update emergency contacts
  updateEmergencyContacts: async (contacts) => {
    const response = await apiClient.put('/tourist/emergency-contacts', contacts);
    return response.data;
  }
};

// Police API endpoints
export const policeAPI = {
  // Get dashboard statistics
  getDashboard: async () => {
    const response = await apiClient.get('/police/dashboard');
    return response.data;
  },

  // Get all tourists
  getAllTourists: async (filters = {}) => {
    const response = await apiClient.get('/police/tourists', { params: filters });
    return response.data;
  },

  // Get tourist details by ID
  getTouristById: async (touristId) => {
    const response = await apiClient.get(`/police/tourists/${touristId}`);
    return response.data;
  },

  // Verify QR code
  verifyQRCode: async (qrData) => {
    const response = await apiClient.post('/police/verify-qr', qrData);
    return response.data;
  },

  // Get alerts
  getAlerts: async (filters = {}) => {
    const response = await apiClient.get('/police/alerts', { params: filters });
    return response.data;
  },

  // Update alert status
  updateAlertStatus: async (alertId, status) => {
    const response = await apiClient.put(`/police/alerts/${alertId}`, { status });
    return response.data;
  },

  // Get heatmap data
  getHeatmapData: async (timeRange = '1h') => {
    const response = await apiClient.get('/police/heatmap', { params: { timeRange } });
    return response.data;
  },

  // Send broadcast message
  sendBroadcast: async (message, targetType = 'all') => {
    const response = await apiClient.post('/police/broadcast', { message, targetType });
    return response.data;
  },

  // Flag tourist for monitoring
  flagTourist: async (touristId, reason) => {
    const response = await apiClient.post(`/police/flag-tourist/${touristId}`, { reason });
    return response.data;
  }
};

// General API utilities
export const generalAPI = {
  // Health check
  healthCheck: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },

  // Get emergency contacts
  getEmergencyNumbers: async () => {
    return {
      police: '100',
      ambulance: '102',
      fire: '101',
      national_emergency: '112',
      women_helpline: '1091',
      tourist_helpline: '1363'
    };
  }
};

// Mock data for development (when backend is not available)
export const mockData = {
  // Sample tourist data
  sampleTourists: [
    {
      id: 'tourist-001',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+91 98765 43210',
      destination: 'Delhi',
      safetyScore: 88,
      status: 'active',
      location: { lat: 28.6139, lng: 77.2090, address: 'India Gate, Delhi' },
      emergencyContact: '+91 87654 32109',
      checkInTime: new Date(),
      blockchainHash: 'abc123def456ghi789'
    },
    {
      id: 'tourist-002',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+91 98765 43211',
      destination: 'Mumbai',
      safetyScore: 92,
      status: 'active',
      location: { lat: 19.0760, lng: 72.8777, address: 'Gateway of India, Mumbai' },
      emergencyContact: '+91 87654 32108',
      checkInTime: new Date(Date.now() - 2 * 60 * 60000),
      blockchainHash: 'def456ghi789jkl012'
    }
  ],

  // Sample alerts
  sampleAlerts: [
    {
      id: 1,
      type: 'SOS',
      touristId: 'tourist-001',
      touristName: 'John Doe',
      message: 'Emergency SOS Alert - Immediate assistance required',
      location: { lat: 28.6139, lng: 77.2090, address: 'India Gate, Delhi' },
      timestamp: new Date(Date.now() - 5 * 60000),
      status: 'active',
      priority: 'critical'
    },
    {
      id: 2,
      type: 'ZONE_VIOLATION',
      touristId: 'tourist-003',
      touristName: 'Mike Johnson',
      message: 'Tourist entered unsafe zone after dark',
      location: { lat: 28.6100, lng: 77.2070, address: 'Construction Area, Delhi' },
      timestamp: new Date(Date.now() - 15 * 60000),
      status: 'acknowledged',
      priority: 'high'
    }
  ],

  // Sample safety zones
  safetyZones: [
    {
      id: 1,
      name: 'Tourist District',
      type: 'safe',
      coordinates: [
        [28.6139, 77.2090],
        [28.6149, 77.2095],
        [28.6145, 77.2105],
        [28.6135, 77.2100]
      ],
      description: 'Well-patrolled tourist area with 24/7 security'
    },
    {
      id: 2,
      name: 'Market Area',
      type: 'medium',
      coordinates: [
        [28.6120, 77.2080],
        [28.6130, 77.2085],
        [28.6125, 77.2095],
        [28.6115, 77.2090]
      ],
      description: 'Busy commercial area - stay alert'
    },
    {
      id: 3,
      name: 'Construction Zone',
      type: 'unsafe',
      coordinates: [
        [28.6100, 77.2070],
        [28.6110, 77.2075],
        [28.6105, 77.2085],
        [28.6095, 77.2080]
      ],
      description: 'Active construction area - avoid after dark'
    }
  ]
};

// Helper function to simulate API delay for development
export const simulateDelay = (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export default apiClient;