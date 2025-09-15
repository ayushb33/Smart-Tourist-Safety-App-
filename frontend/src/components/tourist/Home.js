  import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { toast } from 'react-toastify';
  import { authService } from '../../services/auth';
  import { touristAPI, mockData } from '../../services/api';
  import { geolocationService } from '../../services/geolocation';
  import Loading from '../common/Loading';

  const TouristHome = () => {
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
        // In production: const data = await touristAPI.getDashboard();

        // For demo, simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setDashboardData({
          safetyScore: 85,
          currentLocation: 'India Gate, New Delhi',
          lastCheckIn: new Date(Date.now() - 30 * 60000), // 30 minutes ago
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
      <div className="container-fluid py-4">
        {/* Welcome Header */}
        <div className="row">
          <div className="col-12">
            <div className="card bg-gradient-primary text-white">
              <div className="card-body p-4">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h2 className="mb-2">Welcome back, {userInfo?.name || 'Tourist'}! 👋</h2>
                    <p className="mb-2">Your safety is our priority. Stay connected and stay safe.</p>
                    <div className="d-flex align-items-center">
                      <span className="badge bg-white text-primary me-2">
                        📍 {dashboardData.currentLocation}
                      </span>
                      {locationLoading && (
                        <div className="spinner-border spinner-border-sm text-white" role="status">
                          <span className="visually-hidden">Updating location...</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4 text-end">
                    <div className="display-6">🛡️</div>
                    <div className="small">Last check-in:</div>
                    <div className="fw-bold">
                      {new Date(dashboardData.lastCheckIn).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Stats */}
        <div className="dashboard-grid">
          {/* Safety Score */}
          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">🛡️ Safety Score</h5>
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={() => navigate('/tourist/map')}
              >
                View Details
              </button>
            </div>
            <div className={`stat-number text-${getSafetyScoreColor(dashboardData.safetyScore)}`}>
              {dashboardData.safetyScore}%
            </div>
            <div className="stat-label">{getSafetyScoreText(dashboardData.safetyScore)}</div>
            <div className="progress mt-2" style={{ height: '6px' }}>
              <div 
                className={`progress-bar bg-${getSafetyScoreColor(dashboardData.safetyScore)}`}
                style={{ width: `${dashboardData.safetyScore}%` }}
              />
            </div>
          </div>

          {/* Current Status */}
          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">📊 Current Status</h5>
              <span className="badge bg-success">Active</span>
            </div>
            <div className="stat-number text-success">Safe</div>
            <div className="stat-label">You're in a safe zone</div>
            <div className="small text-muted mt-2">
              <div>🟢 GPS: Active</div>
              <div>📱 Connection: Strong</div>
            </div>
          </div>

          {/* Alerts */}
          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">🚨 Active Alerts</h5>
              <button 
                className="btn btn-sm btn-outline-info"
                onClick={() => toast.info('No active alerts')}
              >
                View All
              </button>
            </div>
            <div className="stat-number text-info">{dashboardData.alertsCount}</div>
            <div className="stat-label">No current alerts</div>
            <div className="small text-success mt-2">
              ✅ All systems normal
            </div>
          </div>

          {/* Nearby Tourists */}
          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">👥 Community</h5>
              <span className="badge bg-info">{dashboardData.nearbyTourists}</span>
            </div>
            <div className="stat-number text-primary">{dashboardData.nearbyTourists}</div>
            <div className="stat-label">Tourists nearby</div>
            <div className="small text-muted mt-2">
              Within 2km radius
            </div>
          </div>
        </div>

        <div className="row mt-4">
          {/* Quick Actions */}
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="mb-0">⚡ Quick Actions</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-6 mb-3">
                    <button 
                      className="btn btn-danger w-100 py-3"
                      onClick={handleEmergencySOS}
                    >
                      🆘<br />Emergency SOS
                    </button>
                  </div>
                  <div className="col-6 mb-3">
                    <button 
                      className="btn btn-success w-100 py-3"
                      onClick={handleSafetyCheckIn}
                    >
                      ✅<br />Safety Check-in
                    </button>
                  </div>
                  <div className="col-6 mb-3">
                    <button 
                      className="btn btn-primary w-100 py-3"
                      onClick={() => navigate('/tourist/map')}
                    >
                      🗺️<br />Safety Map
                    </button>
                  </div>
                  <div className="col-6 mb-3">
                    <button 
                      className="btn btn-info w-100 py-3"
                      onClick={() => navigate('/tourist/qr')}
                    >
                      🆔<br />My Digital ID
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <button 
                    className="btn btn-outline-secondary w-100"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                  >
                    {locationLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Updating Location...
                      </>
                    ) : (
                      '📍 Update My Location'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity & Weather */}
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="mb-0">📊 Recent Activity</h5>
              </div>
              <div className="card-body">
                {dashboardData.recentActivity && dashboardData.recentActivity.length > 0 ? (
                  dashboardData.recentActivity.map((activity, index) => (
                    <div key={index} className="d-flex align-items-center mb-3">
                      <div className="me-3">
                        <span className={`badge ${
                          activity.status === 'success' ? 'bg-success' :
                          activity.status === 'warning' ? 'bg-warning' : 'bg-info'
                        }`}>
                          {activity.status === 'success' ? '✅' :
                          activity.status === 'warning' ? '⚠️' : 'ℹ️'}
                        </span>
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{activity.action}</div>
                        <div className="small text-muted">{activity.time}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted py-4">
                    <div style={{ fontSize: '3rem' }}>📊</div>
                    <p>No recent activity</p>
                    <small>Your safety activities will appear here</small>
                  </div>
                )}

                {/* Weather Info */}
                <div className="mt-4 p-3 bg-light rounded">
                  <h6 className="mb-2">🌤️ Current Weather</h6>
                  <div className="row text-center">
                    <div className="col-3">
                      <div className="fw-bold">{weatherData.temperature}</div>
                      <div className="small text-muted">Temp</div>
                    </div>
                    <div className="col-3">
                      <div className="fw-bold">{weatherData.condition}</div>
                      <div className="small text-muted">Sky</div>
                    </div>
                    <div className="col-3">
                      <div className="fw-bold">{weatherData.humidity}</div>
                      <div className="small text-muted">Humidity</div>
                    </div>
                    <div className="col-3">
                      <div className="fw-bold">{weatherData.visibility}</div>
                      <div className="small text-muted">Visibility</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contacts & Travel Info */}
        <div className="row mt-4">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">🆘 Emergency Contacts</h5>
              </div>
              <div className="card-body">
                {dashboardData.emergencyContacts.map((contact, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <div className="fw-semibold">{contact.name}</div>
                      <div className="text-muted">{contact.number}</div>
                    </div>
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => window.open(`tel:${contact.number}`)}
                    >
                      📞 Call
                    </button>
                  </div>
                ))}

                <div className="mt-3 p-3 bg-danger bg-opacity-10 rounded text-center">
                  <div className="fw-bold text-danger mb-2">In Case of Emergency</div>
                  <button 
                    className="btn btn-danger"
                    onClick={handleEmergencySOS}
                  >
                    🆘 PRESS FOR IMMEDIATE HELP
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">🗺️ Travel Destinations</h5>
              </div>
              <div className="card-body">
                {dashboardData.upcomingDestinations ? (
                  <>
                    <p className="text-muted mb-3">Popular destinations near you:</p>
                    {dashboardData.upcomingDestinations.map((destination, index) => (
                      <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <div className="fw-semibold">{destination}</div>
                          <div className="small text-muted">
                            {Math.floor(Math.random() * 10) + 1} km away
                          </div>
                        </div>
                        <button 
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => navigate('/tourist/map')}
                        >
                          📍 Navigate
                        </button>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center text-muted py-4">
                    <div style={{ fontSize: '3rem' }}>🗺️</div>
                    <p>Explore nearby destinations</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate('/tourist/map')}
                    >
                      View Safety Map
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="alert alert-info">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h6 className="alert-heading mb-1">🛡️ Your Safety Status</h6>
                  <div className="small">
                    GPS tracking is active • Emergency contacts are notified • 
                    You're monitored 24/7 • Last update: {new Date().toLocaleTimeString()}
                  </div>
                </div>
                <div className="col-md-4 text-end">
                  <span className="badge bg-success fs-6">🟢 All Systems Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default TouristHome;