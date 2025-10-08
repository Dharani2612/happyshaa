-- Create storage bucket for emergency photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('emergency-photos', 'emergency-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own emergency photos
CREATE POLICY "Users can upload their own emergency photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'emergency-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to view their own emergency photos
CREATE POLICY "Users can view their own emergency photos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'emergency-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow emergency contacts to view shared photos (via signed URLs in practice)
CREATE POLICY "Public read access for emergency photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'emergency-photos');

-- Create table to log emergency events
CREATE TABLE IF NOT EXISTS public.emergency_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  triggered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  photo_url TEXT,
  gps_latitude DECIMAL(10, 8),
  gps_longitude DECIMAL(11, 8),
  contacts_notified INTEGER DEFAULT 0,
  was_cancelled BOOLEAN DEFAULT false,
  detection_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.emergency_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own logs
CREATE POLICY "Users can view own emergency logs"
ON public.emergency_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own logs
CREATE POLICY "Users can insert own emergency logs"
ON public.emergency_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add settings table for emergency preferences
CREATE TABLE IF NOT EXISTS public.emergency_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  countdown_seconds INTEGER DEFAULT 10,
  enable_sms BOOLEAN DEFAULT true,
  enable_voice_call BOOLEAN DEFAULT true,
  enable_911 BOOLEAN DEFAULT false,
  sensitivity TEXT DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.emergency_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own settings"
ON public.emergency_settings
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);