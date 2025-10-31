import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { spots, getCategoryColor, type Spot } from '@/data/spots';
import FilterBar from './FilterBar';
import SpotDetailsModal from './SpotDetailsModal';

interface MapViewProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  mapMode: 'campus' | 'nationwide' | 'global';
  highlightElement?: (step: string) => boolean;
}

const MapView = ({ selectedCategory, onCategoryChange, mapMode, highlightElement }: MapViewProps) => {
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [userLocationSpots, setUserLocationSpots] = useState<Spot[]>([]);

  // Generate spots based on user location for nationwide and global modes
  useEffect(() => {
    if (mapMode === 'nationwide' || mapMode === 'global') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Fetch nearby real locations using OpenStreetMap's Nominatim API
            try {
              const searchRadius = mapMode === 'global' ? 0.05 : 0.01; // ~5km for global, ~1km for nationwide
              const categories = ['peaceful', 'social', 'scenic'] as const;
              const generatedSpots: Spot[] = [];
              
              // Define search terms for each category
              const searchTerms: Record<typeof categories[number], string[]> = {
                peaceful: ['park', 'garden', 'green space', 'nature reserve'],
                social: ['cafe', 'restaurant', 'square', 'market'],
                scenic: ['viewpoint', 'landmark', 'monument', 'waterfront']
              };
              
              // Fetch 2 locations for each category
              for (const category of categories) {
                const terms = searchTerms[category];
                const spots = await Promise.all(
                  terms.slice(0, 2).map(async (term, index) => {
                    try {
                      // Search for nearby POIs using Nominatim
                      const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?` +
                        `format=json&` +
                        `q=${encodeURIComponent(term)}&` +
                        `lat=${latitude}&` +
                        `lon=${longitude}&` +
                        `limit=1&` +
                        `addressdetails=1`,
                        {
                          headers: {
                            'User-Agent': 'SpotifyLocationApp/1.0'
                          }
                        }
                      );
                      
                      if (!response.ok) throw new Error('Geocoding failed');
                      
                      const data = await response.json();
                      if (data.length === 0) throw new Error('No results');
                      
                      const place = data[0];
                      const displayName = place.display_name.split(',')[0]; // Get primary name
                      const fullAddress = place.display_name;
                      
                      // Get appropriate image based on category
                      const images = {
                        peaceful: [
                          'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop',
                          'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&auto=format&fit=crop'
                        ],
                        social: [
                          'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop',
                          'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&auto=format&fit=crop'
                        ],
                        scenic: [
                          'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&auto=format&fit=crop',
                          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop'
                        ]
                      };
                      
                      const descriptions = {
                        peaceful: [
                          'A serene outdoor space perfect for meditation and quiet contemplation.',
                          'A tranquil location ideal for mindful walks and peaceful reflection.'
                        ],
                        social: [
                          'A lively gathering spot perfect for people-watching and socializing.',
                          'A vibrant social hub great for connecting with others and enjoying the atmosphere.'
                        ],
                        scenic: [
                          'A picturesque location offering stunning views and natural beauty.',
                          'An impressive landmark with breathtaking vistas and scenic surroundings.'
                        ]
                      };
                      
                      return {
                        id: `nearby-${category}-${index}`,
                        name: displayName,
                        address: fullAddress,
                        description: descriptions[category][index],
                        category: category,
                        latitude: parseFloat(place.lat),
                        longitude: parseFloat(place.lon),
                        image: images[category][index],
                        playlists: [
                          {
                            id: `p${generatedSpots.length * 2 + 1}`,
                            name: `${displayName} Mix`,
                            spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4PP3DA4J0N8',
                            category: category
                          },
                          {
                            id: `p${generatedSpots.length * 2 + 2}`,
                            name: `${category} Vibes`,
                            spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZd79rJ6a7lp',
                            category: category
                          }
                        ]
                      };
                    } catch (error) {
                      console.warn(`Failed to fetch ${term}:`, error);
                      return null;
                    }
                  })
                );
                
                generatedSpots.push(...spots.filter(s => s !== null) as Spot[]);
              }
              
              setUserLocationSpots(generatedSpots);
            } catch (error) {
              console.error('Error fetching nearby locations:', error);
              setUserLocationSpots([]);
            }
          },
          (error) => {
            console.warn('Geolocation error:', error);
            // Keep empty array if geolocation fails
            setUserLocationSpots([]);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      }
    } else {
      // Clear user location spots when switching back to campus mode
      setUserLocationSpots([]);
    }
  }, [mapMode]);

  const displaySpots = (mapMode === 'nationwide' || mapMode === 'global') ? userLocationSpots : spots;
  
  const filteredSpots = selectedCategory
    ? displaySpots.filter(spot => spot.category === selectedCategory)
    : displaySpots;

  return (
    <div className="relative h-full w-full">
      {/* Filter Bar */}
      <div className={`absolute top-0 left-0 right-0 z-20 ${highlightElement?.('location-filter') ? 'tutorial-highlight' : ''}`}>
        <FilterBar 
          selectedCategory={selectedCategory} 
          onCategoryChange={onCategoryChange} 
        />
      </div>

      {/* Map Container */}
      <div className="absolute inset-0 bg-muted">
        {/* Simple map representation with spots */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          {/* Background grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Spots as pins */}
          <div className="relative w-full max-w-4xl h-full max-h-[600px] mx-auto">
            {filteredSpots.map((spot, index) => {
              // Position pins in a visually pleasing layout (supports up to 9 pins)
              const positions = [
                { top: '18%', left: '28%' },
                { top: '25%', left: '68%' },
                { top: '42%', left: '45%' },
                { top: '48%', left: '78%' },
                { top: '62%', left: '22%' },
                { top: '68%', left: '62%' },
                { top: '35%', left: '85%' },
                { top: '75%', left: '40%' },
                { top: '55%', left: '52%' },
              ];
              const position = positions[index % positions.length] || { top: '50%', left: '50%' };

              return (
                <button
                  key={spot.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-full group ${highlightElement?.('location-pins') ? 'tutorial-highlight rounded-full' : ''}`}
                  onClick={() => {
                    setSelectedSpot(spot);
                    window.dispatchEvent(new CustomEvent('tutorial-pin-click'));
                  }}
                  style={position}
                  aria-label={`View ${spot.name}`}
                >
                  <div className="relative">
                    <MapPin
                      className="w-10 h-10 drop-shadow-lg transition-transform duration-200 group-hover:scale-110 group-active:scale-95"
                      fill={getCategoryColor(spot.category)}
                      stroke="white"
                      strokeWidth={2}
                    />
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
                      <span className="text-xs font-medium bg-background/90 backdrop-blur-sm px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                        {spot.name}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Spot Details Modal */}
      {selectedSpot && (
        <SpotDetailsModal
          spot={selectedSpot}
          onClose={() => setSelectedSpot(null)}
          highlightElement={highlightElement}
        />
      )}
    </div>
  );
};

export default MapView;
