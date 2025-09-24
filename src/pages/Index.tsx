import { useState } from "react";
import { MessageCircle, Heart, BarChart3, Book, Users, Smile, Phone, Gamepad2, Music2, Palette, BookOpen, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChatInterface } from "@/components/ChatInterface";
import { MoodJournal } from "@/components/MoodJournal";
import { Dashboard } from "@/components/Dashboard";
import { CBTExercises } from "@/components/CBTExercises";
import Games from "@/components/Games";
import Spotify from "@/components/Spotify";
import Doodle from "@/components/Doodle";
import Journal from "@/components/Journal";
import NotePad from "@/components/NotePad";
import heroImage from "@/assets/hero-wellness.jpg";

type ActiveView = "chat" | "mood" | "dashboard" | "exercises" | "games" | "music" | "doodle" | "journal" | "notepad";

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
      case "games":
        return <Games />;
      case "music":
        return <Spotify />;
      case "doodle":
        return <Doodle />;
      case "journal":
        return <Journal />;
      case "notepad":
        return <NotePad />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-fun">
      {/* Header */}
      <header className="bg-card/90 backdrop-blur-sm border-b border-border shadow-companionship">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-gentle">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-elder-2xl font-bold text-foreground">Companion</h1>
                <p className="text-elder-base text-muted-foreground">Your caring companion, always here for you</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={activeView === "chat" ? "companionship" : "nurturing"}
                size="sm"
                onClick={() => setActiveView("chat")}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Chat</span>
              </Button>
              <Button
                variant={activeView === "mood" ? "companionship" : "nurturing"}
                size="sm"
                onClick={() => setActiveView("mood")}
              >
                <Smile className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Mood</span>
              </Button>
              <Button
                variant={activeView === "games" ? "companionship" : "nurturing"}
                size="sm"
                onClick={() => setActiveView("games")}
              >
                <Gamepad2 className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Games</span>
              </Button>
              <Button
                variant={activeView === "music" ? "companionship" : "nurturing"}
                size="sm"
                onClick={() => setActiveView("music")}
              >
                <Music2 className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Music</span>
              </Button>
              <Button
                variant={activeView === "doodle" ? "companionship" : "nurturing"}
                size="sm"
                onClick={() => setActiveView("doodle")}
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Doodle</span>
              </Button>
              <Button
                variant={activeView === "journal" ? "companionship" : "nurturing"}
                size="sm"
                onClick={() => setActiveView("journal")}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Journal</span>
              </Button>
              <Button
                variant={activeView === "notepad" ? "companionship" : "nurturing"}
                size="sm"
                onClick={() => setActiveView("notepad")}
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Notes</span>
              </Button>
              <Button
                variant={activeView === "dashboard" ? "companionship" : "nurturing"}
                size="sm"
                onClick={() => setActiveView("dashboard")}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Progress</span>
              </Button>
              <Button
                variant={activeView === "exercises" ? "companionship" : "nurturing"}
                size="sm"
                onClick={() => setActiveView("exercises")}
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Activities</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section - Only show on chat view */}
      {activeView === "chat" && (
        <div className="relative overflow-hidden bg-gradient-rainbow shadow-colorful">
          <img 
            src={heroImage} 
            alt="Warm, welcoming companion space" 
            className="absolute inset-0 w-full h-40 object-cover opacity-20"
          />
          <div className="relative container mx-auto px-6 py-12">
            <div className="text-center text-white max-w-2xl mx-auto">
              <h2 className="text-elder-3xl font-bold mb-4 drop-shadow-lg">
                🌈 Welcome, Beautiful Soul! 🌈
              </h2>
              <p className="text-elder-xl text-white/95 mb-6 drop-shadow-md">
                ✨ You're amazing and you matter! I'm here to brighten your day with colorful activities and loving support. ✨
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="companionship" size="lg" className="text-elder-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm shadow-colorful">
                  <Phone className="w-6 h-6 mr-2" />
                  💜 Emergency Support: 988
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-card/80 border-t border-border shadow-gentle mt-16">
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-elder-lg text-muted-foreground font-semibold">
            Companion - You always have a friend here
          </p>
          <p className="text-elder-base text-muted-foreground mt-3">
            This app provides friendly conversation and emotional support. For mental health emergencies, please call 988 or your local crisis line.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;