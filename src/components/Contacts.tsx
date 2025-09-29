import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Plus, 
  UserPlus, 
  Heart, 
  Search,
  Edit,
  Trash2,
  PhoneCall
} from "lucide-react";
import { toast } from "sonner";

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  emergency?: boolean;
  addedAt: Date;
}

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      phone: "+1 (555) 123-4567",
      relationship: "Doctor",
      emergency: true,
      addedAt: new Date()
    },
    {
      id: "2", 
      name: "Emma Wilson",
      phone: "+1 (555) 987-6543",
      relationship: "Daughter",
      emergency: false,
      addedAt: new Date()
    },
    {
      id: "3",
      name: "Emergency Services",
      phone: "911",
      relationship: "Emergency",
      emergency: true,
      addedAt: new Date()
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [newContact, setNewContact] = useState({ 
    name: "", 
    phone: "", 
    relationship: "", 
    emergency: false 
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast("Please fill in name and phone number");
      return;
    }

    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name,
      phone: newContact.phone,
      relationship: newContact.relationship || "Contact",
      emergency: newContact.emergency,
      addedAt: new Date()
    };

    setContacts(prev => [...prev, contact]);
    setNewContact({ name: "", phone: "", relationship: "", emergency: false });
    setShowAddForm(false);
    toast(`📞 Added ${contact.name} to your contacts! Calling now...`);

    // Immediately initiate a call after adding the contact
    handleCall(contact);
  };

  const handleCall = (contact: Contact) => {
    // In a real app, this would integrate with the device's phone
    const phoneNumber = contact.phone.replace(/[^\d+]/g, '');
    
    if (navigator.userAgent.includes('Mobile')) {
      // On mobile, try to open the phone app
      window.location.href = `tel:${phoneNumber}`;
    } else {
      // On desktop, show the number
      toast(`📞 Call ${contact.name} at ${contact.phone}`);
    }
  };

  const handleDelete = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    setContacts(prev => prev.filter(c => c.id !== contactId));
    toast(`Removed ${contact?.name} from contacts`);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery) ||
    contact.relationship.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const emergencyContacts = filteredContacts.filter(c => c.emergency);
  const regularContacts = filteredContacts.filter(c => !c.emergency);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-elder-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <Phone className="w-8 h-8 text-primary" />
          Personal Contacts
        </h2>
        <p className="text-elder-lg text-muted-foreground">
          Keep your important contacts close and make calls easily
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
          Add New Contact
        </Button>
        <Button
          onClick={() => handleCall({ name: "Emergency", phone: "911", relationship: "Emergency", id: "emergency", addedAt: new Date() })}
          variant="destructive"
          size="lg"
          className="h-16"
        >
          <PhoneCall className="w-5 h-5 mr-2" />
          Emergency Call (911)
        </Button>
      </div>

      {/* Add Contact Form */}
      {showAddForm && (
        <Card className="p-6 shadow-gentle">
          <h3 className="text-elder-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Add New Contact
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="Full name"
              value={newContact.name}
              onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
              className="text-elder-base"
            />
            <Input
              placeholder="Phone number"
              value={newContact.phone}
              onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
              className="text-elder-base"
            />
            <Input
              placeholder="Relationship (e.g., Son, Doctor)"
              value={newContact.relationship}
              onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
              className="text-elder-base"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="emergency"
                checked={newContact.emergency}
                onChange={(e) => setNewContact(prev => ({ ...prev, emergency: e.target.checked }))}
                className="w-4 h-4"
              />
              <label htmlFor="emergency" className="text-elder-base text-foreground">
                Emergency Contact
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddContact} variant="companionship">
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
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
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-elder-base"
          />
        </div>
      </Card>

      {/* Emergency Contacts */}
      {emergencyContacts.length > 0 && (
        <Card className="p-6 shadow-gentle border-destructive/20">
          <h3 className="text-elder-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-destructive" />
            Emergency Contacts
          </h3>
          <div className="space-y-3">
            {emergencyContacts.map((contact) => (
              <div 
                key={contact.id}
                className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-destructive" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-elder-base font-medium text-foreground">
                      {contact.name}
                    </h4>
                    <p className="text-elder-sm text-muted-foreground">
                      {contact.relationship} • {contact.phone}
                    </p>
                  </div>
                  
                  <Badge variant="destructive">Emergency</Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleCall(contact)}
                    variant="destructive"
                    size="sm"
                  >
                    <PhoneCall className="w-4 h-4 mr-1" />
                    Call
                  </Button>
                  {contact.phone !== "911" && (
                    <Button
                      onClick={() => handleDelete(contact.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Regular Contacts */}
      <Card className="p-6 shadow-gentle">
        <h3 className="text-elder-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-primary" />
          Your Contacts ({regularContacts.length})
        </h3>
        
        {regularContacts.length === 0 ? (
          <div className="text-center py-8">
            <Phone className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-elder-lg text-muted-foreground">
              {searchQuery ? "No contacts match your search" : "No contacts yet"}
            </p>
            <p className="text-elder-base text-muted-foreground mt-2">
              Add some contacts to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {regularContacts.map((contact) => (
              <div 
                key={contact.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:shadow-gentle transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-elder-base font-medium text-foreground">
                      {contact.name}
                    </h4>
                    <p className="text-elder-sm text-muted-foreground">
                      {contact.relationship} • {contact.phone}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleCall(contact)}
                    variant="companionship"
                    size="sm"
                  >
                    <PhoneCall className="w-4 h-4 mr-1" />
                    Call
                  </Button>
                  <Button
                    onClick={() => handleDelete(contact.id)}
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Help Info */}
      <Card className="p-4 shadow-gentle bg-muted/30">
        <h3 className="text-elder-lg font-semibold text-foreground mb-2">How to make calls</h3>
        <div className="text-elder-base text-muted-foreground space-y-2">
          <p>• On mobile devices, clicking "Call" will open your phone app</p>
          <p>• On desktop, the phone number will be displayed for you to dial</p>
          <p>• Emergency contacts are highlighted in red for quick access</p>
          <p>• Always call 911 for life-threatening emergencies</p>
        </div>
      </Card>
    </div>
  );
};

export default Contacts;