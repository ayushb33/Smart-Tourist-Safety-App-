import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../../services/auth';
import Loading from '../common/Loading';
import './Dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalTourists: 0,
    activeTourists: 0,
    alertsCount: 0,
    safetyScore: 0,
    recentAlerts: [],
    touristLocations: []
  });

  const navigate = useNavigate();
  const userInfo = authService.getUserInfo();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDashboardData({
        totalTourists: 156,
        activeTourists: 142,
        alertsCount: 3,
        safetyScore: 87,
        recentAlerts: [
          { 
            id: 1, 
            type: 'SOS', 
            tourist: 'John Doe', 
            location: 'Red Fort Area', 
            time: '2 minutes ago',
            priority: 'high',
            status: 'responding'
          },
          { 
            id: 2, 
            type: 'Safety Check', 
            tourist: 'Jane Smith', 
            location: 'India Gate', 
            time: '15 minutes ago',
            priority: 'medium',
            status: 'resolved'
          },
          { 
            id: 3, 
            type: 'Location Alert', 
            tourist: 'Mike Johnson', 
            location: 'Chandni Chowk', 
            time: '1 hour ago',
            priority: 'low',
            status: 'monitoring'
          }
        ],
        touristLocations: [
          {
            id: 1,
            name: 'John Doe',
            location: 'India Gate',
            safetyScore: 85,
            lastSeen: '5 minutes ago',
            status: 'safe'
          },
          {
            id: 2,
            name: 'Jane Smith',
            location: 'Red Fort',
            safetyScore: 92,
            lastSeen: '10 minutes ago',
            status: 'safe'
          },
          {
            id: 3,
            name: 'Mike Johnson',
            location: 'Qutub Minar',
            safetyScore: 78,
            lastSeen: '15 minutes ago',
            status: 'caution'
          },
          {
            id: 4,
            name: 'Sarah Wilson',
            location: 'Lotus Temple',
            safetyScore: 88,
            lastSeen: '8 minutes ago',
            status: 'safe'
          },
          {
            id: 5,
            name: 'David Brown',
            location: 'Humayun Tomb',
            safetyScore: 90,
            lastSeen: '12 minutes ago',
            status: 'safe'
          },
          {
            id: 6,
            name: 'Lisa Davis',
            location: 'Akshardham',
            safetyScore: 82,
            lastSeen: '20 minutes ago',
            status: 'safe'
          },
          {
            id: 7,
            name: 'Tom Anderson',
            location: 'Chandni Chowk',
            safetyScore: 75,
            lastSeen: '25 minutes ago',
            status: 'caution'
          },
          {
            id: 8,
            name: 'Emma Taylor',
            location: 'Connaught Place',
            safetyScore: 86,
            lastSeen: '6 minutes ago',
            status: 'safe'
          }
        ],
        recentActivity: [
          { action: 'SOS Alert received', time: '2 mins ago', officer: 'Unit-23' },
          { action: 'Tourist check-in verified', time: '15 mins ago', officer: 'Unit-15' },
          { action: 'Safety zone patrol completed', time: '45 mins ago', officer: 'Unit-07' }
        ]
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      authService.removeToken();
      toast.success('Officer logged out successfully');
      navigate('/login');
      window.location.reload();
    }
  };

  const handleAlert = (alertId, action) => {
    toast.info(`Alert ${alertId} ${action}`);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'responding': return 'danger';
      case 'resolved': return 'success';
      case 'monitoring': return 'info';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <Loading message="Loading police dashboard..." size="large" />;
  }

  return (
    <div className="enhanced-dashboard">
      {/* Welcome Header */}
      <div className="dashboard-header">
        <div className="header-card">
          <div className="header-content">
            <div className="header-info">
              <div className="police-badge">👮‍♂️</div>
              <div className="header-text">
                <h1>Police Command Center</h1>
                <p>Welcome back, <span className="officer-name">{userInfo?.name || 'Officer'}</span>! Monitor tourist safety in real-time.</p>
                <div className="header-badges">
                  <span className="status-badge alerts">
                    🚨 {dashboardData.alertsCount} Active Alerts
                  </span>
                  <span className="status-badge online">
                    👥 {dashboardData.activeTourists} Tourists Online
                  </span>
                </div>
              </div>
            </div>
            <div className="header-actions">
              <button className="logout-btn" onClick={handleLogout}>
                <span className="btn-icon">🚪</span>
                <span>Logout</span>
              </button>
              <div className="system-status">
                <div className="status-icon">🛡️</div>
                <div className="status-text">
                  <span className="status-label">System Status</span>
                  <span className="status-value">🟢 OPERATIONAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Statistics */}
      <div className="stats-grid">
        <div className="stat-card total-tourists">
          <div className="stat-content">
            <div className="stat-info">
              <h3>Total Tourists</h3>
              <div className="stat-number">{dashboardData.totalTourists}</div>
              <p>Registered in system</p>
            </div>
            <div className="stat-icon">👥</div>
          </div>
        </div>

        <div className="stat-card active-tourists">
          <div className="stat-content">
            <div className="stat-info">
              <h3>Active Now</h3>
              <div className="stat-number">{dashboardData.activeTourists}</div>
              <p>Currently online</p>
            </div>
            <div className="stat-icon">🟢</div>
          </div>
        </div>

        <div className="stat-card active-alerts">
          <div className="stat-content">
            <div className="stat-info">
              <h3>Active Alerts</h3>
              <div className="stat-number">{dashboardData.alertsCount}</div>
              <p>Requiring attention</p>
            </div>
            <div className="stat-icon">🚨</div>
          </div>
        </div>

        <div className="stat-card safety-score">
          <div className="stat-content">
            <div className="stat-info">
              <h3>Safety Score</h3>
              <div className="stat-number">{dashboardData.safetyScore}%</div>
              <p>Overall area safety</p>
            </div>
            <div className="stat-icon">🛡️</div>
          </div>
        </div>
      </div>

      <div className="dashboard-main">
        {/* Recent Alerts */}
        <div className="alerts-section">
          <div className="section-card">
            <div className="section-header">
              <h2>🚨 Recent Alerts</h2>
              <button 
                className="view-all-btn"
                onClick={() => navigate('/police/alerts')}
              >
                View All Alerts
              </button>
            </div>
            <div className="alerts-content">
              {dashboardData.recentAlerts && dashboardData.recentAlerts.length > 0 ? (
                dashboardData.recentAlerts.map(alert => (
                  <div key={alert.id} className={`alert-item priority-${alert.priority}`}>
                    <div className="alert-info">
                      <div className="alert-header">
                        <span className={`priority-badge ${alert.priority}`}>
                          {alert.priority.toUpperCase()}
                        </span>
                        <span className="alert-type">{alert.type}</span>
                      </div>
                      <div className="alert-details">
                        <span className="tourist-name">Tourist: {alert.tourist}</span>
                        <span className="alert-location">Location: {alert.location}</span>
                        <span className="alert-time">{alert.time}</span>
                      </div>
                    </div>
                    <div className="alert-actions">
                      <span className={`status-badge ${alert.status}`}>
                        {alert.status.toUpperCase()}
                      </span>
                      <div className="action-buttons">
                        <button 
                          className="action-btn respond"
                          onClick={() => handleAlert(alert.id, 'responded')}
                        >
                          Respond
                        </button>
                        <button 
                          className="action-btn resolve"
                          onClick={() => handleAlert(alert.id, 'resolved')}
                        >
                          Resolve
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-alerts">
                  <div className="no-alerts-icon">✅</div>
                  <h3>No active alerts</h3>
                  <p>All tourists are safe</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <div className="section-card">
            <div className="section-header">
              <h2>⚡ Quick Actions</h2>
            </div>
            <div className="quick-actions">
              <button 
                className="quick-action-btn tourists"
                onClick={() => navigate('/police/tourists')}
              >
                <span className="btn-icon">👥</span>
                <span className="btn-text">View All Tourists</span>
              </button>
              <button 
                className="quick-action-btn heatmap"
                onClick={() => navigate('/police/heatmap')}
              >
                <span className="btn-icon">🗺️</span>
                <span className="btn-text">Location Heatmap</span>
              </button>
              <button 
                className="quick-action-btn alerts"
                onClick={() => navigate('/police/alerts')}
              >
                <span className="btn-icon">🚨</span>
                <span className="btn-text">Alert Management</span>
              </button>
              <button 
                className="quick-action-btn scanner"
                onClick={() => toast.info('QR Scanner launched')}
              >
                <span className="btn-icon">📱</span>
                <span className="btn-text">QR Code Scanner</span>
              </button>
              <div className="action-divider"></div>
              <button 
                className="quick-action-btn logout"
                onClick={handleLogout}
              >
                <span className="btn-icon">🚪</span>
                <span className="btn-text">Logout from System</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tourist Locations Overview */}
      <div className="locations-section">
        <div className="section-card">
          <div className="section-header">
            <h2>📍 Tourist Locations Overview</h2>
          </div>
          <div className="tourist-grid">
            {dashboardData.touristLocations && dashboardData.touristLocations.length > 0 ? (
              dashboardData.touristLocations.map((tourist, index) => (
                <div key={tourist.id || index} className="tourist-card">
                  <div className="tourist-header">
                    <span className="tourist-name">{tourist.name}</span>
                    <span className={`safety-badge ${tourist.safetyScore >= 80 ? 'safe' : 'caution'}`}>
                      {tourist.safetyScore}%
                    </span>
                  </div>
                  <div className="tourist-details">
                    <div className="tourist-location">📍 {tourist.location}</div>
                    <div className="tourist-time">🕒 Last seen: {tourist.lastSeen}</div>
                  </div>
                  <div className="tourist-actions">
                    <button 
                      className="tourist-btn contact"
                      onClick={() => toast.info(`Contacting ${tourist.name}`)}
                    >
                      📞 Contact
                    </button>
                    <button 
                      className="tourist-btn details"
                      onClick={() => toast.info(`Viewing ${tourist.name}'s details`)}
                    >
                      👁️ Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-tourists">
                <div className="no-tourists-icon">👥</div>
                <h3>No tourist data available</h3>
                <p>Tourist locations will appear here when available</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <div className="section-card">
            <div className="section-header">
              <h2>📊 Recent Activity</h2>
            </div>
            <div className="activity-list">
              {dashboardData.recentActivity && dashboardData.recentActivity.length > 0 ? (
                dashboardData.recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">ℹ️</div>
                    <div className="activity-content">
                      <div className="activity-action">{activity.action}</div>
                      <div className="activity-meta">
                        {activity.time} • {activity.officer}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-activity">
                  <div className="no-activity-icon">📊</div>
                  <h3>No recent activity</h3>
                  <p>Activity will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="system-status-section">
        <div className="status-alert">
          <div className="status-content">
            <div className="status-info">
              <h3>🛡️ Police System Status</h3>
              <p>
                All monitoring systems operational • Real-time tracking active • 
                Emergency response ready • Last update: {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div className="status-badge-large">🟢 ALL SYSTEMS OPERATIONAL</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
