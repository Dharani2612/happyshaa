import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Plus, 
  Clock, 
  Edit, 
  Trash2,
  Search,
  CheckCircle,
  Circle,
  Bell
} from "lucide-react";
import { toast } from "sonner";

interface Schedule {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: "appointment" | "medication" | "event" | "reminder";
  completed?: boolean;
  priority: "high" | "medium" | "low";
  addedAt: Date;
}

const NotePad = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: "1",
      title: "Doctor Appointment",
      description: "Annual checkup with Dr. Smith",
      date: "2025-01-30",
      time: "10:00",
      type: "appointment",
      priority: "high",
      addedAt: new Date()
    },
    {
      id: "2",
      title: "Take Medication",
      description: "Blood pressure medication",
      date: "2025-01-25",
      time: "08:00",
      type: "medication",
      priority: "high",
      completed: false,
      addedAt: new Date()
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [newSchedule, setNewSchedule] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "reminder" as Schedule["type"],
    priority: "medium" as Schedule["priority"]
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddSchedule = () => {
    if (!newSchedule.title || !newSchedule.date) {
      toast("Please fill in title and date");
      return;
    }

    const schedule: Schedule = {
      id: Date.now().toString(),
      title: newSchedule.title,
      description: newSchedule.description,
      date: newSchedule.date,
      time: newSchedule.time,
      type: newSchedule.type,
      priority: newSchedule.priority,
      completed: false,
      addedAt: new Date()
    };

    setSchedules(prev => [...prev, schedule]);
    setNewSchedule({
      title: "",
      description: "",
      date: "",
      time: "",
      type: "reminder",
      priority: "medium"
    });
    setShowAddForm(false);
    toast(`📝 Added "${schedule.title}" to your schedule!`);
  };

  const handleToggleComplete = (id: string) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === id 
        ? { ...schedule, completed: !schedule.completed }
        : schedule
    ));
    
    const schedule = schedules.find(s => s.id === id);
    toast(`${schedule?.completed ? "Uncompleted" : "Completed"} "${schedule?.title}"`);
  };

  const handleDelete = (id: string) => {
    const schedule = schedules.find(s => s.id === id);
    setSchedules(prev => prev.filter(s => s.id !== id));
    toast(`Removed "${schedule?.title}" from schedule`);
  };

  const filteredSchedules = schedules.filter(schedule =>
    schedule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    schedule.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const today = new Date().toISOString().split('T')[0];
  const todaySchedules = filteredSchedules.filter(s => s.date === today);
  const upcomingSchedules = filteredSchedules.filter(s => s.date > today);
  const pastSchedules = filteredSchedules.filter(s => s.date < today);

  const getTypeIcon = (type: Schedule["type"]) => {
    switch (type) {
      case "appointment": return "🏥";
      case "medication": return "💊";
      case "event": return "🎉";
      default: return "📝";
    }
  };

  const getPriorityColor = (priority: Schedule["priority"]): "destructive" | "secondary" | "outline" => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";  
      case "low": return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-elder-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <Calendar className="w-8 h-8 text-primary" />
          Schedule & Notes
        </h2>
        <p className="text-elder-lg text-muted-foreground">
          Keep track of your appointments, medications, and important events
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          variant="companionship"
          size="lg"
          className="h-16"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Schedule Item
        </Button>
        <div className="text-center p-4 bg-gradient-primary rounded-lg text-primary-foreground">
          <Clock className="w-8 h-8 mx-auto mb-2" />
          <p className="text-elder-base font-semibold">
            {todaySchedules.length} items today
          </p>
        </div>
      </div>

      {/* Add Schedule Form */}
      {showAddForm && (
        <Card className="p-6 shadow-gentle">
          <h3 className="text-elder-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Add New Schedule Item
          </h3>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Title (e.g., Doctor Appointment)"
                value={newSchedule.title}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, title: e.target.value }))}
                className="text-elder-base"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={newSchedule.date}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, date: e.target.value }))}
                  className="text-elder-base"
                />
                <Input
                  type="time"
                  value={newSchedule.time}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, time: e.target.value }))}
                  className="text-elder-base"
                />
              </div>
            </div>
            
            <Textarea
              placeholder="Description (optional)"
              value={newSchedule.description}
              onChange={(e) => setNewSchedule(prev => ({ ...prev, description: e.target.value }))}
              className="text-elder-base"
              rows={3}
            />
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-elder-sm font-medium text-foreground block mb-2">Type</label>
                <select
                  value={newSchedule.type}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, type: e.target.value as Schedule["type"] }))}
                  className="w-full p-2 border border-border rounded-md text-elder-base bg-background"
                >
                  <option value="appointment">🏥 Appointment</option>
                  <option value="medication">💊 Medication</option>
                  <option value="event">🎉 Event</option>
                  <option value="reminder">📝 Reminder</option>
                </select>
              </div>
              
              <div>
                <label className="text-elder-sm font-medium text-foreground block mb-2">Priority</label>
                <select
                  value={newSchedule.priority}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, priority: e.target.value as Schedule["priority"] }))}
                  className="w-full p-2 border border-border rounded-md text-elder-base bg-background"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-6">
            <Button onClick={handleAddSchedule} variant="companionship">
              <Plus className="w-4 h-4 mr-2" />
              Add to Schedule
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

      {/* Search */}
      <Card className="p-4 shadow-gentle">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search your schedule..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-elder-base"
          />
        </div>
      </Card>

      {/* Today's Schedule */}
      {todaySchedules.length > 0 && (
        <Card className="p-6 shadow-gentle border-primary/20">
          <h3 className="text-elder-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Today's Schedule ({todaySchedules.length} items)
          </h3>
          <div className="space-y-3">
            {todaySchedules.map((schedule) => (
              <ScheduleItem
                key={schedule.id}
                schedule={schedule}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
                getTypeIcon={getTypeIcon}
                getPriorityColor={getPriorityColor}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Upcoming Schedule */}
      {upcomingSchedules.length > 0 && (
        <Card className="p-6 shadow-gentle">
          <h3 className="text-elder-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Upcoming Schedule ({upcomingSchedules.length} items)
          </h3>
          <div className="space-y-3">
            {upcomingSchedules.map((schedule) => (
              <ScheduleItem
                key={schedule.id}
                schedule={schedule}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
                getTypeIcon={getTypeIcon}
                getPriorityColor={getPriorityColor}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Past Schedule */}
      {pastSchedules.length > 0 && (
        <Card className="p-6 shadow-gentle">
          <h3 className="text-elder-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-muted-foreground" />
            Past Items ({pastSchedules.length})
          </h3>
          <div className="space-y-3">
            {pastSchedules.map((schedule) => (
              <ScheduleItem
                key={schedule.id}
                schedule={schedule}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
                getTypeIcon={getTypeIcon}
                getPriorityColor={getPriorityColor}
                isPast={true}
              />
            ))}
          </div>
        </Card>
      )}

      {filteredSchedules.length === 0 && (
        <Card className="p-8 shadow-gentle text-center">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-elder-lg text-muted-foreground">
            {searchQuery ? "No items match your search" : "Your schedule is empty"}
          </p>
          <p className="text-elder-base text-muted-foreground mt-2">
            Add appointments, medications, or reminders to get started!
          </p>
        </Card>
      )}
    </div>
  );
};

// Schedule Item Component
const ScheduleItem = ({ 
  schedule, 
  onToggleComplete, 
  onDelete, 
  getTypeIcon, 
  getPriorityColor,
  isPast = false 
}: {
  schedule: Schedule;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  getTypeIcon: (type: Schedule["type"]) => string;
  getPriorityColor: (priority: Schedule["priority"]) => "destructive" | "secondary" | "outline";
  isPast?: boolean;
}) => (
  <div 
    className={`
      flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-gentle
      ${schedule.completed ? 'bg-muted/50 opacity-70' : 'bg-card'}
      ${isPast ? 'border-muted' : 'border-border'}
    `}
  >
    <div className="flex items-center gap-4 flex-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggleComplete(schedule.id)}
        className="p-1"
      >
        {schedule.completed ? (
          <CheckCircle className="w-5 h-5 text-primary" />
        ) : (
          <Circle className="w-5 h-5 text-muted-foreground" />
        )}
      </Button>
      
      <div className="text-2xl">{getTypeIcon(schedule.type)}</div>
      
      <div className="flex-1 min-w-0">
        <h4 className={`text-elder-base font-medium ${schedule.completed ? 'line-through' : ''}`}>
          {schedule.title}
        </h4>
        <p className="text-elder-sm text-muted-foreground">
          {schedule.date} {schedule.time && `at ${schedule.time}`}
        </p>
        {schedule.description && (
          <p className="text-elder-sm text-muted-foreground mt-1">
            {schedule.description}
          </p>
        )}
      </div>
      
      <Badge variant={getPriorityColor(schedule.priority)}>
        {schedule.priority}
      </Badge>
    </div>
    
    <Button
      onClick={() => onDelete(schedule.id)}
      variant="ghost"
      size="sm"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  </div>
);

export default NotePad;