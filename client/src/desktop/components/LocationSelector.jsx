import { useState, useEffect, useRef } from "react";
import { Navigation } from "lucide-react";

export default function LocationSelector({ 
  coordinates, 
  onCoordinatesChange, 
  location, 
  onLocationChange,
  required = false 
}) {
  const [map, setMap] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isSettingLocation, setIsSettingLocation] = useState(false);
  const [marker, setMarker] = useState(null);
  const mapRef = useRef(null);

  // Initialize Google Maps
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsMapLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAPS_API
      }&v=beta`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsMapLoaded(true);
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize map when component mounts and map is loaded
  useEffect(() => {
    if (isMapLoaded && mapRef.current && !map) {
      initializeMap();
    }
  }, [isMapLoaded]);

  // Cleanup marker when component unmounts
  useEffect(() => {
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  const initializeMap = () => {
    const defaultLocation = { lat: 28.6139, lng: 77.2090 }; // Default to Delhi
    
    const googleMap = new window.google.maps.Map(mapRef.current, {
      center: coordinates.lat && coordinates.lng ? coordinates : defaultLocation,
      zoom: 15,
      disableDefaultUI: true,
      gestureHandling: 'greedy',
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      clickableIcons: false,
      mapTypeId: 'roadmap',
      mapId: import.meta.env.VITE_GOOGLE_MAPS_ID,
      colorScheme: window.google?.maps?.ColorScheme?.DARK
    });

    setMap(googleMap);

    // If no coordinates provided, try to get user's current location
    if (!coordinates.lat && !coordinates.lng) {
      getCurrentLocation(googleMap);
    } else {
      // If coordinates exist, add marker immediately
      createOrUpdateMarker(coordinates, googleMap);
    }

    // Add click listener for map
    googleMap.addListener('click', (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      handleLocationSelect({ lat, lng }, googleMap);
    });
  };

  const createOrUpdateMarker = (coords, googleMap = map) => {
    // Remove existing marker if it exists
    if (marker) {
      marker.setMap(null);
    }

    // Create new marker
    const newMarker = new window.google.maps.Marker({
      position: coords,
      map: googleMap,
      title: 'Selected Location',
      animation: window.google.maps.Animation.DROP,
      icon: {
        url: 'data:image/svg+xml;base64,' + btoa(`
          <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12z" fill="#EF4444"/>
            <circle cx="12" cy="12" r="6" fill="white"/>
            <circle cx="12" cy="12" r="3" fill="#EF4444"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(24, 32),
        anchor: new window.google.maps.Point(12, 32)
      }
    });

    setMarker(newMarker);
  };

  const getCurrentLocation = (googleMap) => {
    setIsSettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          googleMap.setCenter(userLocation);
          googleMap.setZoom(15);
          
          handleLocationSelect(userLocation, googleMap);
          setIsSettingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsSettingLocation(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setIsSettingLocation(false);
    }
  };

  const handleLocationSelect = (coords, googleMap = map) => {
    // Update coordinates
    onCoordinatesChange(coords);
    
    // Create or update marker at selected location
    createOrUpdateMarker(coords, googleMap);
    
    // Get address from coordinates using reverse geocoding
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: coords }, (results, status) => {
      if (status === 'OK' && results[0]) {
        parseAddress(results[0]);
      }
    });
  };

  const parseAddress = (result) => {
    const components = result.address_components;
    const newLocation = {
      street: "",
      locality: "",
      city: "",
      district: "",
      state: "",
      country: ""
    };

    components.forEach(component => {
      const types = component.types;
      
      if (types.includes('street_number') || types.includes('route')) {
        newLocation.street += component.long_name + ' ';
      } else if (types.includes('sublocality') || types.includes('neighborhood')) {
        newLocation.locality = component.long_name;
      } else if (types.includes('locality') || types.includes('administrative_area_level_2')) {
        newLocation.city = component.long_name;
      } else if (types.includes('administrative_area_level_3')) {
        newLocation.district = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        newLocation.state = component.long_name;
      } else if (types.includes('country')) {
        newLocation.country = component.long_name;
      }
    });

    newLocation.street = newLocation.street.trim();
    onLocationChange(newLocation);
  };

  const handleLocationFieldChange = (field, value) => {
    onLocationChange({
      ...location,
      [field]: value
    });
  };

  // Prevent form submission when Enter is pressed in input fields
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div>
      <label className="block text-white font-medium mb-2">
        Location {required && <span className="text-red-400">*</span>}
      </label>
      
      {/* Map */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-sm">Click on map to select location</span>
          <button
            type="button"
            onClick={() => getCurrentLocation(map)}
            disabled={isSettingLocation}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            <Navigation size={16} />
            <span>{isSettingLocation ? 'Getting...' : 'Use Current'}</span>
          </button>
        </div>
        
        {isMapLoaded ? (
          <div 
            ref={mapRef}
            className="w-full h-64 bg-gray-800 rounded-lg border border-gray-700"
          />
        ) : (
          <div className="w-full h-64 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center">
            <span className="text-gray-400">Loading map...</span>
          </div>
        )}
        
        {coordinates.lat && coordinates.lng && (
          <p className="text-sm text-green-400 mt-2">
            📍 Location selected: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
          </p>
        )}
      </div>

      {/* Address Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 text-sm mb-1">Street/Colony/Area</label>
          <input
            type="text"
            value={location.street}
            onChange={(e) => handleLocationFieldChange('street', e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Locality/Landmark</label>
          <input
            type="text"
            value={location.locality}
            onChange={(e) => handleLocationFieldChange('locality', e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">City</label>
          <input
            type="text"
            value={location.city}
            onChange={(e) => handleLocationFieldChange('city', e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">District</label>
          <input
            type="text"
            value={location.district}
            onChange={(e) => handleLocationFieldChange('district', e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">State</label>
          <input
            type="text"
            value={location.state}
            onChange={(e) => handleLocationFieldChange('state', e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Country</label>
          <input
            type="text"
            value={location.country}
            onChange={(e) => handleLocationFieldChange('country', e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
