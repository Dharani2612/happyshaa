import { useState } from "react";
import { MessageCircle, Heart, BarChart3, Book, Brain, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChatInterface } from "@/components/ChatInterface";
import { MoodJournal } from "@/components/MoodJournal";
import { Dashboard } from "@/components/Dashboard";
import { CBTExercises } from "@/components/CBTExercises";
import heroImage from "@/assets/hero-wellness.jpg";

type ActiveView = "chat" | "mood" | "dashboard" | "exercises";

const Index = () => {
  const [activeView, setActiveView] = useState<ActiveView>("chat");

  const renderContent = () => {
    switch (activeView) {
      case "chat":
        return <ChatInterface />;
      case "mood":
        return <MoodJournal />;
      case "dashboard":
        return <Dashboard />;
      case "exercises":
        return <CBTExercises />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-healing">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 shadow-gentle">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">WellMind</h1>
                <p className="text-xs text-muted-foreground">Your Mental Wellness Companion</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeView === "chat" ? "therapeutic" : "healing"}
                size="sm"
                onClick={() => setActiveView("chat")}
              >
                <MessageCircle className="w-4 h-4" />
                Chat
              </Button>
              <Button
                variant={activeView === "mood" ? "therapeutic" : "healing"}
                size="sm"
                onClick={() => setActiveView("mood")}
              >
                <Smile className="w-4 h-4" />
                Mood
              </Button>
              <Button
                variant={activeView === "dashboard" ? "therapeutic" : "healing"}
                size="sm"
                onClick={() => setActiveView("dashboard")}
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Button>
              <Button
                variant={activeView === "exercises" ? "therapeutic" : "healing"}
                size="sm"
                onClick={() => setActiveView("exercises")}
              >
                <Brain className="w-4 h-4" />
                Exercises
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Only show on chat view */}
      {activeView === "chat" && (
        <div className="relative overflow-hidden bg-gradient-primary">
          <img 
            src={heroImage} 
            alt="Therapeutic wellness background" 
            className="absolute inset-0 w-full h-32 object-cover opacity-20"
          />
          <div className="relative container mx-auto px-4 py-8">
            <div className="text-center text-primary-foreground">
              <h2 className="text-2xl font-bold mb-2">Hello, I'm here to support you</h2>
              <p className="text-primary-foreground/80">Let's have a conversation about how you're feeling today</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-card/50 border-t border-border/50 mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            WellMind - Supporting your mental wellness journey
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Remember: This app provides supportive conversations and is not a replacement for professional mental health care.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;