import React, { useState, useEffect } from 'react';
import { policeAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './TouristList.css';

const TouristList = () => {
  const [tourists, setTourists] = useState([]);
  const [filteredTourists, setFilteredTourists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [selectedTourist, setSelectedTourist] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Dashboard statistics matching police dashboard
  const dashboardStats = {
    total: 156,
    active: 142,
    alerts: 3,
    averageSafety: 87
  };

  // Sample tourist data for demo
  const sampleTourists = [
    {
      id: 'tourist-001',
      name: 'John Doe',
      destination: 'Delhi',
      phone: '+91 98765 43210',
      email: 'john.doe@email.com',
      safetyScore: 88,
      status: 'active',
      lastSeen: new Date(),
      currentLocation: 'India Gate, Delhi',
      emergencyContact: '+91 87654 32109',
      checkInTime: new Date(Date.now() - 2 * 60 * 60000),
      totalAlerts: 0,
      blockchainHash: 'abc123def456ghi789'
    },
    {
      id: 'tourist-002', 
      name: 'Jane Smith',
      destination: 'Mumbai',
      phone: '+91 98765 43211',
      email: 'jane.smith@email.com',
      safetyScore: 92,
      status: 'active',
      lastSeen: new Date(Date.now() - 30 * 60000),
      currentLocation: 'Gateway of India, Mumbai',
      emergencyContact: '+91 87654 32108',
      checkInTime: new Date(Date.now() - 4 * 60 * 60000),
      totalAlerts: 1,
      blockchainHash: 'def456ghi789jkl012'
    },
    {
      id: 'tourist-003',
      name: 'Mike Johnson',
      destination: 'Goa',
      phone: '+91 98765 43212',
      email: 'mike.johnson@email.com',
      safetyScore: 76,
      status: 'offline',
      lastSeen: new Date(Date.now() - 2 * 60 * 60000),
      currentLocation: 'Baga Beach, Goa',
      emergencyContact: '+91 87654 32107',
      checkInTime: new Date(Date.now() - 6 * 60 * 60000),
      totalAlerts: 3,
      blockchainHash: 'ghi789jkl012mno345'
    },
    {
      id: 'tourist-004',
      name: 'Sarah Wilson',
      destination: 'Delhi',
      phone: '+91 98765 43213',
      email: 'sarah.wilson@email.com',
      safetyScore: 95,
      status: 'active',
      lastSeen: new Date(Date.now() - 5 * 60000),
      currentLocation: 'Red Fort, Delhi',
      emergencyContact: '+91 87654 32106',
      checkInTime: new Date(Date.now() - 1 * 60 * 60000),
      totalAlerts: 0,
      blockchainHash: 'jkl012mno345pqr678'
    },
    {
      id: 'tourist-005',
      name: 'David Brown',
      destination: 'Rajasthan',
      phone: '+91 98765 43214',
      email: 'david.brown@email.com',
      safetyScore: 67,
      status: 'alert',
      lastSeen: new Date(Date.now() - 20 * 60000),
      currentLocation: 'Jaipur City Palace',
      emergencyContact: '+91 87654 32105',
      checkInTime: new Date(Date.now() - 3 * 60 * 60000),
      totalAlerts: 2,
      blockchainHash: 'mno345pqr678stu901'
    },
    {
      id: 'tourist-006',
      name: 'Lisa Chen',
      destination: 'Kerala',
      phone: '+91 98765 43215',
      email: 'lisa.chen@email.com',
      safetyScore: 89,
      status: 'active',
      lastSeen: new Date(Date.now() - 10 * 60000),
      currentLocation: 'Alleppey Backwaters',
      emergencyContact: '+91 87654 32104',
      checkInTime: new Date(Date.now() - 5 * 60 * 60000),
      totalAlerts: 1,
      blockchainHash: 'pqr678stu901vwx234'
    }
  ];

  useEffect(() => {
    loadTourists();
  }, []);

  useEffect(() => {
    filterAndSortTourists();
  }, [searchTerm, filterStatus, sortBy, tourists]);

  const loadTourists = async () => {
    try {
      // In production, uncomment this:
      // const response = await policeAPI.getAllTourists();
      // setTourists(response.data);

      // For demo, use sample data
      setTimeout(() => {
        setTourists(sampleTourists);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading tourists:', error);
      setTourists(sampleTourists);
      setLoading(false);
    }
  };

  const filterAndSortTourists = () => {
    let filtered = tourists.filter(tourist => {
      const matchesSearch = tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tourist.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tourist.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tourist.phone.includes(searchTerm);

      const matchesStatus = filterStatus === 'all' || tourist.status === filterStatus;

      return matchesSearch && matchesStatus;
    });

    // Sort tourists
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'safetyScore':
          return b.safetyScore - a.safetyScore;
        case 'lastSeen':
          return new Date(b.lastSeen) - new Date(a.lastSeen);
        case 'destination':
          return a.destination.localeCompare(b.destination);
        default:
          return 0;
      }
    });

    setFilteredTourists(filtered);
  };

  const getSafetyBadge = (score) => {
    if (score >= 90) return { class: 'bg-success', text: 'Excellent' };
    if (score >= 80) return { class: 'bg-primary', text: 'Good' };
    if (score >= 70) return { class: 'bg-warning', text: 'Fair' };
    return { class: 'bg-danger', text: 'At Risk' };
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return { class: 'bg-success', text: 'Active', icon: '🟢' };
      case 'offline': return { class: 'bg-secondary', text: 'Offline', icon: '⚪' };
      case 'alert': return { class: 'bg-danger', text: 'Alert', icon: '🔴' };
      default: return { class: 'bg-secondary', text: 'Unknown', icon: '❓' };
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

  const flagForMonitoring = (tourist) => {
    toast.info(`${tourist.name} flagged for enhanced monitoring`);
    setTourists(prev => prev.map(t => 
      t.id === tourist.id 
        ? { ...t, status: 'alert' }
        : t
    ));
  };

  const contactTourist = (phone, name) => {
    if (window.confirm(`Call ${name} at ${phone}?`)) {
      window.open(`tel:${phone}`);
    }
  };

  const viewTouristDetails = (tourist) => {
    setSelectedTourist(tourist);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTourist(null);
  };

  const sendMessage = (tourist) => {
    const message = prompt(`Send message to ${tourist.name}:`);
    if (message) {
      toast.success(`Message sent to ${tourist.name}: "${message}"`);
    }
  };

  if (loading) {
    return (
      <div className="tourist-list-container">
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="tourist-list-container">
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="mb-0">👥 Tourist Management System</h3>
                <p className="mb-0 mt-2">Monitor and manage tourist safety across all locations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards - Updated with Dashboard Numbers */}
        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-number text-primary">{dashboardStats.total}</div>
            <div className="stat-label">Total Tourists</div>
            <span className="badge bg-primary">System Wide</span>
          </div>
          <div className="stat-card">
            <div className="stat-number text-success">{dashboardStats.active}</div>
            <div className="stat-label">Currently Active</div>
            <span className="badge bg-success">Online Now</span>
          </div>
          <div className="stat-card">
            <div className="stat-number text-danger">{dashboardStats.alerts}</div>
            <div className="stat-label">Requiring Attention</div>
            <span className="badge bg-danger">High Priority</span>
          </div>
          <div className="stat-card">
            <div className="stat-number text-warning">{dashboardStats.averageSafety}</div>
            <div className="stat-label">Average Safety Score</div>
            <span className="badge bg-info">Out of 100</span>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="row mt-4">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">🔍 Search Tourists</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by name, ID, destination, or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">📊 Filter by Status</label>
                    <select
                      className="form-control"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">🟢 Active</option>
                      <option value="offline">⚪ Offline</option>
                      <option value="alert">🔴 Alert</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">🔄 Sort by</label>
                    <select
                      className="form-control"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="name">Name (A-Z)</option>
                      <option value="safetyScore">Safety Score (High-Low)</option>
                      <option value="lastSeen">Last Seen (Recent)</option>
                      <option value="destination">Destination</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Showing:</strong> {filteredTourists.length} of {dashboardStats.total}
                  </div>
                  <div>
                    <button 
                      className="btn btn-success btn-sm me-2"
                      onClick={() => toast.info('Exporting tourist data...')}
                    >
                      📊 Export
                    </button>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={loadTourists}
                    >
                      🔄 Refresh
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tourist List Table */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">📋 Tourist Directory ({filteredTourists.length})</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{width: '25%'}}>Tourist Information</th>
                        <th style={{width: '15%'}}>Destination & Location</th>
                        <th style={{width: '15%'}}>Safety & Status</th>
                        <th style={{width: '15%'}}>Activity</th>
                        <th style={{width: '15%'}}>Contact Info</th>
                        <th style={{width: '15%'}}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTourists.map((tourist) => {
                        const safetyBadge = getSafetyBadge(tourist.safetyScore);
                        const statusBadge = getStatusBadge(tourist.status);

                        return (
                          <tr key={tourist.id}>
                            <td>
                              <div>
                                <strong className="text-primary">{tourist.name}</strong>
                                <br />
                                <small className="text-muted">
                                  🆔 {tourist.id}
                                </small>
                                <br />
                                <small className="text-muted">
                                  📧 {tourist.email}
                                </small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <span className="badge bg-info mb-1">{tourist.destination}</span>
                                <br />
                                <small className="text-muted">
                                  📍 {tourist.currentLocation}
                                </small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <span className={`badge ${safetyBadge.class} mb-1`}>
                                  🛡️ {tourist.safetyScore}/100
                                </span>
                                <br />
                                <span className={`badge ${statusBadge.class}`}>
                                  {statusBadge.icon} {statusBadge.text}
                                </span>
                                {tourist.totalAlerts > 0 && (
                                  <>
                                    <br />
                                    <small className="text-danger">
                                      ⚠️ {tourist.totalAlerts} alerts
                                    </small>
                                  </>
                                )}
                              </div>
                            </td>
                            <td>
                              <div>
                                <small className="text-muted">
                                  <strong>Last seen:</strong><br />
                                  {getTimeSince(tourist.lastSeen)}
                                </small>
                                <br />
                                <small className="text-muted">
                                  <strong>Check-in:</strong><br />
                                  {getTimeSince(tourist.checkInTime)}
                                </small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <small>
                                  <strong>📞 Tourist:</strong><br />
                                  <a 
                                    href={`tel:${tourist.phone}`} 
                                    className="text-decoration-none"
                                  >
                                    {tourist.phone}
                                  </a>
                                </small>
                                <br />
                                <small>
                                  <strong>🆘 Emergency:</strong><br />
                                  <a 
                                    href={`tel:${tourist.emergencyContact}`} 
                                    className="text-decoration-none text-danger"
                                  >
                                    {tourist.emergencyContact}
                                  </a>
                                </small>
                              </div>
                            </td>
                            <td>
                              <div className="btn-group-vertical btn-group-sm w-100">
                                <button
                                  className="btn btn-primary btn-sm mb-1"
                                  onClick={() => viewTouristDetails(tourist)}
                                  title="View full details"
                                >
                                  👁️ Details
                                </button>
                                <button
                                  className="btn btn-success btn-sm mb-1"
                                  onClick={() => contactTourist(tourist.phone, tourist.name)}
                                  title="Call tourist"
                                >
                                  📞 Call
                                </button>
                                <button
                                  className="btn btn-warning btn-sm mb-1"
                                  onClick={() => flagForMonitoring(tourist)}
                                  title="Flag for monitoring"
                                >
                                  🏃 Monitor
                                </button>
                                <button
                                  className="btn btn-info btn-sm"
                                  onClick={() => sendMessage(tourist)}
                                  title="Send message"
                                >
                                  💬 Message
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {filteredTourists.length === 0 && (
                  <div className="text-center py-5">
                    <h5 className="text-muted">🔍 No tourists found</h5>
                    <p className="text-muted">
                      Try adjusting your search terms or filter criteria
                    </p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        setSearchTerm('');
                        setFilterStatus('all');
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Panel */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">⚡ Quick Actions</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-2">
                    <button 
                      className="btn btn-danger w-100 mb-2"
                      onClick={() => toast.warning('Emergency broadcast sent to all active tourists')}
                    >
                      🚨 Emergency Broadcast
                    </button>
                  </div>
                  <div className="col-md-2">
                    <button 
                      className="btn btn-warning w-100 mb-2"
                      onClick={() => toast.info('Safety reminder sent to low-score tourists')}
                    >
                      ⚠️ Safety Reminder
                    </button>
                  </div>
                  <div className="col-md-2">
                    <button 
                      className="btn btn-info w-100 mb-2"
                      onClick={() => toast.success('Location update requested from all tourists')}
                    >
                      📍 Request Location
                    </button>
                  </div>
                  <div className="col-md-2">
                    <button 
                      className="btn btn-success w-100 mb-2"
                      onClick={() => toast.info('Daily safety report generated')}
                    >
                      📊 Generate Report
                    </button>
                  </div>
                  <div className="col-md-2">
                    <button 
                      className="btn btn-primary w-100 mb-2"
                      onClick={() => toast.info('Tourist data exported to CSV')}
                    >
                      📥 Export Data
                    </button>
                  </div>
                  <div className="col-md-2">
                    <button 
                      className="btn btn-secondary w-100 mb-2"
                      onClick={() => window.location.href = '/police/dashboard'}
                    >
                      📊 Back to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="alert alert-info">
              <h6 className="alert-heading">📡 System Status</h6>
              <div className="row">
                <div className="col-md-3">
                  <strong>Last Data Refresh:</strong> {new Date().toLocaleTimeString()}
                </div>
                <div className="col-md-3">
                  <strong>Total Tourists in System:</strong> {dashboardStats.total}
                </div>
                <div className="col-md-3">
                  <strong>Active Connections:</strong> {dashboardStats.active}
                </div>
                <div className="col-md-3">
                  <strong>System Status:</strong> <span className="badge bg-success">Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tourist Details Modal - Improved Uniform Design */}
        {showModal && selectedTourist && (
          <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title d-flex align-items-center">
                    <span className="me-2">👤</span>
                    Tourist Details - {selectedTourist.name}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body p-0">
                  <div className="row g-0">
                    {/* Personal Information */}
                    <div className="col-md-6">
                      <div className="info-card h-100">
                        <div className="info-card-header bg-primary">
                          <span className="info-icon">📋</span>
                          <h6 className="info-title">Personal Information</h6>
                        </div>
                        <div className="info-card-body">
                          <div className="info-item">
                            <div className="info-icon-wrapper">
                              <span className="info-field-icon">👤</span>
                            </div>
                            <div className="info-content">
                              <label className="info-label">Name</label>
                              <span className="info-value">{selectedTourist.name}</span>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <div className="info-icon-wrapper">
                              <span className="info-field-icon">🆔</span>
                            </div>
                            <div className="info-content">
                              <label className="info-label">Tourist ID</label>
                              <span className="info-value">{selectedTourist.id}</span>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <div className="info-icon-wrapper">
                              <span className="info-field-icon">📧</span>
                            </div>
                            <div className="info-content">
                              <label className="info-label">Email</label>
                              <span className="info-value">{selectedTourist.email}</span>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <div className="info-icon-wrapper">
                              <span className="info-field-icon">📞</span>
                            </div>
                            <div className="info-content">
                              <label className="info-label">Phone Number</label>
                              <a href={`tel:${selectedTourist.phone}`} className="info-value info-link">
                                {selectedTourist.phone}
                              </a>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <div className="info-icon-wrapper">
                              <span className="info-field-icon">🆘</span>
                            </div>
                            <div className="info-content">
                              <label className="info-label">Emergency Contact</label>
                              <a href={`tel:${selectedTourist.emergencyContact}`} className="info-value info-link emergency">
                                {selectedTourist.emergencyContact}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Location & Status */}
                    <div className="col-md-6">
                      <div className="info-card h-100">
                        <div className="info-card-header bg-success">
                          <span className="info-icon">📍</span>
                          <h6 className="info-title">Location & Status</h6>
                        </div>
                        <div className="info-card-body">
                          <div className="info-item">
                            <div className="info-icon-wrapper">
                              <span className="info-field-icon">🎯</span>
                            </div>
                            <div className="info-content">
                              <label className="info-label">Destination</label>
                              <span className="info-value">{selectedTourist.destination}</span>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <div className="info-icon-wrapper">
                              <span className="info-field-icon">📍</span>
                            </div>
                            <div className="info-content">
                              <label className="info-label">Current Location</label>
                              <span className="info-value">{selectedTourist.currentLocation}</span>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <div className="info-icon-wrapper">
                              <span className="info-field-icon">📊</span>
                            </div>
                            <div className="info-content">
                              <label className="info-label">Status</label>
                              <span className={`info-badge badge-${selectedTourist.status}`}>
                                {getStatusBadge(selectedTourist.status).icon} {getStatusBadge(selectedTourist.status).text}
                              </span>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <div className="info-icon-wrapper">
                              <span className="info-field-icon">🛡️</span>
                            </div>
                            <div className="info-content">
                              <label className="info-label">Safety Score</label>
                              <span className={`info-badge badge-safety-${getSafetyBadge(selectedTourist.safetyScore).text.toLowerCase()}`}>
                                {selectedTourist.safetyScore}/100
                              </span>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <div className="info-icon-wrapper">
                              <span className="info-field-icon">🚨</span>
                            </div>
                            <div className="info-content">
                              <label className="info-label">Total Alerts</label>
                              <span className="info-value alert-count">{selectedTourist.totalAlerts}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row g-0 mt-0">
                    {/* Activity Timeline */}
                    <div className="col-md-6">
                      <div className="info-card h-100">
                        <div className="info-card-header bg-info">
                          <span className="info-icon">⏰</span>
                          <h6 className="info-title">Activity Timeline</h6>
                        </div>
                        <div className="info-card-body">
                          <div className="info-item">
                            <div className="info-icon-wrapper">
                              <span className="info-field-icon">⏰</span>
                            </div>
                            <div className="info-content">
                              <label className="info-label">Last Seen</label>
                              <span className="info-value">{getTimeSince(selectedTourist.lastSeen)}</span>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <div className="info-icon-wrapper">
                              <span className="info-field-icon">🕐</span>
                            </div>
                            <div className="info-content">
                              <label className="info-label">Check-in Time</label>
                              <span className="info-value">{getTimeSince(selectedTourist.checkInTime)}</span>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <div className="info-icon-wrapper">
                              <span className="info-field-icon">📅</span>
                            </div>
                            <div className="info-content">
                              <label className="info-label">Last Update</label>
                              <span className="info-value timestamp">{selectedTourist.lastSeen.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* System Information */}
                    <div className="col-md-6">
                      <div className="info-card h-100">
                        <div className="info-card-header bg-warning">
                          <span className="info-icon">🔗</span>
                          <h6 className="info-title">System Information</h6>
                        </div>
                        <div className="info-card-body">
                          <div className="info-item">
                            <div className="info-icon-wrapper">
                              <span className="info-field-icon">🔗</span>
                            </div>
                            <div className="info-content">
                              <label className="info-label">Blockchain Hash</label>
                              <div className="blockchain-hash">
                                <code className="hash-code">{selectedTourist.blockchainHash}</code>
                              </div>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <div className="info-icon-wrapper">
                              <span className="info-field-icon">🔐</span>
                            </div>
                            <div className="info-content">
                              <label className="info-label">Verification Status</label>
                              <span className="info-value verified">Secure digital identity verification</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <div className="action-buttons w-100">
                    <button 
                      type="button" 
                      className="btn btn-success action-btn"
                      onClick={() => contactTourist(selectedTourist.phone, selectedTourist.name)}
                    >
                      <span className="btn-icon">📞</span>
                      <span className="btn-text">Call Tourist</span>
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-danger action-btn"
                      onClick={() => contactTourist(selectedTourist.emergencyContact, selectedTourist.name + ' Emergency')}
                    >
                      <span className="btn-icon">🆘</span>
                      <span className="btn-text">Call Emergency</span>
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-warning action-btn"
                      onClick={() => {
                        flagForMonitoring(selectedTourist);
                        closeModal();
                      }}
                    >
                      <span className="btn-icon">📊</span>
                      <span className="btn-text">Flag Monitor</span>
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-info action-btn"
                      onClick={() => {
                        sendMessage(selectedTourist);
                        closeModal();
                      }}
                    >
                      <span className="btn-icon">💬</span>
                      <span className="btn-text">Send Message</span>
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary action-btn" 
                      onClick={closeModal}
                    >
                      <span className="btn-icon">✖️</span>
                      <span className="btn-text">Close</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TouristList;

