-- Create scheduled_notifications table for persistent reminders
CREATE TABLE IF NOT EXISTS public.scheduled_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  time TEXT NOT NULL,
  message TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  days TEXT[] NOT NULL DEFAULT ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scheduled_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for scheduled_notifications
CREATE POLICY "Users can view own notifications"
  ON public.scheduled_notifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications"
  ON public.scheduled_notifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.scheduled_notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON public.scheduled_notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_scheduled_notifications_updated_at
  BEFORE UPDATE ON public.scheduled_notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();