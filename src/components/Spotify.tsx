import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Music2, Plus, Play, Pause, Heart, ExternalLink, Trash2, Shuffle } from "lucide-react";
import { toast } from "sonner";

interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
  imageUrl?: string;
}

interface Track {
  id: string;
  name: string;
  artist: string;
  duration: string;
  spotifyUrl: string;
}

const Spotify = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showAddPlaylist, setShowAddPlaylist] = useState(false);
  const [showAddTrack, setShowAddTrack] = useState<string | null>(null);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '' });
  const [newTrack, setNewTrack] = useState({ name: '', artist: '', spotifyUrl: '' });

  // Load playlists from localStorage on component mount
  useEffect(() => {
    const savedPlaylists = localStorage.getItem('spotify-playlists');
    if (savedPlaylists) {
      setPlaylists(JSON.parse(savedPlaylists));
    } else {
      // Add some example playlists
      const examplePlaylists: Playlist[] = [
        {
          id: '1',
          name: 'Feel Good Vibes',
          description: 'Happy songs to brighten your day',
          tracks: [
            {
              id: '1',
              name: 'Good as Hell',
              artist: 'Lizzo',
              duration: '3:45',
              spotifyUrl: 'https://open.spotify.com/track/example1'
            }
          ]
        }
      ];
      setPlaylists(examplePlaylists);
      localStorage.setItem('spotify-playlists', JSON.stringify(examplePlaylists));
    }
  }, []);

  // Save playlists to localStorage whenever playlists change
  useEffect(() => {
    localStorage.setItem('spotify-playlists', JSON.stringify(playlists));
  }, [playlists]);

  const handleCreatePlaylist = () => {
    if (!newPlaylist.name.trim()) {
      toast("Please enter a playlist name");
      return;
    }

    const playlist: Playlist = {
      id: Date.now().toString(),
      name: newPlaylist.name,
      description: newPlaylist.description,
      tracks: []
    };

    setPlaylists(prev => [...prev, playlist]);
    setNewPlaylist({ name: '', description: '' });
    setShowAddPlaylist(false);
    toast("Playlist created! 🎵");
  };

  const handleAddTrack = (playlistId: string) => {
    if (!newTrack.name.trim() || !newTrack.artist.trim()) {
      toast("Please fill in song name and artist");
      return;
    }

    const track: Track = {
      id: Date.now().toString(),
      name: newTrack.name,
      artist: newTrack.artist,
      duration: '3:30', // Default duration
      spotifyUrl: newTrack.spotifyUrl || `https://open.spotify.com/search/${encodeURIComponent(newTrack.name + ' ' + newTrack.artist)}`
    };

    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId 
        ? { ...playlist, tracks: [...playlist.tracks, track] }
        : playlist
    ));

    setNewTrack({ name: '', artist: '', spotifyUrl: '' });
    setShowAddTrack(null);
    toast("Track added! 🎶");
  };

  const deletePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
    toast("Playlist deleted");
  };

  const deleteTrack = (playlistId: string, trackId: string) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId 
        ? { ...playlist, tracks: playlist.tracks.filter(t => t.id !== trackId) }
        : playlist
    ));
    toast("Track removed");
  };

  const togglePlay = (trackId: string) => {
    setCurrentPlaying(currentPlaying === trackId ? null : trackId);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-elder-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <Music2 className="w-8 h-8 text-primary" />
          Your Music Playlists
        </h2>
        <p className="text-elder-lg text-muted-foreground mb-6">
          Create playlists and add your favorite songs from Spotify
        </p>
        <Button 
          onClick={() => setShowAddPlaylist(!showAddPlaylist)} 
          variant="companionship" 
          size="lg"
          className="bg-gradient-fun shadow-colorful"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Playlist
        </Button>
      </div>

      {/* Add New Playlist Form */}
      {showAddPlaylist && (
        <Card className="p-6 shadow-colorful border-2 border-primary/20">
          <h3 className="text-elder-xl font-semibold text-foreground mb-4">Create New Playlist</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-elder-base font-medium text-foreground mb-2">Playlist Name</label>
              <Input
                value={newPlaylist.name}
                onChange={(e) => setNewPlaylist(prev => ({ ...prev, name: e.target.value }))}
                placeholder="My Awesome Playlist..."
              />
            </div>
            <div>
              <label className="block text-elder-base font-medium text-foreground mb-2">Description</label>
              <Input
                value={newPlaylist.description}
                onChange={(e) => setNewPlaylist(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Songs that make me happy..."
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleCreatePlaylist} variant="companionship">
                Create
              </Button>
              <Button onClick={() => setShowAddPlaylist(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Playlists Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {playlists.map((playlist) => (
          <Card key={playlist.id} className="p-6 shadow-colorful border-2 border-primary/10 hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-elder-xl font-semibold text-foreground">{playlist.name}</h3>
                <p className="text-muted-foreground">{playlist.description}</p>
                <Badge variant="secondary" className="mt-2">
                  {playlist.tracks.length} songs
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowAddTrack(showAddTrack === playlist.id ? null : playlist.id)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => deletePlaylist(playlist.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Add Track Form */}
            {showAddTrack === playlist.id && (
              <div className="bg-gradient-primary/5 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-foreground mb-3">Add Song from Spotify</h4>
                <div className="space-y-3">
                  <Input
                    value={newTrack.name}
                    onChange={(e) => setNewTrack(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Song name..."
                  />
                  <Input
                    value={newTrack.artist}
                    onChange={(e) => setNewTrack(prev => ({ ...prev, artist: e.target.value }))}
                    placeholder="Artist name..."
                  />
                  <Input
                    value={newTrack.spotifyUrl}
                    onChange={(e) => setNewTrack(prev => ({ ...prev, spotifyUrl: e.target.value }))}
                    placeholder="Spotify link (optional)..."
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleAddTrack(playlist.id)}>
                      Add Song
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowAddTrack(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Track List */}
            <div className="space-y-2">
              {playlist.tracks.map((track) => (
                <div key={track.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => togglePlay(track.id)}
                      className="w-8 h-8 p-0"
                    >
                      {currentPlaying === track.id ? 
                        <Pause className="w-4 h-4" /> : 
                        <Play className="w-4 h-4" />
                      }
                    </Button>
                    <div>
                      <p className="font-medium text-foreground">{track.name}</p>
                      <p className="text-sm text-muted-foreground">{track.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => window.open(track.spotifyUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => deleteTrack(playlist.id, track.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {playlist.tracks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Music2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No songs yet. Add some tracks to get started!</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {playlists.length === 0 && (
        <Card className="p-8 text-center shadow-colorful">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-fun rounded-full flex items-center justify-center mx-auto">
              <Music2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-elder-xl font-semibold text-foreground">No playlists yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Create your first playlist and start adding your favorite songs from Spotify!
            </p>
          </div>
        </Card>
      )}

      {/* Info Card */}
      <Card className="p-6 shadow-gentle bg-gradient-primary/5">
        <div className="flex items-start gap-4">
          <Heart className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-elder-lg font-semibold text-foreground mb-2">How to add songs from Spotify</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>• Search for your favorite songs on Spotify</p>
              <p>• Copy the song name and artist into the form above</p>
              <p>• Optionally paste the Spotify link for direct access</p>
              <p>• Click "Add Song" to save it to your playlist</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Spotify;