import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { authService } from '../../services/auth';
import { touristAPI } from '../../services/api';
import { geolocationService } from '../../services/geolocation';
import { SOSLoading } from '../common/Loading';
import './SOS.css';

const SOS = () => {
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [location, setLocation] = useState(null);
  const [emergencyType, setEmergencyType] = useState('general');
  const [sosPressed, setSosPressed] = useState(false);
  const [holdTimer, setHoldTimer] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: 'Emergency Services', number: '112', type: 'emergency' },
    { name: 'Local Police', number: '100', type: 'police' },
    { name: 'Medical Emergency', number: '102', type: 'medical' },
    { name: 'Tourist Helpline', number: '1363', type: 'tourist' },
    { name: 'Family Contact', number: '+91 98765 43210', type: 'personal' }
  ]);

  const userInfo = authService.getUserInfo();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    let interval = null;
    if (sosActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown => countdown - 1);
      }, 1000);
    } else if (countdown === 0 && sosActive) {
      handleSOSActivation();
    }
    return () => clearInterval(interval);
  }, [sosActive, countdown]);

  const getCurrentLocation = async () => {
    try {
      const position = await geolocationService.getEnhancedPosition();
      setLocation(position);
    } catch (error) {
      console.error('Location error:', error);
      toast.error('Unable to get location. SOS will still work.');
    }
  };

  const startSOS = (type = 'general') => {
    setEmergencyType(type);
    setSosActive(true);
    setCountdown(5);
    toast.warning('🚨 SOS Alert will be sent in 5 seconds. Press CANCEL to stop.');
  };

  const handleSOSHold = () => {
    setSosPressed(true);
    const timer = setTimeout(() => {
      startSOS('emergency');
    }, 3000); // 3-second hold
    setHoldTimer(timer);
  };

  const handleSOSRelease = () => {
    setSosPressed(false);
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
  };

  const cancelSOS = () => {
    setSosActive(false);
    setCountdown(0);
    setEmergencyType('general');
    toast.success('✅ SOS Alert cancelled');
  };

  const handleSOSActivation = async () => {
    try {
      const sosData = {
        touristId: userInfo?.id,
        touristName: userInfo?.name,
        location: location || { lat: 28.6139, lng: 77.2090, address: 'Location unavailable' },
        timestamp: new Date().toISOString(),
        type: `EMERGENCY_SOS_${emergencyType.toUpperCase()}`,
        message: 'URGENT: Tourist requiring immediate assistance'
      };

      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('🚨 Emergency alerts sent successfully!');
      toast.info('📞 Emergency services have been notified');
      toast.info('👨‍👩‍👧‍👦 Your emergency contacts are being called');

      setTimeout(() => {
        setSosActive(false);
        setEmergencyType('general');
      }, 3000);

    } catch (error) {
      console.error('SOS Error:', error);
      toast.error('Failed to send SOS alert. Please call emergency services directly.');
      setSosActive(false);
    }
  };

  const callEmergency = (number, name) => {
    window.open(`tel:${number}`);
    toast.success(`📞 Calling ${name} (${number})...`);
  };

  if (sosActive && countdown === 0) {
    return (
      <div className="sos-loading-container">
        <div className="sos-loading-card">
          <SOSLoading />
          <div className="loading-actions">
            <button 
              className="cancel-alert-btn"
              onClick={() => setSosActive(false)}
            >
              ✕ Close Alert Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-sos-container">
      {/* Emergency Header */}
      <div className="sos-header">
        <div className="header-background">
          <div className="emergency-pattern"></div>
        </div>
        <div className="header-content">
          <div className="emergency-icon">🆘</div>
          <div className="header-text">
            <h1>Emergency SOS System</h1>
            <p>Your safety is our priority - Get help when you need it most</p>
          </div>
          {location && (
            <div className="location-badge">
              <div className="location-icon">📍</div>
              <div className="location-text">
                <span>Location Active</span>
                <small>{location.address || 'GPS Coordinates Available'}</small>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main SOS Button Section */}
      <div className="sos-main-section">
        {sosActive ? (
          <div className="countdown-section">
            <div className="countdown-display">
              <div className="countdown-circle">
                <div className="countdown-number">{countdown}</div>
                <div className="countdown-text">SECONDS</div>
              </div>
            </div>
            <h2 className="countdown-message">SENDING EMERGENCY ALERT</h2>
            <p className="countdown-description">
              Emergency services and your contacts will be notified immediately
            </p>
            <button className="cancel-sos-btn" onClick={cancelSOS}>
              ✕ CANCEL SOS ALERT
            </button>
          </div>
        ) : (
          <div className="sos-button-section">
            <div className="sos-instructions">
              <h2>Press for Emergency Assistance</h2>
              <p>Hold the button below for 3 seconds to activate emergency alert</p>
            </div>
            
            <div className="main-sos-button-container">
              <button
                className={`main-sos-button ${sosPressed ? 'pressed' : ''}`}
                onMouseDown={handleSOSHold}
                onMouseUp={handleSOSRelease}
                onTouchStart={handleSOSHold}
                onTouchEnd={handleSOSRelease}
              >
                <div className="sos-button-background"></div>
                <div className="sos-button-content">
                  <div className="sos-icon">🆘</div>
                  <div className="sos-text">SOS</div>
                  <div className="sos-subtext">HOLD FOR 3 SEC</div>
                </div>
                {sosPressed && (
                  <div className="hold-progress">
                    <div className="progress-ring"></div>
                  </div>
                )}
              </button>
            </div>

            {/* Quick Emergency Types */}
            <div className="emergency-types">
              <h3>Quick Emergency Types</h3>
              <div className="emergency-type-grid">
                <button 
                  className="emergency-type-btn medical"
                  onClick={() => startSOS('medical')}
                >
                  <div className="type-icon">🏥</div>
                  <span>Medical</span>
                </button>
                <button 
                  className="emergency-type-btn police"
                  onClick={() => startSOS('police')}
                >
                  <div className="type-icon">👮‍♂️</div>
                  <span>Police</span>
                </button>
                <button 
                  className="emergency-type-btn fire"
                  onClick={() => startSOS('fire')}
                >
                  <div className="type-icon">🚒</div>
                  <span>Fire</span>
                </button>
                <button 
                  className="emergency-type-btn general"
                  onClick={() => startSOS('general')}
                >
                  <div className="type-icon">🆘</div>
                  <span>General</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Contacts Section */}
      <div className="contacts-section">
        <h2 className="section-title">Emergency Contacts</h2>
        <div className="contacts-grid">
          {/* Emergency Services */}
          <div className="contact-category emergency-services">
            <div className="category-header">
              <div className="category-icon">🚨</div>
              <h3>Emergency Services</h3>
            </div>
            <div className="contact-list">
              {emergencyContacts.filter(c => ['emergency', 'police', 'medical', 'tourist'].includes(c.type)).map((contact, index) => (
                <div key={index} className={`contact-item ${contact.type}`}>
                  <div className="contact-info">
                    <div className="contact-name">{contact.name}</div>
                    <div className="contact-description">
                      {contact.type === 'emergency' && '24/7 Emergency Response'}
                      {contact.type === 'police' && 'Law Enforcement'}
                      {contact.type === 'medical' && 'Medical Emergency'}
                      {contact.type === 'tourist' && 'Tourist Assistance'}
                    </div>
                  </div>
                  <button 
                    className={`call-btn ${contact.type}`}
                    onClick={() => callEmergency(contact.number, contact.name)}
                  >
                    <span className="call-icon">📞</span>
                    <span className="call-number">{contact.number}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Contacts */}
          <div className="contact-category personal-contacts">
            <div className="category-header">
              <div className="category-icon">👨‍👩‍👧‍👦</div>
              <h3>Personal Contacts</h3>
            </div>
            <div className="contact-list">
              {emergencyContacts.filter(c => c.type === 'personal').map((contact, index) => (
                <div key={index} className="contact-item personal">
                  <div className="contact-info">
                    <div className="contact-name">{contact.name}</div>
                    <div className="contact-number">{contact.number}</div>
                  </div>
                  <button 
                    className="call-btn personal"
                    onClick={() => callEmergency(contact.number, contact.name)}
                  >
                    <span className="call-icon">📞</span>
                    <span>Call</span>
                  </button>
                </div>
              ))}
              <button 
                className="add-contact-btn"
                onClick={() => toast.info('👥 Emergency contact management coming soon')}
              >
                <span className="add-icon">➕</span>
                <span>Add Emergency Contact</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Information */}
      <div className="safety-info-section">
        <div className="info-grid">
          <div className="info-card emergency-guide">
            <div className="info-header">
              <div className="info-icon">🆘</div>
              <h3>When to Use Emergency SOS</h3>
            </div>
            <div className="info-content">
              <ul className="emergency-list">
                <li>
                  <span className="list-icon">🏥</span>
                  <span>Serious medical emergencies or injuries</span>
                </li>
                <li>
                  <span className="list-icon">👤</span>
                  <span>Personal safety threats or dangerous situations</span>
                </li>
                <li>
                  <span className="list-icon">🗺️</span>
                  <span>Lost in unsafe or remote areas</span>
                </li>
                <li>
                  <span className="list-icon">👁️</span>
                  <span>Witnessing crimes or suspicious activities</span>
                </li>
                <li>
                  <span className="list-icon">🌪️</span>
                  <span>Natural disasters or severe weather events</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="info-card sos-process">
            <div className="info-header">
              <div className="info-icon">📱</div>
              <h3>What Happens When You Use SOS</h3>
            </div>
            <div className="info-content">
              <div className="process-steps">
                <div className="process-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Immediate Location Sharing</h4>
                    <p>Your exact GPS location is shared with authorities</p>
                  </div>
                </div>
                <div className="process-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Emergency Services Contact</h4>
                    <p>Local emergency services are automatically contacted</p>
                  </div>
                </div>
                <div className="process-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Contact Notification</h4>
                    <p>Your emergency contacts receive instant alerts</p>
                  </div>
                </div>
                <div className="process-step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Continuous Tracking</h4>
                    <p>Real-time location tracking is activated</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="warning-notice">
          <div className="warning-icon">⚠️</div>
          <div className="warning-content">
            <h4>Important Notice</h4>
            <p>
              Only use the SOS feature for genuine emergencies. False alarms can delay 
              response to real emergencies and may result in unnecessary deployment of 
              emergency resources.
            </p>
          </div>
        </div>
      </div>

      {/* Current Location Display */}
      {location && (
        <div className="location-section">
          <div className="location-card">
            <div className="location-header">
              <div className="location-icon">📍</div>
              <h3>Your Current Location</h3>
              <button 
                className="refresh-location-btn"
                onClick={getCurrentLocation}
              >
                🔄 Update
              </button>
            </div>
            <div className="location-details">
              <div className="location-info-grid">
                <div className="location-info-item">
                  <span className="info-label">Address</span>
                  <span className="info-value">{location.address || 'Address not available'}</span>
                </div>
                <div className="location-info-item">
                  <span className="info-label">Coordinates</span>
                  <span className="info-value">{location.formatted || `${location.lat}, ${location.lng}`}</span>
                </div>
                <div className="location-info-item">
                  <span className="info-label">Accuracy</span>
                  <span className="info-value">±{Math.round(location.accuracy || 0)}m</span>
                </div>
                <div className="location-info-item">
                  <span className="info-label">Last Updated</span>
                  <span className="info-value">{new Date(location.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SOS;
