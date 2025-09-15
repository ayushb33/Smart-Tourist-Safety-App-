import React, { useState, useEffect } from 'react';
import './Reports.css';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Dummy analytics data
  const generateReportData = (period) => {
    const baseData = {
      totalTourists: Math.floor(Math.random() * 1000) + 500,
      activeAlerts: Math.floor(Math.random() * 50) + 10,
      safetyIncidents: Math.floor(Math.random() * 20) + 5,
      avgResponseTime: Math.floor(Math.random() * 10) + 5,
      topZones: [
        { name: 'India Gate Area', visitors: 425, growth: '+12%' },
        { name: 'Red Fort Complex', visitors: 389, growth: '+8%' },
        { name: 'Connaught Place', visitors: 352, growth: '+15%' },
        { name: 'Qutub Minar Area', visitors: 298, growth: '+5%' },
        { name: 'Lotus Temple Zone', visitors: 267, growth: '+9%' }
      ],
      dailyStats: Array.from({ length: 7 }, (_, i) => ({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        tourists: Math.floor(Math.random() * 200) + 100,
        alerts: Math.floor(Math.random() * 10) + 2,
        incidents: Math.floor(Math.random() * 5) + 1
      })),
      safetyMetrics: {
        excellent: Math.floor(Math.random() * 40) + 50,
        good: Math.floor(Math.random() * 30) + 25,
        fair: Math.floor(Math.random() * 20) + 15,
        poor: Math.floor(Math.random() * 15) + 5
      },
      alertTypes: [
        { type: 'Location Tracking', count: 25, percentage: 45 },
        { type: 'Emergency Contact', count: 15, percentage: 27 },
        { type: 'Safety Violation', count: 8, percentage: 14 },
        { type: 'Medical Emergency', count: 5, percentage: 9 },
        { type: 'Lost Tourist', count: 3, percentage: 5 }
      ],
      responseMetrics: {
        avgResponseTime: 4.2,
        totalResponses: 156,
        successfulResolutions: 142,
        pendingCases: 14
      }
    };
    
    return baseData;
  };

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setReportData(generateReportData(selectedPeriod));
      setIsLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  const exportReport = (format) => {
    if (!reportData) return;
    
    if (format === 'pdf') {
      alert('PDF report generation would be implemented here');
    } else if (format === 'excel') {
      // Simulate Excel export
      const csvContent = `
Tourist Safety Report - ${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}ly Report
Generated: ${new Date().toLocaleDateString()}

Summary Statistics:
Total Tourists,${reportData.totalTourists}
Active Alerts,${reportData.activeAlerts}
Safety Incidents,${reportData.safetyIncidents}
Avg Response Time,${reportData.avgResponseTime} minutes

Top Tourist Zones:
Zone Name,Visitors,Growth
${reportData.topZones.map(zone => `${zone.name},${zone.visitors},${zone.growth}`).join('\\n')}

Daily Statistics:
Day,Tourists,Alerts,Incidents
${reportData.dailyStats.map(stat => `${stat.day},${stat.tourists},${stat.alerts},${stat.incidents}`).join('\\n')}
      `;
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tourist-safety-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  const getMetricIcon = (metric) => {
    const icons = {
      tourists: '👥',
      alerts: '🚨',
      incidents: '⚠️',
      response: '⏱️',
      safety: '🛡️'
    };
    return icons[metric] || '📊';
  };

  const getTrendIcon = (growth) => {
    if (growth.startsWith('+')) return '📈';
    if (growth.startsWith('-')) return '📉';
    return '➡️';
  };

  if (isLoading) {
    return (
      <div className="reports-container">
        <div className="reports-loading">
          <div className="loading-spinner"></div>
          <h3>Generating Reports...</h3>
          <p>Analyzing tourist safety data and metrics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-container">
      {/* Header Section */}
      <div className="reports-header">
        <div className="header-content">
          <div className="title-section">
            <h1>📈 Analytics & Reports</h1>
            <p>Comprehensive tourist safety insights and analytics dashboard</p>
          </div>
          
          <div className="report-controls">
            <div className="control-group">
              <label>Time Period:</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="period-selector"
              >
                <option value="day">📅 Daily</option>
                <option value="week">🗓️ Weekly</option>
                <option value="month">📆 Monthly</option>
                <option value="quarter">📊 Quarterly</option>
              </select>
            </div>
            
            <div className="control-group">
              <label>Metrics:</label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="metric-selector"
              >
                <option value="all">📊 All Metrics</option>
                <option value="tourists">👥 Tourist Data</option>
                <option value="safety">🛡️ Safety Metrics</option>
                <option value="alerts">🚨 Alert Analytics</option>
                <option value="response">⏱️ Response Times</option>
              </select>
            </div>
            
            <div className="export-buttons">
              <button 
                className="export-btn pdf"
                onClick={() => exportReport('pdf')}
              >
                📄 Export PDF
              </button>
              <button 
                className="export-btn excel"
                onClick={() => exportReport('excel')}
              >
                📊 Export Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card tourists">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>{reportData.totalTourists.toLocaleString()}</h3>
            <p>Total Tourists</p>
            <span className="metric-trend positive">+8% vs last {selectedPeriod}</span>
          </div>
        </div>
        
        <div className="metric-card alerts">
          <div className="metric-icon">🚨</div>
          <div className="metric-content">
            <h3>{reportData.activeAlerts}</h3>
            <p>Active Alerts</p>
            <span className="metric-trend negative">-12% vs last {selectedPeriod}</span>
          </div>
        </div>
        
        <div className="metric-card incidents">
          <div className="metric-icon">⚠️</div>
          <div className="metric-content">
            <h3>{reportData.safetyIncidents}</h3>
            <p>Safety Incidents</p>
            <span className="metric-trend negative">-5% vs last {selectedPeriod}</span>
          </div>
        </div>
        
        <div className="metric-card response">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <h3>{reportData.avgResponseTime}m</h3>
            <p>Avg Response Time</p>
            <span className="metric-trend positive">-2m vs last {selectedPeriod}</span>
          </div>
        </div>
      </div>

      <div className="reports-content">
        <div className="reports-grid">
          {/* Top Tourist Zones */}
          <div className="report-card zones-report">
            <div className="card-header">
              <h3>🏛️ Top Tourist Zones</h3>
              <span className="card-subtitle">Most visited locations this {selectedPeriod}</span>
            </div>
            <div className="zones-list">
              {reportData.topZones.map((zone, index) => (
                <div key={index} className="zone-item">
                  <div className="zone-rank">#{index + 1}</div>
                  <div className="zone-info">
                    <h4>{zone.name}</h4>
                    <div className="zone-stats">
                      <span className="visitors">{zone.visitors} visitors</span>
                      <span className={`growth ${zone.growth.startsWith('+') ? 'positive' : 'negative'}`}>
                        {getTrendIcon(zone.growth)} {zone.growth}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Statistics Chart */}
          <div className="report-card daily-stats">
            <div className="card-header">
              <h3>📊 Daily Statistics</h3>
              <span className="card-subtitle">Tourist activity and alerts over time</span>
            </div>
            <div className="chart-container">
              {reportData.dailyStats.map((stat, index) => (
                <div key={index} className="chart-bar-group">
                  <div className="chart-bars">
                    <div 
                      className="chart-bar tourists" 
                      style={{ height: `${(stat.tourists / 300) * 100}%` }}
                      title={`${stat.tourists} tourists`}
                    />
                    <div 
                      className="chart-bar alerts" 
                      style={{ height: `${(stat.alerts / 15) * 100}%` }}
                      title={`${stat.alerts} alerts`}
                    />
                    <div 
                      className="chart-bar incidents" 
                      style={{ height: `${(stat.incidents / 8) * 100}%` }}
                      title={`${stat.incidents} incidents`}
                    />
                  </div>
                  <div className="chart-label">{stat.day}</div>
                  <div className="chart-values">
                    <small>{stat.tourists}T | {stat.alerts}A | {stat.incidents}I</small>
                  </div>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color tourists"></span>
                <span>Tourists</span>
              </div>
              <div className="legend-item">
                <span className="legend-color alerts"></span>
                <span>Alerts</span>
              </div>
              <div className="legend-item">
                <span className="legend-color incidents"></span>
                <span>Incidents</span>
              </div>
            </div>
          </div>

          {/* Safety Metrics */}
          <div className="report-card safety-metrics">
            <div className="card-header">
              <h3>🛡️ Safety Score Distribution</h3>
              <span className="card-subtitle">Tourist safety rating breakdown</span>
            </div>
            <div className="safety-chart">
              <div className="safety-bars">
                <div className="safety-bar excellent">
                  <div className="bar-fill" style={{ width: `${reportData.safetyMetrics.excellent}%` }}>
                    <span className="bar-label">Excellent</span>
                    <span className="bar-value">{reportData.safetyMetrics.excellent}%</span>
                  </div>
                </div>
                <div className="safety-bar good">
                  <div className="bar-fill" style={{ width: `${reportData.safetyMetrics.good}%` }}>
                    <span className="bar-label">Good</span>
                    <span className="bar-value">{reportData.safetyMetrics.good}%</span>
                  </div>
                </div>
                <div className="safety-bar fair">
                  <div className="bar-fill" style={{ width: `${reportData.safetyMetrics.fair}%` }}>
                    <span className="bar-label">Fair</span>
                    <span className="bar-value">{reportData.safetyMetrics.fair}%</span>
                  </div>
                </div>
                <div className="safety-bar poor">
                  <div className="bar-fill" style={{ width: `${reportData.safetyMetrics.poor}%` }}>
                    <span className="bar-label">Poor</span>
                    <span className="bar-value">{reportData.safetyMetrics.poor}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alert Types */}
          <div className="report-card alert-types">
            <div className="card-header">
              <h3>🚨 Alert Categories</h3>
              <span className="card-subtitle">Types of alerts generated this {selectedPeriod}</span>
            </div>
            <div className="alert-list">
              {reportData.alertTypes.map((alert, index) => (
                <div key={index} className="alert-item">
                  <div className="alert-info">
                    <span className="alert-type">{alert.type}</span>
                    <span className="alert-count">{alert.count} alerts</span>
                  </div>
                  <div className="alert-percentage">
                    <div className="percentage-bar">
                      <div 
                        className="percentage-fill" 
                        style={{ width: `${alert.percentage}%` }}
                      />
                    </div>
                    <span className="percentage-text">{alert.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Response Metrics */}
          <div className="report-card response-metrics">
            <div className="card-header">
              <h3>⏱️ Response Performance</h3>
              <span className="card-subtitle">Emergency response and resolution metrics</span>
            </div>
            <div className="response-stats">
              <div className="response-stat">
                <div className="stat-icon">⚡</div>
                <div className="stat-content">
                  <h4>{reportData.responseMetrics.avgResponseTime}m</h4>
                  <p>Average Response Time</p>
                </div>
              </div>
              <div className="response-stat">
                <div className="stat-icon">📞</div>
                <div className="stat-content">
                  <h4>{reportData.responseMetrics.totalResponses}</h4>
                  <p>Total Responses</p>
                </div>
              </div>
              <div className="response-stat">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h4>{reportData.responseMetrics.successfulResolutions}</h4>
                  <p>Successful Resolutions</p>
                </div>
              </div>
              <div className="response-stat">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <h4>{reportData.responseMetrics.pendingCases}</h4>
                  <p>Pending Cases</p>
                </div>
              </div>
            </div>
            <div className="success-rate">
              <div className="success-rate-label">Success Rate:</div>
              <div className="success-rate-bar">
                <div 
                  className="success-rate-fill" 
                  style={{ width: `${(reportData.responseMetrics.successfulResolutions / reportData.responseMetrics.totalResponses) * 100}%` }}
                />
              </div>
              <div className="success-rate-text">
                {Math.round((reportData.responseMetrics.successfulResolutions / reportData.responseMetrics.totalResponses) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
