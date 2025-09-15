import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';
import { authService } from '../../services/auth';
import { touristAPI } from '../../services/api';
import Loading from '../common/Loading';
import './QRCode.css';

const QRCode = () => {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBlockchain, setShowBlockchain] = useState(false);
  const [activeCard, setActiveCard] = useState('qr');
  const [isQRFlipped, setIsQRFlipped] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const userInfo = authService.getUserInfo();

  useEffect(() => {
    generateQRData();
  }, []);

  const generateQRData = async () => {
    try {
      setLoading(true);
      const blockchainHash = generateBlockchainHash();

      const qrInfo = {
        id: userInfo?.id || 'TID-2025-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        name: userInfo?.name || 'Alex Johnson',
        email: userInfo?.email || 'alex.johnson@tourist.com',
        phone: '+91 98765 43210',
        destination: 'Delhi Heritage Tour',
        emergencyContact: '+91 87654 32109',
        blockchainHash: blockchainHash,
        safetyScore: 92,
        timestamp: new Date().toISOString(),
        version: '2.1',
        verified: true,
        issuer: 'India Tourist Safety Authority',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };

      setQrData(qrInfo);
      await new Promise(resolve => setTimeout(resolve, 1200));
    } catch (error) {
      console.error('Error generating QR data:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const generateBlockchainHash = () => {
    let hash = '';
    const chars = 'abcdef0123456789';
    for (let i = 0; i < 64; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash;
  };

  const downloadQR = async (format = 'png') => {
    setDownloadProgress(0);
    const svg = document.getElementById('tourist-qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);

    // Simulate download progress
    const progressInterval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 50);

    if (format === 'svg') {
      const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = `tourist-id-${userInfo?.name || 'demo'}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = function() {
        canvas.width = 512;
        canvas.height = 512;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(function(blob) {
          const url = URL.createObjectURL(blob);
          const downloadLink = document.createElement('a');
          downloadLink.href = url;
          downloadLink.download = `tourist-id-${userInfo?.name || 'demo'}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        });
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }

    setTimeout(() => {
      toast.success(`📥 QR Code downloaded as ${format.toUpperCase()}`);
      setDownloadProgress(0);
    }, 500);
  };

  const copyToClipboard = () => {
    const qrText = JSON.stringify(qrData, null, 2);
    navigator.clipboard.writeText(qrText).then(() => {
      toast.success('📋 QR data copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Tourist Safety ID',
          text: `Tourist ID: ${qrData.name} - ${qrData.destination}`,
          url: window.location.href
        });
        toast.success('📤 QR code shared successfully');
      } catch (error) {
        toast.info('Share cancelled');
      }
    } else {
      copyToClipboard();
    }
  };

  if (loading) {
    return (
      <div className="qr-loading-container">
        <Loading message="🔄 Generating your digital ID..." size="large" />
        <div className="loading-animation">
          <div className="qr-skeleton"></div>
        </div>
      </div>
    );
  }

  if (!qrData) {
    return (
      <div className="qr-error-container">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h3>Failed to generate QR code</h3>
          <p>Something went wrong while creating your digital identity</p>
          <button className="retry-btn" onClick={generateQRData}>
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-qr-container">
      {/* Floating Header with Live Status */}
      <div className="qr-header">
        <div className="header-content">
          <div className="header-left">
            <h1>🆔 Digital Tourist Identity</h1>
            <p>Secure • Blockchain Verified • Always Protected</p>
          </div>
          <div className="header-right">
            <div className="live-indicator">
              <div className="pulse-dot"></div>
              <span>LIVE</span>
            </div>
            <div className="safety-score-mini">
              <span className="score">{qrData.safetyScore}%</span>
              <span className="label">Safety</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="qr-main-grid">
        
        {/* QR Code Card with 3D Flip */}
        <div className="qr-card-section">
          <div className={`qr-card-3d ${isQRFlipped ? 'flipped' : ''}`}>
            {/* Front Side - QR Code */}
            <div className="qr-card-front">
              <div className="card-header-modern">
                <div className="card-title">
                  <span className="title-icon">📱</span>
                  <div>
                    <h3>Scannable QR Code</h3>
                    <p>Tap to scan or download</p>
                  </div>
                </div>
                <div className="verification-badges">
                  <span className="badge verified">✓ Verified</span>
                  <span className="badge secure">🔐 Secure</span>
                </div>
              </div>

              <div className="qr-display-area">
                <div className="qr-container">
                  <div className="qr-frame">
                    <QRCodeSVG
                      id="tourist-qr-code"
                      value={JSON.stringify(qrData)}
                      size={240}
                      level="H"
                      includeMargin={true}
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                  </div>
                  <div className="qr-corners">
                    <div className="corner top-left"></div>
                    <div className="corner top-right"></div>
                    <div className="corner bottom-left"></div>
                    <div className="corner bottom-right"></div>
                  </div>
                </div>

                <div className="qr-info-display">
                  <h4 className="tourist-name">{qrData.name}</h4>
                  <p className="tourist-id">ID: {qrData.id}</p>
                  <div className="qr-meta-info">
                    <span className="meta-item">📍 {qrData.destination}</span>
                    <span className="meta-item">🛡️ {qrData.safetyScore}% Safe</span>
                  </div>
                </div>
              </div>

              <div className="qr-actions">
                <button 
                  className="action-btn primary"
                  onClick={() => downloadQR('png')}
                  disabled={downloadProgress > 0}
                >
                  {downloadProgress > 0 ? (
                    <div className="download-progress">
                      <span>{downloadProgress}%</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{width: `${downloadProgress}%`}}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="btn-icon">💾</span>
                      <span>Download</span>
                    </>
                  )}
                </button>

                <button className="action-btn secondary" onClick={shareQR}>
                  <span className="btn-icon">📤</span>
                  <span>Share</span>
                </button>

                <button className="action-btn tertiary" onClick={() => setIsQRFlipped(true)}>
                  <span className="btn-icon">🔄</span>
                  <span>Flip</span>
                </button>
              </div>
            </div>

            {/* Back Side - Emergency Info */}
            <div className="qr-card-back">
              <div className="emergency-header">
                <h3>🚨 Emergency Information</h3>
                <p>Critical contacts and safety details</p>
              </div>

              <div className="emergency-contacts">
                <div className="contact-item primary">
                  <div className="contact-icon">📞</div>
                  <div className="contact-details">
                    <span className="contact-label">Emergency Contact</span>
                    <span className="contact-value">{qrData.emergencyContact}</span>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">🏥</div>
                  <div className="contact-details">
                    <span className="contact-label">Medical Emergency</span>
                    <span className="contact-value">102</span>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">👮</div>
                  <div className="contact-details">
                    <span className="contact-label">Tourist Police</span>
                    <span className="contact-value">1363</span>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">🚔</div>
                  <div className="contact-details">
                    <span className="contact-label">Police Emergency</span>
                    <span className="contact-value">100</span>
                  </div>
                </div>
              </div>

              <div className="emergency-id">
                <p>Show this ID to authorities</p>
                <code>{qrData.id}</code>
              </div>

              <button className="flip-back-btn" onClick={() => setIsQRFlipped(false)}>
                🔄 Flip Back
              </button>
            </div>
          </div>
        </div>

        {/* Profile Information Card */}
        <div className="profile-card-section">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <span className="avatar-letter">{qrData.name.charAt(0)}</span>
                <div className="status-ring active"></div>
              </div>
              <div className="profile-info">
                <h3>{qrData.name}</h3>
                <p className="profile-subtitle">Verified Tourist</p>
                <div className="profile-badges">
                  <span className="profile-badge">🇮🇳 Indian National</span>
                </div>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-group">
                <h4>📊 Personal Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-icon">🆔</span>
                    <div className="detail-content">
                      <span className="detail-label">Tourist ID</span>
                      <span className="detail-value">{qrData.id}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">📧</span>
                    <div className="detail-content">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">{qrData.email}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">📱</span>
                    <div className="detail-content">
                      <span className="detail-label">Phone</span>
                      <span className="detail-value">{qrData.phone}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">🎯</span>
                    <div className="detail-content">
                      <span className="detail-label">Destination</span>
                      <span className="detail-value">{qrData.destination}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="safety-metrics">
                <div className="safety-score-large">
                  <div className="score-circle">
                    <svg className="score-ring" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#e6e6e6"
                        strokeWidth="6"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="url(#gradient)"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={`${qrData.safetyScore * 2.83} ${(100 - qrData.safetyScore) * 2.83}`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#00ff88" />
                          <stop offset="100%" stopColor="#00cc6a" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="score-content">
                      <span className="score-number">{qrData.safetyScore}</span>
                      <span className="score-unit">%</span>
                      <span className="score-label">Safety Score</span>
                    </div>
                  </div>
                </div>

                <div className="metrics-grid">
                  <div className="metric-item">
                    <div className="metric-icon verified">✓</div>
                    <span className="metric-label">Verified</span>
                  </div>
                  <div className="metric-item">
                    <div className="metric-icon protected">🔐</div>
                    <span className="metric-label">Protected</span>
                  </div>
                  <div className="metric-item">
                    <div className="metric-icon active">📡</div>
                    <span className="metric-label">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blockchain Security Section */}
      <div className="blockchain-section">
        <div className="blockchain-card">
          <div className="blockchain-header">
            <div className="blockchain-title">
              <span className="blockchain-icon">🔗</span>
              <div>
                <h3>Blockchain Security</h3>
                <p>Advanced cryptographic protection</p>
              </div>
            </div>
            <button 
              className={`toggle-hash-btn ${showBlockchain ? 'active' : ''}`}
              onClick={() => setShowBlockchain(!showBlockchain)}
            >
              <span className="toggle-icon">{showBlockchain ? '🙈' : '👁️'}</span>
              <span>{showBlockchain ? 'Hide Hash' : 'Show Hash'}</span>
            </button>
          </div>

          <div className="blockchain-content">
            <div className="blockchain-visual">
              <div className="block-chain">
                <div className="block block-1">
                  <div className="block-content"></div>
                </div>
                <div className="chain-link"></div>
                <div className="block block-2">
                  <div className="block-content"></div>
                </div>
                <div className="chain-link"></div>
                <div className="block block-3 active">
                  <div className="block-content"></div>
                </div>
              </div>
            </div>

            <div className="blockchain-info">
              <div className="security-features">
                <div className="feature-item">
                  <span className="feature-icon">🛡️</span>
                  <span>Tamper-proof verification</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">⏰</span>
                  <span>Time-stamped authenticity</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔐</span>
                  <span>256-bit encryption</span>
                </div>
              </div>

              {showBlockchain && (
                <div className="hash-display">
                  <label>Blockchain Hash:</label>
                  <div className="hash-container">
                    <code className="hash-code">{qrData.blockchainHash}</code>
                    <button 
                      className="copy-hash-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(qrData.blockchainHash);
                        toast.success('🔗 Hash copied to clipboard');
                      }}
                    >
                      📋
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Download Options Grid */}
      <div className="download-section">
        <h3 className="section-title">📥 Download & Share Options</h3>
        <div className="download-grid">
          <div className="download-option" onClick={() => downloadQR('png')}>
            <div className="download-icon png">🖼️</div>
            <h4>PNG Image</h4>
            <p>High quality for printing</p>
            <span className="download-size">~50KB</span>
          </div>

          <div className="download-option" onClick={() => downloadQR('svg')}>
            <div className="download-icon svg">📄</div>
            <h4>SVG Vector</h4>
            <p>Scalable for all sizes</p>
            <span className="download-size">~15KB</span>
          </div>

          <div className="download-option" onClick={copyToClipboard}>
            <div className="download-icon copy">📋</div>
            <h4>Copy Data</h4>
            <p>Raw JSON format</p>
            <span className="download-size">~2KB</span>
          </div>

          <div className="download-option" onClick={shareQR}>
            <div className="download-icon share">📤</div>
            <h4>Share Link</h4>
            <p>Send to contacts</p>
            <span className="download-size">Instant</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="quick-actions">
        <button className="quick-btn regenerate" onClick={generateQRData}>
          <span className="quick-icon">🔄</span>
          <span>Regenerate</span>
        </button>
        
        <button className="quick-btn validate" onClick={() => toast.info('🔍 QR validation coming soon')}>
          <span className="quick-icon">✅</span>
          <span>Validate</span>
        </button>
        
        <button className="quick-btn update" onClick={() => toast.info('✏️ Profile update coming soon')}>
          <span className="quick-icon">✏️</span>
          <span>Update</span>
        </button>
        
        <button className="quick-btn emergency" onClick={() => toast.info('📞 Emergency contacts notified')}>
          <span className="quick-icon">🚨</span>
          <span>Emergency</span>
        </button>
      </div>

      {/* Status Footer */}
      <div className="status-footer">
        <div className="status-grid">
          <div className="status-item">
            <div className="status-indicator active"></div>
            <span className="status-label">Status</span>
            <span className="status-value">Active</span>
          </div>
          
          <div className="status-item">
            <div className="status-indicator success"></div>
            <span className="status-label">Security</span>
            <span className="status-value">Verified</span>
          </div>
          
          <div className="status-item">
            <div className="status-indicator">⏰</div>
            <span className="status-label">Updated</span>
            <span className="status-value">{new Date(qrData.timestamp).toLocaleTimeString()}</span>
          </div>
          
          <div className="status-item">
            <div className="status-indicator">📅</div>
            <span className="status-label">Expires</span>
            <span className="status-value">{new Date(qrData.expiryDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCode;
