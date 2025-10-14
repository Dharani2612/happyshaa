import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Bell, Clock, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ScheduledReminder {
  id: string;
  time: string;
  message: string;
  enabled: boolean;
  days: string[];
}

export default function ScheduledNotifications() {
  const [reminders, setReminders] = useState<ScheduledReminder[]>([]);
  const [newTime, setNewTime] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadReminders();
    scheduleNotificationChecks();
  }, []);

  const loadReminders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const saved = localStorage.getItem(`reminders_${user.id}`);
    if (saved) {
      setReminders(JSON.parse(saved));
    }
  };

  const saveReminders = async (updatedReminders: ScheduledReminder[]) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    localStorage.setItem(`reminders_${user.id}`, JSON.stringify(updatedReminders));
    setReminders(updatedReminders);
  };

  const addReminder = () => {
    if (!newTime || !newMessage) {
      toast({
        title: "Missing Information",
        description: "Please enter both time and message",
        variant: "destructive",
      });
      return;
    }

    const newReminder: ScheduledReminder = {
      id: Date.now().toString(),
      time: newTime,
      message: newMessage,
      enabled: true,
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    };

    saveReminders([...reminders, newReminder]);
    setNewTime("");
    setNewMessage("");

    toast({
      title: "Reminder Added",
      description: `Scheduled for ${newTime}`,
    });
  };

  const deleteReminder = (id: string) => {
    saveReminders(reminders.filter(r => r.id !== id));
    toast({
      title: "Reminder Deleted",
      description: "The scheduled reminder has been removed",
    });
  };

  const toggleReminder = (id: string) => {
    saveReminders(
      reminders.map(r =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      )
    );
  };

  const scheduleNotificationChecks = () => {
    // Check every minute for scheduled notifications
    setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const currentDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][now.getDay()];

      reminders.forEach(reminder => {
        if (
          reminder.enabled &&
          reminder.time === currentTime &&
          reminder.days.includes(currentDay)
        ) {
          showNotification(reminder.message);
        }
      });
    }, 60000); // Check every minute
  };

  const showNotification = (message: string) => {
    // Request notification permission if not granted
    if (Notification.permission === "granted") {
      new Notification("Shalala Reminder", {
        body: message,
        icon: "/favicon.ico",
      });
      
      // Also play a gentle sound
      const audio = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");
      audio.play().catch(() => {});
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          showNotification(message);
        }
      });
    }

    toast({
      title: "Reminder",
      description: message,
    });
  };

  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      toast({
        title: "Notifications Enabled",
        description: "You'll receive scheduled reminders",
      });
    } else {
      toast({
        title: "Notifications Blocked",
        description: "Please enable notifications in your browser settings",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-companionship">
        <CardHeader>
          <CardTitle className="text-elder-2xl flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Scheduled Reminders
          </CardTitle>
          <CardDescription className="text-elder-base">
            Set up daily reminders for medications, activities, or check-ins
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Notification.permission !== "granted" && (
            <Button onClick={requestNotificationPermission} variant="nurturing" className="w-full">
              Enable Notifications
            </Button>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time" className="text-elder-base">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="text-elder-base h-12"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="message" className="text-elder-base">Message</Label>
                <Input
                  id="message"
                  type="text"
                  placeholder="e.g., Take morning medication"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="text-elder-base h-12"
                />
              </div>
            </div>
            <Button onClick={addReminder} className="w-full" variant="companionship">
              <Plus className="w-4 h-4 mr-2" />
              Add Reminder
            </Button>
          </div>

          <div className="space-y-3">
            {reminders.length === 0 ? (
              <p className="text-elder-base text-muted-foreground text-center py-8">
                No reminders scheduled yet
              </p>
            ) : (
              reminders.map((reminder) => (
                <Card key={reminder.id} className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <Switch
                        checked={reminder.enabled}
                        onCheckedChange={() => toggleReminder(reminder.id)}
                      />
                      <div className="flex-1">
                        <p className="text-elder-lg font-semibold">{reminder.time}</p>
                        <p className="text-elder-base text-muted-foreground">{reminder.message}</p>
                        <p className="text-elder-sm text-muted-foreground mt-1">
                          {reminder.days.join(", ")}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteReminder(reminder.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
