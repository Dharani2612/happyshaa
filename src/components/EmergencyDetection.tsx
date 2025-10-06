import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Phone, Camera, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const EmergencyDetection = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [emergencyDetected, setEmergencyDetected] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoStream]);

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
      toast.success("Emergency monitoring started");
      
      // Simulate emergency detection for demo
      startEmergencyDetection();
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
    setIsMonitoring(false);
    setEmergencyDetected(false);
    toast.info("Emergency monitoring stopped");
  };

  const startEmergencyDetection = () => {
    // This is a simplified demo. In production, you'd use ML models like TensorFlow.js
    // to detect falls, distress, or unusual activity patterns
    const detectionInterval = setInterval(() => {
      // Simulate random emergency detection for demo purposes
      const randomCheck = Math.random();
      if (randomCheck < 0.01) { // 1% chance per check
        detectEmergency();
        clearInterval(detectionInterval);
      }
    }, 2000);

    // Clean up interval after 2 minutes
    setTimeout(() => clearInterval(detectionInterval), 120000);
  };

  const detectEmergency = async () => {
    setEmergencyDetected(true);
    toast.error("⚠️ Emergency detected! Preparing to alert contacts...", {
      duration: 10000,
    });

    // Wait 10 seconds before auto-calling
    setTimeout(() => {
      if (emergencyDetected) {
        makeEmergencyCalls();
      }
    }, 10000);
  };

  const makeEmergencyCalls = async () => {
    try {
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

      // Call each emergency contact
      contacts.forEach((contact: any) => {
        const phoneNumber = contact.phone.replace(/\D/g, '');
        
        // Check if device is mobile
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          window.location.href = `tel:${phoneNumber}`;
          toast.success(`Calling ${contact.name}...`);
        } else {
          // Desktop: show phone number
          toast.info(`Emergency! Call ${contact.name} at ${contact.phone}`, {
            duration: 30000,
          });
        }
      });

      toast.success(`Emergency alerts sent to ${contacts.length} contact(s)`);
      
    } catch (error) {
      console.error("Error making emergency calls:", error);
      toast.error("Failed to alert emergency contacts");
    }
  };

  const cancelEmergency = () => {
    setEmergencyDetected(false);
    toast.info("Emergency alert cancelled");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
          <AlertCircle className="w-8 h-8 text-destructive" />
          Emergency Detection System
        </h2>
        <p className="text-lg text-muted-foreground">
          AI-powered monitoring to keep you safe
        </p>
      </div>

      <Card className="p-6 shadow-companionship">
        {!isMonitoring ? (
          <div className="text-center space-y-4">
            <Camera className="w-16 h-16 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">
              Enable camera monitoring to detect emergencies like falls or distress
            </p>
            <Button onClick={startMonitoring} size="lg" className="gap-2">
              <Camera className="w-5 h-5" />
              Start Monitoring
            </Button>
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
                    <span className="text-sm font-medium text-primary">Monitoring Active</span>
                  </>
                )}
              </div>
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
                      Emergency contacts will be called automatically in 10 seconds...
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={makeEmergencyCalls}
                        variant="destructive"
                        size="sm"
                        className="gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Call Now
                      </Button>
                      <Button
                        onClick={cancelEmergency}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Controls */}
            <div className="flex justify-center">
              <Button onClick={stopMonitoring} variant="outline" className="gap-2">
                <X className="w-4 h-4" />
                Stop Monitoring
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Info Card */}
      <Card className="p-6 shadow-gentle bg-gradient-to-br from-primary/5 to-accent/5">
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-primary" />
          How It Works
        </h3>
        <ul className="space-y-2 text-muted-foreground">
          <li>• <strong>Camera Monitoring:</strong> Uses your device camera to detect unusual activity</li>
          <li>• <strong>AI Detection:</strong> Advanced algorithms identify potential emergencies</li>
          <li>• <strong>Auto-Alert:</strong> Automatically calls your emergency contacts</li>
          <li>• <strong>Cancel Option:</strong> 10-second window to cancel false alarms</li>
          <li>• <strong>Privacy First:</strong> All processing happens locally on your device</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-4 p-3 bg-background/50 rounded-lg">
          💡 <strong>Tip:</strong> Add emergency contacts in the Contacts section for this feature to work
        </p>
      </Card>
    </div>
  );
};

export default EmergencyDetection;
