import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Song, getMoodColor, getEnergyColor } from "@/data/mockData";
import { Music, MapPin, Activity } from "lucide-react";

interface SongCardProps {
  song: Song;
}

const SongCard = ({ song }: SongCardProps) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card 
      className="group p-4 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 cursor-pointer animate-fade-up"
      style={{
        background: `linear-gradient(135deg, hsl(var(--card)) 0%, ${getMoodColor(song.mood)}15 100%)`
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {song.title}
          </h4>
          <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
        </div>
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 ml-2 group-hover:scale-110 transition-transform"
          style={{ backgroundColor: getEnergyColor(song.energy) + '20' }}
        >
          <Music className="w-5 h-5" style={{ color: getEnergyColor(song.energy) }} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Energy:</span>
          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-500 rounded-full"
              style={{ 
                width: `${song.energy}%`,
                backgroundColor: getEnergyColor(song.energy)
              }}
            />
          </div>
          <span className="font-semibold text-foreground">{song.energy}%</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{song.location.city}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <Badge 
            variant="secondary" 
            className="capitalize"
            style={{ 
              backgroundColor: getMoodColor(song.mood) + '20',
              color: getMoodColor(song.mood),
              borderColor: getMoodColor(song.mood) + '40'
            }}
          >
            {song.mood}
          </Badge>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{formatDuration(song.duration)}</span>
            <span>•</span>
            <span>{song.playCount} plays</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SongCard;
