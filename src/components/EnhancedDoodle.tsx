import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect, Triangle, Path, PencilBrush } from "fabric";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Brush, 
  Square, 
  Circle as CircleIcon, 
  Triangle as TriangleIcon,
  Eraser,
  Undo2, 
  Redo2, 
  Trash2, 
  Download,
  Sparkles,
  Paintbrush,
  Zap,
  Droplets
} from "lucide-react";
import { toast } from "sonner";

type Tool = "select" | "draw" | "spray" | "watercolor" | "rectangle" | "circle" | "triangle" | "eraser";

const EnhancedDoodle = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState("#8b5cf6");
  const [activeTool, setActiveTool] = useState<Tool>("draw");
  const [brushSize, setBrushSize] = useState([3]);
  const [opacity, setOpacity] = useState([100]);

  const colors = [
    "#8b5cf6", "#a855f7", "#c084fc", "#d8b4fe",
    "#6366f1", "#3b82f6", "#06b6d4", "#10b981",
    "#f59e0b", "#f97316", "#ef4444", "#ec4899",
    "#64748b", "#374151", "#000000", "#ffffff"
  ];

  const tools = [
    { id: "select", icon: Palette, label: "Select", color: "bg-accent" },
    { id: "draw", icon: Brush, label: "Brush", color: "bg-primary/20" },
    { id: "spray", icon: Zap, label: "Spray", color: "bg-secondary/20" },
    { id: "watercolor", icon: Droplets, label: "Watercolor", color: "bg-primary/30" },
    { id: "rectangle", icon: Square, label: "Rectangle", color: "bg-muted" },
    { id: "circle", icon: CircleIcon, label: "Circle", color: "bg-muted" },
    { id: "triangle", icon: TriangleIcon, label: "Triangle", color: "bg-muted" },
    { id: "eraser", icon: Eraser, label: "Eraser", color: "bg-destructive/20" }
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 500,
      backgroundColor: "#ffffff",
    });

    // Initialize drawing brush
    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.color = activeColor;
    canvas.freeDrawingBrush.width = brushSize[0];

    setFabricCanvas(canvas);
    toast("🎨 Enhanced Paint Studio is ready! Create your masterpiece!");

    return () => {
      canvas.dispose();
    };
  }, []);

  // Update brush properties when tool/color/size changes
  useEffect(() => {
    if (!fabricCanvas) return;

    const isDrawingTool = ["draw", "spray", "watercolor", "eraser"].includes(activeTool);
    fabricCanvas.isDrawingMode = isDrawingTool;
    
    if (isDrawingTool && fabricCanvas.freeDrawingBrush) {
      // Create different brush effects
      switch (activeTool) {
        case "spray":
          fabricCanvas.freeDrawingBrush.width = brushSize[0] * 2;
          fabricCanvas.freeDrawingBrush.color = activeColor;
          break;
        case "watercolor":
          fabricCanvas.freeDrawingBrush.width = brushSize[0] * 1.5;
          fabricCanvas.freeDrawingBrush.color = activeColor + Math.floor(opacity[0] * 0.6).toString(16).padStart(2, '0');
          break;
        case "eraser":
          fabricCanvas.freeDrawingBrush.width = brushSize[0] * 1.2;
          fabricCanvas.freeDrawingBrush.color = "#ffffff";
          break;
        default:
          fabricCanvas.freeDrawingBrush.width = brushSize[0];
          fabricCanvas.freeDrawingBrush.color = activeColor;
      }
    }
  }, [activeTool, activeColor, brushSize, opacity, fabricCanvas]);

  const handleToolClick = (tool: Tool) => {
    setActiveTool(tool);

    if (!fabricCanvas) return;

    // Add shapes
    if (tool === "rectangle") {
      const rect = new Rect({
        left: 100 + Math.random() * 200,
        top: 100 + Math.random() * 200,
        fill: activeColor + Math.floor(opacity[0] * 2.55).toString(16).padStart(2, '0'),
        width: 80,
        height: 60,
        stroke: activeColor,
        strokeWidth: 2,
      });
      fabricCanvas.add(rect);
      toast("Rectangle added! 📐");
    } else if (tool === "circle") {
      const circle = new Circle({
        left: 100 + Math.random() * 200,
        top: 100 + Math.random() * 200,
        fill: activeColor + Math.floor(opacity[0] * 2.55).toString(16).padStart(2, '0'),
        radius: 40,
        stroke: activeColor,
        strokeWidth: 2,
      });
      fabricCanvas.add(circle);
      toast("Circle added! ⭕");
    } else if (tool === "triangle") {
      const triangle = new Triangle({
        left: 100 + Math.random() * 200,
        top: 100 + Math.random() * 200,
        fill: activeColor + Math.floor(opacity[0] * 2.55).toString(16).padStart(2, '0'),
        width: 80,
        height: 80,
        stroke: activeColor,
        strokeWidth: 2,
      });
      fabricCanvas.add(triangle);
      toast("Triangle added! 🔺");
    }
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    toast("Canvas cleared! 🗑️");
  };

  const handleUndo = () => {
    if (!fabricCanvas) return;
    const objects = fabricCanvas.getObjects();
    if (objects.length > 0) {
      fabricCanvas.remove(objects[objects.length - 1]);
      toast("Undone! ↶");
    }
  };

  const handleDownload = () => {
    if (!fabricCanvas) return;
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1,
    });
    
    const link = document.createElement('a');
    link.download = `shalala-artwork-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    
    toast("🎨 Your masterpiece has been downloaded!");
  };

  const applyTextureEffect = () => {
    if (!fabricCanvas) return;
    const objects = fabricCanvas.getObjects();
    objects.forEach(obj => {
      if (obj.type === 'path') {
        obj.set({
          shadow: {
            color: activeColor,
            blur: 5,
            offsetX: 2,
            offsetY: 2,
          }
        });
      }
    });
    fabricCanvas.renderAll();
    toast("✨ Texture effect applied!");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-elder-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <Paintbrush className="w-8 h-8 text-primary" />
          Enhanced Paint Studio
        </h2>
        <p className="text-elder-lg text-muted-foreground">
          Create beautiful artwork with professional painting tools
        </p>
      </div>

      {/* Toolbar */}
      <Card className="p-4 shadow-gentle">
        <div className="space-y-4">
          {/* Tool Selection */}
          <div className="flex flex-wrap gap-2">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Button
                  key={tool.id}
                  variant={activeTool === tool.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToolClick(tool.id as Tool)}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="w-4 h-4" />
                  {tool.label}
                </Button>
              );
            })}
          </div>

          {/* Color Palette */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Colors</h4>
            <div className="grid grid-cols-8 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setActiveColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                    activeColor === color ? 'border-foreground shadow-lg' : 'border-border'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <Badge variant="outline" className="text-xs">
              Active: {activeColor}
            </Badge>
          </div>

          {/* Brush Settings */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Brush Size: {brushSize[0]}px</h4>
              <Slider
                value={brushSize}
                onValueChange={setBrushSize}
                max={50}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Opacity: {opacity[0]}%</h4>
              <Slider
                value={opacity}
                onValueChange={setOpacity}
                max={100}
                min={10}
                step={5}
                className="w-full"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleUndo} variant="outline" size="sm">
              <Undo2 className="w-4 h-4 mr-1" />
              Undo
            </Button>
            <Button onClick={applyTextureEffect} variant="outline" size="sm">
              <Sparkles className="w-4 h-4 mr-1" />
              Add Texture
            </Button>
            <Button onClick={handleClear} variant="outline" size="sm">
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
            <Button onClick={handleDownload} variant="default" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </Card>

      {/* Canvas */}
      <Card className="p-6 shadow-gentle">
        <div className="flex justify-center">
          <div className="border-2 border-border rounded-lg overflow-hidden shadow-companionship">
            <canvas ref={canvasRef} className="bg-white" />
          </div>
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-4 shadow-gentle bg-gradient-companionship">
        <h3 className="text-elder-lg font-semibold text-foreground mb-2">🎨 Painting Tips</h3>
        <div className="grid md:grid-cols-2 gap-4 text-elder-base text-muted-foreground">
          <div>
            <p>• Use <strong>Spray</strong> for soft, textured effects</p>
            <p>• Try <strong>Watercolor</strong> with low opacity for blending</p>
            <p>• Combine shapes with brush strokes for mixed media art</p>
          </div>
          <div>
            <p>• Adjust opacity for layering colors</p>
            <p>• Use larger brush sizes for filling areas</p>
            <p>• Click "Add Texture" for shadow effects</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedDoodle;