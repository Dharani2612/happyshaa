import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-healing p-4">
      <Card className="text-center max-w-md w-full p-8 shadow-therapeutic border-primary/10">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center">
          <Heart className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Page not found</p>
        <p className="text-sm text-muted-foreground mb-8">
          The page you're looking for doesn't exist, but your wellness journey continues.
        </p>
        <Button 
          variant="therapeutic" 
          asChild 
          className="w-full"
        >
          <a href="/">
            <Home className="w-4 h-4 mr-2" />
            Return to WellMind
          </a>
        </Button>
      </Card>
    </div>
  );
};

export default NotFound;
