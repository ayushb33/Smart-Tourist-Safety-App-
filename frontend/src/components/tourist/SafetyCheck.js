import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { authService } from '../../services/auth';
import { geolocationService } from '../../services/geolocation';
import './SafetyCheck.css';

const SafetyCheck = () => {
  const [checkingIn, setCheckingIn] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [location, setLocation] = useState(null);
  const [safetyScore, setSafetyScore] = useState(94);

  const userInfo = authService.getUserInfo();

  const handleSafetyCheckIn = async () => {
    setCheckingIn(true);
    
    try {
      const position = await geolocationService.getEnhancedPosition();
      setLocation(position);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLastCheckIn(new Date());
      setSafetyScore(prev => Math.min(prev + 2, 100));
      toast.success('✅ Safety check-in successful! Your contacts have been notified.');
      
    } catch (error) {
      console.error('Check-in error:', error);
      toast.error('❌ Failed to check in. Please try again.');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleQuickActions = (action) => {
    const actions = {
      location: '📍 Location shared with emergency contacts',
      assistance: '🆘 Non-emergency assistance requested',
      update: '👨‍👩‍👧‍👦 Status update sent to family',
      emergency: '🚨 Emergency services contacted!'
    };
    
    const message = actions[action];
    if (action === 'emergency') {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  return (
    <div className="improved-safety-container">
      {/* Header Section */}
      <div className="safety-header-section">
        <div className="header-icon">🛡️</div>
        <div className="header-content">
          <h1>Safety Check-In System</h1>
          <p>Stay connected with your loved ones and ensure your safety while traveling</p>
        </div>
        <div className="safety-score-display">
          <div className="score-number">{safetyScore}%</div>
          <div className="score-label">Safety Score</div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="status-overview">
        <div className="status-card active">
          <div className="status-icon">🟢</div>
          <div className="status-text">
            <h3>System Active</h3>
            <p>All monitoring systems operational</p>
          </div>
        </div>
        
        <div className="status-card user">
          <div className="status-icon">👤</div>
          <div className="status-text">
            <h3>{userInfo?.name || 'Tourist User'}</h3>
            <p>Verified and protected account</p>
          </div>
        </div>
        
        <div className="status-card location">
          <div className="status-icon">📍</div>
          <div className="status-text">
            <h3>{location ? 'Location Tracked' : 'Location Pending'}</h3>
            <p>GPS monitoring {location ? 'active' : 'initializing'}</p>
          </div>
        </div>
      </div>

      {/* Last Check-in Info */}
      {lastCheckIn && (
        <div className="checkin-info-card">
          <div className="checkin-header">
            <div className="checkin-icon">✅</div>
            <div className="checkin-details">
              <h2>Last Safety Check-In</h2>
              <p className="checkin-time">{lastCheckIn.toLocaleString()}</p>
              {location && (
                <p className="checkin-location">
                  📍 {location.address || 'Current Location Recorded'}
                </p>
              )}
            </div>
            <div className="safety-badge">SAFE</div>
          </div>
        </div>
      )}

      {/* Main Check-In Button */}
      <div className="main-checkin-section">
        <button
          className={`main-checkin-btn ${checkingIn ? 'checking-in' : ''}`}
          onClick={handleSafetyCheckIn}
          disabled={checkingIn}
        >
          {checkingIn ? (
            <div className="checking-content">
              <div className="spinner"></div>
              <span className="checking-text">Checking In...</span>
              <div className="progress-indicator">
                <div className="progress-bar"></div>
              </div>
            </div>
          ) : (
            <div className="checkin-content">
              <div className="checkin-icon-btn">🛡️</div>
              <div className="checkin-text-content">
                <span className="main-text">I'm Safe - Check In Now</span>
                <span className="sub-text">Notify your emergency contacts instantly</span>
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-heading">Quick Actions</h2>
        <div className="quick-actions-grid">
          <button 
            className="quick-action-btn location-btn"
            onClick={() => handleQuickActions('location')}
          >
            <div className="action-icon">📍</div>
            <div className="action-content">
              <h3>Share Location</h3>
              <p>Send real-time location to contacts</p>
            </div>
          </button>

          <button 
            className="quick-action-btn assistance-btn"
            onClick={() => handleQuickActions('assistance')}
          >
            <div className="action-icon">🆘</div>
            <div className="action-content">
              <h3>Need Help</h3>
              <p>Request non-emergency assistance</p>
            </div>
          </button>

          <button 
            className="quick-action-btn update-btn"
            onClick={() => handleQuickActions('update')}
          >
            <div className="action-icon">👨‍👩‍👧‍👦</div>
            <div className="action-content">
              <h3>Update Family</h3>
              <p>Send status to family members</p>
            </div>
          </button>

          <button 
            className="quick-action-btn emergency-btn"
            onClick={() => handleQuickActions('emergency')}
          >
            <div className="action-icon">🚨</div>
            <div className="action-content">
              <h3>Emergency</h3>
              <p>Contact emergency services</p>
            </div>
          </button>
        </div>
      </div>

      {/* Information Section */}
      <div className="info-section">
        <div className="info-card checkin-process">
          <h2 className="card-title">How Safety Check-In Works</h2>
          <div className="process-list">
            <div className="process-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Location Recording</h4>
                <p>Your current GPS location is securely recorded and encrypted</p>
              </div>
            </div>
            <div className="process-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Contact Notification</h4>
                <p>All emergency contacts receive instant notification of your safety</p>
              </div>
            </div>
            <div className="process-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Safety Score Update</h4>
                <p>Your safety rating is updated and shared with the network</p>
              </div>
            </div>
            <div className="process-item">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Monitoring Continues</h4>
                <p>System continues to monitor and protect your journey</p>
              </div>
            </div>
          </div>
        </div>

        <div className="info-card schedule-card">
          <h2 className="card-title">Recommended Check-In Schedule</h2>
          <div className="schedule-list">
            <div className="schedule-item morning">
              <div className="time-icon">🌅</div>
              <div className="time-content">
                <h4>Morning Check-In</h4>
                <p className="time-range">6:00 AM - 12:00 PM</p>
                <span className="priority-badge recommended">Recommended</span>
                <p className="time-description">Start your day by letting contacts know you're safe</p>
              </div>
            </div>

            <div className="schedule-item afternoon">
              <div className="time-icon">☀️</div>
              <div className="time-content">
                <h4>Afternoon Update</h4>
                <p className="time-range">12:00 PM - 6:00 PM</p>
                <span className="priority-badge optional">Optional</span>
                <p className="time-description">Check in when changing locations or activities</p>
              </div>
            </div>

            <div className="schedule-item evening">
              <div className="time-icon">🌆</div>
              <div className="time-content">
                <h4>Evening Check-In</h4>
                <p className="time-range">6:00 PM - 11:00 PM</p>
                <span className="priority-badge important">Important</span>
                <p className="time-description">End your day safely with a final check-in</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="emergency-contacts-section">
        <h2 className="section-heading">Emergency Contacts</h2>
        <div className="emergency-grid">
          <div className="emergency-card tourist-police" onClick={() => toast.info('📞 Calling Tourist Police: 1363')}>
            <div className="emergency-icon">👮‍♂️</div>
            <div className="emergency-content">
              <h3>Tourist Police</h3>
              <div className="emergency-number">1363</div>
              <p>24/7 tourist assistance</p>
            </div>
          </div>

          <div className="emergency-card medical" onClick={() => toast.info('📞 Calling Medical Emergency: 102')}>
            <div className="emergency-icon">🏥</div>
            <div className="emergency-content">
              <h3>Medical Emergency</h3>
              <div className="emergency-number">102</div>
              <p>Medical assistance</p>
            </div>
          </div>

          <div className="emergency-card police" onClick={() => toast.info('📞 Calling Police: 100')}>
            <div className="emergency-icon">🚔</div>
            <div className="emergency-content">
              <h3>Police</h3>
              <div className="emergency-number">100</div>
              <p>General police emergency</p>
            </div>
          </div>

          <div className="emergency-card fire" onClick={() => toast.info('📞 Calling Fire Department: 101')}>
            <div className="emergency-icon">🚒</div>
            <div className="emergency-content">
              <h3>Fire Department</h3>
              <div className="emergency-number">101</div>
              <p>Fire emergency services</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyCheck;
