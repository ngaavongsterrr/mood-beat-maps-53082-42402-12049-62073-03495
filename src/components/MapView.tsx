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
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          
          // Generate 3 nearby spots (one per category) with realistic location names
          const generatedSpots: Spot[] = [
            {
              id: 'nearby-1',
              name: 'Community Park',
              description: 'A tranquil green space perfect for quiet reflection and peaceful relaxation.',
              category: 'peaceful',
              latitude: latitude + 0.002,
              longitude: longitude + 0.002,
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
              id: 'nearby-2',
              name: 'Town Square Cafe',
              description: 'A vibrant gathering spot with outdoor seating, ideal for socializing and connecting.',
              category: 'social',
              latitude: latitude - 0.001,
              longitude: longitude + 0.001,
              image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop',
              playlists: [
                {
                  id: 'p3',
                  name: 'Coffee Shop Vibes',
                  spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4pUKG1kS0Ac',
                  category: 'social'
                },
                {
                  id: 'p4',
                  name: 'Social Gathering',
                  spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWSf2RDTDayIx',
                  category: 'social'
                }
              ]
            },
            {
              id: 'nearby-3',
              name: 'Scenic Overlook',
              description: 'A picturesque viewpoint offering stunning panoramic views and fresh air.',
              category: 'scenic',
              latitude: latitude - 0.002,
              longitude: longitude - 0.002,
              image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&auto=format&fit=crop',
              playlists: [
                {
                  id: 'p5',
                  name: 'Epic Views',
                  spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO',
                  category: 'scenic'
                },
                {
                  id: 'p6',
                  name: 'Adventure Time',
                  spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ',
                  category: 'scenic'
                }
              ]
            }
          ];
          
          setUserLocationSpots(generatedSpots);
        });
      }
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
              // Position pins in a visually pleasing layout
              const positions = [
                { top: '20%', left: '30%' },
                { top: '35%', left: '65%' },
                { top: '45%', left: '45%' },
                { top: '60%', left: '25%' },
                { top: '70%', left: '70%' },
                { top: '50%', left: '80%' },
              ];
              const position = positions[index] || { top: '50%', left: '50%' };

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
