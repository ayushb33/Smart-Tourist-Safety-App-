import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../../services/auth';
import Loading from '../common/Loading';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'tourist',
    destination: '',
    emergencyContact: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    const phoneRegex = /^[\+]?[1-9]?[0-9]{7,12}$/;
    if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      toast.error('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await authService.register(formData);

      if (result.success) {
        toast.success('Registration successful! Welcome to Tourist Safety System');

        // Redirect based on user type
        if (formData.userType === 'tourist') {
          navigate('/tourist/home');
        } else {
          navigate('/police/dashboard');
        }
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Creating your account..." size="medium" />;
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>🛡️</div>
                  <h2 className="fw-bold text-primary">Create Account</h2>
                  <p className="text-muted">Join the Tourist Safety System</p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* User Type Selection */}
                  <div className="mb-4">
                    <label className="form-label">I am a</label>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-check form-check-card">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="userType"
                            value="tourist"
                            checked={formData.userType === 'tourist'}
                            onChange={handleChange}
                          />
                          <label className="form-check-label w-100 p-3 border rounded">
                            <div className="text-center">
                              <div style={{ fontSize: '2rem' }}>🧳</div>
                              <strong>Tourist</strong>
                              <div className="small text-muted">Visitor seeking safety</div>
                            </div>
                          </label>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-check form-check-card">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="userType"
                            value="police"
                            checked={formData.userType === 'police'}
                            onChange={handleChange}
                          />
                          <label className="form-check-label w-100 p-3 border rounded">
                            <div className="text-center">
                              <div style={{ fontSize: '2rem' }}>👮</div>
                              <strong>Police Officer</strong>
                              <div className="small text-muted">Law enforcement</div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    {/* Name */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">Email Address *</label>
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
                  </div>

                  <div className="row">
                    {/* Phone */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="phone" className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>

                    {/* Emergency Contact (for tourists) */}
                    {formData.userType === 'tourist' && (
                      <div className="col-md-6 mb-3">
                        <label htmlFor="emergencyContact" className="form-label">Emergency Contact</label>
                        <input
                          type="tel"
                          className="form-control"
                          id="emergencyContact"
                          name="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={handleChange}
                          placeholder="+91 87654 32109"
                        />
                      </div>
                    )}
                  </div>

                  {/* Destination (for tourists) */}
                  {formData.userType === 'tourist' && (
                    <div className="mb-3">
                      <label htmlFor="destination" className="form-label">Travel Destination</label>
                      <select
                        className="form-control"
                        id="destination"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                      >
                        <option value="">Select your destination</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Goa">Goa</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  )}

                  <div className="row">
                    {/* Password */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="password" className="form-label">Password *</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="At least 6 characters"
                        required
                      />
                    </div>

                    {/* Confirm Password */}
                    <div className="col-md-6 mb-4">
                      <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repeat password"
                        required
                      />
                    </div>
                  </div>

                  {/* Terms and Privacy */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="terms" required />
                      <label className="form-check-label small" htmlFor="terms">
                        I agree to the{' '}
                        <a href="#" className="text-decoration-none">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-decoration-none">Privacy Policy</a>
                      </label>
                    </div>
                  </div>

                  {/* Register Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 mb-3"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>

                {/* Login Link */}
                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <button
                      className="btn btn-link p-0"
                      onClick={() => navigate('/login')}
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="text-center mt-4">
              <div className="text-white">
                <h6>🔒 Your Security is Our Priority</h6>
                <div className="row mt-3">
                  <div className="col-md-4">
                    <div className="small text-white-50">
                      <strong>🛡️ Blockchain Secured</strong><br />
                      Your digital identity is protected with blockchain encryption
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="small text-white-50">
                      <strong>📡 Real-time Monitoring</strong><br />
                      24/7 safety monitoring and emergency response
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="small text-white-50">
                      <strong>🆘 Emergency Ready</strong><br />
                      Instant SOS alerts to authorities and contacts
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .form-check-card .form-check-input:checked ~ .form-check-label {
          border-color: var(--bs-primary);
          background-color: rgba(13, 110, 253, 0.1);
        }

        .form-check-card .form-check-label:hover {
          border-color: var(--bs-primary);
          background-color: rgba(13, 110, 253, 0.05);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Register;