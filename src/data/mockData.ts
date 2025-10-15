export interface Song {
  id: string;
  title: string;
  artist: string;
  energy: number; // 0-100
  mood: 'energetic' | 'calm' | 'happy' | 'melancholic' | 'intense';
  location: {
    city: string;
    lat: number;
    lng: number;
  };
  playCount: number;
  duration: number; // in seconds
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  averageEnergy: number;
  dominantMood: string;
}

export const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Electric Dreams',
    artist: 'Neon Pulse',
    energy: 95,
    mood: 'energetic',
    location: { city: 'New York', lat: 40.7128, lng: -74.0060 },
    playCount: 142,
    duration: 234,
  },
  {
    id: '2',
    title: 'Midnight Calm',
    artist: 'Luna Rivers',
    energy: 25,
    mood: 'calm',
    location: { city: 'Portland', lat: 45.5152, lng: -122.6784 },
    playCount: 89,
    duration: 198,
  },
  {
    id: '3',
    title: 'Summer Vibes',
    artist: 'The Sunshine Collective',
    energy: 78,
    mood: 'happy',
    location: { city: 'Miami', lat: 25.7617, lng: -80.1918 },
    playCount: 215,
    duration: 187,
  },
  {
    id: '4',
    title: 'Rainy Day Blues',
    artist: 'Echo Chamber',
    energy: 35,
    mood: 'melancholic',
    location: { city: 'Seattle', lat: 47.6062, lng: -122.3321 },
    playCount: 67,
    duration: 256,
  },
  {
    id: '5',
    title: 'Adrenaline Rush',
    artist: 'Voltage',
    energy: 98,
    mood: 'intense',
    location: { city: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
    playCount: 178,
    duration: 203,
  },
  {
    id: '6',
    title: 'Ocean Whispers',
    artist: 'Serene Waves',
    energy: 20,
    mood: 'calm',
    location: { city: 'San Diego', lat: 32.7157, lng: -117.1611 },
    playCount: 93,
    duration: 245,
  },
  {
    id: '7',
    title: 'City Lights',
    artist: 'Urban Rhythm',
    energy: 82,
    mood: 'energetic',
    location: { city: 'Chicago', lat: 41.8781, lng: -87.6298 },
    playCount: 156,
    duration: 212,
  },
  {
    id: '8',
    title: 'Sunset Reflection',
    artist: 'Golden Hour',
    energy: 45,
    mood: 'melancholic',
    location: { city: 'Austin', lat: 30.2672, lng: -97.7431 },
    playCount: 124,
    duration: 228,
  },
  {
    id: '9',
    title: 'Dance All Night',
    artist: 'Rhythm Kings',
    energy: 92,
    mood: 'happy',
    location: { city: 'Las Vegas', lat: 36.1699, lng: -115.1398 },
    playCount: 267,
    duration: 195,
  },
  {
    id: '10',
    title: 'Mountain Meditation',
    artist: 'Zen Collective',
    energy: 15,
    mood: 'calm',
    location: { city: 'Denver', lat: 39.7392, lng: -104.9903 },
    playCount: 78,
    duration: 312,
  },
  {
    id: '11',
    title: 'Thunder Strike',
    artist: 'Storm Chasers',
    energy: 96,
    mood: 'intense',
    location: { city: 'Phoenix', lat: 33.4484, lng: -112.0740 },
    playCount: 189,
    duration: 221,
  },
  {
    id: '12',
    title: 'Breezy Afternoon',
    artist: 'Acoustic Soul',
    energy: 55,
    mood: 'happy',
    location: { city: 'Nashville', lat: 36.1627, lng: -86.7816 },
    playCount: 145,
    duration: 198,
  },
];

export const mockPlaylists: Playlist[] = [
  {
    id: 'p1',
    name: 'High Energy Workout',
    songs: mockSongs.filter(s => s.energy > 80),
    averageEnergy: 92,
    dominantMood: 'energetic',
  },
  {
    id: 'p2',
    name: 'Chill Vibes',
    songs: mockSongs.filter(s => s.energy < 40),
    averageEnergy: 23,
    dominantMood: 'calm',
  },
  {
    id: 'p3',
    name: 'Feel Good Mix',
    songs: mockSongs.filter(s => s.mood === 'happy'),
    averageEnergy: 68,
    dominantMood: 'happy',
  },
];

export const getMoodColor = (mood: string): string => {
  const moodColors: Record<string, string> = {
    energetic: 'hsl(var(--energy-high))',
    calm: 'hsl(var(--calm-high))',
    happy: 'hsl(25 95% 53%)',
    melancholic: 'hsl(220 50% 40%)',
    intense: 'hsl(340 82% 52%)',
  };
  return moodColors[mood] || 'hsl(var(--primary))';
};

export const getEnergyColor = (energy: number): string => {
  if (energy >= 70) return 'hsl(var(--energy-high))';
  if (energy >= 40) return 'hsl(var(--energy-medium))';
  return 'hsl(var(--energy-low))';
};
