import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Activity, 
  Shield, 
  Users, 
  Gamepad2, 
  TrendingUp,
  Phone,
  Camera,
  Bell,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Calendar
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const EnhancedDashboard = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    emergencyContacts: 0,
    totalGamesPlayed: 0,
    totalJournalEntries: 0,
    recentEmergencies: 0,
    emergencySystemActive: false
  });
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load contacts
      const { data: contacts } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id);
      
      const emergencyCount = contacts?.filter(c => c.emergency_contact).length || 0;

      // Load game scores
      const { data: gameScores } = await supabase
        .from('game_scores')
        .select('*')
        .eq('user_id', user.id);

      // Load journal entries
      const { data: journalEntries } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id);

      // Load recent emergencies (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: emergencies } = await supabase
        .from('emergency_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Load emergency settings
      const { data: emergencySettings } = await supabase
        .from('emergency_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setStats({
        totalContacts: contacts?.length || 0,
        emergencyContacts: emergencyCount,
        totalGamesPlayed: gameScores?.length || 0,
        totalJournalEntries: journalEntries?.length || 0,
        recentEmergencies: emergencies?.length || 0,
        emergencySystemActive: emergencySettings !== null
      });

    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-elder-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
          <Activity className="w-8 h-8 text-primary" />
          Your Wellness Dashboard
        </h2>
        <p className="text-elder-lg text-muted-foreground">
          Track your activities, safety, and well-being all in one place
        </p>
      </div>

      {/* Emergency System Status */}
      <Card className="p-6 shadow-companionship border-2 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-pink-400 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-elder-xl font-semibold text-foreground">Emergency Detection System</h3>
              <p className="text-elder-base text-muted-foreground">AI-powered camera monitoring for your safety</p>
            </div>
          </div>
          <Badge variant={stats.emergencySystemActive ? "default" : "secondary"} className="text-elder-base">
            {stats.emergencySystemActive ? (
              <><CheckCircle className="w-4 h-4 mr-1" /> Configured</>
            ) : (
              <><AlertTriangle className="w-4 h-4 mr-1" /> Setup Required</>
            )}
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Camera className="w-5 h-5 text-primary" />
              <span className="text-elder-base font-medium">Camera Monitoring</span>
            </div>
            <p className="text-elder-sm text-muted-foreground">AI analyzes video frames every 5 seconds</p>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-5 h-5 text-primary" />
              <span className="text-elder-base font-medium">Automatic Alerts</span>
            </div>
            <p className="text-elder-sm text-muted-foreground">SMS + Voice calls to {stats.emergencyContacts} contacts</p>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-elder-base font-medium">GPS Location</span>
            </div>
            <p className="text-elder-sm text-muted-foreground">Shares precise location + photo with contacts</p>
          </div>
        </div>

        {stats.recentEmergencies > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <Bell className="w-4 h-4" />
              <span className="text-elder-sm font-medium">
                {stats.recentEmergencies} emergency alert{stats.recentEmergencies !== 1 ? 's' : ''} in the last 30 days
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6 shadow-gentle hover:shadow-companionship transition-all">
          <div className="flex items-center justify-between mb-3">
            <Users className="w-8 h-8 text-blue-500" />
            <Badge variant="secondary" className="text-elder-lg font-bold">{stats.totalContacts}</Badge>
          </div>
          <h4 className="text-elder-base font-semibold text-foreground mb-1">Total Contacts</h4>
          <p className="text-elder-sm text-muted-foreground">{stats.emergencyContacts} emergency contacts</p>
        </Card>

        <Card className="p-6 shadow-gentle hover:shadow-companionship transition-all">
          <div className="flex items-center justify-between mb-3">
            <Gamepad2 className="w-8 h-8 text-purple-500" />
            <Badge variant="secondary" className="text-elder-lg font-bold">{stats.totalGamesPlayed}</Badge>
          </div>
          <h4 className="text-elder-base font-semibold text-foreground mb-1">Games Played</h4>
          <p className="text-elder-sm text-muted-foreground">Keep your mind sharp!</p>
        </Card>

        <Card className="p-6 shadow-gentle hover:shadow-companionship transition-all">
          <div className="flex items-center justify-between mb-3">
            <Calendar className="w-8 h-8 text-green-500" />
            <Badge variant="secondary" className="text-elder-lg font-bold">{stats.totalJournalEntries}</Badge>
          </div>
          <h4 className="text-elder-base font-semibold text-foreground mb-1">Journal Entries</h4>
          <p className="text-elder-sm text-muted-foreground">Your thoughts & memories</p>
        </Card>

        <Card className="p-6 shadow-gentle hover:shadow-companionship transition-all">
          <div className="flex items-center justify-between mb-3">
            <Heart className="w-8 h-8 text-pink-500" />
            <Badge variant="secondary" className="text-elder-lg font-bold">24/7</Badge>
          </div>
          <h4 className="text-elder-base font-semibold text-foreground mb-1">AI Companion</h4>
          <p className="text-elder-sm text-muted-foreground">Always here for you</p>
        </Card>
      </div>

      {/* Feature Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 shadow-gentle">
          <h3 className="text-elder-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Safety Features
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-elder-base font-medium">AI Emergency Detection</p>
                <p className="text-elder-sm text-muted-foreground">Automatic fall and distress detection via camera</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-elder-base font-medium">Instant Notifications</p>
                <p className="text-elder-sm text-muted-foreground">SMS + voice calls to family members</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-elder-base font-medium">GPS + Photo Sharing</p>
                <p className="text-elder-sm text-muted-foreground">Real-time location and visual context</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-elder-base font-medium">Countdown Cancellation</p>
                <p className="text-elder-sm text-muted-foreground">10-second window to prevent false alarms</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-gentle">
          <h3 className="text-elder-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Wellness Activities
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-elder-base font-medium">AI Chatbot Companion</p>
                <p className="text-elder-sm text-muted-foreground">Empathetic conversations powered by Google Gemini</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-elder-base font-medium">Brain Training Games</p>
                <p className="text-elder-sm text-muted-foreground">Temple Run, Candy Crush, memory challenges</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-elder-base font-medium">Creative Activities</p>
                <p className="text-elder-sm text-muted-foreground">Doodle, journaling, music, and more</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-elder-base font-medium">Mood Tracking</p>
                <p className="text-elder-sm text-muted-foreground">Monitor your emotional well-being</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Call to Action */}
      {!stats.emergencySystemActive && (
        <Card className="p-6 shadow-companionship bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-primary mx-auto mb-3" />
            <h3 className="text-elder-xl font-semibold text-foreground mb-2">
              Set Up Your Emergency System
            </h3>
            <p className="text-elder-base text-muted-foreground mb-4">
              Add emergency contacts and configure your safety settings for peace of mind
            </p>
            <Button variant="default" size="lg" className="text-elder-base">
              <Shield className="w-5 h-5 mr-2" />
              Go to Settings
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default EnhancedDashboard;