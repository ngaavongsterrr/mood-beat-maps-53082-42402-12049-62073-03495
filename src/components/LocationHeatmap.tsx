import { Card } from "@/components/ui/card";
import { mockSongs } from "@/data/mockData";
import { MapPin } from "lucide-react";

const LocationHeatmap = () => {
  // Calculate play counts per city
  const locationData = mockSongs.reduce((acc, song) => {
    const city = song.location.city;
    if (acc[city]) {
      acc[city].count += song.playCount;
      acc[city].songs += 1;
    } else {
      acc[city] = {
        count: song.playCount,
        songs: 1,
        lat: song.location.lat,
        lng: song.location.lng,
      };
    }
    return acc;
  }, {} as Record<string, { count: number; songs: number; lat: number; lng: number }>);

  const maxCount = Math.max(...Object.values(locationData).map(loc => loc.count));
  const locations = Object.entries(locationData).sort((a, b) => b[1].count - a[1].count);

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-accent/30 transition-all duration-300">
      <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
        Top Listening Locations
      </h3>
      <div className="space-y-3">
        {locations.map(([city, data]) => {
          const intensity = (data.count / maxCount) * 100;
          const color = intensity > 70 ? 'var(--energy-high)' : 
                       intensity > 40 ? 'var(--energy-medium)' : 
                       'var(--energy-low)';
          
          return (
            <div 
              key={city} 
              className="group relative p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in"
            >
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                  style={{ 
                    backgroundColor: `hsl(${color} / 0.2)`,
                  }}
                >
                  <MapPin className="w-5 h-5" style={{ color: `hsl(${color})` }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {city}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {data.songs} songs • {data.count} total plays
                  </p>
                </div>
                <div 
                  className="text-2xl font-bold tabular-nums"
                  style={{ color: `hsl(${color})` }}
                >
                  {Math.round(intensity)}%
                </div>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-1000 rounded-full"
                  style={{ 
                    width: `${intensity}%`,
                    backgroundColor: `hsl(${color})`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default LocationHeatmap;
