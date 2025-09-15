// Authentication Service
class AuthService {
  constructor() {
    this.TOKEN_KEY = 'tourist_safety_token';
    this.USER_TYPE_KEY = 'user_type';
    this.USER_INFO_KEY = 'user_info';
  }

  setToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_TYPE_KEY);
    localStorage.removeItem(this.USER_INFO_KEY);
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  setUserType(userType) {
    localStorage.setItem(this.USER_TYPE_KEY, userType);
  }

  getUserType() {
    return localStorage.getItem(this.USER_TYPE_KEY);
  }

  setUserInfo(userInfo) {
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo));
  }

  getUserInfo() {
    const userInfo = localStorage.getItem(this.USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  }

  async login(email, password, userType) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const demoCredentials = {
        tourist: { email: 'tourist@demo.com', password: 'demo123' },
        police: { email: 'police@demo.com', password: 'demo123' }
      };

      if (
        email === demoCredentials[userType]?.email && 
        password === demoCredentials[userType]?.password
      ) {
        const token = `demo_token_${userType}_${Date.now()}`;
        const userInfo = {
          email,
          name: userType === 'tourist' ? 'John Doe' : 'Officer Smith',
          id: userType === 'tourist' ? 'tourist-001' : 'officer-001'
        };

        this.setToken(token);
        this.setUserType(userType);
        this.setUserInfo(userInfo);

        return { success: true, token, userType, userInfo };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  }

  async register(userData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const token = `demo_token_${userData.userType}_${Date.now()}`;
      const userInfo = {
        email: userData.email,
        name: userData.name,
        id: `${userData.userType}-${Date.now()}`,
        phone: userData.phone,
        destination: userData.destination || null
      };

      this.setToken(token);
      this.setUserType(userData.userType);
      this.setUserInfo(userInfo);

      return { success: true, token, userType: userData.userType, userInfo };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  }

  logout() {
    this.removeToken();
    window.location.href = '/login';
  }

  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();
export default authService;
