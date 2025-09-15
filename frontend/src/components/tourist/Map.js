import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';

// Fix for default markers in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Map = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const zonesLayer = useRef(null);
  const markersGroup = useRef(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewType, setViewType] = useState('attraction'); // 'attraction' or 'safety'
  const [showLegend, setShowLegend] = useState(true);
  const [showAttractions, setShowAttractions] = useState(true);

  // Tourist Attraction Zones
  const touristZones = [
    {
      id: 'heritage-zone',
      name: 'Heritage Zone (Old Delhi)',
      type: 'heritage',
      color: '#8B4513',
      description: 'Historical monuments and cultural sites in Old Delhi',
      safetyRating: 4.2,
      crowdLevel: 'High',
      bestTime: 'Morning & Evening',
      avgDuration: '4-6 hours',
      coordinates: [
        [28.6700, 77.2200], [28.6750, 77.2450], [28.6600, 77.2500], 
        [28.6500, 77.2400], [28.6550, 77.2150], [28.6700, 77.2200]
      ],
      center: [28.6562, 77.2410],
      attractions: [
        { name: 'Red Fort', type: 'UNESCO World Heritage', rating: 4.6, timings: '6:00 AM - 6:00 PM' },
        { name: 'Jama Masjid', type: 'Mosque', rating: 4.4, timings: '7:00 AM - 12:00 PM, 1:30 PM - 6:30 PM' },
        { name: 'Chandni Chowk', type: 'Market', rating: 4.2, timings: '10:00 AM - 8:00 PM' },
        { name: 'Raj Ghat', type: 'Memorial', rating: 4.3, timings: '6:00 AM - 6:00 PM' }
      ],
      facilities: ['Metro Station', 'Parking', 'Food Courts', 'Tourist Police', 'ATMs', 'Restrooms'],
      transportation: ['Delhi Metro (Red Line)', 'Bus Routes: 101, 102, 103', 'Auto Rickshaws'],
      tips: ['Visit early morning to avoid crowds', 'Carry water and wear comfortable shoes']
    },
    {
      id: 'central-delhi-zone',
      name: 'Central Delhi Zone',
      type: 'modern',
      color: '#4169E1',
      description: 'Government area and modern attractions',
      safetyRating: 4.8,
      crowdLevel: 'Very High',
      bestTime: 'All Day',
      avgDuration: '3-5 hours',
      coordinates: [
        [28.6000, 77.1900], [28.6300, 77.1950], [28.6350, 77.2300], 
        [28.6200, 77.2350], [28.5950, 77.2100], [28.6000, 77.1900]
      ],
      center: [28.6129, 77.2295],
      attractions: [
        { name: 'India Gate', type: 'War Memorial', rating: 4.7, timings: '24 hours' },
        { name: 'Rashtrapati Bhavan', type: 'Presidential Palace', rating: 4.6, timings: 'By appointment' },
        { name: 'Parliament House', type: 'Government Building', rating: 4.4, timings: 'Restricted access' }
      ],
      facilities: ['Metro Stations', 'Security', 'Restaurants', 'Government Buildings'],
      transportation: ['Delhi Metro (Central Line)', 'Bus Routes: 201, 202, 203'],
      tips: ['Security checks at government buildings', 'Great for evening walks around India Gate']
    },
    {
      id: 'connaught-place-zone',
      name: 'Connaught Place Zone',
      type: 'modern',
      color: '#1E90FF',
      description: 'Shopping and business district',
      safetyRating: 4.7,
      crowdLevel: 'Very High',
      bestTime: 'All Day',
      avgDuration: '2-4 hours',
      coordinates: [
        [28.6250, 77.2050], [28.6400, 77.2100], [28.6380, 77.2280], 
        [28.6280, 77.2300], [28.6200, 77.2150], [28.6250, 77.2050]
      ],
      center: [28.6315, 77.2167],
      attractions: [
        { name: 'Connaught Place', type: 'Shopping District', rating: 4.5, timings: '10:00 AM - 10:00 PM' },
        { name: 'Janpath Market', type: 'Market', rating: 4.2, timings: '10:00 AM - 8:00 PM' }
      ],
      facilities: ['Metro Station', 'Shopping Malls', 'Restaurants', 'ATMs'],
      transportation: ['Delhi Metro (Blue, Yellow Lines)', 'Bus Terminal'],
      tips: ['Perfect for shopping and dining', 'Central location with best connectivity']
    },
    {
      id: 'south-delhi-zone',
      name: 'South Delhi Heritage Zone',
      type: 'heritage',
      color: '#FF6347',
      description: 'Ancient monuments and gardens in South Delhi',
      safetyRating: 4.4,
      crowdLevel: 'Medium',
      bestTime: 'Morning & Late Afternoon',
      avgDuration: '4-6 hours',
      coordinates: [
        [28.5100, 77.1700], [28.5400, 77.1750], [28.5450, 77.2050], 
        [28.5200, 77.2100], [28.5000, 77.1900], [28.5100, 77.1700]
      ],
      center: [28.5245, 77.1855],
      attractions: [
        { name: 'Qutub Minar', type: 'UNESCO World Heritage', rating: 4.5, timings: '7:00 AM - 5:00 PM' },
        { name: 'Mehrauli Archaeological Park', type: 'Archaeological Site', rating: 4.2, timings: '6:00 AM - 6:00 PM' }
      ],
      facilities: ['Parking', 'Cafeteria', 'Souvenir Shop', 'Guide Services'],
      transportation: ['Delhi Metro (Yellow Line)', 'Bus Routes: 501, 502'],
      tips: ['Perfect for history enthusiasts', 'Carry sun protection during summers']
    },
    {
      id: 'spiritual-zone',
      name: 'Spiritual Zone (South East)',
      type: 'spiritual',
      color: '#FFD700',
      description: 'Temples and spiritual centers',
      safetyRating: 4.7,
      crowdLevel: 'Medium',
      bestTime: 'Early Morning & Evening',
      avgDuration: '2-4 hours',
      coordinates: [
        [28.5400, 77.2400], [28.5650, 77.2450], [28.5700, 77.2700], 
        [28.5500, 77.2750], [28.5350, 77.2550], [28.5400, 77.2400]
      ],
      center: [28.5535, 77.2588],
      attractions: [
        { name: 'Lotus Temple', type: 'Bahai House of Worship', rating: 4.6, timings: '9:00 AM - 5:30 PM' },
        { name: 'ISKCON Temple', type: 'Hindu Temple', rating: 4.5, timings: '4:30 AM - 1:00 PM, 4:00 PM - 9:00 PM' }
      ],
      facilities: ['Meditation Halls', 'Parking', 'Shoe Storage', 'Pure Vegetarian Food'],
      transportation: ['Delhi Metro (Violet Line)', 'Bus Routes: 601, 602'],
      tips: ['Maintain silence in meditation areas', 'Remove shoes before entering temples']
    },
    {
      id: 'garden-zone',
      name: 'Garden & Nature Zone',
      type: 'nature',
      color: '#32CD32',
      description: 'Parks, gardens and natural spaces',
      safetyRating: 4.6,
      crowdLevel: 'Low-Medium',
      bestTime: 'Early Morning & Evening',
      avgDuration: '2-3 hours',
      coordinates: [
        [28.5750, 77.2050], [28.6050, 77.2100], [28.6100, 77.2400], 
        [28.5900, 77.2450], [28.5700, 77.2250], [28.5750, 77.2050]
      ],
      center: [28.5918, 77.2219],
      attractions: [
        { name: 'Lodhi Gardens', type: 'Historical Garden', rating: 4.5, timings: '6:00 AM - 8:00 PM' },
        { name: 'Humayuns Tomb', type: 'UNESCO World Heritage', rating: 4.4, timings: '6:00 AM - 6:00 PM' }
      ],
      facilities: ['Walking Trails', 'Exercise Equipment', 'Childrens Play Area', 'Cafeteria'],
      transportation: ['Delhi Metro (Violet Line)', 'Bus Routes: 701, 702'],
      tips: ['Perfect for morning jogs and yoga', 'Great for family picnics']
    }
  ];

  // Safety Zones Based on Real Delhi Safety Conditions
  const safetyZones = [
    {
      id: 'safe-zone-1',
      name: 'South Delhi Safe Zone',
      type: 'safe',
      color: '#00C851',
      description: 'Well-patrolled upscale residential and commercial areas with excellent safety record',
      safetyLevel: 'Very Safe',
      riskFactors: 'Minimal',
      policePresence: 'High',
      lightingQuality: 'Excellent',
      crimeStat: 'Very Low',
      recommendedTime: '24/7 Safe',
      coordinates: [
        [28.5400, 77.2000], [28.5700, 77.2100], [28.5800, 77.2400], 
        [28.5600, 77.2500], [28.5300, 77.2300], [28.5400, 77.2000]
      ],
      center: [28.5550, 77.2250],
      safetyFeatures: [
        'CCTV surveillance network',
        '24/7 police patrolling',
        'Well-lit streets and parks',
        'Emergency call boxes',
        'Tourist helpline available',
        'Hospital facilities nearby'
      ],
      emergencyContacts: [
        'Tourist Police: 1363',
        'Local Police Station: +91-11-2699-xxxx',
        'Medical Emergency: 102',
        'Fire Department: 101'
      ],
      tips: [
        'Ideal for solo travelers and families',
        'Safe for evening walks and outdoor activities',
        'Reliable transportation options available',
        'ATMs and banks easily accessible'
      ]
    },
    {
      id: 'moderate-zone-1',
      name: 'Central Delhi Moderate Zone',
      type: 'moderate',
      color: '#FFB347',
      description: 'Busy commercial area with moderate safety, requires normal precautions',
      safetyLevel: 'Moderately Safe',
      riskFactors: 'Low to Moderate',
      policePresence: 'Moderate',
      lightingQuality: 'Good',
      crimeStat: 'Low',
      recommendedTime: '6 AM - 10 PM',
      coordinates: [
        [28.6100, 77.2000], [28.6400, 77.2050], [28.6450, 77.2350], 
        [28.6200, 77.2400], [28.6050, 77.2200], [28.6100, 77.2000]
      ],
      center: [28.6225, 77.2175],
      safetyFeatures: [
        'Regular police patrols',
        'CCTV in main areas',
        'Tourist police posts',
        'Well-connected transport',
        'Emergency services access',
        'Local security guards'
      ],
      emergencyContacts: [
        'Tourist Police: 1363',
        'Local Police: 100',
        'Tourist Helpline: 1363',
        'Medical Emergency: 102'
      ],
      tips: [
        'Stay in well-lit main roads after dark',
        'Keep valuables secure',
        'Use official transportation',
        'Travel in groups when possible'
      ]
    },
    {
      id: 'crowdy-zone-1',
      name: 'Old Delhi Crowdy Zone',
      type: 'crowdy',
      color: '#FF8C00',
      description: 'Extremely crowded market areas with heavy foot traffic and congestion',
      safetyLevel: 'Safe but Congested',
      riskFactors: 'Pickpocketing, Getting Lost',
      policePresence: 'High',
      lightingQuality: 'Variable',
      crimeStat: 'Moderate (Mostly Petty Crimes)',
      recommendedTime: '9 AM - 7 PM',
      coordinates: [
        [28.6500, 77.2300], [28.6700, 77.2350], [28.6750, 77.2500], 
        [28.6600, 77.2550], [28.6450, 77.2400], [28.6500, 77.2300]
      ],
      center: [28.6575, 77.2425],
      safetyFeatures: [
        'Heavy police deployment',
        'Tourist police assistance',
        'CCTV monitoring',
        'Emergency response teams',
        'Medical aid stations',
        'Lost & found centers'
      ],
      emergencyContacts: [
        'Tourist Police: 1363',
        'Chandni Chowk Police: +91-11-2327-xxxx',
        'Emergency Services: 112',
        'Tourist Helpline: 1363'
      ],
      tips: [
        'Beware of pickpockets in crowds',
        'Keep important documents secure',
        'Stay hydrated and take breaks',
        'Follow local guides in narrow lanes',
        'Avoid carrying large amounts of cash'
      ]
    },
    {
      id: 'construction-zone-1',
      name: 'Metro Construction Zone',
      type: 'construction',
      color: '#FFFF00',
      description: 'Active construction areas with ongoing metro and infrastructure development',
      safetyLevel: 'Caution Required',
      riskFactors: 'Construction Hazards, Traffic Congestion',
      policePresence: 'Low',
      lightingQuality: 'Poor in Construction Areas',
      crimeStat: 'Low',
      recommendedTime: 'Avoid Peak Hours',
      coordinates: [
        [28.5800, 77.1800], [28.6000, 77.1850], [28.6050, 77.2000], 
        [28.5900, 77.2050], [28.5750, 77.1950], [28.5800, 77.1800]
      ],
      center: [28.5900, 77.1925],
      safetyFeatures: [
        'Construction safety barriers',
        'Warning signage in multiple languages',
        'Alternative route information',
        'Emergency contact numbers displayed',
        'Regular safety inspections',
        'Traffic management systems'
      ],
      emergencyContacts: [
        'DMRC Helpline: 155370',
        'Traffic Police: 1095',
        'Emergency Services: 112',
        'Construction Safety: +91-11-2xxx-xxxx'
      ],
      tips: [
        'Follow designated pathways',
        'Wear sturdy footwear',
        'Avoid construction areas during rain',
        'Use alternative routes when possible',
        'Keep emergency contacts handy'
      ]
    },
    {
      id: 'risky-zone-1',
      name: 'High Alert Zone',
      type: 'risky',
      color: '#FF1744',
      description: 'Areas requiring extra caution due to higher crime rates or safety concerns',
      safetyLevel: 'Exercise Extreme Caution',
      riskFactors: 'Higher Crime Rate, Poor Lighting',
      policePresence: 'Moderate',
      lightingQuality: 'Poor',
      crimeStat: 'Moderate to High',
      recommendedTime: 'Daylight Hours Only (9 AM - 6 PM)',
      coordinates: [
        [28.6800, 77.2100], [28.7000, 77.2150], [28.7050, 77.2350], 
        [28.6900, 77.2400], [28.6750, 77.2250], [28.6800, 77.2100]
      ],
      center: [28.6925, 77.2275],
      safetyFeatures: [
        'Increased police patrols',
        'Tourist advisory notices',
        'Emergency panic buttons',
        'Escort services available',
        'Safe house locations',
        '24/7 monitoring systems'
      ],
      emergencyContacts: [
        'Emergency Services: 112',
        'Women Helpline: 1091',
        'Tourist SOS: 1363',
        'Local Police: 100'
      ],
      tips: [
        'Travel only during daylight',
        'Never travel alone',
        'Inform someone about your location',
        'Avoid displaying expensive items',
        'Use only registered transportation',
        'Stay on main roads and avoid shortcuts'
      ]
    },
    {
      id: 'safe-zone-2',
      name: 'Diplomatic Enclave Safe Zone',
      type: 'safe',
      color: '#00C851',
      description: 'Diplomatic area with maximum security and safety protocols',
      safetyLevel: 'Maximum Security',
      riskFactors: 'Minimal',
      policePresence: 'Very High',
      lightingQuality: 'Excellent',
      crimeStat: 'Nearly Zero',
      recommendedTime: '24/7 Safe with Restrictions',
      coordinates: [
        [28.5950, 77.1900], [28.6100, 77.1950], [28.6150, 77.2100], 
        [28.6000, 77.2150], [28.5900, 77.2000], [28.5950, 77.1900]
      ],
      center: [28.6025, 77.2025],
      safetyFeatures: [
        'Multi-tier security system',
        '24/7 armed security',
        'Advanced CCTV network',
        'Restricted access zones',
        'Emergency medical facilities',
        'International standard safety protocols'
      ],
      emergencyContacts: [
        'Security Control: +91-11-2xxx-xxxx',
        'Embassy Security: +91-11-2xxx-xxxx',
        'Emergency Services: 112',
        'Tourist Police: 1363'
      ],
      tips: [
        'Carry valid identification',
        'Follow security protocols strictly',
        'Photography restrictions apply',
        'Ideal for business travelers',
        'Premium healthcare facilities available'
      ]
    }
  ];

  // Initialize map
  useEffect(() => {
    if (!mapInstance.current && mapRef.current) {
      mapInstance.current = L.map(mapRef.current, {
        center: [28.6139, 77.2090],
        zoom: 11,
        minZoom: 9,
        maxZoom: 16,
        zoomControl: true,
        scrollWheelZoom: true,
        attributionControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Delhi Tourist Zone Map',
        maxZoom: 18
      }).addTo(mapInstance.current);

      zonesLayer.current = L.layerGroup().addTo(mapInstance.current);
      markersGroup.current = L.layerGroup().addTo(mapInstance.current);

      // Fit bounds first
      const zones = viewType === 'attraction' ? touristZones : safetyZones;
      const group = new L.featureGroup();
      zones.forEach(zone => {
        const polygon = L.polygon(zone.coordinates);
        group.addLayer(polygon);
      });
      mapInstance.current.fitBounds(group.getBounds(), { padding: [20, 20] });

      // Add zones and markers with delay
      setTimeout(() => {
        if (mapInstance.current) {
          mapInstance.current.invalidateSize();
          addZones();
          if (showAttractions && viewType === 'attraction') {
            addAttractionMarkers();
          }
        }
      }, 100);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Force resize when container changes
  useEffect(() => {
    const handleResize = () => {
      if (mapInstance.current) {
        setTimeout(() => {
          mapInstance.current.invalidateSize();
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update when filters or view type changes
  useEffect(() => {
    if (zonesLayer.current) {
      zonesLayer.current.clearLayers();
      addZones();
    }
    if (markersGroup.current) {
      markersGroup.current.clearLayers();
      if (showAttractions && viewType === 'attraction') {
        addAttractionMarkers();
      }
    }
  }, [activeFilter, viewType, showAttractions]);

  // Force resize on UI changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstance.current) {
        mapInstance.current.invalidateSize();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [showLegend, selectedZone]);

  // Add zones based on current view type
  const addZones = () => {
    if (!zonesLayer.current) return;

    const zones = viewType === 'attraction' ? touristZones : safetyZones;
    const filteredZones = activeFilter === 'all' ? zones : zones.filter(zone => zone.type === activeFilter);

    filteredZones.forEach(zone => {
      const polygon = L.polygon(zone.coordinates, {
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: viewType === 'safety' ? 0.5 : 0.4,
        weight: viewType === 'safety' ? 4 : 3,
        opacity: 0.8,
        interactive: true
      });

      polygon.on('mouseover', function(e) {
        this.setStyle({
          fillOpacity: viewType === 'safety' ? 0.7 : 0.6,
          weight: viewType === 'safety' ? 5 : 4
        });
      });

      polygon.on('mouseout', function(e) {
        this.setStyle({
          fillOpacity: viewType === 'safety' ? 0.5 : 0.4,
          weight: viewType === 'safety' ? 4 : 3
        });
      });

      polygon.on('click', function(e) {
        setSelectedZone(zone);
        mapInstance.current.fitBounds(polygon.getBounds(), { padding: [20, 20] });
      });

      const popupContent = viewType === 'safety' ? createSafetyPopup(zone) : createAttractionPopup(zone);

      polygon.bindPopup(popupContent, {
        maxWidth: 400,
        className: viewType === 'safety' ? 'custom-safety-popup' : 'custom-zone-popup'
      });

      zonesLayer.current.addLayer(polygon);
    });

    window.viewZoneDetails = (zoneId) => {
      const zones = viewType === 'attraction' ? touristZones : safetyZones;
      const zone = zones.find(z => z.id === zoneId);
      if (zone) {
        setSelectedZone(zone);
        mapInstance.current.closePopup();
      }
    };
  };

  // Create safety zone popup content
  const createSafetyPopup = (zone) => {
    const safetyIcon = {
      safe: '🛡️',
      moderate: '⚠️',
      crowdy: '👥',
      construction: '🚧',
      risky: '🚨'
    };

    return `
      <div class="safety-popup-content">
        <div class="popup-header" style="background: ${zone.color}">
          <h3>${safetyIcon[zone.type]} ${zone.name}</h3>
          <span class="safety-level">${zone.safetyLevel}</span>
        </div>
        <div class="popup-body">
          <p class="zone-description">${zone.description}</p>
          
          <div class="safety-metrics">
            <div class="metric">
              <span class="metric-icon">🚔</span>
              <span class="metric-label">Police:</span>
              <span class="metric-value">${zone.policePresence}</span>
            </div>
            <div class="metric">
              <span class="metric-icon">💡</span>
              <span class="metric-label">Lighting:</span>
              <span class="metric-value">${zone.lightingQuality}</span>
            </div>
            <div class="metric">
              <span class="metric-icon">📊</span>
              <span class="metric-label">Crime Rate:</span>
              <span class="metric-value">${zone.crimeStat}</span>
            </div>
            <div class="metric">
              <span class="metric-icon">🕐</span>
              <span class="metric-label">Safe Hours:</span>
              <span class="metric-value">${zone.recommendedTime}</span>
            </div>
          </div>
          
          <div class="risk-factors">
            <h4>⚠️ Risk Factors:</h4>
            <p>${zone.riskFactors}</p>
          </div>
          
          <div class="popup-actions">
            <button class="detail-btn safety" onclick="window.viewZoneDetails('${zone.id}')">
              🛡️ View Safety Details
            </button>
          </div>
        </div>
      </div>
    `;
  };

  // Create attraction zone popup content  
  const createAttractionPopup = (zone) => {
    return `
      <div class="zone-popup-content">
        <div class="popup-header" style="background: ${zone.color}">
          <h3>${zone.name}</h3>
          <span class="zone-type">${zone.type.charAt(0).toUpperCase() + zone.type.slice(1)}</span>
        </div>
        <div class="popup-body">
          <p class="zone-description">${zone.description}</p>
          
          <div class="zone-metrics">
            <div class="metric">
              <span class="metric-icon">🛡️</span>
              <span class="metric-label">Safety:</span>
              <span class="metric-value">${zone.safetyRating}/5</span>
            </div>
            <div class="metric">
              <span class="metric-icon">👥</span>
              <span class="metric-label">Crowd:</span>
              <span class="metric-value">${zone.crowdLevel}</span>
            </div>
          </div>
          
          <div class="top-attractions">
            <h4>🎯 Top Attractions:</h4>
            <ul>
              ${zone.attractions.slice(0, 3).map(attraction => 
                `<li><strong>${attraction.name}</strong> (${attraction.rating}⭐)</li>`
              ).join('')}
            </ul>
          </div>
          
          <div class="popup-actions">
            <button class="detail-btn" onclick="window.viewZoneDetails('${zone.id}')">
              📋 View Full Details
            </button>
          </div>
        </div>
      </div>
    `;
  };

  // Add attraction markers (only for attraction view)
  const addAttractionMarkers = () => {
    if (!markersGroup.current || viewType !== 'attraction') return;
    
    markersGroup.current.clearLayers();
    
    const filteredZones = activeFilter === 'all' ? touristZones : touristZones.filter(zone => zone.type === activeFilter);
    
    filteredZones.forEach(zone => {
      zone.attractions.forEach((attraction, index) => {
        const center = zone.center;
        const offsetLat = (Math.random() - 0.5) * 0.008;
        const offsetLng = (Math.random() - 0.5) * 0.008;
        
        const marker = L.marker([center[0] + offsetLat, center[1] + offsetLng], {
          title: attraction.name
        });

        const markerPopup = `
          <div class="attraction-popup">
            <h4>${attraction.name}</h4>
            <p><strong>Type:</strong> ${attraction.type}</p>
            <p><strong>Rating:</strong> ${attraction.rating}⭐</p>
            <p><strong>Timings:</strong> ${attraction.timings}</p>
            <p><strong>Zone:</strong> ${zone.name}</p>
          </div>
        `;

        marker.bindPopup(markerPopup, {
          className: 'attraction-popup-wrapper'
        });

        markersGroup.current.addLayer(marker);
      });
    });
  };

  // Filter zones by type
  const filterZones = (type) => {
    setActiveFilter(type);
  };

  // Get filtered zones for legend
  const getFilteredZones = () => {
    const zones = viewType === 'attraction' ? touristZones : safetyZones;
    return activeFilter === 'all' ? zones : zones.filter(zone => zone.type === activeFilter);
  };

  // Get filter options based on view type
  const getFilterOptions = () => {
    if (viewType === 'attraction') {
      return [
        { value: 'all', label: '🌍 All Zones', icon: '🌍' },
        { value: 'heritage', label: '🏛️ Heritage', icon: '🏛️' },
        { value: 'modern', label: '🏙️ Modern', icon: '🏙️' },
        { value: 'spiritual', label: '🕉️ Spiritual', icon: '🕉️' },
        { value: 'nature', label: '🌳 Nature', icon: '🌳' }
      ];
    } else {
      return [
        { value: 'all', label: '🌍 All Safety Zones', icon: '🌍' },
        { value: 'safe', label: '🛡️ Safe Areas', icon: '🛡️' },
        { value: 'moderate', label: '⚠️ Moderate Areas', icon: '⚠️' },
        { value: 'crowdy', label: '👥 Crowded Areas', icon: '👥' },
        { value: 'construction', label: '🚧 Construction Zones', icon: '🚧' },
        { value: 'risky', label: '🚨 High Alert Areas', icon: '🚨' }
      ];
    }
  };

  const filterOptions = getFilterOptions();

  return (
    <div className="tourist-map-container">
      {/* Header Controls */}
      <div className="map-header">
        <div className="header-content">
          <div className="title-section">
            <h2>🗺️ Delhi Tourist Zone Explorer</h2>
            <p>Discover Delhi's attractions and safety information with interactive maps</p>
          </div>
          
          <div className="map-controls">
            <div className="view-type-controls">
              <label>Map Type:</label>
              <div className="view-type-buttons">
                <button 
                  className={`view-type-btn ${viewType === 'attraction' ? 'active' : ''}`}
                  onClick={() => setViewType('attraction')}
                >
                  <span className="btn-icon">🎯</span>
                  <span className="btn-text">Tourist Attractions</span>
                </button>
                <button 
                  className={`view-type-btn ${viewType === 'safety' ? 'active' : ''}`}
                  onClick={() => setViewType('safety')}
                >
                  <span className="btn-icon">🛡️</span>
                  <span className="btn-text">Safety Zones</span>
                </button>
              </div>
            </div>
            
            <div className="filter-controls">
              <label>Filter:</label>
              <select 
                value={activeFilter} 
                onChange={(e) => filterZones(e.target.value)}
                className="zone-filter"
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="toggle-controls">
              <button 
                className={`toggle-btn ${showLegend ? 'active' : ''}`}
                onClick={() => setShowLegend(!showLegend)}
              >
                📋 Legend
              </button>
              {viewType === 'attraction' && (
                <button 
                  className={`toggle-btn ${showAttractions ? 'active' : ''}`}
                  onClick={() => setShowAttractions(!showAttractions)}
                >
                  📍 Attractions
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="map-content">
        {/* Map Container */}
        <div className="map-container">
          <div 
            ref={mapRef} 
            className="leaflet-zone-map"
            style={{ height: '100%', width: '100%', minHeight: '600px' }}
          />
          
          {/* Zone Legend Overlay */}
          {showLegend && (
            <div className={`zone-legend ${viewType === 'safety' ? 'safety-legend' : ''}`}>
              <div className="legend-header">
                <h4>
                  {viewType === 'safety' ? '🛡️ Safety Guide' : '🎯 Zone Guide'}
                </h4>
                <p>
                  {viewType === 'safety' 
                    ? 'Safety levels and risk information for different areas'
                    : 'Click on colored zones to explore attractions'
                  }
                </p>
              </div>
              <div className="legend-zones">
                {getFilteredZones().map((zone, index) => (
                  <div 
                    key={zone.id} 
                    className={`legend-zone-item ${viewType === 'safety' ? 'safety-item' : ''}`}
                    onClick={() => {
                      const polygon = L.polygon(zone.coordinates);
                      mapInstance.current.fitBounds(polygon.getBounds(), { padding: [20, 20] });
                      setSelectedZone(zone);
                    }}
                  >
                    <div 
                      className="zone-color-indicator" 
                      style={{ backgroundColor: zone.color }}
                    ></div>
                    <div className="zone-info">
                      <span className="zone-name">{zone.name}</span>
                      {viewType === 'safety' ? (
                        <>
                          <span className="safety-level">{zone.safetyLevel}</span>
                          <span className="recommended-time">{zone.recommendedTime}</span>
                        </>
                      ) : (
                        <>
                          <span className="zone-attractions">{zone.attractions.length} attractions</span>
                          <span className="zone-rating">🛡️ {zone.safetyRating}/5</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="legend-footer">
                <small>💡 Click zones on map or legend items</small>
              </div>
            </div>
          )}
        </div>

        {/* Zone Details Panel */}
        <div className="zone-details-panel">
          {selectedZone ? (
            <div className="zone-details-content">
              <div className="zone-details-header" style={{ backgroundColor: selectedZone.color }}>
                <h3>{selectedZone.name}</h3>
                <button 
                  className="close-details-btn"
                  onClick={() => setSelectedZone(null)}
                >
                  ✖
                </button>
              </div>
              
              <div className="zone-details-body">
                {viewType === 'safety' ? (
                  // Safety Zone Details
                  <>
                    <div className="safety-overview">
                      <p className="zone-description">{selectedZone.description}</p>
                      
                      <div className="safety-metrics-grid">
                        <div className="metric-card safety">
                          <span className="metric-icon">🛡️</span>
                          <div className="metric-content">
                            <span className="metric-value">{selectedZone.safetyLevel}</span>
                            <span className="metric-label">Safety Level</span>
                          </div>
                        </div>
                        <div className="metric-card police">
                          <span className="metric-icon">🚔</span>
                          <div className="metric-content">
                            <span className="metric-value">{selectedZone.policePresence}</span>
                            <span className="metric-label">Police Presence</span>
                          </div>
                        </div>
                        <div className="metric-card lighting">
                          <span className="metric-icon">💡</span>
                          <div className="metric-content">
                            <span className="metric-value">{selectedZone.lightingQuality}</span>
                            <span className="metric-label">Street Lighting</span>
                          </div>
                        </div>
                        <div className="metric-card crime">
                          <span className="metric-icon">📊</span>
                          <div className="metric-content">
                            <span className="metric-value">{selectedZone.crimeStat}</span>
                            <span className="metric-label">Crime Statistics</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="risk-section">
                      <h4>⚠️ Risk Factors</h4>
                      <p className="risk-description">{selectedZone.riskFactors}</p>
                      <div className="recommended-time-badge">
                        <span className="time-icon">🕐</span>
                        <span className="time-text">Recommended Time: {selectedZone.recommendedTime}</span>
                      </div>
                    </div>
                    
                    <div className="safety-features-section">
                      <h4>🛡️ Safety Features</h4>
                      <div className="features-list">
                        {selectedZone.safetyFeatures.map((feature, index) => (
                          <div key={index} className="feature-item">
                            <span className="feature-bullet">✓</span>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="emergency-contacts-section">
                      <h4>🚨 Emergency Contacts</h4>
                      <div className="emergency-list">
                        {selectedZone.emergencyContacts.map((contact, index) => (
                          <div key={index} className="emergency-item">
                            <span className="emergency-icon">📞</span>
                            <span className="emergency-text">{contact}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="safety-tips-section">
                      <h4>💡 Safety Tips</h4>
                      <div className="tips-list">
                        {selectedZone.tips.map((tip, index) => (
                          <div key={index} className="tip-item safety-tip">
                            <span className="tip-bullet">•</span>
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  // Attraction Zone Details
                  <>
                    <div className="zone-overview">
                      <p className="zone-description">{selectedZone.description}</p>
                      
                      <div className="zone-metrics-grid">
                        <div className="metric-card">
                          <span className="metric-icon">🛡️</span>
                          <div className="metric-content">
                            <span className="metric-value">{selectedZone.safetyRating}/5</span>
                            <span className="metric-label">Safety Rating</span>
                          </div>
                        </div>
                        <div className="metric-card">
                          <span className="metric-icon">👥</span>
                          <div className="metric-content">
                            <span className="metric-value">{selectedZone.crowdLevel}</span>
                            <span className="metric-label">Crowd Level</span>
                          </div>
                        </div>
                        <div className="metric-card">
                          <span className="metric-icon">⏰</span>
                          <div className="metric-content">
                            <span className="metric-value">{selectedZone.bestTime}</span>
                            <span className="metric-label">Best Time</span>
                          </div>
                        </div>
                        <div className="metric-card">
                          <span className="metric-icon">🕐</span>
                          <div className="metric-content">
                            <span className="metric-value">{selectedZone.avgDuration}</span>
                            <span className="metric-label">Average Duration</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="attractions-section">
                      <h4>🎯 Top Attractions</h4>
                      <div className="attractions-list">
                        {selectedZone.attractions.map((attraction, index) => (
                          <div key={index} className="attraction-item">
                            <div className="attraction-main">
                              <h5>{attraction.name}</h5>
                              <span className="attraction-rating">{attraction.rating}⭐</span>
                            </div>
                            <p className="attraction-type">{attraction.type}</p>
                            <p className="attraction-timings">🕐 {attraction.timings}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="facilities-section">
                      <h4>🏢 Facilities Available</h4>
                      <div className="facilities-tags">
                        {selectedZone.facilities.map((facility, index) => (
                          <span key={index} className="facility-tag">{facility}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="transportation-section">
                      <h4>🚇 How to Reach</h4>
                      <div className="transportation-list">
                        {selectedZone.transportation.map((transport, index) => (
                          <div key={index} className="transport-item">
                            {transport}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="tips-section">
                      <h4>💡 Tourist Tips</h4>
                      <div className="tips-list">
                        {selectedZone.tips.map((tip, index) => (
                          <div key={index} className="tip-item">
                            <span className="tip-bullet">•</span>
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="no-zone-selected">
              <div className="no-zone-icon">
                {viewType === 'safety' ? '🛡️' : '🗺️'}
              </div>
              <h3>
                {viewType === 'safety' 
                  ? 'Explore Delhi\'s Safety Zones' 
                  : 'Explore Delhi\'s Tourist Zones'
                }
              </h3>
              <p>
                {viewType === 'safety' 
                  ? 'Click on any colored zone to view detailed safety information, risk factors, and emergency contacts for that area.'
                  : 'Click on any colored zone on the map to discover attractions, facilities, and travel tips for that area.'
                }
              </p>
              
              {/* Scrollable Zone Types Container */}
              <div className="zone-types-scroll-container">
                {viewType === 'safety' ? (
                  <div className="zone-types-grid safety-grid">
                    <div className="zone-type-card safe" onClick={() => filterZones('safe')}>
                      <span className="zone-type-icon">🛡️</span>
                      <span className="zone-type-name">Safe Areas</span>
                      <span className="zone-type-desc">Well-patrolled zones</span>
                    </div>
                    <div className="zone-type-card moderate" onClick={() => filterZones('moderate')}>
                      <span className="zone-type-icon">⚠️</span>
                      <span className="zone-type-name">Moderate</span>
                      <span className="zone-type-desc">Normal precautions</span>
                    </div>
                    <div className="zone-type-card crowdy" onClick={() => filterZones('crowdy')}>
                      <span className="zone-type-icon">👥</span>
                      <span className="zone-type-name">Crowded</span>
                      <span className="zone-type-desc">High foot traffic</span>
                    </div>
                    <div className="zone-type-card construction" onClick={() => filterZones('construction')}>
                      <span className="zone-type-icon">🚧</span>
                      <span className="zone-type-name">Construction</span>
                      <span className="zone-type-desc">Development areas</span>
                    </div>
                    <div className="zone-type-card risky" onClick={() => filterZones('risky')}>
                      <span className="zone-type-icon">🚨</span>
                      <span className="zone-type-name">High Alert</span>
                      <span className="zone-type-desc">Extra caution needed</span>
                    </div>
                  </div>
                ) : (
                  <div className="zone-types-grid attraction-grid">
                    <div className="zone-type-card heritage" onClick={() => filterZones('heritage')}>
                      <span className="zone-type-icon">🏛️</span>
                      <span className="zone-type-name">Heritage</span>
                      <span className="zone-type-desc">Historical sites</span>
                    </div>
                    <div className="zone-type-card modern" onClick={() => filterZones('modern')}>
                      <span className="zone-type-icon">🏙️</span>
                      <span className="zone-type-name">Modern</span>
                      <span className="zone-type-desc">Contemporary areas</span>
                    </div>
                    <div className="zone-type-card spiritual" onClick={() => filterZones('spiritual')}>
                      <span className="zone-type-icon">🕉️</span>
                      <span className="zone-type-name">Spiritual</span>
                      <span className="zone-type-desc">Religious places</span>
                    </div>
                    <div className="zone-type-card nature" onClick={() => filterZones('nature')}>
                      <span className="zone-type-icon">🌳</span>
                      <span className="zone-type-name">Nature</span>
                      <span className="zone-type-desc">Parks & gardens</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Map;
