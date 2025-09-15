import React from 'react';

const Loading = ({ 
  message = 'Loading...', 
  size = 'large',
  overlay = false,
  showProgress = false,
  progress = 0,
  theme = 'light'
}) => {
  const getSpinnerSize = () => {
    switch (size) {
      case 'small':
        return { width: '20px', height: '20px' };
      case 'medium':
        return { width: '40px', height: '40px' };
      case 'large':
      default:
        return { width: '60px', height: '60px' };
    }
  };

  const LoadingContent = () => (
    <div className={`d-flex flex-column justify-content-center align-items-center ${overlay ? 'p-4' : 'min-vh-100'}`}>
      <div className="text-center">
        {/* Custom animated spinner */}
        <div 
          className="loading-spinner mb-3 position-relative"
          style={getSpinnerSize()}
        >
          <div 
            className={`spinner-border ${theme === 'dark' ? 'text-light' : 'text-primary'}`} 
            role="status" 
            style={getSpinnerSize()}
          >
            <span className="visually-hidden">Loading...</span>
          </div>

          {/* Outer ring animation */}
          <div 
            className="position-absolute top-0 start-0 spinner-grow opacity-25"
            style={{
              ...getSpinnerSize(),
              animationDelay: '0.5s'
            }}
          />
        </div>

        {/* Loading message */}
        <div className="mb-3">
          <h5 className={`mb-2 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
            {message}
          </h5>

          {/* Progress bar if enabled */}
          {showProgress && (
            <div className="mb-3">
              <div className="progress mb-2" style={{ width: '250px', height: '8px' }}>
                <div 
                  className="progress-bar progress-bar-striped progress-bar-animated" 
                  role="progressbar" 
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                  aria-valuenow={progress} 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                />
              </div>
              <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                {Math.round(progress)}% complete
              </small>
            </div>
          )}

          {/* Loading dots animation */}
          <div className="loading-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>

        {/* Loading tips based on size */}
        <div className={`small ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
          {size === 'large' && (
            <div>
              <p className="mb-1">🛡️ Securing your data with blockchain encryption</p>
              <p className="mb-0">Please wait while we prepare your dashboard</p>
            </div>
          )}
          {size === 'medium' && (
            <p className="mb-0">Processing your request...</p>
          )}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        .loading-spinner .spinner-border {
          border-width: 3px;
        }

        .loading-dots {
          display: inline-flex;
          gap: 6px;
          margin-top: 10px;
        }

        .dot {
          width: 8px;
          height: 8px;
          background-color: ${theme === 'dark' ? '#ffffff' : '#6c757d'};
          border-radius: 50%;
          animation: loading-dots 1.4s infinite ease-in-out both;
        }

        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }
        .dot:nth-child(3) { animation-delay: 0s; }

        @keyframes loading-dots {
          0%, 80%, 100% {
            transform: scale(0.6);
            opacity: 0.4;
          }
          40% {
            transform: scale(1.0);
            opacity: 1;
          }
        }

        .spinner-border {
          animation: spinner-border 0.75s linear infinite;
        }

        .spinner-grow {
          animation: spinner-grow 2s linear infinite;
        }
      `}</style>
    </div>
  );

  // Return with overlay if needed
  if (overlay) {
    return (
      <div 
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
        style={{ 
          backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)', 
          zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}
      >
        <div className={`${theme === 'dark' ? 'bg-dark' : 'bg-white'} p-4 rounded-3 shadow-lg border`}>
          <LoadingContent />
        </div>
      </div>
    );
  }

  return <LoadingContent />;
};

// Specific loading components for different use cases
export const PageLoading = ({ message = 'Loading page...', theme = 'light' }) => (
  <Loading message={message} size="large" theme={theme} />
);

export const ButtonLoading = ({ message = 'Processing...', theme = 'light' }) => (
  <Loading message={message} size="small" theme={theme} />
);

export const OverlayLoading = ({ 
  message = 'Please wait...', 
  progress = 0, 
  showProgress = false,
  theme = 'light' 
}) => (
  <Loading 
    message={message} 
    size="medium" 
    overlay={true} 
    progress={progress} 
    showProgress={showProgress}
    theme={theme}
  />
);

// Loading states for specific features
export const QRScanLoading = ({ theme = 'light' }) => (
  <Loading 
    message="📷 Scanning QR Code..." 
    size="medium"
    theme={theme}
  />
);

export const MapLoading = ({ theme = 'light' }) => (
  <Loading 
    message="🗺️ Loading safety zones..." 
    size="medium"
    theme={theme}
  />
);

export const DashboardLoading = ({ theme = 'light' }) => (
  <Loading 
    message="📊 Loading dashboard data..." 
    size="large"
    theme={theme}
  />
);

export const AuthLoading = ({ message = 'Authenticating...', theme = 'light' }) => (
  <Loading 
    message={`🔐 ${message}`}
    size="medium"
    theme={theme}
  />
);

export const LocationLoading = ({ theme = 'light' }) => (
  <Loading 
    message="📍 Getting your location..." 
    size="medium"
    theme={theme}
  />
);

export const DataSyncLoading = ({ progress = 0, theme = 'light' }) => (
  <Loading 
    message="🔄 Syncing data..." 
    size="medium"
    showProgress={true}
    progress={progress}
    theme={theme}
  />
);

export const SOSLoading = ({ theme = 'dark' }) => (
  <div className="text-center">
    <div className="position-relative d-inline-block mb-4">
      <div 
        className="loading-spinner mx-auto" 
        style={{ width: '100px', height: '100px' }}
      >
        <div 
          className="spinner-border text-danger" 
          role="status" 
          style={{ 
            width: '100px', 
            height: '100px', 
            borderWidth: '6px',
            animation: 'spin 0.8s linear infinite'
          }}
        >
          <span className="visually-hidden">Sending SOS...</span>
        </div>
      </div>

      {/* Pulsing outer ring */}
      <div 
        className="position-absolute top-0 start-0 border border-danger rounded-circle opacity-25"
        style={{ 
          width: '120px', 
          height: '120px',
          animation: 'pulse 1.5s ease-in-out infinite',
          left: '-10px',
          top: '-10px'
        }}
      />
    </div>

    <h3 className="text-danger mb-3 fw-bold">🆘 SENDING EMERGENCY ALERT</h3>
    <div className="mb-3">
      <div className="alert alert-danger border-0 bg-danger bg-opacity-10">
        <div className="d-flex align-items-center justify-content-center">
          <div className="spinner-border spinner-border-sm text-danger me-2" />
          <span>Emergency services are being contacted...</span>
        </div>
      </div>
    </div>

    <div className="row text-start">
      <div className="col-md-6">
        <h6 className="text-danger">📡 Alerting:</h6>
        <ul className="list-unstyled small">
          <li>✓ Local Police Department</li>
          <li>✓ Emergency Medical Services</li>
          <li>✓ Your Emergency Contact</li>
          <li>✓ Tourist Safety Command</li>
        </ul>
      </div>
      <div className="col-md-6">
        <h6 className="text-danger">📍 Sharing:</h6>
        <ul className="list-unstyled small">
          <li>✓ Your Current Location</li>
          <li>✓ Tourist ID & Profile</li>
          <li>✓ Medical Information</li>
          <li>✓ Emergency Contacts</li>
        </ul>
      </div>
    </div>

    <div className="mt-3">
      <small className="text-muted">
        Stay calm • Help is on the way • Keep your phone nearby
      </small>
    </div>

    <style jsx>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes pulse {
        0%, 100% { 
          transform: scale(1);
          opacity: 0.25;
        }
        50% { 
          transform: scale(1.1);
          opacity: 0.1;
        }
      }
    `}</style>
  </div>
);

// Skeleton loading for lists/cards
export const SkeletonLoading = ({ count = 3, type = 'card' }) => (
  <div>
    {[...Array(count)].map((_, index) => (
      <div key={index} className="card mb-3">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="placeholder-glow flex-shrink-0 me-3">
              <div className="placeholder bg-secondary rounded-circle" style={{ width: '48px', height: '48px' }} />
            </div>
            <div className="flex-grow-1">
              <div className="placeholder-glow">
                <span className="placeholder col-6 mb-2" />
                <span className="placeholder col-4 mb-1" />
                <span className="placeholder col-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Table loading skeleton
export const TableLoading = ({ rows = 5, columns = 4 }) => (
  <div className="table-responsive">
    <table className="table">
      <thead>
        <tr>
          {[...Array(columns)].map((_, index) => (
            <th key={index}>
              <div className="placeholder-glow">
                <span className="placeholder col-8" />
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(rows)].map((_, rowIndex) => (
          <tr key={rowIndex}>
            {[...Array(columns)].map((_, colIndex) => (
              <td key={colIndex}>
                <div className="placeholder-glow">
                  <span className="placeholder col-10" />
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Loading;