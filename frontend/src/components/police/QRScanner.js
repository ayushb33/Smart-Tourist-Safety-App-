import React, { useState, useRef, useEffect } from 'react';
import './QRScanner.css';

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [manualInput, setManualInput] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scannerRef = useRef(null);

  // Dummy tourist database for verification
  const touristDatabase = {
    'QR-T001-2025': {
      id: 'T001',
      name: 'John Smith',
      nationality: 'USA',
      status: 'active',
      destination: 'India Gate',
      checkInTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
      emergencyContact: '+91 98765 43210',
      safetyScore: 92,
      verified: true
    },
    'QR-T002-2025': {
      id: 'T002',
      name: 'Maria Garcia',
      nationality: 'Spain',
      status: 'active',
      destination: 'Red Fort',
      checkInTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      emergencyContact: '+91 98765 43211',
      safetyScore: 88,
      verified: true
    },
    'QR-T003-2025': {
      id: 'T003',
      name: 'Yuki Tanaka',
      nationality: 'Japan',
      status: 'offline',
      destination: 'Lotus Temple',
      checkInTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
      emergencyContact: '+91 98765 43212',
      safetyScore: 76,
      verified: true
    },
    'QR-T004-2025': {
      id: 'T004',
      name: 'David Wilson',
      nationality: 'UK',
      status: 'alert',
      destination: 'Qutub Minar',
      checkInTime: new Date(Date.now() - 8 * 60 * 60 * 1000),
      emergencyContact: '+91 98765 43213',
      safetyScore: 65,
      verified: true
    },
    'QR-T005-2025': {
      id: 'T005',
      name: 'Emma Johnson',
      nationality: 'Canada',
      status: 'active',
      destination: 'Akshardham',
      checkInTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
      emergencyContact: '+91 98765 43214',
      safetyScore: 94,
      verified: true
    }
  };

  useEffect(() => {
    // Load scan history from localStorage
    const savedHistory = localStorage.getItem('qr-scan-history');
    if (savedHistory) {
      setScanHistory(JSON.parse(savedHistory));
    }

    // Cleanup camera when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setCameraPermission('granted');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        startScanning();
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      setCameraPermission('denied');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
    if (scannerRef.current) {
      clearInterval(scannerRef.current);
    }
  };

  const startScanning = () => {
    scannerRef.current = setInterval(() => {
      captureAndScan();
    }, 500);
  };

  const captureAndScan = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      // Simulate QR code detection (in real app, use a QR library like jsQR)
      simulateQRDetection();
    }
  };

  const simulateQRDetection = () => {
    // Simulate random QR code detection
    if (Math.random() < 0.1) { // 10% chance per scan
      const qrCodes = Object.keys(touristDatabase);
      const randomQR = qrCodes[Math.floor(Math.random() * qrCodes.length)];
      handleQRCodeDetected(randomQR);
    }
  };

  const handleQRCodeDetected = (qrData) => {
    setScannedData(qrData);
    stopCamera();
    verifyTourist(qrData);
    addToHistory(qrData);
  };

  const verifyTourist = (qrCode) => {
    const tourist = touristDatabase[qrCode];
    
    if (tourist) {
      setVerificationResult({
        success: true,
        tourist: tourist,
        message: 'Tourist verified successfully!',
        timestamp: new Date()
      });
    } else {
      setVerificationResult({
        success: false,
        tourist: null,
        message: 'Invalid QR code or tourist not found in database.',
        timestamp: new Date()
      });
    }
  };

  const addToHistory = (qrData) => {
    const newEntry = {
      id: Date.now(),
      qrCode: qrData,
      timestamp: new Date(),
      verified: !!touristDatabase[qrData]
    };
    
    const updatedHistory = [newEntry, ...scanHistory.slice(0, 9)]; // Keep last 10
    setScanHistory(updatedHistory);
    localStorage.setItem('qr-scan-history', JSON.stringify(updatedHistory));
  };

  const handleManualVerification = () => {
    if (manualInput.trim()) {
      verifyTourist(manualInput.trim());
      addToHistory(manualInput.trim());
      setScannedData(manualInput.trim());
      setManualInput('');
    }
  };

  const clearHistory = () => {
    setScanHistory([]);
    localStorage.removeItem('qr-scan-history');
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { text: 'Active', class: 'status-active', icon: '✅' },
      offline: { text: 'Offline', class: 'status-offline', icon: '📴' },
      alert: { text: 'Alert', class: 'status-alert', icon: '🚨' }
    };
    return badges[status] || badges.active;
  };

  const getTimeSince = (date) => {
    const minutes = Math.floor((new Date() - date) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const contactTourist = (phone, name) => {
    alert(`Calling ${name} at ${phone}...`);
  };

  const sendAlert = (tourist) => {
    alert(`Safety alert sent to ${tourist.name}!`);
  };

  return (
    <div className="qr-scanner-container">
      {/* Header Section */}
      <div className="scanner-header">
        <div className="header-content">
          <div className="title-section">
            <h1>📱 QR Code Scanner</h1>
            <p>Scan tourist QR codes for instant verification and safety monitoring</p>
          </div>
          
          <div className="scanner-stats">
            <div className="stat-card">
              <span className="stat-icon">📊</span>
              <div className="stat-content">
                <span className="stat-value">{scanHistory.length}</span>
                <span className="stat-label">Total Scans</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">✅</span>
              <div className="stat-content">
                <span className="stat-value">{scanHistory.filter(s => s.verified).length}</span>
                <span className="stat-label">Verified</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">❌</span>
              <div className="stat-content">
                <span className="stat-value">{scanHistory.filter(s => !s.verified).length}</span>
                <span className="stat-label">Invalid</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="scanner-content">
        <div className="scanner-section">
          {/* Camera Scanner */}
          <div className="camera-scanner">
            <div className="scanner-card">
              <div className="card-header">
                <h3>📷 Camera Scanner</h3>
                <p>Point camera at tourist QR code</p>
              </div>
              
              <div className="camera-container">
                {!isScanning && cameraPermission !== 'denied' && (
                  <div className="camera-placeholder">
                    <div className="placeholder-icon">📷</div>
                    <h4>Camera Scanner Ready</h4>
                    <p>Click "Start Scanning" to begin QR code detection</p>
                    <button 
                      className="start-scanner-btn"
                      onClick={startCamera}
                    >
                      🔍 Start Scanning
                    </button>
                  </div>
                )}
                
                {cameraPermission === 'denied' && (
                  <div className="camera-error">
                    <div className="error-icon">🚫</div>
                    <h4>Camera Access Denied</h4>
                    <p>Please enable camera permissions to scan QR codes</p>
                    <button 
                      className="retry-camera-btn"
                      onClick={() => {
                        setCameraPermission(null);
                        startCamera();
                      }}
                    >
                      🔄 Retry Camera Access
                    </button>
                  </div>
                )}
                
                {isScanning && (
                  <div className="camera-active">
                    <video 
                      ref={videoRef} 
                      className="camera-video"
                      autoPlay 
                      playsInline 
                      muted
                    />
                    <canvas 
                      ref={canvasRef} 
                      className="camera-canvas" 
                      style={{ display: 'none' }}
                    />
                    <div className="scanner-overlay">
                      <div className="scanner-frame">
                        <div className="scanner-corners">
                          <div className="corner top-left"></div>
                          <div className="corner top-right"></div>
                          <div className="corner bottom-left"></div>
                          <div className="corner bottom-right"></div>
                        </div>
                        <div className="scanner-line"></div>
                      </div>
                    </div>
                    <div className="scanner-controls">
                      <button 
                        className="stop-scanner-btn"
                        onClick={stopCamera}
                      >
                        ⏹️ Stop Scanning
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Manual Input */}
            <div className="manual-input-card">
              <div className="card-header">
                <h3>✏️ Manual Verification</h3>
                <p>Enter QR code manually if camera isn't working</p>
              </div>
              
              <div className="manual-input-section">
                <div className="input-group">
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Enter QR code (e.g., QR-T001-2025)"
                    className="manual-input"
                    onKeyPress={(e) => e.key === 'Enter' && handleManualVerification()}
                  />
                  <button 
                    className="verify-btn"
                    onClick={handleManualVerification}
                    disabled={!manualInput.trim()}
                  >
                    🔍 Verify
                  </button>
                </div>
                <div className="input-help">
                  <p>💡 Tip: QR codes follow the format: QR-T###-2025</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Verification Result */}
          {verificationResult && (
            <div className="verification-result">
              <div className={`result-card ${verificationResult.success ? 'success' : 'error'}`}>
                <div className="result-header">
                  <div className="result-icon">
                    {verificationResult.success ? '✅' : '❌'}
                  </div>
                  <div className="result-status">
                    <h3>{verificationResult.success ? 'Verification Successful' : 'Verification Failed'}</h3>
                    <p>{verificationResult.message}</p>
                  </div>
                </div>
                
                {verificationResult.success && verificationResult.tourist && (
                  <div className="tourist-details">
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">👤 Name:</span>
                        <span className="detail-value">{verificationResult.tourist.name}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">🆔 ID:</span>
                        <span className="detail-value">{verificationResult.tourist.id}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">🏳️ Nationality:</span>
                        <span className="detail-value">{verificationResult.tourist.nationality}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">📍 Destination:</span>
                        <span className="detail-value">{verificationResult.tourist.destination}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">📊 Status:</span>
                        <span className={`status-badge ${getStatusBadge(verificationResult.tourist.status).class}`}>
                          {getStatusBadge(verificationResult.tourist.status).icon} {getStatusBadge(verificationResult.tourist.status).text}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">🛡️ Safety Score:</span>
                        <span className="detail-value safety-score">{verificationResult.tourist.safetyScore}/100</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">🕐 Check-in:</span>
                        <span className="detail-value">{getTimeSince(verificationResult.tourist.checkInTime)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">📞 Emergency:</span>
                        <span className="detail-value emergency-contact">{verificationResult.tourist.emergencyContact}</span>
                      </div>
                    </div>
                    
                    <div className="action-buttons">
                      <button 
                        className="action-btn contact"
                        onClick={() => contactTourist(verificationResult.tourist.emergencyContact, verificationResult.tourist.name)}
                      >
                        📞 Contact Tourist
                      </button>
                      <button 
                        className="action-btn alert"
                        onClick={() => sendAlert(verificationResult.tourist)}
                      >
                        🚨 Send Alert
                      </button>
                      <button 
                        className="action-btn clear"
                        onClick={() => setVerificationResult(null)}
                      >
                        ✖ Clear Result
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Scan History */}
        <div className="history-section">
          <div className="history-card">
            <div className="card-header">
              <h3>📝 Scan History</h3>
              <div className="header-actions">
                <span className="history-count">{scanHistory.length} scans</span>
                {scanHistory.length > 0 && (
                  <button 
                    className="clear-history-btn"
                    onClick={clearHistory}
                  >
                    🗑️ Clear
                  </button>
                )}
              </div>
            </div>
            
            <div className="history-list">
              {scanHistory.length === 0 ? (
                <div className="empty-history">
                  <div className="empty-icon">📋</div>
                  <h4>No Scans Yet</h4>
                  <p>Your scan history will appear here</p>
                </div>
              ) : (
                scanHistory.map((entry) => (
                  <div key={entry.id} className="history-item">
                    <div className="history-main">
                      <div className="history-qr">
                        <span className="qr-icon">📱</span>
                        <span className="qr-code">{entry.qrCode}</span>
                      </div>
                      <div className="history-status">
                        <span className={`verification-badge ${entry.verified ? 'verified' : 'invalid'}`}>
                          {entry.verified ? '✅ Verified' : '❌ Invalid'}
                        </span>
                      </div>
                    </div>
                    <div className="history-meta">
                      <span className="scan-time">
                        🕐 {entry.timestamp.toLocaleString()}
                      </span>
                      {entry.verified && touristDatabase[entry.qrCode] && (
                        <span className="tourist-name">
                          👤 {touristDatabase[entry.qrCode].name}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
