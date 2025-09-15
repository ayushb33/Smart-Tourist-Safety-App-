import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './AlertPanel.css';

const AlertPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedAlerts, setSelectedAlerts] = useState([]);

  // Sample alerts data
  const sampleAlerts = [
    {
      id: 1,
      type: 'SOS',
      touristId: 'tourist-001',
      touristName: 'John Doe',
      message: 'Emergency SOS Alert - Immediate assistance required',
      location: { lat: 28.6139, lng: 77.2090, address: 'India Gate, Delhi' },
      timestamp: new Date(Date.now() - 5 * 60000),
      status: 'active',
      priority: 'critical',
      assignedOfficer: 'Officer Smith',
      responseTime: null
    },
    {
      id: 2,
      type: 'ZONE_VIOLATION',
      touristId: 'tourist-003',
      touristName: 'Mike Johnson',
      message: 'Tourist entered unsafe zone after dark hours',
      location: { lat: 28.6100, lng: 77.2070, address: 'Construction Area, Delhi' },
      timestamp: new Date(Date.now() - 15 * 60000),
      status: 'acknowledged',
      priority: 'high',
      assignedOfficer: 'Officer Brown',
      responseTime: '2 minutes'
    },
    {
      id: 3,
      type: 'OFFLINE',
      touristId: 'tourist-005',
      touristName: 'Lisa Chen',
      message: 'Tourist offline for more than 2 hours - welfare check required',
      location: { lat: 28.6120, lng: 77.2080, address: 'Last seen: Market Area' },
      timestamp: new Date(Date.now() - 45 * 60000),
      status: 'investigating',
      priority: 'medium',
      assignedOfficer: 'Officer Davis',
      responseTime: '5 minutes'
    },
    {
      id: 4,
      type: 'SAFETY_SCORE',
      touristId: 'tourist-007',
      touristName: 'Robert Kim',
      message: 'Safety score dropped below critical threshold (55%)',
      location: { lat: 28.6150, lng: 77.2090, address: 'Tourist District, Delhi' },
      timestamp: new Date(Date.now() - 60 * 60000),
      status: 'resolved',
      priority: 'low',
      assignedOfficer: 'Officer Wilson',
      responseTime: '1 minute'
    },
    {
      id: 5,
      type: 'SOS',
      touristId: 'tourist-008',
      touristName: 'Emma Watson',
      message: 'Medical emergency - tourist requesting ambulance',
      location: { lat: 28.6145, lng: 77.2105, address: 'Red Fort, Delhi' },
      timestamp: new Date(Date.now() - 30 * 60000),
      status: 'resolved',
      priority: 'critical',
      assignedOfficer: 'Officer Johnson',
      responseTime: '30 seconds'
    }
  ];

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = () => {
    setLoading(true);
    setTimeout(() => {
      setAlerts(sampleAlerts);
      setLoading(false);
    }, 500);
  };

  const getFilteredAlerts = () => {
    return alerts.filter(alert => {
      if (filter === 'all') return true;
      if (filter === 'active') return alert.status === 'active';
      if (filter === 'critical') return alert.priority === 'critical';
      if (filter === 'unresolved') return alert.status !== 'resolved';
      return alert.type === filter;
    });
  };

  const updateAlertStatus = (alertId, newStatus) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { 
            ...alert, 
            status: newStatus,
            responseTime: newStatus === 'acknowledged' && !alert.responseTime ? '1 minute' : alert.responseTime
          }
        : alert
    ));

    const alert = alerts.find(a => a.id === alertId);
    toast.success(`✅ Alert #${alertId} (${alert?.touristName}) marked as ${newStatus}`);
  };

  const bulkUpdateAlerts = (status) => {
    if (selectedAlerts.length === 0) {
      toast.warning('Please select alerts first');
      return;
    }

    setAlerts(alerts.map(alert => 
      selectedAlerts.includes(alert.id) 
        ? { ...alert, status }
        : alert
    ));

    toast.success(`✅ ${selectedAlerts.length} alerts marked as ${status}`);
    setSelectedAlerts([]);
  };

  const toggleAlertSelection = (alertId) => {
    setSelectedAlerts(prev => 
      prev.includes(alertId) 
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'SOS': return '🆘';
      case 'ZONE_VIOLATION': return '⚠️';
      case 'OFFLINE': return '📴';
      case 'SAFETY_SCORE': return '📉';
      case 'MEDICAL': return '🏥';
      default: return '⚡';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'critical': return 'priority-critical';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'acknowledged': return 'status-acknowledged';
      case 'investigating': return 'status-investigating';
      case 'resolved': return 'status-resolved';
      default: return 'status-active';
    }
  };

  const getTimeSince = (date) => {
    const minutes = Math.floor((new Date() - new Date(date)) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const assignToOfficer = (alertId) => {
    const officer = prompt('Assign to officer:');
    if (officer) {
      setAlerts(alerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, assignedOfficer: officer }
          : alert
      ));
      toast.success(`Alert assigned to ${officer}`);
    }
  };

  const viewLocation = (location) => {
    const message = `Location: ${location.address}\nCoordinates: ${location.lat}, ${location.lng}`;
    alert(message);
  };

  const emergencyDispatch = () => {
    const criticalAlerts = alerts.filter(a => a.priority === 'critical' && a.status === 'active');
    if (criticalAlerts.length > 0) {
      toast.error(`🚨 Emergency dispatch activated for ${criticalAlerts.length} critical alerts`);
    } else {
      toast.info('No critical alerts requiring emergency dispatch');
    }
  };

  const filteredAlerts = getFilteredAlerts();

  return (
    <div className="enhanced-alert-panel">
      {/* Header */}
      <div className="alert-panel-header">
        <div className="header-content">
          <div className="header-title">
            <div className="title-icon">🚨</div>
            <div className="title-text">
              <h1>Alert Management Center</h1>
              <p>Monitor, manage and respond to tourist safety alerts in real-time</p>
            </div>
          </div>
          <div className="header-status">
            <div className="live-indicator">
              <div className="live-dot"></div>
              <span>LIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card active-alerts">
            <div className="stat-content">
              <div className="stat-info">
                <h3>{alerts.filter(a => a.status === 'active').length}</h3>
                <p>Active Alerts</p>
              </div>
              <div className="stat-icon">🚨</div>
            </div>
            <div className="stat-trend up"></div>
          </div>

          <div className="stat-card critical-alerts">
            <div className="stat-content">
              <div className="stat-info">
                <h3>{alerts.filter(a => a.priority === 'critical').length}</h3>
                <p>Critical Priority</p>
              </div>
              <div className="stat-icon">⚡</div>
            </div>
            <div className="stat-trend stable"></div>
          </div>

          <div className="stat-card investigating">
            <div className="stat-content">
              <div className="stat-info">
                <h3>{alerts.filter(a => a.status === 'investigating').length}</h3>
                <p>Under Investigation</p>
              </div>
              <div className="stat-icon">🔍</div>
            </div>
            <div className="stat-trend down"></div>
          </div>

          <div className="stat-card resolved">
            <div className="stat-content">
              <div className="stat-info">
                <h3>{alerts.filter(a => a.status === 'resolved').length}</h3>
                <p>Resolved Today</p>
              </div>
              <div className="stat-icon">✅</div>
            </div>
            <div className="stat-trend up"></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-section">
        <div className="controls-left">
          <div className="filter-controls">
            <label>🎯 Filter Alerts</label>
            <select 
              className="enhanced-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Alerts</option>
              <option value="active">🔴 Active Only</option>
              <option value="critical">⚡ Critical Priority</option>
              <option value="unresolved">⏳ Unresolved</option>
              <option value="SOS">🆘 SOS Alerts</option>
              <option value="ZONE_VIOLATION">⚠️ Zone Violations</option>
              <option value="OFFLINE">📴 Offline Tourists</option>
            </select>
          </div>
          <button 
            className="control-btn refresh-btn"
            onClick={loadAlerts}
            disabled={loading}
          >
            <span className={`btn-icon ${loading ? 'rotating' : ''}`}>🔄</span>
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button 
            className="control-btn emergency-btn"
            onClick={emergencyDispatch}
          >
            <span className="btn-icon">🚨</span>
            <span>Emergency Dispatch</span>
          </button>
        </div>

        <div className="controls-right">
          <div className="results-info">
            <span>Showing {filteredAlerts.length} of {alerts.length} alerts</span>
            {selectedAlerts.length > 0 && (
              <span className="selected-count">{selectedAlerts.length} selected</span>
            )}
          </div>
          <div className="bulk-actions">
            <button 
              className="control-btn export-btn"
              onClick={() => toast.info('Alert report exported')}
            >
              <span className="btn-icon">📊</span>
              <span>Export</span>
            </button>
            <div className="bulk-dropdown">
              <button 
                className="control-btn bulk-btn"
                disabled={selectedAlerts.length === 0}
              >
                <span className="btn-icon">⚙️</span>
                <span>Bulk Actions</span>
              </button>
              {selectedAlerts.length > 0 && (
                <div className="bulk-menu">
                  <button onClick={() => bulkUpdateAlerts('acknowledged')}>Mark as Acknowledged</button>
                  <button onClick={() => bulkUpdateAlerts('investigating')}>Mark as Investigating</button>
                  <button onClick={() => bulkUpdateAlerts('resolved')}>Mark as Resolved</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="alerts-section">
        <div className="alerts-header">
          <h2>📋 Alert Queue ({filteredAlerts.length})</h2>
        </div>
        
        <div className="alerts-container">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <div key={alert.id} className={`alert-card ${getPriorityClass(alert.priority)} ${getStatusClass(alert.status)}`}>
                <div className="alert-card-header">
                  <div className="alert-selection">
                    <input 
                      type="checkbox"
                      className="alert-checkbox"
                      checked={selectedAlerts.includes(alert.id)}
                      onChange={() => toggleAlertSelection(alert.id)}
                    />
                  </div>
                  <div className="alert-icon-large">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="alert-main-info">
                    <div className="alert-title-row">
                      <h3>Alert #{alert.id} - {alert.touristName}</h3>
                      <div className="alert-badges">
                        <span className={`priority-badge ${alert.priority}`}>
                          {alert.priority.toUpperCase()}
                        </span>
                        <span className={`status-badge ${alert.status}`}>
                          {alert.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="alert-message">{alert.message}</p>
                    <div className="alert-meta">
                      <span className="meta-item">📍 {alert.location.address}</span>
                      <span className="meta-item">🕒 {getTimeSince(alert.timestamp)}</span>
                      <span className="meta-item">👮 {alert.assignedOfficer || 'Unassigned'}</span>
                      {alert.responseTime && (
                        <span className="meta-item">⏱️ Response: {alert.responseTime}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="alert-actions">
                  <div className="primary-actions">
                    {alert.status === 'active' && (
                      <button 
                        className="action-btn acknowledge-btn"
                        onClick={() => updateAlertStatus(alert.id, 'acknowledged')}
                      >
                        <span className="btn-icon">✅</span>
                        <span>Acknowledge</span>
                      </button>
                    )}
                    {alert.status === 'acknowledged' && (
                      <button 
                        className="action-btn investigate-btn"
                        onClick={() => updateAlertStatus(alert.id, 'investigating')}
                      >
                        <span className="btn-icon">🔍</span>
                        <span>Investigate</span>
                      </button>
                    )}
                    {alert.status === 'investigating' && (
                      <button 
                        className="action-btn resolve-btn"
                        onClick={() => updateAlertStatus(alert.id, 'resolved')}
                      >
                        <span className="btn-icon">✅</span>
                        <span>Resolve</span>
                      </button>
                    )}
                  </div>

                  <div className="secondary-actions">
                    <button 
                      className="action-btn location-btn"
                      onClick={() => viewLocation(alert.location)}
                    >
                      <span className="btn-icon">📍</span>
                      <span>Location</span>
                    </button>
                    <button 
                      className="action-btn assign-btn"
                      onClick={() => assignToOfficer(alert.id)}
                    >
                      <span className="btn-icon">👮</span>
                      <span>Assign</span>
                    </button>
                    <button 
                      className="action-btn call-btn"
                      onClick={() => toast.info(`📞 Calling ${alert.touristName}`)}
                    >
                      <span className="btn-icon">📞</span>
                      <span>Call</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-alerts">
              <div className="no-alerts-icon">🎉</div>
              <h3>All Clear!</h3>
              <p>
                {filter === 'all' 
                  ? 'No alerts in the system - all tourists are safe' 
                  : 'No alerts match your current filter criteria'}
              </p>
              {filter !== 'all' && (
                <button 
                  className="action-btn primary"
                  onClick={() => setFilter('all')}
                >
                  Show All Alerts
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Emergency Response Panel */}
      <div className="emergency-panel">
        <div className="panel-header">
          <h3>⚡ Emergency Response Center</h3>
        </div>
        <div className="response-actions">
          <button 
            className="response-btn emergency"
            onClick={emergencyDispatch}
          >
            <div className="response-icon">🚨</div>
            <div className="response-text">
              <span>Emergency</span>
              <small>Dispatch</small>
            </div>
          </button>
          <button 
            className="response-btn broadcast"
            onClick={() => toast.info('Safety broadcast sent to all tourists')}
          >
            <div className="response-icon">📢</div>
            <div className="response-text">
              <span>Safety</span>
              <small>Broadcast</small>
            </div>
          </button>
          <button 
            className="response-btn backup"
            onClick={() => toast.info('Backup units requested')}
          >
            <div className="response-icon">🚁</div>
            <div className="response-text">
              <span>Request</span>
              <small>Backup</small>
            </div>
          </button>
          <button 
            className="response-btn report"
            onClick={() => toast.info('Incident report generated')}
          >
            <div className="response-icon">📊</div>
            <div className="response-text">
              <span>Generate</span>
              <small>Report</small>
            </div>
          </button>
          <button 
            className="response-btn notify"
            onClick={() => toast.info('All zone commanders notified')}
          >
            <div className="response-icon">👮‍♂️</div>
            <div className="response-text">
              <span>Notify</span>
              <small>Commanders</small>
            </div>
          </button>
          <button 
            className="response-btn dashboard"
            onClick={() => window.location.href = '/police/dashboard'}
          >
            <div className="response-icon">🏠</div>
            <div className="response-text">
              <span>Back to</span>
              <small>Dashboard</small>
            </div>
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="system-status">
        <div className="status-content">
          <div className="status-info">
            <h4>📡 Real-time Alert Monitoring</h4>
            <div className="status-details">
              <span><strong>System Status:</strong> <span className="status-operational">Operational</span></span>
              <span><strong>Last Update:</strong> {new Date().toLocaleTimeString()}</span>
              <span><strong>Active Monitors:</strong> 24/7 Coverage</span>
              <span><strong>Response Team:</strong> <span className="status-ready">Ready</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertPanel;
