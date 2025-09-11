import { useState } from "react";
import { Calendar, Smile, Frown, Meh, TrendingUp, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface MoodEntry {
  id: string;
  date: Date;
  mood: 1 | 2 | 3 | 4 | 5;
  notes: string;
  activities: string[];
}

const moodOptions = [
  { value: 1, label: "Very Low", color: "text-destructive", icon: "😢" },
  { value: 2, label: "Low", color: "text-orange-500", icon: "🙁" },
  { value: 3, label: "Neutral", color: "text-muted-foreground", icon: "😐" },
  { value: 4, label: "Good", color: "text-primary", icon: "🙂" },
  { value: 5, label: "Excellent", color: "text-green-500", icon: "😊" },
];

const commonActivities = [
  "Exercise", "Meditation", "Social Time", "Work", "Hobbies", 
  "Rest", "Nature", "Reading", "Music", "Cooking"
];

export const MoodJournal = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([
    {
      id: "1",
      date: new Date(Date.now() - 86400000), // Yesterday
      mood: 3,
      notes: "Feeling okay today, had some challenges at work but managed well.",
      activities: ["Work", "Exercise", "Reading"]
    },
    {
      id: "2", 
      date: new Date(Date.now() - 2 * 86400000), // 2 days ago
      mood: 4,
      notes: "Good day! Spent time in nature and felt refreshed.",
      activities: ["Nature", "Exercise", "Social Time"]
    }
  ]);
  const { toast } = useToast();

  const handleActivityToggle = (activity: string) => {
    setSelectedActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handleSaveMoodEntry = () => {
    if (selectedMood === null) {
      toast({
        title: "Please select your mood",
        description: "Choose how you're feeling today before saving.",
        variant: "destructive",
      });
      return;
    }

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date(),
      mood: selectedMood as 1 | 2 | 3 | 4 | 5,
      notes,
      activities: selectedActivities
    };

    setMoodEntries(prev => [newEntry, ...prev]);
    setSelectedMood(null);
    setNotes("");
    setSelectedActivities([]);

    toast({
      title: "Mood entry saved! ✨",
      description: "Your wellness journey is being tracked. Keep up the great work!",
    });
  };

  const getAverageMood = () => {
    if (moodEntries.length === 0) return 0;
    const sum = moodEntries.reduce((acc, entry) => acc + entry.mood, 0);
    return (sum / moodEntries.length).toFixed(1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Today's Mood Entry */}
      <Card className="p-6 shadow-therapeutic border-primary/10">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Today's Mood Check-in</h2>
        </div>

        <div className="space-y-6">
          {/* Mood Selection */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">How are you feeling today?</h3>
            <div className="grid grid-cols-5 gap-3">
              {moodOptions.map((mood) => (
                <Button
                  key={mood.value}
                  variant={selectedMood === mood.value ? "therapeutic" : "healing"}
                  className="h-20 flex-col gap-1 transition-therapeutic"
                  onClick={() => setSelectedMood(mood.value)}
                >
                  <span className="text-2xl">{mood.icon}</span>
                  <span className="text-xs">{mood.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">What activities did you do today?</h3>
            <div className="flex flex-wrap gap-2">
              {commonActivities.map((activity) => (
                <Button
                  key={activity}
                  variant={selectedActivities.includes(activity) ? "calming" : "outline"}
                  size="sm"
                  onClick={() => handleActivityToggle(activity)}
                  className="transition-gentle"
                >
                  {activity}
                </Button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Any additional thoughts or reflections?</h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reflect on your day, challenges you faced, or things you're grateful for..."
              className="min-h-24 transition-gentle focus:shadow-gentle"
            />
          </div>

          <Button
            onClick={handleSaveMoodEntry}
            variant="therapeutic"
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Today's Entry
          </Button>
        </div>
      </Card>

      {/* Mood History & Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <Card className="p-6 shadow-gentle border-primary/10">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Wellness Insights</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gradient-healing rounded-lg">
              <span className="text-sm text-foreground">Average Mood</span>
              <span className="font-bold text-primary">{getAverageMood()}/5</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gradient-calm rounded-lg">
              <span className="text-sm text-accent-foreground">Entries This Week</span>
              <span className="font-bold text-accent-foreground">{moodEntries.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-accent/30 rounded-lg">
              <span className="text-sm text-accent-foreground">Most Common Activity</span>
              <span className="font-bold text-accent-foreground">Exercise</span>
            </div>
          </div>
        </Card>

        {/* Recent Entries */}
        <Card className="p-6 shadow-gentle border-primary/10">
          <h3 className="font-semibold text-foreground mb-4">Recent Entries</h3>
          <div className="space-y-3">
            {moodEntries.slice(0, 3).map((entry) => {
              const moodOption = moodOptions.find(m => m.value === entry.mood);
              return (
                <div key={entry.id} className="p-3 bg-gradient-healing rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{moodOption?.icon}</span>
                    <span className="text-sm font-medium text-foreground">
                      {entry.date.toLocaleDateString()}
                    </span>
                    <span className={`text-sm ${moodOption?.color}`}>
                      {moodOption?.label}
                    </span>
                  </div>
                  {entry.notes && (
                    <p className="text-xs text-muted-foreground truncate">
                      {entry.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};