import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../../services/auth';
import { touristAPI, mockData } from '../../services/api';
import { geolocationService } from '../../services/geolocation';
import Loading from '../common/Loading';
import './Home.css';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    safetyScore: 85,
    currentLocation: 'Loading...',
    lastCheckIn: new Date(),
    alertsCount: 0,
    nearbyTourists: 12,
    emergencyContacts: []
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [weatherData, setWeatherData] = useState({
    temperature: '24°C',
    condition: 'Clear',
    humidity: '65%',
    visibility: 'Good'
  });

  const navigate = useNavigate();
  const userInfo = authService.getUserInfo();

  useEffect(() => {
    loadDashboardData();
    getCurrentLocation();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      setDashboardData({
        safetyScore: 85,
        currentLocation: 'India Gate, New Delhi',
        lastCheckIn: new Date(Date.now() - 30 * 60000),
        alertsCount: 0,
        nearbyTourists: 12,
        emergencyContacts: [
          { name: 'Emergency Services', number: '112' },
          { name: 'Tourist Helpline', number: '1363' },
          { name: 'Local Police', number: '100' }
        ],
        upcomingDestinations: ['Red Fort', 'Qutub Minar', 'Lotus Temple'],
        recentActivity: [
          { action: 'Safety check-in', time: '30 minutes ago', status: 'success' },
          { action: 'Location updated', time: '1 hour ago', status: 'info' },
          { action: 'Entered safe zone', time: '2 hours ago', status: 'success' }
        ]
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      const position = await geolocationService.getEnhancedPosition();
      setCurrentLocation(position);

      setDashboardData(prev => ({
        ...prev,
        currentLocation: position.address || `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`
      }));
    } catch (error) {
      console.error('Location error:', error);
      setDashboardData(prev => ({
        ...prev,
        currentLocation: 'Location unavailable'
      }));
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSafetyCheckIn = () => {
    toast.success('Safety check-in recorded! Your emergency contacts have been notified.');
    setDashboardData(prev => ({
      ...prev,
      lastCheckIn: new Date(),
      recentActivity: [
        { action: 'Safety check-in', time: 'Just now', status: 'success' },
        ...prev.recentActivity.slice(0, 2)
      ]
    }));
  };

  const handleEmergencySOS = () => {
    navigate('/tourist/sos');
  };

  const getSafetyScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const getSafetyScoreText = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Attention';
  };

  if (loading) {
    return <Loading message="Loading your safety dashboard..." size="large" />;
  }

  return (
    <div className="tourist-home-wrapper">
      <div className="tourist-container">
        {/* Welcome Header */}
        <div className="tourist-welcome-header">
          <div className="tourist-welcome-content">
            <div className="tourist-welcome-left">
              <h1 className="tourist-welcome-title">Welcome back, {userInfo?.name || 'John Doe'}! 👋</h1>
              <p className="tourist-welcome-subtitle">Your safety is our priority. Stay connected and stay safe.</p>
              <div className="tourist-location-badge">
                <span className="tourist-location-icon">📍</span>
                <span className="tourist-location-text">{dashboardData.currentLocation}</span>
                {locationLoading && (
                  <div className="tourist-location-spinner">
                    <div className="tourist-spinner"></div>
                  </div>
                )}
              </div>
            </div>
            <div className="tourist-welcome-right">
              <div className="tourist-status-icon">🛡️</div>
              <div className="tourist-status-info">
                <div className="tourist-status-label">Last check-in:</div>
                <div className="tourist-status-time">
                  {new Date(dashboardData.lastCheckIn).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Stats */}
        <div className="tourist-dashboard-grid">
          {/* Safety Score */}
          <div className="tourist-stat-card">
            <div className="tourist-stat-header">
              <h3 className="tourist-stat-title">🛡️ Safety Score</h3>
              <button 
                className="tourist-view-details-btn"
                onClick={() => navigate('/tourist/map')}
              >
                View Details
              </button>
            </div>
            <div className={`tourist-stat-number tourist-${getSafetyScoreColor(dashboardData.safetyScore)}`}>
              {dashboardData.safetyScore}%
            </div>
            <div className="tourist-stat-label">{getSafetyScoreText(dashboardData.safetyScore)}</div>
            <div className="tourist-progress-wrapper">
              <div className="tourist-progress-bar">
                <div 
                  className={`tourist-progress-fill tourist-progress-${getSafetyScoreColor(dashboardData.safetyScore)}`}
                  style={{ width: `${dashboardData.safetyScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="tourist-stat-card">
            <div className="tourist-stat-header">
              <h3 className="tourist-stat-title">📊 Current Status</h3>
              <span className="tourist-active-badge">Active</span>
            </div>
            <div className="tourist-stat-number tourist-success">Safe</div>
            <div className="tourist-stat-label">You're in a safe zone</div>
            <div className="tourist-status-details">
              <div className="tourist-status-item">🟢 GPS: Active</div>
              <div className="tourist-status-item">📱 Connection: Strong</div>
            </div>
          </div>

          {/* Alerts */}
          <div className="tourist-stat-card">
            <div className="tourist-stat-header">
              <h3 className="tourist-stat-title">🚨 Active Alerts</h3>
              <button 
                className="tourist-view-all-btn"
                onClick={() => toast.info('No active alerts')}
              >
                View All
              </button>
            </div>
            <div className="tourist-stat-number tourist-info">{dashboardData.alertsCount}</div>
            <div className="tourist-stat-label">No current alerts</div>
            <div className="tourist-all-normal">✅ All systems normal</div>
          </div>

          {/* Nearby Tourists */}
          <div className="tourist-stat-card">
            <div className="tourist-stat-header">
              <h3 className="tourist-stat-title">👥 Community</h3>
              <span className="tourist-community-badge">{dashboardData.nearbyTourists}</span>
            </div>
            <div className="tourist-stat-number tourist-primary">{dashboardData.nearbyTourists}</div>
            <div className="tourist-stat-label">Tourists nearby</div>
            <div className="tourist-community-radius">Within 2km radius</div>
          </div>
        </div>

        <div className="tourist-main-sections">
          {/* Quick Actions */}
          <div className="tourist-section-card tourist-quick-actions">
            <div className="tourist-section-header">
              <h3 className="tourist-section-title">⚡ Quick Actions</h3>
            </div>
            <div className="tourist-section-body">
              <div className="tourist-actions-grid">
                <button 
                  className="tourist-action-btn tourist-emergency"
                  onClick={handleEmergencySOS}
                >
                  <span className="tourist-action-icon">🆘</span>
                  <span className="tourist-action-text">Emergency SOS</span>
                </button>
                <button 
                  className="tourist-action-btn tourist-success"
                  onClick={handleSafetyCheckIn}
                >
                  <span className="tourist-action-icon">✅</span>
                  <span className="tourist-action-text">Safety Check-in</span>
                </button>
                <button 
                  className="tourist-action-btn tourist-primary"
                  onClick={() => navigate('/tourist/map')}
                >
                  <span className="tourist-action-icon">🗺️</span>
                  <span className="tourist-action-text">Safety Map</span>
                </button>
                <button 
                  className="tourist-action-btn tourist-info"
                  onClick={() => navigate('/tourist/qr')}
                >
                  <span className="tourist-action-icon">🆔</span>
                  <span className="tourist-action-text">My Digital ID</span>
                </button>
              </div>
              
              <div className="tourist-location-update">
                <button 
                  className="tourist-location-btn"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                >
                  {locationLoading ? (
                    <>
                      <span className="tourist-btn-spinner"></span>
                      <span>Updating Location...</span>
                    </>
                  ) : (
                    <>
                      <span>📍</span>
                      <span>Update My Location</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="tourist-section-card tourist-recent-activity">
            <div className="tourist-section-header">
              <h3 className="tourist-section-title">📊 Recent Activity</h3>
            </div>
            <div className="tourist-section-body">
              {dashboardData.recentActivity && dashboardData.recentActivity.length > 0 ? (
                <div className="tourist-activity-list">
                  {dashboardData.recentActivity.map((activity, index) => (
                    <div key={index} className="tourist-activity-item">
                      <div className="tourist-activity-icon">
                        <span className={`tourist-activity-badge tourist-${activity.status}`}>
                          {activity.status === 'success' ? '✅' :
                          activity.status === 'warning' ? '⚠️' : 'ℹ️'}
                        </span>
                      </div>
                      <div className="tourist-activity-content">
                        <div className="tourist-activity-action">{activity.action}</div>
                        <div className="tourist-activity-time">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="tourist-empty-activity">
                  <div className="tourist-empty-icon">📊</div>
                  <p className="tourist-empty-title">No recent activity</p>
                  <small className="tourist-empty-subtitle">Your safety activities will appear here</small>
                </div>
              )}

              {/* Weather Info */}
              <div className="tourist-weather-section">
                <h4 className="tourist-weather-title">🌤️ Current Weather</h4>
                <div className="tourist-weather-grid">
                  <div className="tourist-weather-item">
                    <div className="tourist-weather-value">{weatherData.temperature}</div>
                    <div className="tourist-weather-label">Temp</div>
                  </div>
                  <div className="tourist-weather-item">
                    <div className="tourist-weather-value">{weatherData.condition}</div>
                    <div className="tourist-weather-label">Sky</div>
                  </div>
                  <div className="tourist-weather-item">
                    <div className="tourist-weather-value">{weatherData.humidity}</div>
                    <div className="tourist-weather-label">Humidity</div>
                  </div>
                  <div className="tourist-weather-item">
                    <div className="tourist-weather-value">{weatherData.visibility}</div>
                    <div className="tourist-weather-label">Visibility</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sections */}
        <div className="tourist-bottom-sections">
          {/* Emergency Contacts */}
          <div className="tourist-section-card tourist-emergency-contacts">
            <div className="tourist-section-header">
              <h3 className="tourist-section-title">🆘 Emergency Contacts</h3>
            </div>
            <div className="tourist-section-body">
              <div className="tourist-contacts-list">
                {dashboardData.emergencyContacts.map((contact, index) => (
                  <div key={index} className="tourist-contact-item">
                    <div className="tourist-contact-info">
                      <div className="tourist-contact-name">{contact.name}</div>
                      <div className="tourist-contact-number">{contact.number}</div>
                    </div>
                    <button 
                      className="tourist-call-btn"
                      onClick={() => window.open(`tel:${contact.number}`)}
                    >
                      📞 Call
                    </button>
                  </div>
                ))}
              </div>

              <div className="tourist-emergency-alert">
                <div className="tourist-emergency-title">In Case of Emergency</div>
                <button 
                  className="tourist-emergency-btn"
                  onClick={handleEmergencySOS}
                >
                  🆘 PRESS FOR IMMEDIATE HELP
                </button>
              </div>
            </div>
          </div>

          {/* Travel Destinations */}
          <div className="tourist-section-card tourist-travel-destinations">
            <div className="tourist-section-header">
              <h3 className="tourist-section-title">🗺️ Travel Destinations</h3>
            </div>
            <div className="tourist-section-body">
              {dashboardData.upcomingDestinations ? (
                <>
                  <p className="tourist-destinations-subtitle">Popular destinations near you:</p>
                  <div className="tourist-destinations-list">
                    {dashboardData.upcomingDestinations.map((destination, index) => (
                      <div key={index} className="tourist-destination-item">
                        <div className="tourist-destination-info">
                          <div className="tourist-destination-name">{destination}</div>
                          <div className="tourist-destination-distance">
                            {Math.floor(Math.random() * 10) + 1} km away
                          </div>
                        </div>
                        <button 
                          className="tourist-navigate-btn"
                          onClick={() => navigate('/tourist/map')}
                        >
                          📍 Navigate
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="tourist-empty-destinations">
                  <div className="tourist-empty-icon">🗺️</div>
                  <p className="tourist-empty-title">Explore nearby destinations</p>
                  <button 
                    className="tourist-explore-btn"
                    onClick={() => navigate('/tourist/map')}
                  >
                    View Safety Map
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="tourist-system-status">
          <div className="tourist-status-content">
            <div className="tourist-status-text">
              <h4 className="tourist-status-title">🛡️ Your Safety Status</h4>
              <div className="tourist-status-description">
                GPS tracking is active • Emergency contacts are notified • 
                You're monitored 24/7 • Last update: {new Date().toLocaleTimeString()}
              </div>
            </div>
            <div className="tourist-status-indicator">
              <span className="tourist-status-badge-large">🟢 All Systems Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
