import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music2, Heart, Search, Plus, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Song {
  id: string;
  name: string;
  artist: string;
  album?: string;
  spotifyUrl: string;
  addedAt: Date;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  embedUrl: string;
  addedAt: Date;
}

const MusicWithSpotify = () => {
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newSong, setNewSong] = useState({
    name: '',
    artist: '',
    spotifyUrl: ''
  });
  const [newPlaylist, setNewPlaylist] = useState({
    name: '',
    description: '',
    embedUrl: ''
  });
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);

  // Spotify functions
  const handleAddSong = () => {
    if (!newSong.name || !newSong.artist) {
      toast.error('Please fill in song name and artist');
      return;
    }

    const song: Song = {
      id: Date.now().toString(),
      ...newSong,
      spotifyUrl: newSong.spotifyUrl || `https://open.spotify.com/search/${encodeURIComponent(newSong.name + ' ' + newSong.artist)}`,
      addedAt: new Date()
    };

    setPlaylist([...playlist, song]);
    setNewSong({ name: '', artist: '', spotifyUrl: '' });
    toast.success(`${song.name} added to playlist! 🎵`);
  };

  const handleAddPlaylist = () => {
    if (!newPlaylist.name || !newPlaylist.embedUrl) {
      toast.error('Please fill in playlist name and Spotify embed URL');
      return;
    }

    const playlistItem: Playlist = {
      id: Date.now().toString(),
      ...newPlaylist,
      addedAt: new Date()
    };

    setPlaylists([...playlists, playlistItem]);
    setNewPlaylist({ name: '', description: '', embedUrl: '' });
    toast.success(`${playlistItem.name} playlist added! 🎵`);
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

  const deletePlaylist = (id: string) => {
    setPlaylists(playlists.filter(p => p.id !== id));
    toast.success('Playlist removed');
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
          Spotify Music
        </h2>
        <p className="text-lg text-muted-foreground">
          Your favorite songs and playlists from Spotify
        </p>
      </div>

      <div className="space-y-6">
        {/* Add Spotify Playlist */}
        <Card className="p-6 shadow-gentle">
          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Music2 className="w-5 h-5 text-primary" />
            Add Spotify Playlist
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            To add a playlist: Open Spotify → Click "..." on a playlist → Share → Copy Embed Code → Paste the iframe src URL below
          </p>
          <div className="space-y-3">
            <Input
              placeholder="Playlist name (e.g., Relaxing Jazz)"
              value={newPlaylist.name}
              onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
            />
            <Input
              placeholder="Description (optional)"
              value={newPlaylist.description}
              onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
            />
            <Input
              placeholder="Spotify embed URL (e.g., https://open.spotify.com/embed/playlist/...)"
              value={newPlaylist.embedUrl}
              onChange={(e) => setNewPlaylist({ ...newPlaylist, embedUrl: e.target.value })}
            />
            <Button onClick={handleAddPlaylist} variant="companionship" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Playlist
            </Button>
          </div>
        </Card>

        {/* Display Playlists */}
        {playlists.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">My Playlists</h3>
            {playlists.map((pl) => (
              <Card key={pl.id} className="p-6 shadow-gentle hover:shadow-companionship transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">{pl.name}</h4>
                    {pl.description && <p className="text-sm text-muted-foreground">{pl.description}</p>}
                  </div>
                  <Button
                    onClick={() => deletePlaylist(pl.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <iframe
                  src={pl.embedUrl}
                  width="100%"
                  height="380"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-lg"
                ></iframe>
              </Card>
            ))}
          </div>
        )}

        {/* Add Individual Songs */}
        <Card className="p-6 shadow-gentle">
          <h3 className="text-xl font-semibold text-foreground mb-4">Add Individual Songs</h3>
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
              placeholder="Spotify URL (optional - will search if empty)"
              value={newSong.spotifyUrl}
              onChange={(e) => setNewSong({ ...newSong, spotifyUrl: e.target.value })}
            />
            <Button onClick={handleAddSong} variant="companionship" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Song
            </Button>
          </div>
        </Card>

        {playlist.length > 0 && (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search your songs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">My Songs</h3>
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
          </>
        )}

        {playlist.length === 0 && playlists.length === 0 && (
          <Card className="p-8 text-center shadow-gentle">
            <Music2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No music added yet. Add playlists or songs above!</p>
          </Card>
        )}

        <Card className="p-6 shadow-gentle bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="text-center">
            <Heart className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Music for Your Soul</h3>
            <p className="text-muted-foreground">
              Enjoy your favorite Spotify playlists and songs all in one place. Music has the power to uplift, comfort, and bring joy!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MusicWithSpotify;
