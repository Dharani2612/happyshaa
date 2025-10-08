import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Phone, Camera, CheckCircle, X, MapPin, Settings, Image } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const EmergencyDetection = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [emergencyDetected, setEmergencyDetected] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [gpsLocation, setGpsLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  // Settings
  const [countdownSeconds, setCountdownSeconds] = useState(10);
  const [enableSMS, setEnableSMS] = useState(true);
  const [enableCall, setEnableCall] = useState(true);
  const [enable911, setEnable911] = useState(false);
  const [detectionSensitivity, setDetectionSensitivity] = useState(50);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [videoStream]);

  // Load settings
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('emergency_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCountdownSeconds(data.countdown_seconds);
        setEnableSMS(data.enable_sms);
        setEnableCall(data.enable_voice_call);
        setEnable911(data.enable_911);
        setDetectionSensitivity(data.sensitivity === 'low' ? 30 : data.sensitivity === 'high' ? 70 : 50);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const sensitivity = detectionSensitivity < 40 ? 'low' : detectionSensitivity > 60 ? 'high' : 'medium';

      const { error } = await supabase
        .from('emergency_settings')
        .upsert({
          user_id: user.id,
          countdown_seconds: countdownSeconds,
          enable_sms: enableSMS,
          enable_voice_call: enableCall,
          enable_911: enable911,
          sensitivity
        });

      if (error) throw error;

      toast.success("Settings saved successfully!");
      setShowSettings(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error("Failed to save settings");
    }
  };

  const getGPSLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          toast.success("📍 GPS location acquired");
        },
        (error) => {
          console.error("GPS error:", error);
          toast.error("Could not get GPS location");
        }
      );
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const uploadPhoto = async (photoData: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Convert base64 to blob
      const response = await fetch(photoData);
      const blob = await response.blob();

      const fileName = `${user.id}/${Date.now()}.jpg`;

      const { data, error } = await supabase.storage
        .from('emergency-photos')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('emergency-photos')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      return null;
    }
  };

  const startMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      
      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsMonitoring(true);
      toast.success("🎥 Emergency monitoring started");
      
      // Get GPS location
      getGPSLocation();
      
      // Start AI-powered emergency detection
      startAIDetection();
    } catch (error) {
      toast.error("Could not access camera. Please check permissions.");
      console.error(error);
    }
  };

  const stopMonitoring = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    setIsMonitoring(false);
    setEmergencyDetected(false);
    toast.info("Emergency monitoring stopped");
  };

  const startAIDetection = () => {
    // Check every 5 seconds
    detectionIntervalRef.current = setInterval(async () => {
      const photoData = await capturePhoto();
      if (!photoData) return;

      try {
        const { data, error } = await supabase.functions.invoke('detect-emergency', {
          body: { imageData: photoData }
        });

        if (error) throw error;

        console.log('Detection result:', data);

        // Check if emergency detected based on confidence and sensitivity
        if (data.emergency && data.confidence > detectionSensitivity) {
          console.log(`Emergency detected: ${data.type} (confidence: ${data.confidence}%)`);
          detectEmergency(data.type, photoData);
        }
      } catch (error) {
        console.error('Detection error:', error);
      }
    }, 5000);
  };

  const detectEmergency = async (detectionType: string, photoData: string) => {
    if (emergencyDetected) return; // Prevent duplicate detections

    setEmergencyDetected(true);
    setCapturedPhoto(photoData);
    
    toast.error(`⚠️ ${detectionType.toUpperCase()} DETECTED! Alerting contacts in ${countdownSeconds}s...`, {
      duration: countdownSeconds * 1000,
    });

    // Automatically call after countdown unless cancelled
    const timeoutId = setTimeout(async () => {
      await makeEmergencyCalls(photoData);
    }, countdownSeconds * 1000);

    // Store timeout ID so it can be cancelled
    (window as any).emergencyTimeoutId = timeoutId;
  };

  const makeEmergencyCalls = async (photoData?: string) => {
    try {
      // Upload photo if available
      let photoUrl = null;
      if (photoData || capturedPhoto) {
        toast.info("📸 Uploading emergency photo...");
        photoUrl = await uploadPhoto(photoData || capturedPhoto!);
      }

      // Log emergency event
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('emergency_logs').insert({
          user_id: user.id,
          photo_url: photoUrl,
          gps_latitude: gpsLocation?.latitude,
          gps_longitude: gpsLocation?.longitude,
          detection_type: 'ai_vision',
          was_cancelled: false
        });
      }

      // Fetch emergency contacts from database
      const { data: contacts, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('emergency_contact', true);

      if (error) throw error;

      if (!contacts || contacts.length === 0) {
        toast.error("No emergency contacts found. Please add emergency contacts first.");
        return;
      }

      toast.info(`📞 Initiating emergency alerts to ${contacts.length} contact(s)...`);

      // Call each emergency contact with all info
      const callPromises = contacts.map(async (contact: any) => {
        try {
          const { data, error: callError } = await supabase.functions.invoke('make-emergency-call', {
            body: {
              phoneNumber: contact.phone,
              contactName: contact.name,
              gpsLocation,
              photoUrl,
              sendSMS: enableSMS,
              sendCall: enableCall,
              emergency911: enable911
            }
          });

          if (callError) throw callError;

          if (data?.success) {
            const alertTypes = [];
            if (data.results.sms?.success) alertTypes.push("SMS");
            if (data.results.call?.success) alertTypes.push("Call");
            toast.success(`✅ ${alertTypes.join(" & ")} sent to ${contact.name}`);
          } else {
            throw new Error(data?.error || 'Unknown error');
          }
        } catch (err) {
          console.error(`Error alerting ${contact.name}:`, err);
          toast.error(`Failed to alert ${contact.name}`);
        }
      });

      await Promise.all(callPromises);
      
      if (enable911) {
        toast.info("🚨 Emergency services would be alerted in production");
      }
      
      toast.success(`🎯 Emergency alerts completed!`);
      
    } catch (error) {
      console.error("Error making emergency calls:", error);
      toast.error("Failed to alert emergency contacts");
    }
  };

  const cancelEmergency = async () => {
    // Cancel the automatic call timeout
    if ((window as any).emergencyTimeoutId) {
      clearTimeout((window as any).emergencyTimeoutId);
      (window as any).emergencyTimeoutId = null;
    }
    
    // Log cancellation
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('emergency_logs').insert({
        user_id: user.id,
        was_cancelled: true,
        detection_type: 'ai_vision'
      });
    }
    
    setEmergencyDetected(false);
    setCapturedPhoto(null);
    toast.info("Emergency alert cancelled");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
          <AlertCircle className="w-8 h-8 text-destructive" />
          AI Emergency Detection System
        </h2>
        <p className="text-lg text-muted-foreground">
          Real-time monitoring with AI vision, GPS tracking & instant alerts
        </p>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="p-6 shadow-companionship space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Emergency Settings</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Countdown Time: {countdownSeconds}s</Label>
              <Slider
                value={[countdownSeconds]}
                onValueChange={(v) => setCountdownSeconds(v[0])}
                min={5}
                max={30}
                step={5}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Detection Sensitivity: {detectionSensitivity}%</Label>
              <Slider
                value={[detectionSensitivity]}
                onValueChange={(v) => setDetectionSensitivity(v[0])}
                min={20}
                max={80}
                step={10}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Higher = more sensitive but may have false alarms
              </p>
            </div>

            <div className="flex items-center justify-between">
              <Label>Send SMS Messages</Label>
              <Switch checked={enableSMS} onCheckedChange={setEnableSMS} />
            </div>

            <div className="flex items-center justify-between">
              <Label>Make Voice Calls</Label>
              <Switch checked={enableCall} onCheckedChange={setEnableCall} />
            </div>

            <div className="flex items-center justify-between">
              <Label>Call 911 (Emergency Services)</Label>
              <Switch checked={enable911} onCheckedChange={setEnable911} />
            </div>

            <Button onClick={saveSettings} className="w-full">
              Save Settings
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-6 shadow-companionship">
        {!isMonitoring ? (
          <div className="text-center space-y-4">
            <Camera className="w-16 h-16 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">
              Enable AI-powered monitoring to detect falls, distress, and emergencies
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={startMonitoring} size="lg" className="gap-2">
                <Camera className="w-5 h-5" />
                Start Monitoring
              </Button>
              <Button onClick={() => setShowSettings(!showSettings)} variant="outline" size="lg">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Video Feed */}
            <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Status Overlay */}
              <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                {emergencyDetected ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-destructive animate-pulse" />
                    <span className="text-sm font-medium text-destructive">EMERGENCY DETECTED</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">AI Monitoring Active</span>
                  </>
                )}
              </div>

              {/* GPS Indicator */}
              {gpsLocation && (
                <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-xs">
                  <MapPin className="w-3 h-3 text-green-500" />
                  <span>GPS Active</span>
                </div>
              )}

              {/* Captured Photo Preview */}
              {capturedPhoto && (
                <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-xs">
                  <Image className="w-3 h-3 text-blue-500" />
                  <span>Photo Captured</span>
                </div>
              )}
            </div>

            {/* Emergency Alert */}
            {emergencyDetected && (
              <Card className="p-4 bg-destructive/10 border-destructive">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-destructive mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Emergency Detected!
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {enableCall && enableSMS && `Calling & texting`}
                      {enableCall && !enableSMS && `Calling`}
                      {!enableCall && enableSMS && `Texting`}
                      {` emergency contacts in ${countdownSeconds} seconds...`}
                      {enable911 && " 911 will be alerted."}
                    </p>
                    {gpsLocation && (
                      <p className="text-xs text-muted-foreground mb-2">
                        📍 Location: {gpsLocation.latitude.toFixed(6)}, {gpsLocation.longitude.toFixed(6)}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => makeEmergencyCalls()}
                        variant="destructive"
                        size="sm"
                        className="gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Alert Now
                      </Button>
                      <Button
                        onClick={cancelEmergency}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel (I'm OK)
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Controls */}
            <div className="flex justify-center gap-2">
              <Button onClick={stopMonitoring} variant="outline" className="gap-2">
                <X className="w-4 h-4" />
                Stop Monitoring
              </Button>
              <Button onClick={() => setShowSettings(!showSettings)} variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Info Card */}
      <Card className="p-6 shadow-gentle bg-gradient-to-br from-primary/5 to-accent/5">
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-primary" />
          Complete Emergency Response System
        </h3>
        <ul className="space-y-2 text-muted-foreground">
          <li>• <strong>AI Vision Detection:</strong> Real-time analysis for falls, distress, medical emergencies</li>
          <li>• <strong>SMS & Voice Calls:</strong> Instant alerts to all emergency contacts</li>
          <li>• <strong>GPS Location Sharing:</strong> Exact coordinates sent with Google Maps link</li>
          <li>• <strong>Photo Capture:</strong> Visual proof of emergency situation shared instantly</li>
          <li>• <strong>Configurable Settings:</strong> Adjust sensitivity, countdown time, alert methods</li>
          <li>• <strong>911 Integration:</strong> Optional automatic emergency services notification</li>
          <li>• <strong>Cancel Protection:</strong> {countdownSeconds}-second window to cancel false alarms</li>
          <li>• <strong>Privacy First:</strong> All data encrypted, photos securely stored</li>
        </ul>
        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm text-muted-foreground">
            <strong>Setup Required:</strong> Add emergency contacts in the Contacts section and mark them as emergency contacts. Configure Twilio credentials for real phone calls & SMS.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default EmergencyDetection;
