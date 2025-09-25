import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Plus, 
  Heart, 
  Star, 
  Smile,
  Search,
  Filter,
  Edit,
  Trash2,
  Calendar,
  Tag,
  Camera,
  Palette
} from "lucide-react";
import { toast } from "sonner";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: "happy" | "peaceful" | "grateful" | "reflective" | "excited" | "nostalgic";
  tags: string[];
  date: Date;
  color: string;
  isFavorite: boolean;
}

const PinterestJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: "1",
      title: "Beautiful Morning Walk",
      content: "Today I took a lovely walk in the park. The flowers were blooming and I felt so peaceful watching the birds sing. It reminded me of walks I used to take with my dear mother.",
      mood: "peaceful",
      tags: ["nature", "memories", "walking"],
      date: new Date("2025-01-20"),
      color: "bg-green-50 border-green-200",
      isFavorite: true
    },
    {
      id: "2",
      title: "Family Video Call",
      content: "Had the most wonderful video call with my grandchildren today! They showed me their drawings and we played online games together. Technology is amazing.",
      mood: "happy",
      tags: ["family", "grandchildren", "technology"],
      date: new Date("2025-01-18"),
      color: "bg-blue-50 border-blue-200",
      isFavorite: false
    },
    {
      id: "3",
      title: "Gratitude for Friends",
      content: "Feeling so grateful for my dear friend Sarah who brought me homemade soup when I wasn't feeling well. True friendship is such a blessing.",
      mood: "grateful",
      tags: ["friendship", "gratitude", "kindness"],
      date: new Date("2025-01-15"),
      color: "bg-pink-50 border-pink-200",
      isFavorite: true
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    mood: "happy" as JournalEntry["mood"],
    tags: "",
    color: "bg-purple-50 border-purple-200"
  });

  const moodOptions = [
    { value: "happy", label: "Happy", icon: "😊", color: "bg-yellow-50 border-yellow-200" },
    { value: "peaceful", label: "Peaceful", icon: "😌", color: "bg-green-50 border-green-200" },
    { value: "grateful", label: "Grateful", icon: "🙏", color: "bg-pink-50 border-pink-200" },
    { value: "reflective", label: "Reflective", icon: "🤔", color: "bg-blue-50 border-blue-200" },
    { value: "excited", label: "Excited", icon: "🤩", color: "bg-orange-50 border-orange-200" },
    { value: "nostalgic", label: "Nostalgic", icon: "💭", color: "bg-purple-50 border-purple-200" }
  ];

  const colorOptions = [
    "bg-purple-50 border-purple-200",
    "bg-pink-50 border-pink-200", 
    "bg-blue-50 border-blue-200",
    "bg-green-50 border-green-200",
    "bg-yellow-50 border-yellow-200",
    "bg-orange-50 border-orange-200",
    "bg-red-50 border-red-200",
    "bg-indigo-50 border-indigo-200"
  ];

  const handleAddEntry = () => {
    if (!newEntry.title || !newEntry.content) {
      toast("Please fill in title and content");
      return;
    }

    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: newEntry.title,
      content: newEntry.content,
      mood: newEntry.mood,
      tags: newEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      date: new Date(),
      color: newEntry.color,
      isFavorite: false
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry({
      title: "",
      content: "",
      mood: "happy",
      tags: "",
      color: "bg-purple-50 border-purple-200"
    });
    setShowAddForm(false);
    toast("✨ Journal entry added!");
  };

  const toggleFavorite = (id: string) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry
    ));
    toast("❤️ Updated favorites!");
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    toast("Deleted journal entry");
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesMood = selectedMood === "all" || entry.mood === selectedMood;
    
    return matchesSearch && matchesMood;
  });

  const getMoodIcon = (mood: string) => {
    const moodOption = moodOptions.find(m => m.value === mood);
    return moodOption ? moodOption.icon : "😊";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-elder-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          My Beautiful Journal
        </h2>
        <p className="text-elder-lg text-muted-foreground">
          Capture your precious memories and thoughts in a beautiful, Pinterest-inspired journal
        </p>
      </div>

      {/* Quick Stats & Add Button */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="text-elder-2xl font-bold text-purple-600">{entries.length}</div>
          <div className="text-elder-sm text-purple-600">Total Entries</div>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-pink-50 to-red-50 border-pink-200">
          <div className="text-elder-2xl font-bold text-pink-600">{entries.filter(e => e.isFavorite).length}</div>
          <div className="text-elder-sm text-pink-600">Favorites</div>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="text-elder-2xl font-bold text-blue-600">{new Set(entries.flatMap(e => e.tags)).size}</div>
          <div className="text-elder-sm text-blue-600">Unique Tags</div>
        </Card>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="h-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Entry
        </Button>
      </div>

      {/* Add Entry Form */}
      {showAddForm && (
        <Card className="p-6 shadow-gentle bg-gradient-to-br from-purple-50/50 to-pink-50/50 border-purple-200">
          <h3 className="text-elder-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Edit className="w-5 h-5 text-primary" />
            Create New Journal Entry
          </h3>
          
          <div className="space-y-4">
            <Input
              placeholder="Give your entry a beautiful title..."
              value={newEntry.title}
              onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
              className="text-elder-base bg-white/80"
            />
            
            <Textarea
              placeholder="Share your thoughts, memories, and feelings..."
              value={newEntry.content}
              onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
              className="text-elder-base bg-white/80 min-h-32"
              rows={6}
            />
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-elder-sm font-medium text-foreground block mb-2">How are you feeling?</label>
                <select
                  value={newEntry.mood}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, mood: e.target.value as JournalEntry["mood"] }))}
                  className="w-full p-2 border border-border rounded-md text-elder-base bg-white/80"
                >
                  {moodOptions.map(mood => (
                    <option key={mood.value} value={mood.value}>
                      {mood.icon} {mood.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-elder-sm font-medium text-foreground block mb-2">Tags (comma-separated)</label>
                <Input
                  placeholder="family, memories, gratitude..."
                  value={newEntry.tags}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, tags: e.target.value }))}
                  className="text-elder-base bg-white/80"
                />
              </div>
            </div>
            
            <div>
              <label className="text-elder-sm font-medium text-foreground block mb-2 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Choose a color theme
              </label>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setNewEntry(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${color} ${
                      newEntry.color === color ? 'border-foreground scale-110' : 'border-border'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-6">
            <Button onClick={handleAddEntry} className="bg-gradient-to-r from-primary to-primary-glow">
              <Plus className="w-4 h-4 mr-2" />
              Save Entry
            </Button>
            <Button 
              onClick={() => setShowAddForm(false)} 
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Search & Filters */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4 shadow-gentle">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search your memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-elder-base"
            />
          </div>
        </Card>
        
        <Card className="p-4 shadow-gentle">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className="flex-1 p-2 border border-border rounded-md text-elder-base bg-background"
            >
              <option value="all">All Moods</option>
              {moodOptions.map(mood => (
                <option key={mood.value} value={mood.value}>
                  {mood.icon} {mood.label}
                </option>
              ))}
            </select>
          </div>
        </Card>
      </div>

      {/* Pinterest-style Journal Grid */}
      {filteredEntries.length === 0 ? (
        <Card className="p-8 shadow-gentle text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-elder-lg text-muted-foreground">
            {searchQuery || selectedMood !== "all" ? "No entries match your search" : "Your journal is waiting for your first entry"}
          </p>
          <p className="text-elder-base text-muted-foreground mt-2">
            Start writing your beautiful memories today! ✨
          </p>
        </Card>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredEntries.map((entry) => (
            <Card 
              key={entry.id} 
              className={`break-inside-avoid p-6 shadow-gentle hover:shadow-companionship transition-all cursor-pointer ${entry.color} group`}
            >
              {/* Entry Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-elder-lg font-semibold text-foreground mb-2">
                    {entry.title}
                  </h3>
                  <div className="flex items-center gap-2 text-elder-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {entry.date.toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    onClick={() => toggleFavorite(entry.id)}
                    variant="ghost"
                    size="sm"
                    className="p-1"
                  >
                    <Heart className={`w-4 h-4 ${entry.isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                  </Button>
                  <Button
                    onClick={() => deleteEntry(entry.id)}
                    variant="ghost"
                    size="sm"
                    className="p-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Mood Badge */}
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="bg-white/60">
                  {getMoodIcon(entry.mood)} {entry.mood}
                </Badge>
                {entry.isFavorite && (
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                )}
              </div>

              {/* Content */}
              <p className="text-elder-base text-foreground mb-4 leading-relaxed">
                {entry.content}
              </p>

              {/* Tags */}
              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs bg-white/60 hover:bg-white/80 transition-colors"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Inspiration Footer */}
      <Card className="p-6 shadow-gentle bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-center">
        <h3 className="text-elder-lg font-semibold text-foreground mb-2">✨ Journal Inspiration ✨</h3>
        <div className="grid md:grid-cols-3 gap-4 text-elder-sm text-muted-foreground">
          <div>
            <p className="mb-2">💭 <strong>Memories:</strong> What made you smile today?</p>
            <p>🌸 <strong>Gratitude:</strong> What are you thankful for?</p>
          </div>
          <div>
            <p className="mb-2">👥 <strong>People:</strong> Who brightened your day?</p>
            <p>🌈 <strong>Feelings:</strong> How did today make you feel?</p>
          </div>
          <div>
            <p className="mb-2">🌟 <strong>Dreams:</strong> What are you looking forward to?</p>
            <p>📖 <strong>Stories:</strong> What story does today tell?</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PinterestJournal;