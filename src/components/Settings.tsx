import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Save, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    email: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile({
        full_name: data.full_name || '',
        email: data.email || user.email || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-6 shadow-gentle">
        <h2 className="text-2xl font-bold text-foreground mb-6">Account Settings</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Your name"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                value={profile.email}
                disabled
                className="pl-10 bg-muted"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleSave}
              variant="companionship"
              disabled={loading}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>

            <Button
              onClick={handleLogout}
              variant="destructive"
              className="flex-1"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
