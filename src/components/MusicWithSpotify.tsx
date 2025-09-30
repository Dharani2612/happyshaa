import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Music2, Play, Pause, Volume2, VolumeX, Heart, Waves, Cloud, Sun, Search, Plus, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SoundTrack {
  id: string;
  name: string;
  description: string;
  icon: any;
  duration: number;
  color: string;
}

interface Song {
  id: string;
  name: string;
  artist: string;
  album?: string;
  spotifyUrl: string;
  addedAt: Date;
}

const MusicWithSpotify = () => {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Spotify playlist state
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newSong, setNewSong] = useState({
    name: '',
    artist: '',
    spotifyUrl: ''
  });
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);

  const soundTracks: SoundTrack[] = [
    {
      id: 'rain',
      name: 'Gentle Rain',
      description: 'Soft rain sounds for relaxation',
      icon: Cloud,
      duration: 600,
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
      duration: 300,
      color: 'from-purple-400 to-pink-500'
    },
    {
      id: 'nature',
      name: 'Nature Sounds',
      description: 'Birds and gentle breeze',
      icon: Sun,
      duration: 480,
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
    } catch (error) {
      toast.error("Couldn't play audio");
    }
  };

  const pauseTrack = () => {
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
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
    if (intervalRef.current) clearInterval(intervalRef.current);
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

  // Spotify functions
  const handleAddSong = () => {
    if (!newSong.name || !newSong.artist || !newSong.spotifyUrl) {
      toast.error('Please fill in all fields');
      return;
    }

    const song: Song = {
      id: Date.now().toString(),
      ...newSong,
      addedAt: new Date()
    };

    setPlaylist([...playlist, song]);
    setNewSong({ name: '', artist: '', spotifyUrl: '' });
    toast.success(`${song.name} added to playlist! 🎵`);
  };

  const handlePlaySpotify = (songId: string, url: string) => {
    setCurrentPlaying(currentPlaying === songId ? null : songId);
    window.open(url, '_blank');
    toast('Opening in Spotify 🎵');
  };

  const deleteSong = (id: string) => {
    setPlaylist(playlist.filter(s => s.id !== id));
    toast.success('Song removed from playlist');
  };

  const filteredPlaylist = playlist.filter(song =>
    song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <Music2 className="w-8 h-8 text-primary" />
          Music & Sounds
        </h2>
        <p className="text-lg text-muted-foreground">
          Calming sounds and your favorite songs in one place
        </p>
      </div>

      <Tabs defaultValue="sounds" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sounds">Calming Sounds</TabsTrigger>
          <TabsTrigger value="spotify">My Playlist</TabsTrigger>
        </TabsList>

        {/* Calming Sounds Tab */}
        <TabsContent value="sounds" className="space-y-6">
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
                    <h3 className="text-lg font-semibold text-foreground">{getCurrentTrack()?.name}</h3>
                    <p className="text-muted-foreground">{getCurrentTrack()?.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button onClick={isPlaying ? pauseTrack : resumeTrack} variant="companionship" size="lg">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  <Button onClick={stopTrack} variant="outline" size="lg">Stop</Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(getCurrentTrack()?.duration || 0)}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(currentTime / (getCurrentTrack()?.duration || 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4">
                {volume === 0 ? <VolumeX className="w-5 h-5 text-muted-foreground" /> : <Volume2 className="w-5 h-5 text-muted-foreground" />}
                <Slider value={[volume]} onValueChange={updateVolume} max={1} step={0.1} className="flex-1" />
                <span className="text-sm text-muted-foreground min-w-[3rem]">{Math.round(volume * 100)}%</span>
              </div>
            </Card>
          )}

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
                      <h3 className="text-lg font-semibold text-foreground">{track.name}</h3>
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
        </TabsContent>

        {/* Spotify Playlist Tab */}
        <TabsContent value="spotify" className="space-y-6">
          <Card className="p-6 shadow-gentle">
            <h3 className="text-xl font-semibold text-foreground mb-4">Add Song from Spotify</h3>
            <div className="space-y-3">
              <Input
                placeholder="Song name"
                value={newSong.name}
                onChange={(e) => setNewSong({ ...newSong, name: e.target.value })}
              />
              <Input
                placeholder="Artist name"
                value={newSong.artist}
                onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
              />
              <Input
                placeholder="Spotify URL (optional)"
                value={newSong.spotifyUrl}
                onChange={(e) => setNewSong({ ...newSong, spotifyUrl: e.target.value })}
              />
              <Button onClick={handleAddSong} variant="companionship" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add to Playlist
              </Button>
            </div>
          </Card>

          {playlist.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search your playlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          <div className="space-y-4">
            {filteredPlaylist.map((song) => (
              <Card key={song.id} className="p-4 shadow-gentle hover:shadow-companionship transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{song.name}</h4>
                    <p className="text-sm text-muted-foreground">{song.artist}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handlePlaySpotify(song.id, song.spotifyUrl)}
                      variant="companionship"
                      size="sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => deleteSong(song.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {playlist.length === 0 && (
            <Card className="p-8 text-center shadow-gentle">
              <Music2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Your playlist is empty. Add some songs!</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Card className="p-6 shadow-gentle bg-muted/30">
        <div className="text-center">
          <Heart className="w-8 h-8 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Music for Your Soul</h3>
          <p className="text-muted-foreground">
            Combine calming ambient sounds with your favorite songs to create the perfect atmosphere.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default MusicWithSpotify;
