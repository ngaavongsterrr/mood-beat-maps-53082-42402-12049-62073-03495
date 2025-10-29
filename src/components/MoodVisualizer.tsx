import { useEffect, useRef, useState } from 'react';
import { SpotCategory } from '@/data/spots';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockPlaylists } from '@/data/mockData';
import { X, Save, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CustomEmoji from './CustomEmoji';
import html2canvas from 'html2canvas';
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth';

interface MoodVisualizerProps {
  category: SpotCategory;
  isPlaying?: boolean;
}

type EmotionType = 'love' | 'happy' | 'content' | 'disappointed' | 'sad' | 'angry' | 'neutral' | 'curious';
type MoodStage = 'before' | 'during' | 'after';

interface MoodEntry {
  stage: MoodStage;
  emotion: EmotionType;
  timestamp: Date;
}

// Plutchik's Wheel of Emotions adapted for music/playlist context
const emotions = [
  // Positive spectrum (Joy branch - green) - highest to lowest intensity
  { 
    id: 'love' as EmotionType, 
    emoji: '😍',
    label: 'In Love', 
    description: 'Heart-eyes, completely captivated',
    color: 'hsl(142, 76%, 36%)', // Deep vibrant green
    spectrum: 'positive',
    intensity: 3,
    animation: 'animate-bounce-gentle'
  },
  { 
    id: 'happy' as EmotionType, 
    emoji: '😄',
    label: 'Happy', 
    description: 'Joyful and energized',
    color: 'hsl(142, 71%, 45%)', // Medium green
    spectrum: 'positive',
    intensity: 2,
    animation: 'animate-bounce-gentle'
  },
  { 
    id: 'content' as EmotionType, 
    emoji: '😊',
    label: 'Content', 
    description: 'Peacefully satisfied',
    color: 'hsl(142, 65%, 55%)', // Light green
    spectrum: 'positive',
    intensity: 1,
    animation: 'animate-bounce-gentle'
  },
  // Negative spectrum (Sadness/Anger branch - red) - highest to lowest intensity
  { 
    id: 'angry' as EmotionType, 
    emoji: '😡',
    label: 'Angry', 
    description: 'Frustrated or agitated',
    color: 'hsl(0, 84%, 60%)', // Bright red
    spectrum: 'negative',
    intensity: 3,
    animation: 'animate-shake-fast'
  },
  { 
    id: 'sad' as EmotionType, 
    emoji: '😢',
    label: 'Sad', 
    description: 'Tearful and melancholic',
    color: 'hsl(0, 70%, 50%)', // Medium red
    spectrum: 'negative',
    intensity: 2,
    animation: 'animate-sway-slow'
  },
  { 
    id: 'disappointed' as EmotionType, 
    emoji: '☹️',
    label: 'Disappointed', 
    description: 'Let down or dissatisfied',
    color: 'hsl(0, 60%, 40%)', // Dark red
    spectrum: 'negative',
    intensity: 1,
    animation: 'animate-sway-slow'
  },
  // Neutral/Curious spectrum (Anticipation branch - gray) - highest to lowest intensity
  { 
    id: 'neutral' as EmotionType, 
    emoji: '😐',
    label: 'Neutral', 
    description: 'Indifferent, neither good nor bad',
    color: 'hsl(210, 10%, 60%)', // Light neutral gray
    spectrum: 'neutral',
    intensity: 2,
    animation: 'animate-pulse-steady'
  },
  { 
    id: 'curious' as EmotionType, 
    emoji: '🧐',
    label: 'Curious', 
    description: 'Thoughtfully intrigued',
    color: 'hsl(210, 8%, 50%)', // Medium neutral gray
    spectrum: 'neutral',
    intensity: 1,
    animation: 'animate-pulse-steady'
  },
];

const stagePrompts = {
  before: "How does this playlist make you feel before starting your journey?",
  during: "How does this playlist feel while exploring?",
  after: "How well does this playlist match the location's atmosphere?"
};

const MoodVisualizer = ({ category, isPlaying = true }: MoodVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentStage, setCurrentStage] = useState<MoodStage>('before');
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<EmotionType | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>(mockPlaylists[0].id);
  const [showSubmitPrompt, setShowSubmitPrompt] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [summaryScreenshot, setSummaryScreenshot] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const moodRef = useRef<EmotionType | null>(null);
  const reminderTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const [hasValidSelection, setHasValidSelection] = useState(false);
  const [isSpotifyPlaylistPlaying, setIsSpotifyPlaylistPlaying] = useState(false);
  const { isAuthenticated, currentPlayback, login, isLoading, handleCallback } = useSpotifyAuth();
  
  // Handle Spotify callback
  useEffect(() => {
    if (window.location.hash.includes('access_token')) {
      handleCallback();
    }
  }, [handleCallback]);

  // Check if Spotify is playing and matches selected category
  useEffect(() => {
    if (!isAuthenticated || !currentPlayback) {
      setIsSpotifyPlaylistPlaying(false);
      setHasValidSelection(false);
      return;
    }

    // Check if user is actually playing music
    if (!currentPlayback.is_playing || !currentPlayback.context) {
      setIsSpotifyPlaylistPlaying(false);
      setHasValidSelection(false);
      toast({
        title: "No music playing",
        description: "Please play a Spotify playlist to enable the mood visualizer",
      });
      return;
    }

    // Get the currently playing context (playlist)
    const playlistUri = currentPlayback.context?.uri;
    const savedPlaylistName = localStorage.getItem('selectedSpotifyPlaylist');
    const savedCategory = localStorage.getItem('selectedPlaylistCategory');

    // If user clicked "+Open in Spotify", check if that playlist is playing
    if (savedPlaylistName && savedCategory) {
      // Here we'd ideally match the playlist URI with our stored data
      // For now, we'll match by category and assume user is playing the right playlist
      const matchingPlaylist = mockPlaylists.find(p => {
        const categoryMatch = p.name.toLowerCase().includes(savedCategory.toLowerCase()) ||
                            (savedCategory === 'social' && p.name.includes('Coffee')) ||
                            (savedCategory === 'peaceful' && p.name.includes('Garden')) ||
                            (savedCategory === 'scenic' && p.name.includes('Epic'));
        return categoryMatch;
      });

      if (matchingPlaylist) {
        setSelectedPlaylist(matchingPlaylist.id);
        setIsSpotifyPlaylistPlaying(true);
        setHasValidSelection(true);
      } else {
        setIsSpotifyPlaylistPlaying(false);
        setHasValidSelection(false);
      }
    } else {
      // No playlist selected via "+Open in Spotify"
      setIsSpotifyPlaylistPlaying(false);
      setHasValidSelection(false);
    }
  }, [isAuthenticated, currentPlayback, category, toast]);

  // Auto-sync playlist from Spotify selection events
  useEffect(() => {
    const handleSpotifySelection = (event: any) => {
      const { category: selectedCategory, playlistName } = event.detail;
      
      // Find matching playlist in our list
      const matchingPlaylist = mockPlaylists.find(p => {
        const categoryMatch = p.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                            (selectedCategory === 'social' && p.name.includes('Coffee')) ||
                            (selectedCategory === 'peaceful' && p.name.includes('Garden')) ||
                            (selectedCategory === 'scenic' && p.name.includes('Epic'));
        return categoryMatch;
      });

      if (matchingPlaylist) {
        setSelectedPlaylist(matchingPlaylist.id);
        
        // Only enable if Spotify is actually playing
        if (isAuthenticated && currentPlayback?.is_playing) {
          setHasValidSelection(true);
          setIsSpotifyPlaylistPlaying(true);
        }
      }
    };

    window.addEventListener('spotifyPlaylistSelected', handleSpotifySelection);
    return () => window.removeEventListener('spotifyPlaylistSelected', handleSpotifySelection);
  }, [isAuthenticated, currentPlayback]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Animation parameters based on category and mood
    let particles: Particle[] = [];
    let animationId: number;
    
    const getMoodModifier = (mood: EmotionType | null) => {
      if (!mood) return { speedMultiplier: 1, sizeMultiplier: 1, opacityBoost: 0, baseColor: null };
      
      const emotion = emotions.find(e => e.id === mood);
      if (!emotion) return { speedMultiplier: 1, sizeMultiplier: 1, opacityBoost: 0, baseColor: null };
      
      // Calculate modifiers based on emotion spectrum and intensity
      const intensityFactor = emotion.intensity / 3; // Normalize to 0-1
      
      if (emotion.spectrum === 'positive') {
        // Positive emotions: faster, larger, brighter
        return { 
          speedMultiplier: 1 + (intensityFactor * 0.5), 
          sizeMultiplier: 1 + (intensityFactor * 0.3), 
          opacityBoost: intensityFactor * 0.2, 
          baseColor: emotion.color 
        };
      } else if (emotion.spectrum === 'negative') {
        // Negative emotions: more erratic or slower
        return { 
          speedMultiplier: emotion.id === 'angry' ? 2 : 0.5 + (intensityFactor * 0.3), 
          sizeMultiplier: 0.9 + (intensityFactor * 0.2), 
          opacityBoost: intensityFactor * 0.1, 
          baseColor: emotion.color 
        };
      } else {
        // Neutral emotions: steady, moderate
        return { 
          speedMultiplier: 0.7 + (intensityFactor * 0.2), 
          sizeMultiplier: 1, 
          opacityBoost: 0, 
          baseColor: emotion.color 
        };
      }
    };

    class BurstParticle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      life: number;
      maxLife: number;
      emoji: string;

      constructor(x: number, y: number, emoji: string, color: string) {
        this.x = x;
        this.y = y;
        this.emoji = emoji;
        this.size = Math.random() * 30 + 20;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 3;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed - 2;
        this.color = color;
        this.life = 0;
        this.maxLife = 60;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.2; // gravity
        this.life++;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const opacity = 1 - (this.life / this.maxLife);
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.font = `${this.size}px Arial`;
        ctx.fillText(this.emoji, this.x, this.y);
        ctx.restore();
      }

      isDead() {
        return this.life >= this.maxLife;
      }
    }

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      angle: number;
      angleSpeed: number;

      constructor(canvas: HTMLCanvasElement, category: SpotCategory) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        
        const mood = getMoodModifier(moodRef.current);
        const baseColor = mood.baseColor;
        
        switch (category) {
          case 'peaceful':
            this.size = (Math.random() * 30 + 20) * mood.sizeMultiplier;
            this.speedX = (Math.random() - 0.5) * 0.3 * mood.speedMultiplier;
            this.speedY = (Math.random() - 0.5) * 0.3 * mood.speedMultiplier;
            this.color = baseColor || `hsla(222, 66%, 55%, ${Math.random() * 0.3 + 0.1 + mood.opacityBoost})`;
            this.angleSpeed = (Math.random() - 0.5) * 0.01 * mood.speedMultiplier;
            break;
          case 'social':
            this.size = (Math.random() * 20 + 10) * mood.sizeMultiplier;
            this.speedX = (Math.random() - 0.5) * 2 * mood.speedMultiplier;
            this.speedY = (Math.random() - 0.5) * 2 * mood.speedMultiplier;
            this.color = baseColor || `hsla(340, 80%, 60%, ${Math.random() * 0.4 + 0.2 + mood.opacityBoost})`;
            this.angleSpeed = (Math.random() - 0.5) * 0.05 * mood.speedMultiplier;
            break;
          case 'scenic':
            this.size = (Math.random() * 40 + 25) * mood.sizeMultiplier;
            this.speedX = (Math.random() - 0.5) * 1 * mood.speedMultiplier;
            this.speedY = (Math.random() - 0.5) * 1 * mood.speedMultiplier;
            this.color = baseColor || `hsla(160, 70%, 50%, ${Math.random() * 0.3 + 0.15 + mood.opacityBoost})`;
            this.angleSpeed = (Math.random() - 0.5) * 0.03 * mood.speedMultiplier;
            break;
        }
        
        this.angle = Math.random() * Math.PI * 2;
      }

      update(canvas: HTMLCanvasElement) {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.angleSpeed;

        // Wrap around edges
        if (this.x < -this.size) this.x = canvas.width + this.size;
        if (this.x > canvas.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = canvas.height + this.size;
        if (this.y > canvas.height + this.size) this.y = -this.size;
      }

      draw(ctx: CanvasRenderingContext2D, category: SpotCategory) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        switch (category) {
          case 'peaceful':
            // Soft circles
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            break;
          case 'social':
            // Dynamic squares
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            break;
          case 'scenic':
            // Flowing shapes
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
              const angle = (Math.PI * 2 * i) / 6;
              const x = Math.cos(angle) * this.size;
              const y = Math.sin(angle) * this.size;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
            break;
        }

        ctx.restore();
      }
    }

    // Initialize particles
    const particleCount = category === 'peaceful' ? 8 : category === 'social' ? 15 : 12;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas, category));
    }

    let localBurstParticles: BurstParticle[] = [];

    // Animation loop
    const animate = () => {
      if (!isPlaying) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.update(canvas);
        particle.draw(ctx, category);
      });

      // Update and draw burst particles
      localBurstParticles = localBurstParticles.filter(bp => {
        bp.update();
        bp.draw(ctx);
        return !bp.isDead();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Listen for burst particle events
    const handleBurstEvent = (event: CustomEvent) => {
      const { x, y, emoji, color } = event.detail;
      for (let i = 0; i < 8; i++) {
        localBurstParticles.push(new BurstParticle(x, y, emoji, color));
      }
    };

    canvas.addEventListener('moodBurst' as any, handleBurstEvent as any);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      canvas.removeEventListener('moodBurst' as any, handleBurstEvent as any);
      cancelAnimationFrame(animationId);
    };
  }, [category, isPlaying, selectedMood]);

  // Regenerate particles when mood changes to update colors
  useEffect(() => {
    moodRef.current = selectedMood;
  }, [selectedMood]);

  // Periodic reminder effect
  useEffect(() => {
    if (!selectedMood) {
      reminderTimerRef.current = setInterval(() => {
        setShowReminder(true);
        setTimeout(() => setShowReminder(false), 3000);
      }, 15000);
    }

    return () => {
      if (reminderTimerRef.current) {
        clearInterval(reminderTimerRef.current);
      }
    };
  }, [selectedMood]);

  const handleMoodSelect = (mood: EmotionType) => {
    setSelectedMood(mood);
    moodRef.current = mood;
    setShowOverlay(false);
    
    // Save mood entry for current stage
    const newEntry: MoodEntry = {
      stage: currentStage,
      emotion: mood,
      timestamp: new Date()
    };
    setMoodEntries(prev => [...prev.filter(e => e.stage !== currentStage), newEntry]);
    
    setShowConfirmation(true);
    
    // Trigger burst effect
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = rect.width / 2;
      const y = rect.height / 2;
      const emotion = emotions.find(e => e.id === mood);
      if (emotion) {
        const event = new CustomEvent('moodBurst', {
          detail: { x, y, emoji: emotion.emoji, color: emotion.color }
        });
        canvas.dispatchEvent(event);
      }
    }
    
    setTimeout(() => {
      setShowConfirmation(false);
      setShowSubmitPrompt(true);
    }, 2000);
  };

  const handleContinue = () => {
    setShowSubmitPrompt(false);
    
    // Move to next stage
    if (currentStage === 'before') {
      setCurrentStage('during');
      setSelectedMood(null);
      moodRef.current = null;
    } else if (currentStage === 'during') {
      setCurrentStage('after');
      setSelectedMood(null);
      moodRef.current = null;
    }
  };

  const handleSaveToJournal = async () => {
    if (moodEntries.length !== 3) return;
    
    const playlist = mockPlaylists.find(p => p.id === selectedPlaylist);
    
    // Capture screenshot of summary with light theme and no overlays
    let screenshotData: string | undefined;
    if (summaryRef.current) {
      try {
        // Hide close button and other overlays
        const closeButton = summaryRef.current.querySelector('button');
        const originalDisplay = closeButton ? closeButton.style.display : '';
        if (closeButton) closeButton.style.display = 'none';
        
        // Apply light theme temporarily
        const originalBg = summaryRef.current.style.backgroundColor;
        const originalColor = summaryRef.current.style.color;
        summaryRef.current.style.backgroundColor = '#fafafa';
        summaryRef.current.style.color = '#111';
        
        const canvas = await html2canvas(summaryRef.current, {
          backgroundColor: '#fafafa',
          scale: 2,
          logging: false,
        });
        screenshotData = canvas.toDataURL('image/png');
        
        // Revert to original
        summaryRef.current.style.backgroundColor = originalBg;
        summaryRef.current.style.color = originalColor;
        if (closeButton) closeButton.style.display = originalDisplay;
      } catch (error) {
        console.error('Failed to capture screenshot:', error);
      }
    }
    
    // Build summary text
    const summary = {
      before: moodEntries.find(e => e.stage === 'before'),
      during: moodEntries.find(e => e.stage === 'during'),
      after: moodEntries.find(e => e.stage === 'after')
    };
    
    // Get stored data
    const playlistCategoryName = localStorage.getItem('selectedPlaylistCategory') || category;
    const spotifyPlaylistName = localStorage.getItem('selectedSpotifyPlaylist') || playlist?.name || '';
    const locationTitle = localStorage.getItem('selectedLocationTitle') || 'Unknown Location';
    
    // Create journal entry
    const journalEntry = {
      id: `journey-${Date.now()}`,
      locationTitle,
      playlistName: playlist?.name,
      playlistCategoryName,
      spotifyPlaylistName,
      category,
      moodEntries: moodEntries.map(e => ({
        stage: e.stage,
        emotion: e.emotion,
        timestamp: e.timestamp.toISOString()
      })),
      timestamp: new Date().toISOString(),
      summaryData: summary,
      summaryImage: screenshotData
    };
    
    // Save to localStorage
    const existingEntries = JSON.parse(localStorage.getItem('moodJournalEntries') || '[]');
    localStorage.setItem('moodJournalEntries', JSON.stringify([...existingEntries, journalEntry]));
    
    // Trigger storage event for journal view
    window.dispatchEvent(new Event('storage'));
    
    // Sync to Google Sheets (silent fail)
    fetch('https://script.google.com/macros/s/AKfycbwJWZ_YtNln5bKTBTLJCAIBsSidYxx04k7fRO-Oqy2Bmi2RNO4MfoGjxnUdEjGfWU2M/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(journalEntry)
    }).catch(err => console.log('Sync failed:', err));
    
    toast({
      title: "Journey Saved! 🎵",
      description: `${playlist?.name} mood journey saved to your journal`,
    });
    
    setShowSubmitPrompt(false);
    setShowSaveConfirmation(true);
    
    setTimeout(() => {
      setShowSaveConfirmation(false);
      // Reset for new journey
      setMoodEntries([]);
      setCurrentStage('before');
      setSelectedMood(null);
      moodRef.current = null;
    }, 2000);
  };

  const handleClose = () => {
    setShowOverlay(false);
    setShowSubmitPrompt(false);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!showOverlay && !showConfirmation && hasValidSelection) {
      setShowOverlay(true);
    }
  };

  const currentPlaylist = mockPlaylists.find(p => p.id === selectedPlaylist);

  return (
    <div className="relative w-full h-full min-h-[300px] rounded-lg overflow-hidden bg-black/80 backdrop-blur-sm">
      {/* Spotify Authentication Prompt */}
      {!isAuthenticated && (
        <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/80 backdrop-blur-md">
          <div className="bg-background/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10 max-w-md mx-4 text-center space-y-4">
            <h3 className="text-xl font-semibold">Connect to Spotify</h3>
            <p className="text-sm text-muted-foreground">
              Connect your Spotify account to enable the mood visualizer and track your listening experience in real-time.
            </p>
            <Button onClick={login} className="w-full gap-2" size="lg">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Connect Spotify
            </Button>
            <p className="text-xs text-muted-foreground">
              You'll need to authorize access to see what you're currently playing
            </p>
          </div>
        </div>
      )}

      {/* Playlist Selector */}
      <div className={`absolute top-4 left-4 z-30 ${!hasValidSelection ? 'animate-pulse' : ''}`}
           style={!hasValidSelection ? { boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.6)' } : {}}>
        <Select value={selectedPlaylist} onValueChange={setSelectedPlaylist} disabled={!hasValidSelection}>
          <SelectTrigger className="w-[200px] bg-black/60 backdrop-blur-md border-white/20 text-white">
            <SelectValue placeholder="Select playlist" />
          </SelectTrigger>
          <SelectContent>
            {mockPlaylists.map(playlist => (
              <SelectItem key={playlist.id} value={playlist.id}>
                {playlist.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {currentPlaylist && hasValidSelection && (
          <p className="text-xs text-white/60 mt-1">
            {currentPlaylist.songs.length} songs • {currentPlaylist.dominantMood}
          </p>
        )}
        {isAuthenticated && currentPlayback?.item && (
          <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Now Playing: {currentPlayback.item.name}
          </p>
        )}
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        onClick={handleCanvasClick}
      />

      {/* Lightbox when no valid selection */}
      {!hasValidSelection && isAuthenticated && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 max-w-[200px] text-center">
            <p className="text-xs text-white/90">
              {!currentPlayback?.is_playing 
                ? "Play a Spotify playlist to begin"
                : "Click '+Open in Spotify' on a playlist that matches what you're playing"}
            </p>
          </div>
        </div>
      )}

      {/* Periodic Reminder */}
      {showReminder && !selectedMood && !showOverlay && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 animate-fade-in">
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20 animate-pulse">
            <p className="text-white/80 text-sm font-medium">
              Tap to share how you feel 💭
            </p>
          </div>
        </div>
      )}
      
      {/* Emotion Selection Overlay */}
      {showOverlay && (
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center animate-fade-in z-10"
        >
          <div 
            className="bg-background/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10 max-w-md mx-4 animate-scale-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
            
            {/* Stage indicator */}
            <div className="text-center mb-4">
              <div className="flex justify-center gap-2 mb-3">
                {(['before', 'during', 'after'] as MoodStage[]).map((stage) => (
                  <div 
                    key={stage}
                    className={`h-2 w-12 rounded-full transition-all ${
                      currentStage === stage 
                        ? 'bg-primary' 
                        : moodEntries.some(e => e.stage === stage)
                        ? 'bg-primary/50'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {currentStage === 'before' && 'Before Journey'}
                {currentStage === 'during' && 'During Journey'}
                {currentStage === 'after' && 'After Journey'}
              </p>
            </div>

            <h3 className="text-lg font-medium text-center mb-6 text-foreground">
              {stagePrompts[currentStage]}
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {emotions.map((emotion) => (
                <Button
                  key={emotion.id}
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-4 hover:scale-110 transition-all border-2"
                  style={{ 
                    borderColor: `${emotion.color.replace(')', ' / 0.5)')}`
                  }}
                  onClick={() => handleMoodSelect(emotion.id)}
                >
                  <div className={emotion.animation}>
                    <CustomEmoji type={emotion.id} size={48} />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{emotion.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Submit Prompt */}
      {showSubmitPrompt && (
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center animate-fade-in z-10"
        >
          <div 
            ref={summaryRef}
            className="bg-background/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10 max-w-md mx-4 animate-scale-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="text-center space-y-4">
              <div className={`flex justify-center mb-4 ${emotions.find(e => e.id === selectedMood)?.animation}`}>
                <CustomEmoji type={selectedMood || 'neutral'} size={64} />
              </div>
              <h3 className="text-lg font-medium text-foreground">
                {emotions.find(e => e.id === selectedMood)?.label}
              </h3>
              <p className="text-sm text-muted-foreground">
                {mockPlaylists.find(p => p.id === selectedPlaylist)?.name}
              </p>
              <p className="text-xs text-muted-foreground italic">
                {localStorage.getItem('selectedSpotifyPlaylist') || ''} - Spotify
              </p>

              {/* Mood journey progress */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Your Journey
                </h4>
                {moodEntries.map((entry) => (
                  <div key={entry.stage} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground capitalize">{entry.stage}:</span>
                    <span className="flex items-center gap-2">
                      <CustomEmoji type={entry.emotion} size={24} />
                      <span className="text-sm font-medium text-foreground">{emotions.find(e => e.id === entry.emotion)?.label}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                {currentStage !== 'after' ? (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleClose}
                    >
                      Continue Listening
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleContinue}
                    >
                      Next Stage
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleClose}
                    >
                      Close
                    </Button>
                    <Button
                      className="flex-1 gap-2"
                      onClick={handleSaveToJournal}
                    >
                      <Save className="w-4 h-4" />
                      Save Journey
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Confirmation */}
      {showSaveConfirmation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="bg-background/90 backdrop-blur-md rounded-2xl px-8 py-6 shadow-lg border border-white/10 animate-scale-in">
            <p className="text-lg font-medium text-foreground flex items-center gap-3">
              <Save className="w-5 h-5 text-primary" />
              Journey saved to journal! 
              <span className="text-2xl">🎵</span>
            </p>
          </div>
        </div>
      )}

      {/* Confirmation Message */}
      {showConfirmation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="bg-background/90 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border border-white/10 animate-fade-in flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">Mood captured</p>
            <CustomEmoji type={selectedMood || 'neutral'} size={24} />
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 text-white/60 text-sm font-medium bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
        {category === 'peaceful' && '🌊 Peaceful'}
        {category === 'social' && '✨ Social'}
        {category === 'scenic' && '🌄 Scenic'}
      </div>

      {selectedMood && !showOverlay && !showConfirmation && !showSubmitPrompt && !showSaveConfirmation && (
        <div className="absolute top-4 right-4 text-white/80 text-sm font-medium bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
          <CustomEmoji type={selectedMood} size={20} />
          <span className="text-xs text-white/60 capitalize">{currentStage}</span>
        </div>
      )}
    </div>
  );
};

export default MoodVisualizer;
