import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { spots, getCategoryColor, type Spot } from '@/data/spots';
import FilterBar from './FilterBar';
import SpotDetailsModal from './SpotDetailsModal';

interface MapViewProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  mapMode: 'campus' | 'nationwide' | 'global';
}

const MapView = ({ selectedCategory, onCategoryChange, mapMode }: MapViewProps) => {
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [userLocationSpots, setUserLocationSpots] = useState<Spot[]>([]);

  // Generate spots based on user location for nationwide and global modes
  useEffect(() => {
    if (mapMode === 'nationwide' || mapMode === 'global') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            
            // Generate 6 nearby spots (2 per category) with realistic outdoor location names
            const generatedSpots: Spot[] = [
              // Peaceful locations
              {
                id: 'nearby-peaceful-1',
                name: 'Botanical Garden',
                description: 'A serene botanical sanctuary with carefully curated plant collections, ideal for meditation and quiet contemplation.',
                category: 'peaceful',
                latitude: latitude + 0.003,
                longitude: longitude + 0.003,
                image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop',
                playlists: [
                  {
                    id: 'p1',
                    name: 'Garden Serenity',
                    spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4PP3DA4J0N8',
                    category: 'peaceful'
                  },
                  {
                    id: 'p2',
                    name: 'Nature Sounds',
                    spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZd79rJ6a7lp',
                    category: 'peaceful'
                  }
                ]
              },
              {
                id: 'nearby-peaceful-2',
                name: 'Memorial Park',
                description: 'A tranquil memorial park with reflective pathways and peaceful garden spaces, perfect for mindful walks.',
                category: 'peaceful',
                latitude: latitude + 0.0015,
                longitude: longitude - 0.002,
                image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&auto=format&fit=crop',
                playlists: [
                  {
                    id: 'p3',
                    name: 'Classical Focus',
                    spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWEJlAGA9gs0',
                    category: 'peaceful'
                  },
                  {
                    id: 'p4',
                    name: 'Museum Ambience',
                    spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX0XUfTFmNBRM',
                    category: 'peaceful'
                  }
                ]
              },
              // Social locations
              {
                id: 'nearby-social-1',
                name: 'Market Square',
                description: 'A lively public square with outdoor cafés and bustling market stalls, ideal for people-watching and socializing.',
                category: 'social',
                latitude: latitude - 0.002,
                longitude: longitude + 0.0025,
                image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop',
                playlists: [
                  {
                    id: 'p5',
                    name: 'Coffee Shop Vibes',
                    spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4pUKG1kS0Ac',
                    category: 'social'
                  },
                  {
                    id: 'p6',
                    name: 'Social Gathering',
                    spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWSf2RDTDayIx',
                    category: 'social'
                  }
                ]
              },
              {
                id: 'nearby-social-2',
                name: 'Riverside Promenade',
                description: 'A vibrant waterfront walkway with street performers and outdoor seating areas, great for connecting with others.',
                category: 'social',
                latitude: latitude - 0.001,
                longitude: longitude - 0.0015,
                image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&auto=format&fit=crop',
                playlists: [
                  {
                    id: 'p7',
                    name: 'Shopping Beats',
                    spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ',
                    category: 'social'
                  },
                  {
                    id: 'p8',
                    name: 'Urban Energy',
                    spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4pUKG1kS0Ac',
                    category: 'social'
                  }
                ]
              },
              // Scenic locations
              {
                id: 'nearby-scenic-1',
                name: 'Hilltop Viewpoint',
                description: 'An elevated scenic overlook offering breathtaking panoramic views of the surrounding landscape and city skyline.',
                category: 'scenic',
                latitude: latitude - 0.0025,
                longitude: longitude - 0.003,
                image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&auto=format&fit=crop',
                playlists: [
                  {
                    id: 'p9',
                    name: 'Epic Views',
                    spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO',
                    category: 'scenic'
                  },
                  {
                    id: 'p10',
                    name: 'Adventure Time',
                    spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ',
                    category: 'scenic'
                  }
                ]
              },
              {
                id: 'nearby-scenic-2',
                name: 'Lakeside Trail',
                description: "A picturesque nature trail winding along the water's edge, offering stunning lake views and natural beauty.",
                category: 'scenic',
                latitude: latitude + 0.002,
                longitude: longitude - 0.0025,
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop',
                playlists: [
                  {
                    id: 'p11',
                    name: 'Sunset Chill',
                    spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4pUKG1kS0Ac',
                    category: 'scenic'
                  },
                  {
                    id: 'p12',
                    name: 'Lakeside Lounge',
                    spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWSf2RDTDayIx',
                    category: 'scenic'
                  }
                ]
              }
            ];
            
            setUserLocationSpots(generatedSpots);
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
      <div className="absolute top-0 left-0 right-0 z-20">
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
                  onClick={() => setSelectedSpot(spot)}
                  className="absolute transform -translate-x-1/2 -translate-y-full group"
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
        />
      )}
    </div>
  );
};

export default MapView;
