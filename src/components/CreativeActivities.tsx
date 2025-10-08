import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Palette, BookOpen, Camera, Puzzle, Gamepad2, Heart, Coffee, Star, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const CreativeActivities = () => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const activities = [
    {
      id: "coloring",
      title: "Coloring Therapy",
      icon: Palette,
      color: "text-purple-500",
      description: "Relax with beautiful mandala patterns",
      action: () => {
        toast.success("🎨 Opening coloring activity...");
        // Could navigate to a coloring page or open a modal
      }
    },
    {
      id: "music",
      title: "Music Memories",
      icon: Music,
      color: "text-blue-500",
      description: "Listen to classics from your era",
      action: () => {
        toast.success("🎵 Preparing your favorite tunes...");
      }
    },
    {
      id: "stories",
      title: "Story Time",
      icon: BookOpen,
      color: "text-green-500",
      description: "Read or listen to heartwarming stories",
      action: () => {
        toast.success("📚 Loading story collection...");
      }
    },
    {
      id: "memories",
      title: "Memory Lane",
      icon: Camera,
      color: "text-pink-500",
      description: "Create a photo album of memories",
      action: () => {
        toast.success("📸 Opening memory creator...");
      }
    },
    {
      id: "puzzles",
      title: "Brain Puzzles",
      icon: Puzzle,
      color: "text-orange-500",
      description: "Keep your mind sharp with fun puzzles",
      action: () => {
        toast.success("🧩 Loading puzzle games...");
      }
    },
    {
      id: "games",
      title: "Gentle Games",
      icon: Gamepad2,
      color: "text-indigo-500",
      description: "Relaxing games at your own pace",
      action: () => {
        toast.success("🎮 Starting games...");
      }
    },
    {
      id: "meditation",
      title: "Guided Meditation",
      icon: Heart,
      color: "text-red-500",
      description: "Peaceful moments of mindfulness",
      action: () => {
        toast.success("🧘 Beginning meditation...");
      }
    },
    {
      id: "recipes",
      title: "Memory Recipes",
      icon: Coffee,
      color: "text-amber-500",
      description: "Rediscover favorite old recipes",
      action: () => {
        toast.success("☕ Opening recipe book...");
      }
    }
  ];

  const quotes = [
    "Every day is a new canvas to paint! 🎨",
    "Creativity knows no age! ✨",
    "Your memories are treasures! 💎",
    "Keep your mind active and heart happy! ❤️",
    "Learning and fun never get old! 🌟"
  ];

  const handleActivityClick = (activity: typeof activities[0]) => {
    setSelectedActivity(activity.id);
    activity.action();
    
    // Show encouraging message
    setTimeout(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      toast(randomQuote, { duration: 3000 });
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          Creative Activities
        </h2>
        <p className="text-lg text-muted-foreground">
          Discover activities designed to bring joy and keep your mind active
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <Card
              key={activity.id}
              className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                selectedActivity === activity.id ? 'ring-2 ring-primary shadow-gentle' : ''
              }`}
              onClick={() => handleActivityClick(activity)}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`${activity.color} bg-background p-4 rounded-full`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-foreground">{activity.title}</h3>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Start Activity
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 shadow-gentle bg-gradient-to-br from-primary/5 to-accent/5">
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          Why Activities Matter
        </h3>
        <ul className="space-y-2 text-muted-foreground">
          <li>• <strong>Mental Wellness:</strong> Keep your mind sharp and engaged</li>
          <li>• <strong>Emotional Health:</strong> Activities bring joy and reduce stress</li>
          <li>• <strong>Social Connection:</strong> Share your creations with loved ones</li>
          <li>• <strong>Memory Preservation:</strong> Create and relive beautiful moments</li>
          <li>• <strong>Physical Benefits:</strong> Gentle activities improve coordination</li>
          <li>• <strong>Purpose & Joy:</strong> Each activity brings meaning to your day</li>
        </ul>
      </Card>
    </div>
  );
};

export default CreativeActivities;
