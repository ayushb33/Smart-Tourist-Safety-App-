import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../../services/auth';
import Loading from '../common/Loading';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'tourist'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const isAuthenticated = authService.isAuthenticated();
    const userType = authService.getUserType();
    
    if (isAuthenticated && userType) {
      // User is already logged in, redirect to appropriate dashboard
      if (userType === 'tourist') {
        navigate('/tourist/home', { replace: true });
      } else if (userType === 'police') {
        navigate('/police/dashboard', { replace: true });
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting login with:', formData.email, formData.userType);
      
      const result = await authService.login(formData.email, formData.password, formData.userType);
      
      console.log('Login result:', result);
      
      if (result.success) {
        toast.success(`Welcome back! Logged in as ${formData.userType}`);
        
        // Force a small delay to ensure localStorage is updated
        setTimeout(() => {
          // Double-check authentication state
          const isAuth = authService.isAuthenticated();
          const type = authService.getUserType();
          
          console.log('After login - isAuth:', isAuth, 'type:', type);
          
          if (isAuth && type) {
            if (type === 'tourist') {
              navigate('/tourist/home', { replace: true });
            } else if (type === 'police') {
              navigate('/police/dashboard', { replace: true });
            }
          } else {
            toast.error('Authentication failed. Please try again.');
          }
        }, 100);
        
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (userType) => {
    setFormData({
      email: userType === 'tourist' ? 'tourist@demo.com' : 'police@demo.com',
      password: 'demo123',
      userType: userType
    });
    toast.info(`Demo credentials filled for ${userType}`);
  };

  if (loading) {
    return <Loading message="Authenticating..." size="medium" />;
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>🛡️</div>
                  <h2 className="fw-bold text-primary">Tourist Safety System</h2>
                  <p className="text-muted">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* User Type Selection */}
                  <div className="mb-4">
                    <label className="form-label">Select User Type</label>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="userType"
                            value="tourist"
                            checked={formData.userType === 'tourist'}
                            onChange={handleChange}
                          />
                          <label className="form-check-label">
                            🧳 Tourist
                          </label>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="userType"
                            value="police"
                            checked={formData.userType === 'police'}
                            onChange={handleChange}
                          />
                          <label className="form-check-label">
                            👮 Police
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 mb-3"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>

                {/* Demo Credentials */}
                <div className="text-center mb-3">
                  <p className="small text-muted mb-2">Quick Demo Access:</p>
                  <div className="d-flex gap-2 justify-content-center">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => fillDemoCredentials('tourist')}
                    >
                      🧳 Tourist Demo
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => fillDemoCredentials('police')}
                    >
                      👮 Police Demo
                    </button>
                  </div>
                </div>

                {/* Registration Link */}
                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account?{' '}
                    <button
                      className="btn btn-link p-0"
                      onClick={() => navigate('/register')}
                    >
                      Register here
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
