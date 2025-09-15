import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/auth';
import { toast } from 'react-toastify';

const Navbar = ({ updateAuthState }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userType = authService.getUserType();
  const isAuthenticated = authService.isAuthenticated();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear all authentication data
      authService.removeToken();
      
      // Update app auth state immediately
      if (updateAuthState) {
        updateAuthState(false, null);
      }
      
      toast.success('Logged out successfully');
      
      // Navigate to login page without reload
      navigate('/login', { replace: true });
      closeMenu();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeMenu(); // Close menu after navigation
  };

  // Don't show navbar on login/register pages
  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  const isActivePath = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  const getUserDisplayName = () => {
    const userInfo = authService.getUserInfo();
    return userInfo?.name || (userType === 'tourist' ? 'Tourist User' : 'Officer Smith');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top ">
        <div className="container-fluid">
          {/* Brand */}
          <a 
            className="navbar-brand d-flex align-items-center" 
            href="#" 
            onClick={(e) => { e.preventDefault(); handleNavigation('/'); }}
            style={{ cursor: 'pointer' }}
          >
            <span className="me-2" style={{ fontSize: '1.5rem' }}>🛡️</span>
            <div>
              <strong>Tourist Safety System</strong>
              <div className="small text-muted d-none d-md-block">Real-time Monitoring & Protection</div>
            </div>
          </a>
          
          {/* Mobile toggle button */}
          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={toggleMenu}
            aria-controls="navbarNav" 
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
            {/* Navigation Links */}
            <ul className="navbar-nav me-auto">
              {isAuthenticated && userType === 'tourist' && (
                <>
                  <li className="nav-item">
                    <button 
                      className={`${isActivePath('/tourist/home')} btn btn-link text-decoration-none`}
                      onClick={() => handleNavigation('/tourist/home')}
                      style={{ padding: '0.5rem 1rem', textAlign: 'left', width: '100%', border: 'none' }}
                    >
                      <span className="me-1">🏠</span> Home
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`${isActivePath('/tourist/map')} btn btn-link text-decoration-none`}
                      onClick={() => handleNavigation('/tourist/map')}
                      style={{ padding: '0.5rem 1rem', textAlign: 'left', width: '100%', border: 'none' }}
                    >
                      <span className="me-1">🗺️</span> Safety Map
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`${isActivePath('/tourist/qr')} btn btn-link text-decoration-none`}
                      onClick={() => handleNavigation('/tourist/qr')}
                      style={{ padding: '0.5rem 1rem', textAlign: 'left', width: '100%', border: 'none' }}
                    >
                      <span className="me-1">🆔</span> My Digital ID
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`${isActivePath('/tourist/safety-check')} btn btn-link text-decoration-none`}
                      onClick={() => handleNavigation('/tourist/safety-check')}
                      style={{ padding: '0.5rem 1rem', textAlign: 'left', width: '100%', border: 'none' }}
                    >
                      <span className="me-1">✅</span> Safety Check
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`${isActivePath('/tourist/sos')} btn btn-link text-decoration-none text-danger`}
                      onClick={() => handleNavigation('/tourist/sos')}
                      style={{ padding: '0.5rem 1rem', textAlign: 'left', width: '100%', border: 'none' }}
                    >
                      <span className="me-1">🆘</span> Emergency SOS
                    </button>
                  </li>
                </>
              )}
              
              {isAuthenticated && userType === 'police' && (
                <>
                  <li className="nav-item">
                    <button 
                      className={`${isActivePath('/police/dashboard')} btn btn-link text-decoration-none`}
                      onClick={() => handleNavigation('/police/dashboard')}
                      style={{ padding: '0.5rem 1rem', textAlign: 'left', width: '100%', border: 'none' }}
                    >
                      <span className="me-1">📊</span> Dashboard
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`${isActivePath('/police/tourists')} btn btn-link text-decoration-none`}
                      onClick={() => handleNavigation('/police/tourists')}
                      style={{ padding: '0.5rem 1rem', textAlign: 'left', width: '100%', border: 'none' }}
                    >
                      <span className="me-1">👥</span> Tourists
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`${isActivePath('/police/heatmap')} btn btn-link text-decoration-none`}
                      onClick={() => handleNavigation('/police/heatmap')}
                      style={{ padding: '0.5rem 1rem', textAlign: 'left', width: '100%', border: 'none' }}
                    >
                      <span className="me-1">🗺️</span> Heatmap
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`${isActivePath('/police/alerts')} btn btn-link text-decoration-none`}
                      onClick={() => handleNavigation('/police/alerts')}
                      style={{ padding: '0.5rem 1rem', textAlign: 'left', width: '100%', border: 'none' }}
                    >
                      <span className="me-1">🚨</span> Alerts
                    </button>
                  </li>
                </>
              )}
            </ul>
            
            {/* Right side - User menu and actions */}
            {isAuthenticated && (
              <ul className="navbar-nav ms-auto">
                {/* System Status Indicator - Hidden on small screens */}
                <li className="nav-item me-3 d-none d-lg-block">
                  <div className="d-flex align-items-center">
                    <span className="badge bg-success me-2 pulse">●</span>
                    <small className="text-muted">System Online</small>
                  </div>
                </li>
                
                {/* Emergency Button for Tourists - Always visible */}
                {userType === 'tourist' && (
                  <li className="nav-item me-3">
                    <button 
                      className="btn btn-danger btn-sm emergency-btn"
                      onClick={() => handleNavigation('/tourist/sos')}
                    >
                      🆘 Emergency
                    </button>
                  </li>
                )}
                
                {/* User Info - Responsive display */}
                <li className="nav-item me-3">
                  <div className="d-flex align-items-center">
                    <span className="me-2">
                      {userType === 'tourist' ? '🧳' : '👮'}
                    </span>
                    <div className="me-3">
                      <div className="small fw-bold">{getUserDisplayName()}</div>
                      <div className="small text-muted d-none d-sm-block">
                        {userType?.charAt(0).toUpperCase() + userType?.slice(1)}
                      </div>
                    </div>
                  </div>
                </li>
                
                {/* Logout Button */}
                <li className="nav-item">
                  <button 
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleLogout}
                    title="Logout"
                  >
                    <span className="d-none d-sm-inline">🚪 Logout</span>
                    <span className="d-sm-none">🚪</span>
                  </button>
                </li>
              </ul>
            )}
            
            {/* Login button for non-authenticated users */}
            {!isAuthenticated && (
              <ul className="navbar-nav ms-auto">
                <li className="nav-item me-2">
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleNavigation('/register')}
                  >
                    📝 Register
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleNavigation('/login')}
                  >
                    🔐 Login
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      {/* Custom CSS for navbar styling and animations */}
      <style jsx>{`
        .nav-link.active {
          background-color: rgba(13, 110, 253, 0.1) !important;
          border-radius: 6px;
          font-weight: 600;
          color: #0d6efd !important;
        }
        
        .nav-link:hover, .btn-link:hover {
          background-color: rgba(13, 110, 253, 0.05) !important;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        
        .emergency-btn {
          animation: emergency-pulse 2s infinite;
          font-weight: 600;
        }
        
        .pulse {
          animation: status-pulse 2s infinite;
        }
        
        /* Mobile menu improvements */
        @media (max-width: 991.98px) {
          .navbar-collapse {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            margin-top: 8px;
            padding: 1rem;
            position: absolute;
            top: 100%;
            left: 15px;
            right: 15px;
            z-index: 1050;
            border: 1px solid rgba(0,0,0,0.1);
          }
          
          .navbar-nav .nav-item {
            margin-bottom: 0.25rem;
          }
          
          .navbar-nav .btn-link {
            color: #495057 !important;
            font-weight: 500;
            display: block;
            border-radius: 6px;
            margin-bottom: 0.25rem;
          }
          
          .navbar-nav .btn-link:hover {
            background-color: rgba(13, 110, 253, 0.1) !important;
            color: #0d6efd !important;
          }
          
          .navbar-nav .btn-link.active {
            background-color: rgba(13, 110, 253, 0.1) !important;
            color: #0d6efd !important;
            font-weight: 600;
          }
          
          .emergency-btn {
            width: 100%;
            margin-bottom: 1rem;
          }
          
          /* Make sure buttons are clickable */
          .navbar-nav .nav-item {
            position: relative;
            z-index: 1051;
          }
        }
        
        /* Ensure buttons look like nav links on desktop */
        @media (min-width: 992px) {
          .navbar-nav .btn-link {
            color: rgba(0,0,0,.55) !important;
            padding: 0.5rem 1rem;
            font-weight: 400;
            text-decoration: none !important;
            border: none;
            background: none;
          }
          
          .navbar-nav .btn-link:hover {
            color: rgba(0,0,0,.7) !important;
          }
          
          .navbar-nav .btn-link.active {
            color: #0d6efd !important;
            font-weight: 600;
          }
        }
        
        @keyframes emergency-pulse {
          0% { 
            box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          70% { 
            box-shadow: 0 0 0 10px rgba(220, 53, 69, 0); 
          }
          100% { 
            box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
            transform: scale(1);
          }
        }
        
        @keyframes status-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        /* Ensure proper stacking */
        .navbar {
          z-index: 1030;
        }
        
        /* Improve mobile button sizing */
        @media (max-width: 575.98px) {
          .btn-sm {
            font-size: 0.875rem;
            padding: 0.375rem 0.75rem;
          }
        }
        
        /* Remove default button styles for nav links */
        .btn-link:focus {
          box-shadow: none;
        }
      `}</style>
    </>
  );
};

export default Navbar;

