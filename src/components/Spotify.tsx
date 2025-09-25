import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Music, 
  Plus, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  Heart,
  ExternalLink,
  Search
} from "lucide-react";
import { toast } from "sonner";

interface Song {
  id: string;
  name: string;
  artist: string;
  album?: string;
  spotifyUrl: string;
  addedAt: Date;
}

const Spotify = () => {
  const [playlist, setPlaylist] = useState<Song[]>([
    {
      id: "1",
      name: "What a Wonderful World",
      artist: "Louis Armstrong",
      album: "Greatest Hits",
      spotifyUrl: "https://open.spotify.com/track/example1",
      addedAt: new Date()
    },
    {
      id: "2", 
      name: "Fly Me to the Moon",
      artist: "Frank Sinatra",
      album: "Sinatra at the Sands",
      spotifyUrl: "https://open.spotify.com/track/example2",
      addedAt: new Date()
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [newSong, setNewSong] = useState({ name: "", artist: "", spotifyUrl: "" });
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAddSong = () => {
    if (!newSong.name || !newSong.artist) {
      toast("Please fill in song name and artist");
      return;
    }

    const song: Song = {
      id: Date.now().toString(),
      name: newSong.name,
      artist: newSong.artist,
      spotifyUrl: newSong.spotifyUrl || `https://open.spotify.com/search/${encodeURIComponent(newSong.name + " " + newSong.artist)}`,
      addedAt: new Date()
    };

    setPlaylist(prev => [...prev, song]);
    setNewSong({ name: "", artist: "", spotifyUrl: "" });
    toast(`🎵 Added "${song.name}" to your playlist!`);
  };

  const handlePlayPause = (songId: string) => {
    if (currentPlaying === songId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentPlaying(songId);
      setIsPlaying(true);
    }
    
    const song = playlist.find(s => s.id === songId);
    if (song) {
      toast(`${isPlaying ? "Paused" : "Playing"} "${song.name}"`);
    }
  };

  const openSpotify = (url: string) => {
    window.open(url, '_blank');
    toast("Opening in Spotify! 🎵");
  };

  const filteredPlaylist = playlist.filter(song =>
    song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-elder-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <Music className="w-8 h-8 text-primary" />
          Your Spotify Playlist
        </h2>
        <p className="text-elder-lg text-muted-foreground">
          Add your favorite songs from Spotify and create your perfect playlist
        </p>
      </div>

      {/* Add New Song */}
      <Card className="p-6 shadow-gentle">
        <h3 className="text-elder-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Add Song from Spotify
        </h3>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <Input
            placeholder="Song name"
            value={newSong.name}
            onChange={(e) => setNewSong(prev => ({ ...prev, name: e.target.value }))}
            className="text-elder-base"
          />
          <Input
            placeholder="Artist name"
            value={newSong.artist}
            onChange={(e) => setNewSong(prev => ({ ...prev, artist: e.target.value }))}
            className="text-elder-base"
          />
          <Input
            placeholder="Spotify URL (optional)"
            value={newSong.spotifyUrl}
            onChange={(e) => setNewSong(prev => ({ ...prev, spotifyUrl: e.target.value }))}
            className="text-elder-base"
          />
        </div>
        <Button onClick={handleAddSong} className="w-full" variant="companionship">
          <Plus className="w-4 h-4 mr-2" />
          Add to Playlist
        </Button>
      </Card>

      {/* Search & Filter */}
      <Card className="p-4 shadow-gentle">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search your playlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-elder-base"
          />
        </div>
      </Card>

      {/* Playlist */}
      <Card className="p-6 shadow-gentle">
        <h3 className="text-elder-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Your Playlist ({filteredPlaylist.length} songs)
        </h3>
        
        {filteredPlaylist.length === 0 ? (
          <div className="text-center py-8">
            <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-elder-lg text-muted-foreground">
              {searchQuery ? "No songs match your search" : "Your playlist is empty"}
            </p>
            <p className="text-elder-base text-muted-foreground mt-2">
              Add some songs to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPlaylist.map((song) => (
              <div 
                key={song.id}
                className={`
                  flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-gentle
                  ${currentPlaying === song.id ? 'bg-primary/10 border-primary/20' : 'bg-card border-border'}
                `}
              >
                <div className="flex items-center gap-4 flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePlayPause(song.id)}
                    className="shrink-0"
                  >
                    {currentPlaying === song.id && isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-elder-base font-medium text-foreground truncate">
                      {song.name}
                    </h4>
                    <p className="text-elder-sm text-muted-foreground truncate">
                      {song.artist} {song.album && `• ${song.album}`}
                    </p>
                  </div>
                  
                  {currentPlaying === song.id && (
                    <Badge variant="secondary" className="animate-pulse">
                      Now Playing
                    </Badge>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openSpotify(song.spotifyUrl)}
                  className="shrink-0 ml-2"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Player Controls */}
      {currentPlaying && (
        <Card className="p-4 shadow-gentle bg-gradient-primary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                <Music className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-elder-base font-medium text-primary-foreground">
                  {playlist.find(s => s.id === currentPlaying)?.name}
                </p>
                <p className="text-elder-sm text-primary-foreground/80">
                  {playlist.find(s => s.id === currentPlaying)?.artist}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-primary-foreground">
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handlePlayPause(currentPlaying)}
                className="text-primary-foreground"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="sm" className="text-primary-foreground">
                <SkipForward className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-primary-foreground">
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Spotify Integration Info */}
      <Card className="p-4 shadow-gentle bg-muted/30">
        <h3 className="text-elder-lg font-semibold text-foreground mb-2">How to use Spotify Integration</h3>
        <div className="text-elder-base text-muted-foreground space-y-2">
          <p>• Search for songs on Spotify and copy the song URL</p>
          <p>• Or just add the song name and artist - we'll help you find it!</p>
          <p>• Click the external link icon to open songs directly in Spotify</p>
          <p>• Use the play buttons to track what you're listening to</p>
        </div>
      </Card>
    </div>
  );
};

export default Spotify;