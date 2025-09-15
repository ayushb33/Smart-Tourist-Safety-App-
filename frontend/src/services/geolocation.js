// Geolocation Service for Tourist Safety System
class GeolocationService {
  constructor() {
    this.watchId = null;
    this.currentPosition = null;
    this.options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // 1 minute
    };
  }

  // Get current position
  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date()
          };
          resolve(this.currentPosition);
        },
        (error) => {
          reject(this.handleLocationError(error));
        },
        this.options
      );
    });
  }

  // Start watching position
  startWatching(callback, errorCallback) {
    if (!navigator.geolocation) {
      errorCallback(new Error('Geolocation is not supported'));
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date()
        };
        callback(this.currentPosition);
      },
      (error) => {
        errorCallback(this.handleLocationError(error));
      },
      this.options
    );

    return this.watchId;
  }

  // Stop watching position
  stopWatching() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Handle location errors
  handleLocationError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return new Error('Location access denied by user');
      case error.POSITION_UNAVAILABLE:
        return new Error('Location information unavailable');
      case error.TIMEOUT:
        return new Error('Location request timed out');
      default:
        return new Error('An unknown location error occurred');
    }
  }

  // Calculate distance between two points (Haversine formula)
  calculateDistance(pos1, pos2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(pos2.lat - pos1.lat);
    const dLng = this.toRadians(pos2.lng - pos1.lng);

    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(pos1.lat)) * Math.cos(this.toRadians(pos2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance; // Distance in kilometers
  }

  // Convert degrees to radians
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Check if point is within a polygon (safety zone)
  isPointInPolygon(point, polygon) {
    let inside = false;
    const x = point.lat;
    const y = point.lng;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0];
      const yi = polygon[i][1];
      const xj = polygon[j][0];
      const yj = polygon[j][1];

      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }

    return inside;
  }

  // Get nearest safety zone
  getNearestSafetyZone(position, safetyZones) {
    let nearestZone = null;
    let minDistance = Infinity;

    safetyZones.forEach(zone => {
      // Calculate distance to zone center
      const zoneCenter = this.calculatePolygonCenter(zone.coordinates);
      const distance = this.calculateDistance(position, zoneCenter);

      if (distance < minDistance) {
        minDistance = distance;
        nearestZone = {
          ...zone,
          distance: distance,
          isInside: this.isPointInPolygon(position, zone.coordinates)
        };
      }
    });

    return nearestZone;
  }

  // Calculate polygon center (centroid)
  calculatePolygonCenter(coordinates) {
    let lat = 0;
    let lng = 0;

    coordinates.forEach(coord => {
      lat += coord[0];
      lng += coord[1];
    });

    return {
      lat: lat / coordinates.length,
      lng: lng / coordinates.length
    };
  }

  // Format coordinates for display
  formatCoordinates(position, precision = 6) {
    if (!position || !position.lat || !position.lng) {
      return 'Unknown location';
    }

    return `${position.lat.toFixed(precision)}, ${position.lng.toFixed(precision)}`;
  }

  // Get location permissions status
  async getPermissionStatus() {
    if (!navigator.permissions) {
      return 'unknown';
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state; // 'granted', 'denied', or 'prompt'
    } catch (error) {
      return 'unknown';
    }
  }

  // Request location permissions
  async requestPermission() {
    const status = await this.getPermissionStatus();

    if (status === 'granted') {
      return true;
    } else if (status === 'denied') {
      return false;
    } else {
      // Try to get location to trigger permission prompt
      try {
        await this.getCurrentPosition();
        return true;
      } catch (error) {
        return false;
      }
    }
  }

  // Get address from coordinates (reverse geocoding simulation)
  async getAddressFromCoordinates(lat, lng) {
    // In a real app, you would use a geocoding service like Google Maps or OpenStreetMap
    // For demo purposes, return a simulated address

    // Famous locations in Delhi for demo
    const delhiLocations = [
      { lat: 28.6139, lng: 77.2090, address: 'India Gate, New Delhi' },
      { lat: 28.6507, lng: 77.2334, address: 'Red Fort, Old Delhi' },
      { lat: 28.5245, lng: 77.1855, address: 'Qutub Minar, Mehrauli' },
      { lat: 28.6562, lng: 77.2410, address: 'Jama Masjid, Old Delhi' },
      { lat: 28.6127, lng: 77.2773, address: 'Lotus Temple, Kalkaji' }
    ];

    // Find closest known location
    let closestLocation = delhiLocations[0];
    let minDistance = this.calculateDistance({ lat, lng }, { lat: closestLocation.lat, lng: closestLocation.lng });

    delhiLocations.forEach(location => {
      const distance = this.calculateDistance({ lat, lng }, { lat: location.lat, lng: location.lng });
      if (distance < minDistance) {
        minDistance = distance;
        closestLocation = location;
      }
    });

    // If very close to a known location, return that address
    if (minDistance < 0.5) { // Within 500 meters
      return closestLocation.address;
    }

    // Otherwise return generic address
    return `Near ${closestLocation.address}`;
  }

  // Check if location services are available
  isLocationServiceAvailable() {
    return 'geolocation' in navigator;
  }

  // Get current position with enhanced error handling
  async getEnhancedPosition() {
    try {
      const position = await this.getCurrentPosition();
      const address = await this.getAddressFromCoordinates(position.lat, position.lng);

      return {
        ...position,
        address,
        formatted: this.formatCoordinates(position)
      };
    } catch (error) {
      throw error;
    }
  }

  // Start background location tracking for safety monitoring
  startSafetyTracking(callback, safetyZones) {
    return this.startWatching(
      (position) => {
        const nearestZone = this.getNearestSafetyZone(position, safetyZones);
        callback({
          position,
          nearestZone,
          timestamp: new Date()
        });
      },
      (error) => {
        console.error('Safety tracking error:', error);
        callback({ error: error.message });
      }
    );
  }
}

export const geolocationService = new GeolocationService();
export default geolocationService;