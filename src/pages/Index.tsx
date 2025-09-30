import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Heart, BarChart3, Book, Users, Smile, Phone, Gamepad2, Palette, BookOpen, Music2, Calendar, PhoneIcon, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-wellness.jpg";
import { EnhancedChatInterface } from "@/components/EnhancedChatInterface";
import { MoodJournal } from "@/components/MoodJournal";
import { Dashboard } from "@/components/Dashboard";
import Settings from "@/components/Settings";
import { CBTExercises } from "@/components/CBTExercises";
import InterestingGames from "@/components/InterestingGames";
import MusicWithSpotify from "@/components/MusicWithSpotify";
import FixedDoodle from "@/components/FixedDoodle";
import PinterestJournal from "@/components/PinterestJournal";
import NotePad from "@/components/NotePad";
import Contacts from "@/components/Contacts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ActiveView = "chat" | "mood" | "dashboard" | "exercises" | "games" | "music" | "doodle" | "journal" | "notepad" | "contacts" | "settings";

const Index = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<ActiveView>("chat");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-companionship flex items-center justify-center">
        <p className="text-foreground text-lg">Loading...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case "chat":
        return <EnhancedChatInterface />;
      case "mood":
        return <MoodJournal />;
      case "dashboard":
        return <Dashboard />;
      case "settings":
        return <Settings />;
      case "exercises":
        return <CBTExercises />;
      case "games":
        return <InterestingGames />;
      case "music":
        return <MusicWithSpotify />;
      case "doodle":
        return <FixedDoodle />;
      case "journal":
        return <PinterestJournal />;
      case "notepad":
        return <NotePad />;
      case "contacts":
        return <Contacts />;
      default:
        return <EnhancedChatInterface />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-companionship">
      {/* Header */}
      <header className="bg-card/90 backdrop-blur-sm border-b border-border shadow-companionship">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-gentle">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-elder-2xl font-bold text-foreground">Shalala</h1>
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
              <Button
                variant={activeView === "notepad" ? "companionship" : "nurturing"}
                size="sm"
                onClick={() => setActiveView("notepad")}
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Schedule</span>
              </Button>
              <Button
                variant={activeView === "contacts" ? "companionship" : "nurturing"}
                size="sm"
                onClick={() => setActiveView("contacts")}
              >
                <PhoneIcon className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Contacts</span>
              </Button>
              <Button
                variant={activeView === "settings" ? "companionship" : "nurturing"}
                size="sm"
                onClick={() => setActiveView("settings")}
              >
                <SettingsIcon className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Settings</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section - Only show on chat view */}
      {activeView === "chat" && (
        <div className="relative overflow-hidden bg-gradient-primary shadow-companionship">
          <img 
            src={heroImage} 
            alt="Warm, welcoming companion space" 
            className="absolute inset-0 w-full h-40 object-cover opacity-25"
          />
          <div className="relative container mx-auto px-6 py-12">
            <div className="text-center text-primary-foreground max-w-2xl mx-auto">
              <h2 className="text-elder-3xl font-bold mb-4">Welcome, dear friend</h2>
              <p className="text-elder-xl text-primary-foreground/90 mb-6">
                You're not alone. I'm here to listen, chat, and keep you company whenever you need it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="comfort" size="lg" className="text-elder-lg">
                  <Phone className="w-6 h-6" />
                  Emergency Support: 988
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
            Shalala - You always have a friend here
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