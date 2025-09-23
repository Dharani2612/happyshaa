import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Plus, 
  Calendar, 
  Heart, 
  Star, 
  Target,
  Lightbulb,
  Smile,
  Cloud,
  Sun
} from "lucide-react";
import { toast } from "sonner";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: 'happy' | 'peaceful' | 'thoughtful' | 'challenging';
  tags: string[];
  gratitude?: string[];
  goals?: string[];
}

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      title: 'A Beautiful Day',
      content: 'Today was filled with small moments of joy. I noticed the way sunlight filtered through my window this morning, and it reminded me to appreciate the simple things.',
      date: '2024-01-15',
      mood: 'happy',
      tags: ['gratitude', 'mindfulness'],
      gratitude: ['Morning sunlight', 'Peaceful moments', 'Good health']
    }
  ]);
  
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 'peaceful' as JournalEntry['mood'],
    tags: [] as string[],
    gratitude: ['', '', ''],
    goals: ['', '', '']
  });
  const [newTag, setNewTag] = useState('');

  const moodOptions = [
    { value: 'happy', label: 'Happy', icon: Smile, color: 'from-yellow-400 to-orange-400' },
    { value: 'peaceful', label: 'Peaceful', icon: Sun, color: 'from-blue-400 to-green-400' },
    { value: 'thoughtful', label: 'Thoughtful', icon: Lightbulb, color: 'from-purple-400 to-blue-400' },
    { value: 'challenging', label: 'Challenging', icon: Cloud, color: 'from-gray-400 to-blue-400' }
  ];

  const handleSaveEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      toast.error('Please add a title and write about your day');
      return;
    }

    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: newEntry.title,
      content: newEntry.content,
      date: new Date().toISOString().split('T')[0],
      mood: newEntry.mood,
      tags: newEntry.tags,
      gratitude: newEntry.gratitude.filter(g => g.trim() !== ''),
      goals: newEntry.goals.filter(g => g.trim() !== '')
    };

    setEntries(prev => [entry, ...prev]);
    
    // Reset form
    setNewEntry({
      title: '',
      content: '',
      mood: 'peaceful',
      tags: [],
      gratitude: ['', '', ''],
      goals: ['', '', '']
    });
    setShowNewEntry(false);
    
    toast.success('Journal entry saved! 📝');
  };

  const addTag = () => {
    if (newTag.trim() && !newEntry.tags.includes(newTag.trim())) {
      setNewEntry(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const updateGratitude = (index: number, value: string) => {
    const newGratitude = [...newEntry.gratitude];
    newGratitude[index] = value;
    setNewEntry(prev => ({ ...prev, gratitude: newGratitude }));
  };

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...newEntry.goals];
    newGoals[index] = value;
    setNewEntry(prev => ({ ...prev, goals: newGoals }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMoodIcon = (mood: JournalEntry['mood']) => {
    const option = moodOptions.find(o => o.value === mood);
    return option?.icon || Smile;
  };

  const getMoodColor = (mood: JournalEntry['mood']) => {
    const option = moodOptions.find(o => o.value === mood);
    return option?.color || 'from-blue-400 to-green-400';
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-elder-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          Personal Journal
        </h2>
        <p className="text-elder-lg text-muted-foreground">
          Reflect on your thoughts, feelings, and daily experiences
        </p>
      </div>

      {/* New Entry Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => setShowNewEntry(!showNewEntry)}
          variant="companionship"
          size="lg"
          className="text-elder-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          {showNewEntry ? 'Cancel' : 'Write New Entry'}
        </Button>
      </div>

      {/* New Entry Form */}
      {showNewEntry && (
        <Card className="p-6 shadow-gentle">
          <h3 className="text-elder-xl font-semibold text-foreground mb-4">New Journal Entry</h3>
          
          <div className="space-y-6">
            {/* Title and Mood */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Title</label>
                <Input
                  placeholder="Give your entry a title..."
                  value={newEntry.title}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">How are you feeling?</label>
                <div className="grid grid-cols-2 gap-2">
                  {moodOptions.map((mood) => {
                    const IconComponent = mood.icon;
                    return (
                      <Button
                        key={mood.value}
                        variant={newEntry.mood === mood.value ? "companionship" : "outline"}
                        onClick={() => setNewEntry(prev => ({ ...prev, mood: mood.value as JournalEntry['mood'] }))}
                        className="h-auto p-3"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <IconComponent className="w-4 h-4" />
                          <span className="text-xs">{mood.label}</span>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                What's on your mind today?
              </label>
              <Textarea
                placeholder="Write about your day, your thoughts, feelings, or anything that comes to mind..."
                value={newEntry.content}
                onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-32"
              />
            </div>

            {/* Gratitude Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4 text-primary" />
                <label className="text-sm font-medium text-foreground">
                  Three things I'm grateful for today:
                </label>
              </div>
              <div className="space-y-2">
                {newEntry.gratitude.map((item, index) => (
                  <Input
                    key={index}
                    placeholder={`Gratitude ${index + 1}...`}
                    value={item}
                    onChange={(e) => updateGratitude(index, e.target.value)}
                  />
                ))}
              </div>
            </div>

            {/* Goals Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-primary" />
                <label className="text-sm font-medium text-foreground">
                  Goals or intentions for tomorrow:
                </label>
              </div>
              <div className="space-y-2">
                {newEntry.goals.map((goal, index) => (
                  <Input
                    key={index}
                    placeholder={`Goal ${index + 1}...`}
                    value={goal}
                    onChange={(e) => updateGoal(index, e.target.value)}
                  />
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="flex-1"
                />
                <Button onClick={addTag} variant="outline">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newEntry.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center pt-4">
              <Button onClick={handleSaveEntry} variant="companionship" size="lg">
                <BookOpen className="w-4 h-4 mr-2" />
                Save Entry
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Journal Entries */}
      <div className="space-y-6">
        <h3 className="text-elder-xl font-semibold text-foreground">Your Journal Entries</h3>
        
        {entries.map((entry) => {
          const MoodIcon = getMoodIcon(entry.mood);
          
          return (
            <Card key={entry.id} className="p-6 shadow-gentle">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getMoodColor(entry.mood)} flex items-center justify-center`}>
                    <MoodIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-elder-lg font-semibold text-foreground">{entry.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {formatDate(entry.date)}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {entry.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <p className="text-foreground mb-4 leading-relaxed">{entry.content}</p>

              {entry.gratitude && entry.gratitude.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Grateful for:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {entry.gratitude.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {entry.goals && entry.goals.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Goals:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {entry.goals.map((goal, index) => (
                      <li key={index}>{goal}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          );
        })}

        {entries.length === 1 && (
          <Card className="p-6 shadow-gentle bg-muted/30 text-center">
            <Star className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="text-elder-lg font-semibold text-foreground mb-2">Start Your Journey</h3>
            <p className="text-muted-foreground">
              This is your personal space for reflection and growth. Write regularly to track your progress and celebrate your journey.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Journal;