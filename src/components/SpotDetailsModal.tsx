import { useState, useEffect } from 'react';
import { X, Music, Sparkles, Navigation, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type Spot, getCategoryLabel, type SpotCategory, type Playlist } from '@/data/spots';
import MoodVisualizer from './MoodVisualizer';

interface SpotDetailsModalProps {
  spot: Spot;
  onClose: () => void;
  highlightElement?: (step: string) => boolean;
}

const SpotDetailsModal = ({ spot, onClose, highlightElement }: SpotDetailsModalProps) => {
  const [selectedPlaylistCategory, setSelectedPlaylistCategory] = useState<SpotCategory | null>(null);
  const [playlistOpened, setPlaylistOpened] = useState(false);
  
  // Clear previous location data when a new location is selected
  useEffect(() => {
    localStorage.removeItem('selectedPlaylistCategory');
    localStorage.removeItem('selectedSpotifyPlaylistName');
    localStorage.removeItem('selectedLocationTitle');
    localStorage.removeItem('spotifyPlaylistActive');
    
    // Reset playlist opened state
    setPlaylistOpened(false);
    
    // Dispatch event to reset mood visualizer
    window.dispatchEvent(new CustomEvent('locationChanged'));
  }, [spot.id]);

  const filteredPlaylists = selectedPlaylistCategory
    ? spot.playlists.filter(p => p.category === selectedPlaylistCategory)
    : spot.playlists;

  const categories: SpotCategory[] = ['peaceful', 'social', 'scenic'];

  const handleNavigate = () => {
    const { latitude, longitude, name } = spot;
    const encodedName = encodeURIComponent(name);
    
    // Detect device type
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS) {
      // iOS: Show options for Apple Maps, Google Maps, or Waze
      const userChoice = confirm(
        `Open "${name}" in:\n\nOK = Apple Maps\nCancel = Choose Google Maps or Waze`
      );
      
      if (userChoice) {
        // Apple Maps with location name
        window.location.href = `maps://?daddr=${latitude},${longitude}&q=${encodedName}`;
      } else {
        const googleOrWaze = confirm('OK = Google Maps\nCancel = Waze');
        if (googleOrWaze) {
          // Google Maps with location name
          window.location.href = `comgooglemaps://?daddr=${encodedName}&center=${latitude},${longitude}`;
          // Fallback to web if app not installed
          setTimeout(() => {
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&destination_place_id=${encodedName}`, '_blank');
          }, 500);
        } else {
          // Waze with location name
          window.location.href = `waze://?ll=${latitude},${longitude}&navigate=yes&q=${encodedName}`;
          // Fallback to web if app not installed
          setTimeout(() => {
            window.open(`https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes&q=${encodedName}`, '_blank');
          }, 500);
        }
      }
    } else if (isAndroid) {
      // Android: Show options for Google Maps or Waze
      const userChoice = confirm(
        `Open "${name}" in:\n\nOK = Google Maps\nCancel = Waze`
      );
      
      if (userChoice) {
        // Google Maps with location name
        window.location.href = `geo:${latitude},${longitude}?q=${encodedName}`;
      } else {
        // Waze with location name
        window.location.href = `waze://?ll=${latitude},${longitude}&navigate=yes&q=${encodedName}`;
        // Fallback to web if app not installed
        setTimeout(() => {
          window.open(`https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes&q=${encodedName}`, '_blank');
        }, 500);
      }
    } else {
      // Desktop: Open Google Maps with location name in new tab
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedName}+${latitude},${longitude}`, '_blank');
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header Image */}
        <div className="relative h-48 w-full">
          <img 
            src={spot.image} 
            alt={spot.name}
            className="w-full h-full object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <DialogTitle className="text-2xl font-semibold">
                {spot.name}
              </DialogTitle>
              <Badge className="capitalize shrink-0">
                {getCategoryLabel(spot.category)}
              </Badge>
            </div>
            <p className="text-muted-foreground text-base mt-2">
              {spot.description}
            </p>
          </DialogHeader>

          {/* Navigation Button */}
          <Button 
            onClick={handleNavigate}
            disabled={!playlistOpened}
            className="w-full gap-2 transition-opacity duration-250 ease-in-out"
            size="lg"
          >
            <Navigation className="w-5 h-5" />
            Navigate to Location
          </Button>

          {/* Tabs */}
          <Tabs defaultValue="playlists" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="playlists" className="gap-2">
                <Music className="w-4 h-4" />
                Playlists
              </TabsTrigger>
              <TabsTrigger value="visualizer" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Mood Visualizer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="playlists" className="space-y-4 mt-4">
              {/* Playlist Filter */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Filter Playlists:
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <Button
                    variant={selectedPlaylistCategory === null ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPlaylistCategory(null)}
                    className="rounded-full"
                  >
                    All
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedPlaylistCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPlaylistCategory(category)}
                      className="rounded-full capitalize"
                    >
                      {getCategoryLabel(category)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Spotify Playlists */}
              <div className={`space-y-4 ${highlightElement?.('playlist-tab') ? 'tutorial-highlight rounded-lg' : ''}`}>
                {filteredPlaylists.map((playlist) => (
                  <div key={playlist.id} className="space-y-2 relative group">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{playlist.name}</h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${highlightElement?.('spotify-open') ? 'tutorial-highlight' : ''}`}
                        onClick={() => {
                          // Store exact playlist data for accurate syncing with its specific category
                          localStorage.setItem('selectedPlaylistCategory', playlist.category);
                          localStorage.setItem('selectedSpotifyPlaylistName', playlist.name);
                          localStorage.setItem('selectedLocationTitle', spot.name);
                          localStorage.setItem('spotifyPlaylistActive', 'true');
                          
                          // Enable navigation button
                          setPlaylistOpened(true);
                          
                          // Dispatch custom event with playlist-specific category for instant update
                          window.dispatchEvent(new CustomEvent('spotifyPlaylistSelected', {
                            detail: { 
                              category: playlist.category,
                              playlistName: playlist.name,
                              locationName: spot.name
                            }
                          }));
                          
                          // Dispatch tutorial event when Spotify is opened
                          window.dispatchEvent(new CustomEvent('tutorial-spotify-open'));
                          
                          const spotifyAppUrl = playlist.spotifyUrl.replace('/embed/', '/');
                          window.open(spotifyAppUrl, '_blank');
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        Open in Spotify
                      </Button>
                    </div>
                     <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-muted">
                      <iframe
                        src={playlist.spotifyUrl}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        title={playlist.name}
                        onLoad={() => {
                          // Dispatch tutorial event when playlist is loaded/previewed
                          window.dispatchEvent(new CustomEvent('tutorial-playlist-preview'));
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="visualizer" className="mt-4">
              <div className="h-[400px]">
                <MoodVisualizer category={spot.category} isPlaying={true} highlightElement={highlightElement} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SpotDetailsModal;
