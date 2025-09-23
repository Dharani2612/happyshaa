import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Music2, Play, Pause, Volume2, VolumeX, Heart, Waves, Cloud, Sun } from "lucide-react";
import { toast } from "sonner";

interface SoundTrack {
  id: string;
  name: string;
  description: string;
  icon: any;
  duration: number;
  color: string;
}

const Music = () => {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const soundTracks: SoundTrack[] = [
    {
      id: 'rain',
      name: 'Gentle Rain',
      description: 'Soft rain sounds for relaxation',
      icon: Cloud,
      duration: 600, // 10 minutes
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'ocean',
      name: 'Ocean Waves',
      description: 'Peaceful ocean waves',
      icon: Waves,
      duration: 600,
      color: 'from-cyan-400 to-blue-500'
    },
    {
      id: 'meditation',
      name: 'Meditation Tone',
      description: 'Calming meditation bell',
      icon: Heart,
      duration: 300, // 5 minutes
      color: 'from-purple-400 to-pink-500'
    },
    {
      id: 'nature',
      name: 'Nature Sounds',
      description: 'Birds and gentle breeze',
      icon: Sun,
      duration: 480, // 8 minutes
      color: 'from-green-400 to-yellow-500'
    }
  ];

  useEffect(() => {
    return () => {
      stopTrack();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const createAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const generateSound = (trackId: string) => {
    const audioContext = createAudioContext();
    
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;

    // Different sound patterns for each track
    switch (trackId) {
      case 'rain':
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime);
        break;
      case 'ocean':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
        gainNode.gain.setValueAtTime(volume * 0.4, audioContext.currentTime);
        // Add subtle frequency modulation for wave effect
        const lfo = audioContext.createOscillator();
        const lfoGain = audioContext.createGain();
        lfo.frequency.setValueAtTime(0.1, audioContext.currentTime);
        lfoGain.gain.setValueAtTime(20, audioContext.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        lfo.start();
        break;
      case 'meditation':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(432, audioContext.currentTime);
        gainNode.gain.setValueAtTime(volume * 0.2, audioContext.currentTime);
        break;
      case 'nature':
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        gainNode.gain.setValueAtTime(volume * 0.25, audioContext.currentTime);
        break;
    }

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();

    return { oscillator, gainNode };
  };

  const playTrack = async (trackId: string) => {
    try {
      const audioContext = createAudioContext();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      setCurrentTrack(trackId);
      setIsPlaying(true);
      setCurrentTime(0);

      generateSound(trackId);

      const track = soundTracks.find(t => t.id === trackId);
      if (track) {
        toast(`Now playing: ${track.name} 🎵`);
        
        // Start progress timer
        intervalRef.current = setInterval(() => {
          setCurrentTime(prev => {
            const newTime = prev + 1;
            if (newTime >= track.duration) {
              stopTrack();
              toast(`${track.name} completed 🎶`);
              return 0;
            }
            return newTime;
          });
        }, 1000);
      }
    } catch (error) {
      toast.error("Couldn't play audio. Please check your browser settings.");
    }
  };

  const pauseTrack = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
  };

  const resumeTrack = () => {
    if (currentTrack) {
      setIsPlaying(true);
      generateSound(currentTrack);
      
      const track = soundTracks.find(t => t.id === currentTrack);
      if (track) {
        intervalRef.current = setInterval(() => {
          setCurrentTime(prev => {
            const newTime = prev + 1;
            if (newTime >= track.duration) {
              stopTrack();
              return 0;
            }
            return newTime;
          });
        }, 1000);
      }
    }
  };

  const stopTrack = () => {
    setIsPlaying(false);
    setCurrentTrack(null);
    setCurrentTime(0);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
  };

  const updateVolume = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(vol * 0.3, audioContextRef.current?.currentTime || 0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentTrack = () => soundTracks.find(t => t.id === currentTrack);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-elder-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <Music2 className="w-8 h-8 text-primary" />
          Calming Sounds
        </h2>
        <p className="text-elder-lg text-muted-foreground">
          Relaxing sounds to help you unwind and find peace
        </p>
      </div>

      {/* Current Playing Track */}
      {currentTrack && (
        <Card className="p-6 shadow-gentle">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getCurrentTrack()?.color} flex items-center justify-center`}>
                {getCurrentTrack()?.icon && (() => {
                  const IconComponent = getCurrentTrack()!.icon;
                  return <IconComponent className="w-6 h-6 text-white" />;
                })()}
              </div>
              <div>
                <h3 className="text-elder-lg font-semibold text-foreground">{getCurrentTrack()?.name}</h3>
                <p className="text-muted-foreground">{getCurrentTrack()?.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={isPlaying ? pauseTrack : resumeTrack}
                variant="companionship"
                size="lg"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button onClick={stopTrack} variant="outline" size="lg">
                Stop
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(getCurrentTrack()?.duration || 0)}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-1000"
                style={{ 
                  width: `${(currentTime / (getCurrentTrack()?.duration || 1)) * 100}%` 
                }}
              />
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-4 mt-4">
            {volume === 0 ? <VolumeX className="w-5 h-5 text-muted-foreground" /> : <Volume2 className="w-5 h-5 text-muted-foreground" />}
            <Slider
              value={[volume]}
              onValueChange={updateVolume}
              max={1}
              step={0.1}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground min-w-[3rem]">{Math.round(volume * 100)}%</span>
          </div>
        </Card>
      )}

      {/* Sound Track Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {soundTracks.map((track) => {
          const IconComponent = track.icon;
          const isActive = currentTrack === track.id;
          
          return (
            <Card 
              key={track.id}
              className={`p-6 cursor-pointer transition-all hover:shadow-companionship ${
                isActive ? 'ring-2 ring-primary shadow-companionship' : 'shadow-gentle'
              }`}
              onClick={() => !isActive ? playTrack(track.id) : (isPlaying ? pauseTrack() : resumeTrack())}
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${track.color} flex items-center justify-center shadow-gentle`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-elder-lg font-semibold text-foreground">{track.name}</h3>
                  <p className="text-muted-foreground mb-2">{track.description}</p>
                  <p className="text-sm text-muted-foreground">Duration: {formatTime(track.duration)}</p>
                </div>
                
                <div className="flex items-center">
                  {isActive ? (
                    isPlaying ? <Pause className="w-6 h-6 text-primary" /> : <Play className="w-6 h-6 text-primary" />
                  ) : (
                    <Play className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 shadow-gentle bg-muted/30">
        <div className="text-center">
          <Heart className="w-8 h-8 text-primary mx-auto mb-4" />
          <h3 className="text-elder-lg font-semibold text-foreground mb-2">Find Your Peace</h3>
          <p className="text-muted-foreground">
            These calming sounds are designed to help you relax, meditate, or simply find a moment of tranquility. 
            Use headphones for the best experience.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Music;