import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import { MapPin, Navigation, Locate, Search } from "lucide-react";

const Map = () => {
  const mapRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const loadMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 28.6139, lng: 77.209 }, // Example: New Delhi
        zoom: 12,
        styles: [
          {
            "featureType": "all",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#1a1a1a"}]
          },
          {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#ffffff"}]
          },
          {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [{"color": "#000000"}, {"lightness": 13}]
          },
          {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#2a2a2a"}]
          },
          {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#0f4c75"}]
          }
        ]
      });
      setIsMapLoaded(true);
    };

    // If Google Maps is already loaded
    if (window.google && window.google.maps) {
      loadMap();
    } else {
      // Create script element
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAPS_API
      }`;
      script.async = true;
      script.defer = true;
      script.onload = loadMap;
      document.body.appendChild(script);
    }
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(pos);
          if (mapRef.current && window.google) {
            const map = new window.google.maps.Map(mapRef.current, {
              center: pos,
              zoom: 15,
            });
            new window.google.maps.Marker({
              position: pos,
              map: map,
              title: "Your Location"
            });
          }
        },
        () => {
          console.log("Error: The Geolocation service failed.");
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto bg-black">
          {/* Map Header */}
          <div className="p-6 border-b border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-800 rounded-lg">
                  <MapPin className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Explore Map</h1>
                  <p className="text-gray-400">Discover places and locations</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={getUserLocation}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Locate size={18} />
                  My Location
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors">
                  <Navigation size={18} />
                  Directions
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search locations, places..."
              />
            </div>
            
            {/* Quick Filters */}
            <div className="flex gap-2 flex-wrap">
              {['Restaurants', 'Gas Stations', 'Hotels', 'Attractions', 'Shopping'].map((filter) => (
                <button
                  key={filter}
                  className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-gray-300 hover:text-white rounded-full text-sm transition-colors"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 relative">
            {!isMapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading map...</p>
                </div>
              </div>
            )}
            <div
              ref={mapRef}
              className="w-full h-full min-h-[calc(100vh-200px)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
