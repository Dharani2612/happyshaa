import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, Save, Trash2, Edit, CheckCircle, Circle, Star } from "lucide-react";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  content: string;
  category: 'schedule' | 'reminder' | 'note' | 'important';
  date: string;
  time: string;
  completed: boolean;
  color: string;
}

const NotePad = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showAddNote, setShowAddNote] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: 'note' as Note['category'],
    date: '',
    time: '',
    color: 'purple'
  });

  const categories = [
    { value: 'schedule', label: 'Schedule', icon: Calendar, color: 'bg-blue-500' },
    { value: 'reminder', label: 'Reminder', icon: Clock, color: 'bg-orange-500' },
    { value: 'note', label: 'Note', icon: Edit, color: 'bg-green-500' },
    { value: 'important', label: 'Important', icon: Star, color: 'bg-red-500' }
  ];

  const colorOptions = [
    { name: 'purple', bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-800' },
    { name: 'blue', bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800' },
    { name: 'green', bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-800' },
    { name: 'orange', bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-800' },
    { name: 'pink', bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-800' },
    { name: 'yellow', bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-800' }
  ];

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('notepad-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      // Add example notes
      const exampleNotes: Note[] = [
        {
          id: '1',
          title: 'Morning Walk',
          content: 'Take a 30-minute walk in the park to start the day fresh',
          category: 'schedule',
          date: new Date().toISOString().split('T')[0],
          time: '07:00',
          completed: false,
          color: 'blue'
        },
        {
          id: '2',
          title: 'Gratitude Practice',
          content: 'Write down 3 things I\'m grateful for today',
          category: 'reminder',
          date: new Date().toISOString().split('T')[0],
          time: '21:00',
          completed: false,
          color: 'green'
        }
      ];
      setNotes(exampleNotes);
      localStorage.setItem('notepad-notes', JSON.stringify(exampleNotes));
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('notepad-notes', JSON.stringify(notes));
  }, [notes]);

  const handleSaveNote = () => {
    if (!newNote.title.trim()) {
      toast("Please enter a title");
      return;
    }

    const note: Note = {
      id: editingNote || Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      category: newNote.category,
      date: newNote.date || new Date().toISOString().split('T')[0],
      time: newNote.time,
      completed: false,
      color: newNote.color
    };

    if (editingNote) {
      setNotes(prev => prev.map(n => n.id === editingNote ? note : n));
      setEditingNote(null);
      toast("Note updated! ✏️");
    } else {
      setNotes(prev => [...prev, note]);
      toast("Note saved! 📝");
    }

    setNewNote({
      title: '',
      content: '',
      category: 'note',
      date: '',
      time: '',
      color: 'purple'
    });
    setShowAddNote(false);
  };

  const handleEditNote = (note: Note) => {
    setNewNote({
      title: note.title,
      content: note.content,
      category: note.category,
      date: note.date,
      time: note.time,
      color: note.color
    });
    setEditingNote(note.id);
    setShowAddNote(true);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
    toast("Note deleted");
  };

  const toggleCompleted = (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, completed: !note.completed }
        : note
    ));
  };

  const getCategoryIcon = (category: Note['category']) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : Edit;
  };

  const getColorClasses = (colorName: string) => {
    return colorOptions.find(c => c.name === colorName) || colorOptions[0];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(b.date + ' ' + (b.time || '00:00')).getTime() - 
           new Date(a.date + ' ' + (a.time || '00:00')).getTime();
  });

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-elder-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <Edit className="w-8 h-8 text-primary" />
          My NotePad
        </h2>
        <p className="text-elder-lg text-muted-foreground mb-6">
          Keep track of your schedules, reminders, and important notes
        </p>
        <Button 
          onClick={() => setShowAddNote(!showAddNote)} 
          variant="companionship" 
          size="lg"
          className="bg-gradient-fun shadow-colorful"
        >
          <Plus className="w-5 h-5 mr-2" />
          {editingNote ? 'Edit Note' : 'Add Note'}
        </Button>
      </div>

      {/* Add/Edit Note Form */}
      {showAddNote && (
        <Card className="p-6 shadow-colorful border-2 border-primary/20">
          <h3 className="text-elder-xl font-semibold text-foreground mb-4">
            {editingNote ? 'Edit Note' : 'Create New Note'}
          </h3>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-elder-base font-medium text-foreground mb-2">Title</label>
                <Input
                  value={newNote.title}
                  onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Note title..."
                />
              </div>
              
              <div>
                <label className="block text-elder-base font-medium text-foreground mb-2">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => {
                    const IconComponent = cat.icon;
                    return (
                      <Button
                        key={cat.value}
                        variant={newNote.category === cat.value ? "companionship" : "outline"}
                        onClick={() => setNewNote(prev => ({ ...prev, category: cat.value as Note['category'] }))}
                        className="h-auto p-3"
                        size="sm"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <IconComponent className="w-4 h-4" />
                          <span className="text-xs">{cat.label}</span>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-elder-base font-medium text-foreground mb-2">Content</label>
              <Textarea
                value={newNote.content}
                onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your note here..."
                className="min-h-24"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-elder-base font-medium text-foreground mb-2">Date</label>
                <Input
                  type="date"
                  value={newNote.date}
                  onChange={(e) => setNewNote(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-elder-base font-medium text-foreground mb-2">Time</label>
                <Input
                  type="time"
                  value={newNote.time}
                  onChange={(e) => setNewNote(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-elder-base font-medium text-foreground mb-2">Color</label>
                <div className="flex gap-2">
                  {colorOptions.slice(0, 6).map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setNewNote(prev => ({ ...prev, color: color.name }))}
                      className={`w-8 h-8 rounded-full border-2 ${color.bg} ${
                        newNote.color === color.name ? 'border-foreground scale-110' : 'border-border'
                      } transition-all`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSaveNote} variant="companionship">
                <Save className="w-4 h-4 mr-2" />
                {editingNote ? 'Update' : 'Save'} Note
              </Button>
              <Button onClick={() => {
                setShowAddNote(false);
                setEditingNote(null);
                setNewNote({
                  title: '',
                  content: '',
                  category: 'note',
                  date: '',
                  time: '',
                  color: 'purple'
                });
              }} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Notes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedNotes.map((note) => {
          const IconComponent = getCategoryIcon(note.category);
          const colorClasses = getColorClasses(note.color);
          
          return (
            <Card 
              key={note.id} 
              className={`p-4 shadow-colorful transition-all hover:shadow-lg ${colorClasses.bg} ${colorClasses.border} border-2 ${
                note.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <IconComponent className={`w-5 h-5 ${colorClasses.text}`} />
                  <Badge variant="secondary" className="text-xs">
                    {note.category}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleCompleted(note.id)}
                  className="w-8 h-8 p-0"
                >
                  {note.completed ? 
                    <CheckCircle className="w-4 h-4 text-green-600" /> : 
                    <Circle className="w-4 h-4" />
                  }
                </Button>
              </div>

              <h3 className={`font-semibold mb-2 ${colorClasses.text} ${note.completed ? 'line-through' : ''}`}>
                {note.title}
              </h3>
              
              {note.content && (
                <p className={`text-sm mb-3 ${colorClasses.text} opacity-80 ${note.completed ? 'line-through' : ''}`}>
                  {note.content}
                </p>
              )}

              {(note.date || note.time) && (
                <div className={`flex items-center gap-2 text-xs ${colorClasses.text} opacity-70 mb-3`}>
                  {note.date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(note.date)}
                    </div>
                  )}
                  {note.time && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {note.time}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditNote(note)}
                  className="w-8 h-8 p-0"
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteNote(note.id)}
                  className="w-8 h-8 p-0"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {sortedNotes.length === 0 && (
        <Card className="p-8 text-center shadow-colorful">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-fun rounded-full flex items-center justify-center mx-auto">
              <Edit className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-elder-xl font-semibold text-foreground">No notes yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start organizing your life! Create your first note, schedule, or reminder.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default NotePad;