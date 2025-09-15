import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import './HeatMap.css';

// Fix for default markers in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const HeatMap = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const heatmapLayer = useRef(null);
  const markersGroup = useRef(null);
  const [viewMode, setViewMode] = useState('density');
  const [timeOfDay, setTimeOfDay] = useState('current');
  const [selectedZone, setSelectedZone] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [showStatistics, setShowStatistics] = useState(true);

  // Delhi tourist zones with real GPS coordinates
  const delhiTouristZones = [
    {
      id: 'zone-1',
      name: 'India Gate Area',
      location: 'Central Delhi',
      coordinates: [28.6129, 77.2295],
      tourists: 85,
      intensity: 0.95,
      risk: 'low',
      activity: 'high',
      details: {
        active: 78,
        offline: 5,
        alerts: 2,
        popularTimes: { morning: 65, afternoon: 85, evening: 95, night: 25 },
        attractions: ['India Gate', 'Rajpath', 'National War Memorial'],
        avgVisitTime: '2.5 hours',
        crowdLevel: 'Very High',
        safetyRating: 4.5,
        policeStations: 3,
        emergencyUnits: 2,
        avgResponseTime: '3.2 min'
      }
    },
    {
      id: 'zone-2',
      name: 'Red Fort Complex',
      location: 'Old Delhi',
      coordinates: [28.6562, 77.2410],
      tourists: 72,
      intensity: 0.85,
      risk: 'medium',
      activity: 'high',
      details: {
        active: 65,
        offline: 4,
        alerts: 3,
        popularTimes: { morning: 72, afternoon: 68, evening: 45, night: 15 },
        attractions: ['Red Fort', 'Chandni Chowk', 'Jama Masjid'],
        avgVisitTime: '3 hours',
        crowdLevel: 'High',
        safetyRating: 4.0,
        policeStations: 2,
        emergencyUnits: 1,
        avgResponseTime: '4.8 min'
      }
    },
    {
      id: 'zone-3',
      name: 'Connaught Place',
      location: 'Central Delhi',
      coordinates: [28.6315, 77.2167],
      tourists: 64,
      intensity: 0.78,
      risk: 'low',
      activity: 'very-high',
      details: {
        active: 60,
        offline: 2,
        alerts: 2,
        popularTimes: { morning: 45, afternoon: 64, evening: 78, night: 52 },
        attractions: ['Connaught Place', 'Janpath Market', 'Palika Bazaar'],
        avgVisitTime: '2 hours',
        crowdLevel: 'Very High',
        safetyRating: 4.8,
        policeStations: 4,
        emergencyUnits: 3,
        avgResponseTime: '2.5 min'
      }
    },
    {
      id: 'zone-4',
      name: 'Qutub Minar Area',
      location: 'South Delhi',
      coordinates: [28.5245, 77.1855],
      tourists: 58,
      intensity: 0.70,
      risk: 'low',
      activity: 'medium',
      details: {
        active: 54,
        offline: 3,
        alerts: 1,
        popularTimes: { morning: 58, afternoon: 52, evening: 38, night: 8 },
        attractions: ['Qutub Minar', 'Iron Pillar', 'Mehrauli Archaeological Park'],
        avgVisitTime: '2.5 hours',
        crowdLevel: 'High',
        safetyRating: 4.6,
        policeStations: 2,
        emergencyUnits: 1,
        avgResponseTime: '5.1 min'
      }
    },
    {
      id: 'zone-5',
      name: 'Lotus Temple Zone',
      location: 'South Delhi',
      coordinates: [28.5535, 77.2588],
      tourists: 48,
      intensity: 0.62,
      risk: 'low',
      activity: 'medium',
      details: {
        active: 45,
        offline: 2,
        alerts: 1,
        popularTimes: { morning: 48, afternoon: 42, evening: 35, night: 12 },
        attractions: ['Lotus Temple', 'Kalkaji Temple', 'Okhla Bird Sanctuary'],
        avgVisitTime: '1.5 hours',
        crowdLevel: 'Medium',
        safetyRating: 4.7,
        policeStations: 1,
        emergencyUnits: 1,
        avgResponseTime: '6.2 min'
      }
    },
    {
      id: 'zone-6',
      name: 'Humayun\'s Tomb Area',
      location: 'Central Delhi',
      coordinates: [28.5933, 77.2507],
      tourists: 42,
      intensity: 0.55,
      risk: 'low',
      activity: 'medium',
      details: {
        active: 39,
        offline: 2,
        alerts: 1,
        popularTimes: { morning: 42, afternoon: 38, evening: 28, night: 5 },
        attractions: ['Humayun\'s Tomb', 'Nizamuddin Dargah', 'Khan-i-Khanan Tomb'],
        avgVisitTime: '2 hours',
        crowdLevel: 'Medium',
        safetyRating: 4.4,
        policeStations: 1,
        emergencyUnits: 1,
        avgResponseTime: '5.8 min'
      }
    },
    {
      id: 'zone-7',
      name: 'Akshardham Complex',
      location: 'East Delhi',
      coordinates: [28.6127, 77.2773],
      tourists: 55,
      intensity: 0.68,
      risk: 'low',
      activity: 'high',
      details: {
        active: 52,
        offline: 2,
        alerts: 1,
        popularTimes: { morning: 35, afternoon: 55, evening: 48, night: 0 },
        attractions: ['Akshardham Temple', 'Yamuna Sports Complex'],
        avgVisitTime: '4 hours',
        crowdLevel: 'High',
        safetyRating: 4.9,
        policeStations: 2,
        emergencyUnits: 2,
        avgResponseTime: '4.1 min'
      }
    },
    {
      id: 'zone-8',
      name: 'Lodhi Gardens Area',
      location: 'Central Delhi',
      coordinates: [28.5918, 77.2219],
      tourists: 38,
      intensity: 0.48,
      risk: 'low',
      activity: 'medium',
      details: {
        active: 36,
        offline: 1,
        alerts: 1,
        popularTimes: { morning: 45, afternoon: 32, evening: 38, night: 15 },
        attractions: ['Lodhi Gardens', 'Safdarjung Tomb', 'India International Centre'],
        avgVisitTime: '1.5 hours',
        crowdLevel: 'Medium',
        safetyRating: 4.5,
        policeStations: 1,
        emergencyUnits: 1,
        avgResponseTime: '4.9 min'
      }
    }
  ];

  // Legend configurations for different view modes
  const getLegendConfig = () => {
    switch (viewMode) {
      case 'risk':
        return {
          title: '🚨 Risk Assessment Legend',
          description: 'Color-coded safety risk levels across tourist zones',
          items: [
            { color: '#2ecc71', label: 'Low Risk', description: 'Safe zones with minimal incidents', icon: '🟢', value: '< 20%' },
            { color: '#f39c12', label: 'Medium Risk', description: 'Moderate caution required', icon: '🟡', value: '20-60%' },
            { color: '#e74c3c', label: 'High Risk', description: 'Enhanced security needed', icon: '🔴', value: '> 60%' }
          ]
        };
      case 'activity':
        return {
          title: '📊 Activity Level Legend',
          description: 'Real-time tourist activity and movement intensity',
          items: [
            { color: '#95a5a6', label: 'Low Activity', description: 'Minimal tourist movement', icon: '⚪', value: '< 25%' },
            { color: '#1abc9c', label: 'Medium Activity', description: 'Moderate tourist presence', icon: '🔵', value: '25-50%' },
            { color: '#3498db', label: 'High Activity', description: 'Busy tourist zones', icon: '🟦', value: '50-75%' },
            { color: '#8e44ad', label: 'Very High Activity', description: 'Peak tourist concentration', icon: '🟣', value: '> 75%' }
          ]
        };
      default: // density
        return {
          title: '🔥 Tourist Density Legend',
          description: 'Heat intensity showing tourist concentration levels',
          items: [
            { color: '#4caf50', label: 'Very Low', description: '1-20 tourists per zone', icon: '🟢', value: '1-20' },
            { color: '#ffeb3b', label: 'Low', description: '21-40 tourists per zone', icon: '🟡', value: '21-40' },
            { color: '#ff9800', label: 'Medium', description: '41-60 tourists per zone', icon: '🟠', value: '41-60' },
            { color: '#ff5722', label: 'High', description: '61-80 tourists per zone', icon: '🔶', value: '61-80' },
            { color: '#f44336', label: 'Very High', description: '81-100 tourists per zone', icon: '🔴', value: '81-100' },
            { color: '#d32f2f', label: 'Extreme', description: '100+ tourists per zone', icon: '🟥', value: '100+' }
          ]
        };
    }
  };

  // Generate statistical insights
  const getStatisticalInsights = () => {
    const totalTourists = delhiTouristZones.reduce((sum, zone) => sum + getTimeBasedData(zone), 0);
    const avgSafetyScore = (delhiTouristZones.reduce((sum, zone) => sum + zone.details.safetyRating, 0) / delhiTouristZones.length).toFixed(1);
    const totalAlerts = delhiTouristZones.reduce((sum, zone) => sum + zone.details.alerts, 0);
    const totalPoliceStations = delhiTouristZones.reduce((sum, zone) => sum + zone.details.policeStations, 0);
    const avgResponseTime = (delhiTouristZones.reduce((sum, zone) => sum + parseFloat(zone.details.avgResponseTime), 0) / delhiTouristZones.length).toFixed(1);
    
    const riskDistribution = {
      low: delhiTouristZones.filter(z => z.risk === 'low').length,
      medium: delhiTouristZones.filter(z => z.risk === 'medium').length,
      high: delhiTouristZones.filter(z => z.risk === 'high').length
    };

    return {
      totalTourists,
      avgSafetyScore,
      totalAlerts,
      totalPoliceStations,
      avgResponseTime,
      riskDistribution,
      peakHour: getCurrentPeakHour(),
      mostActiveZone: getMostActiveZone(),
      safestZone: getSafestZone()
    };
  };

  const getCurrentPeakHour = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 12) return 'Morning (6-12 AM)';
    if (currentHour >= 12 && currentHour < 18) return 'Afternoon (12-6 PM)';
    if (currentHour >= 18 && currentHour < 22) return 'Evening (6-10 PM)';
    return 'Night (10 PM-6 AM)';
  };

  const getMostActiveZone = () => {
    return delhiTouristZones.reduce((max, zone) => 
      getTimeBasedData(zone) > getTimeBasedData(max) ? zone : max
    );
  };

  const getSafestZone = () => {
    return delhiTouristZones.reduce((max, zone) => 
      zone.details.safetyRating > max.details.safetyRating ? zone : max
    );
  };

  // Generate dummy individual tourist points for more realistic heat distribution
  const generateDummyTouristPoints = () => {
    let points = [];
    
    delhiTouristZones.forEach(zone => {
      const currentTourists = getTimeBasedData(zone);
      const intensity = getIntensityForMode(zone, currentTourists);
      
      // Add main zone point
      points.push([zone.coordinates[0], zone.coordinates[1], intensity]);
      
      // Add surrounding random points for realistic heat spread
      const numPoints = Math.floor(currentTourists / 3);
      for (let i = 0; i < numPoints; i++) {
        const offsetLat = (Math.random() - 0.5) * 0.02;
        const offsetLng = (Math.random() - 0.5) * 0.02;
        const randomIntensity = intensity * (0.4 + Math.random() * 0.6);
        
        points.push([
          zone.coordinates[0] + offsetLat,
          zone.coordinates[1] + offsetLng,
          randomIntensity
        ]);
      }
    });
    
    return points;
  };

  const getTimeBasedData = (zone) => {
    const currentHour = new Date().getHours();
    let timeKey;
    if (currentHour >= 6 && currentHour < 12) timeKey = 'morning';
    else if (currentHour >= 12 && currentHour < 18) timeKey = 'afternoon';
    else if (currentHour >= 18 && currentHour < 22) timeKey = 'evening';
    else timeKey = 'night';
    
    if (timeOfDay === 'current') {
      return zone.details.popularTimes[timeKey];
    }
    return zone.details.popularTimes[timeOfDay] || zone.tourists;
  };

  const getIntensityForMode = (zone, tourists) => {
    switch (viewMode) {
      case 'risk':
        if (zone.risk === 'high') return 1.0;
        if (zone.risk === 'medium') return 0.6;
        return 0.3;
      case 'activity':
        if (zone.activity === 'very-high') return 1.0;
        if (zone.activity === 'high') return 0.8;
        if (zone.activity === 'medium') return 0.5;
        return 0.2;
      default: // density
        return Math.min(tourists / 100, 1.0);
    }
  };

  const getHeatmapOptions = () => {
    const baseOptions = {
      maxZoom: 15,
      max: 1.0,
      minOpacity: 0.1
    };

    switch (viewMode) {
      case 'risk':
        return {
          ...baseOptions,
          radius: 30,
          blur: 20,
          gradient: {
            0.0: '#2ecc71',
            0.5: '#f39c12',
            1.0: '#e74c3c'
          }
        };
      case 'activity':
        return {
          ...baseOptions,
          radius: 25,
          blur: 15,
          gradient: {
            0.0: '#95a5a6',
            0.3: '#1abc9c',
            0.6: '#3498db',
            1.0: '#8e44ad'
          }
        };
      default: // density
        return {
          ...baseOptions,
          radius: 35,
          blur: 25,
          gradient: {
            0.0: '#4caf50',
            0.2: '#ffeb3b',
            0.4: '#ff9800',
            0.6: '#ff5722',
            0.8: '#f44336',
            1.0: '#d32f2f'
          }
        };
    }
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      const heatmapData = generateDummyTouristPoints();
      const options = getHeatmapOptions();
      
      if (heatmapLayer.current && mapInstance.current) {
        mapInstance.current.removeLayer(heatmapLayer.current);
        heatmapLayer.current = L.heatLayer(heatmapData, options);
        mapInstance.current.addLayer(heatmapLayer.current);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const getTotalStats = () => {
    return delhiTouristZones.reduce((acc, zone) => ({
      total: acc.total + zone.tourists,
      active: acc.active + zone.details.active,
      offline: acc.offline + zone.details.offline,
      alerts: acc.alerts + zone.details.alerts
    }), { total: 0, active: 0, offline: 0, alerts: 0 });
  };

  // Initialize map
  useEffect(() => {
    if (!mapInstance.current && mapRef.current) {
      setIsLoading(true);
      
      mapInstance.current = L.map(mapRef.current, {
        center: [28.6139, 77.2090],
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: true,
        attributionControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Tourist Safety Monitoring System',
        maxZoom: 18,
        tileSize: 256
      }).addTo(mapInstance.current);

      markersGroup.current = L.layerGroup().addTo(mapInstance.current);

      delhiTouristZones.forEach(zone => {
        const marker = L.marker(zone.coordinates, {
          title: zone.name
        });

        const popupContent = `
          <div class="zone-popup">
            <h3>${zone.name}</h3>
            <div class="popup-stats">
              <div class="popup-stat">
                <span class="stat-icon">📍</span>
                <span><strong>Location:</strong> ${zone.location}</span>
              </div>
              <div class="popup-stat">
                <span class="stat-icon">👥</span>
                <span><strong>Current Tourists:</strong> ${getTimeBasedData(zone)}</span>
              </div>
              <div class="popup-stat">
                <span class="stat-icon">⚠️</span>
                <span><strong>Risk Level:</strong> <span class="risk-${zone.risk}">${zone.risk.toUpperCase()}</span></span>
              </div>
              <div class="popup-stat">
                <span class="stat-icon">⭐</span>
                <span><strong>Safety Rating:</strong> ${zone.details.safetyRating}/5</span>
              </div>
              <div class="popup-stat">
                <span class="stat-icon">🚔</span>
                <span><strong>Police Stations:</strong> ${zone.details.policeStations}</span>
              </div>
              <div class="popup-stat">
                <span class="stat-icon">⏱️</span>
                <span><strong>Response Time:</strong> ${zone.details.avgResponseTime}</span>
              </div>
            </div>
            <div class="popup-attractions">
              <strong>🎯 Key Attractions:</strong>
              <ul class="attraction-list">
                ${zone.details.attractions.map(attraction => `<li>${attraction}</li>`).join('')}
              </ul>
            </div>
            <div class="popup-actions">
              <button class="popup-btn primary" onclick="window.selectZone('${zone.id}')">📊 View Details</button>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 350,
          className: 'custom-popup'
        });

        markersGroup.current.addLayer(marker);
      });

      window.selectZone = (zoneId) => {
        const zone = delhiTouristZones.find(z => z.id === zoneId);
        if (zone) {
          setSelectedZone(zone);
          mapInstance.current.closePopup();
        }
      };

      setIsLoading(false);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
      if (window.selectZone) {
        delete window.selectZone;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstance.current) {
      if (heatmapLayer.current) {
        mapInstance.current.removeLayer(heatmapLayer.current);
      }

      const heatmapData = generateDummyTouristPoints();
      const options = getHeatmapOptions();

      heatmapLayer.current = L.heatLayer(heatmapData, options);
      mapInstance.current.addLayer(heatmapLayer.current);
    }
  }, [viewMode, timeOfDay]);

  // Get computed values
  const stats = getTotalStats();
  const legendConfig = getLegendConfig();
  const insights = getStatisticalInsights();

  return (
    <div className="enhanced-leaflet-heatmap">
      {/* Enhanced Header */}
      <div className="heatmap-header-modern">
        <div className="header-background">
          <div className="header-pattern"></div>
        </div>
        
        <div className="header-content-modern">
          <div className="title-section-modern">
            <div className="title-icon-modern">🗺️</div>
            <div className="title-text-modern">
              <h1>Tourist Safety Monitoring</h1>
              <h2>Live Heatmap Dashboard</h2>
              <p>Real-time interactive tourist distribution mapping across Delhi with advanced statistical analysis</p>
            </div>
            <div className="live-indicator-modern">
              <div className="pulse-dot-modern"></div>
              <span>LIVE DATA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Controls Panel */}
      <div className="controls-panel-modern">
        <div className="controls-container">
          <div className="control-sections">
            <div className="control-section">
              <div className="control-header">
                <span className="control-icon">👁️</span>
                <label>View Mode</label>
              </div>
              <div className="enhanced-select-wrapper">
                <select 
                  value={viewMode} 
                  onChange={(e) => setViewMode(e.target.value)}
                  className="enhanced-select"
                >
                  <option value="density">🔥 Tourist Density</option>
                  <option value="risk">⚠️ Risk Assessment</option>
                  <option value="activity">📊 Activity Level</option>
                </select>
                <div className="select-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="control-section">
              <div className="control-header">
                <span className="control-icon">⏰</span>
                <label>Time Period</label>
              </div>
              <div className="enhanced-select-wrapper">
                <select 
                  value={timeOfDay} 
                  onChange={(e) => setTimeOfDay(e.target.value)}
                  className="enhanced-select"
                >
                  <option value="current">🕐 Current Time</option>
                  <option value="morning">🌅 Morning (6-12)</option>
                  <option value="afternoon">☀️ Afternoon (12-18)</option>
                  <option value="evening">🌆 Evening (18-22)</option>
                  <option value="night">🌙 Night (22-6)</option>
                </select>
                <div className="select-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="action-buttons-modern">
            <button 
              className={`modern-btn toggle-btn ${showLegend ? 'active' : ''}`}
              onClick={() => setShowLegend(!showLegend)}
            >
              <span className="btn-icon">🗺️</span>
              <span className="btn-text">Legend</span>
              <div className="btn-glow"></div>
            </button>

            <button 
              className={`modern-btn toggle-btn ${showStatistics ? 'active' : ''}`}
              onClick={() => setShowStatistics(!showStatistics)}
            >
              <span className="btn-icon">📊</span>
              <span className="btn-text">Statistics</span>
              <div className="btn-glow"></div>
            </button>

            <button 
              className="modern-btn refresh-btn"
              onClick={refreshData}
              disabled={isLoading}
            >
              <span className={`btn-icon ${isLoading ? 'rotating' : ''}`}>🔄</span>
              <span className="btn-text">{isLoading ? 'Refreshing...' : 'Refresh Data'}</span>
              <div className="btn-glow"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="heatmap-main-content">
        {/* Enhanced Map Container */}
        <div className="map-section-modern">
          <div className="map-wrapper-modern">
            <div 
              ref={mapRef} 
              className="leaflet-map-modern"
            />
            
            {/* Enhanced Legend */}
            {showLegend && (
              <div className="legend-panel-modern">
                <div className="legend-header-modern">
                  <div className="legend-title">
                    <span className="legend-icon">🎨</span>
                    <h4>{legendConfig.title}</h4>
                  </div>
                  <button 
                    className="legend-close"
                    onClick={() => setShowLegend(false)}
                  >
                    ✕
                  </button>
                </div>
                
                <p className="legend-description">{legendConfig.description}</p>
                
                <div className="legend-items-modern">
                  {legendConfig.items.map((item, index) => (
                    <div key={index} className="legend-item-modern">
                      <div className="legend-color-indicator">
                        <div 
                          className="color-dot"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="color-icon">{item.icon}</span>
                      </div>
                      <div className="legend-content">
                        <div className="legend-label-row">
                          <span className="legend-label">{item.label}</span>
                          <span className="legend-value">{item.value}</span>
                        </div>
                        <span className="legend-description-text">{item.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="legend-footer-modern">
                  <div className="update-indicator">
                    <div className="update-dot"></div>
                    <span>Updates every 30s • Live from {delhiTouristZones.length} zones</span>
                  </div>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="loading-overlay-modern">
                <div className="loading-content">
                  <div className="loading-spinner-modern">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                  </div>
                  <p>Loading map data...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Statistics Panel */}
        <div className="stats-panel-modern">
          {/* Live Statistics */}
          <div className="stats-card-modern">
            <div className="stats-header-modern">
              <h3>📊 Live Statistics</h3>
              <div className="live-badge">
                <div className="live-dot"></div>
                <span>LIVE</span>
              </div>
            </div>
            
            <div className="stats-grid-modern">
              <div className="stat-item-modern total">
                <div className="stat-icon-modern">👥</div>
                <div className="stat-content-modern">
                  <span className="stat-value-modern">{stats.total}</span>
                  <span className="stat-label-modern">Total Tourists</span>
                </div>
                <div className="stat-trend up">↗</div>
              </div>
              
              <div className="stat-item-modern active">
                <div className="stat-icon-modern">✅</div>
                <div className="stat-content-modern">
                  <span className="stat-value-modern">{stats.active}</span>
                  <span className="stat-label-modern">Currently Active</span>
                </div>
                <div className="stat-trend stable">→</div>
              </div>
              
              <div className="stat-item-modern offline">
                <div className="stat-icon-modern">📴</div>
                <div className="stat-content-modern">
                  <span className="stat-value-modern">{stats.offline}</span>
                  <span className="stat-label-modern">Offline</span>
                </div>
                <div className="stat-trend down">↘</div>
              </div>
              
              <div className="stat-item-modern alerts">
                <div className="stat-icon-modern">🚨</div>
                <div className="stat-content-modern">
                  <span className="stat-value-modern">{stats.alerts}</span>
                  <span className="stat-label-modern">Active Alerts</span>
                </div>
                <div className="stat-trend stable">→</div>
              </div>
            </div>
          </div>

          {/* Enhanced Insights */}
          {showStatistics && (
            <div className="insights-card-modern">
              <div className="insights-header-modern">
                <h3>📈 Advanced Insights</h3>
                <button 
                  className="insights-toggle"
                  onClick={() => setShowStatistics(false)}
                >
                  ➖
                </button>
              </div>
              
              <div className="insights-grid-modern">
                <div className="insight-item-modern">
                  <div className="insight-icon-wrapper">
                    <span className="insight-icon">🎯</span>
                  </div>
                  <div className="insight-content">
                    <span className="insight-label">Peak Activity</span>
                    <span className="insight-value">{insights.peakHour}</span>
                  </div>
                </div>
                
                <div className="insight-item-modern">
                  <div className="insight-icon-wrapper">
                    <span className="insight-icon">🏆</span>
                  </div>
                  <div className="insight-content">
                    <span className="insight-label">Most Active</span>
                    <span className="insight-value">{insights.mostActiveZone.name}</span>
                  </div>
                </div>
                
                <div className="insight-item-modern">
                  <div className="insight-icon-wrapper">
                    <span className="insight-icon">🛡️</span>
                  </div>
                  <div className="insight-content">
                    <span className="insight-label">Safest Zone</span>
                    <span className="insight-value">{insights.safestZone.name}</span>
                  </div>
                </div>
                
                <div className="insight-item-modern">
                  <div className="insight-icon-wrapper">
                    <span className="insight-icon">⚡</span>
                  </div>
                  <div className="insight-content">
                    <span className="insight-label">Avg Response</span>
                    <span className="insight-value">{insights.avgResponseTime} min</span>
                  </div>
                </div>
              </div>

              {/* Risk Distribution */}
              <div className="risk-analysis-modern">
                <h4>🎯 Risk Distribution Analysis</h4>
                <div className="risk-bars-modern">
                  <div className="risk-bar-modern low">
                    <div className="risk-info">
                      <span className="risk-icon">🟢</span>
                      <span className="risk-label">Low Risk</span>
                      <span className="risk-count">{insights.riskDistribution.low}</span>
                    </div>
                    <div className="risk-progress-modern">
                      <div 
                        className="risk-fill-modern"
                        style={{ width: `${(insights.riskDistribution.low / delhiTouristZones.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="risk-bar-modern medium">
                    <div className="risk-info">
                      <span className="risk-icon">🟡</span>
                      <span className="risk-label">Medium Risk</span>
                      <span className="risk-count">{insights.riskDistribution.medium}</span>
                    </div>
                    <div className="risk-progress-modern">
                      <div 
                        className="risk-fill-modern"
                        style={{ width: `${(insights.riskDistribution.medium / delhiTouristZones.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="risk-bar-modern high">
                    <div className="risk-info">
                      <span className="risk-icon">🔴</span>
                      <span className="risk-label">High Risk</span>
                      <span className="risk-count">{insights.riskDistribution.high}</span>
                    </div>
                    <div className="risk-progress-modern">
                      <div 
                        className="risk-fill-modern"
                        style={{ width: `${(insights.riskDistribution.high / delhiTouristZones.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Status */}
          <div className="system-status-modern">
            <div className="status-header-modern">
              <h4>🖥️ System Status</h4>
              <div className="status-indicator-modern online">
                <div className="status-dot-modern"></div>
                <span>ONLINE</span>
              </div>
            </div>
            
            <div className="status-details-modern">
              <div className="status-item-row">
                <span className="status-label">Last Update</span>
                <span className="status-value">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="status-item-row">
                <span className="status-label">Auto Refresh</span>
                <span className="status-value">Every 30s</span>
              </div>
              <div className="status-item-row">
                <span className="status-label">View Mode</span>
                <span className="status-value">{viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}</span>
              </div>
              <div className="status-item-row">
                <span className="status-label">Zones Monitored</span>
                <span className="status-value">{delhiTouristZones.length}</span>
              </div>
              <div className="status-item-row">
                <span className="status-label">Safety Score</span>
                <span className="status-value">{insights.avgSafetyScore}/5 ⭐</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Zone Details Modal */}
      {selectedZone && (
        <div className="zone-modal-modern">
          <div className="zone-modal-content">
            <div className="zone-modal-header">
              <h3>📍 {selectedZone.name}</h3>
              <button 
                className="zone-modal-close"
                onClick={() => setSelectedZone(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="zone-modal-body">
              <p className="zone-location">{selectedZone.location}</p>
              
              <div className="zone-quick-stats">
                <div className="quick-stat">
                  <span className="quick-stat-value">{getTimeBasedData(selectedZone)}</span>
                  <span className="quick-stat-label">Current Tourists</span>
                </div>
                <div className="quick-stat">
                  <span className="quick-stat-value">{selectedZone.details.safetyRating}/5</span>
                  <span className="quick-stat-label">Safety Rating</span>
                </div>
                <div className="quick-stat">
                  <span className={`risk-badge-modern ${selectedZone.risk}`}>{selectedZone.risk.toUpperCase()}</span>
                  <span className="quick-stat-label">Risk Level</span>
                </div>
              </div>
              
              <div className="zone-attractions-modern">
                <h5>🎯 Key Attractions</h5>
                <div className="attractions-tags">
                  {selectedZone.details.attractions.map((attraction, index) => (
                    <span key={index} className="attraction-tag-modern">{attraction}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeatMap;
