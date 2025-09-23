import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect, Path } from "fabric";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Palette, 
  Pencil, 
  Circle as CircleIcon, 
  Square, 
  Trash2, 
  Download, 
  Undo2, 
  Redo2,
  MousePointer
} from "lucide-react";
import { toast } from "sonner";

const Doodle = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState("#6366f1");
  const [activeTool, setActiveTool] = useState<"select" | "draw" | "rectangle" | "circle">("draw");
  const [brushSize, setBrushSize] = useState(3);

  const colors = [
    "#6366f1", // Primary
    "#ec4899", // Pink
    "#10b981", // Green
    "#f59e0b", // Yellow
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#06b6d4", // Cyan
    "#84cc16", // Lime
    "#f97316", // Orange
    "#1f2937", // Dark gray
    "#6b7280", // Gray
    "#ffffff"  // White
  ];

  const brushSizes = [1, 3, 5, 8, 12, 16];

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
    });

    // Initialize the freeDrawingBrush
    canvas.freeDrawingBrush.color = activeColor;
    canvas.freeDrawingBrush.width = brushSize;

    setFabricCanvas(canvas);
    toast("Canvas ready! Start creating! 🎨");

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === "draw";
    
    if (activeTool === "draw" && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = activeColor;
      fabricCanvas.freeDrawingBrush.width = brushSize;
    }
  }, [activeTool, activeColor, brushSize, fabricCanvas]);

  const handleToolClick = (tool: typeof activeTool) => {
    setActiveTool(tool);

    if (tool === "rectangle") {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: activeColor,
        width: 100,
        height: 80,
        cornerStyle: 'circle',
        cornerColor: 'rgba(0,0,255,0.5)',
        cornerSize: 6,
        transparentCorners: false
      });
      fabricCanvas?.add(rect);
      fabricCanvas?.setActiveObject(rect);
      toast("Rectangle added! 📐");
    } else if (tool === "circle") {
      const circle = new Circle({
        left: 100,
        top: 100,
        fill: activeColor,
        radius: 50,
        cornerStyle: 'circle',
        cornerColor: 'rgba(0,0,255,0.5)',
        cornerSize: 6,
        transparentCorners: false
      });
      fabricCanvas?.add(circle);
      fabricCanvas?.setActiveObject(circle);
      toast("Circle added! ⭕");
    }
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    toast("Canvas cleared! ✨");
  };

  const handleUndo = () => {
    // Simple undo - remove last object
    const objects = fabricCanvas?.getObjects();
    if (objects && objects.length > 0) {
      fabricCanvas?.remove(objects[objects.length - 1]);
      toast("Undone! ↶");
    }
  };

  const handleRedo = () => {
    // Note: This is a simplified redo - a full implementation would need a history stack
    toast("Redo functionality - draw something new! 🎨");
  };

  const handleDownload = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 0.8,
      multiplier: 1
    });
    
    const link = document.createElement('a');
    link.download = `doodle-${new Date().getTime()}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast("Your artwork has been downloaded! 📥");
  };

  const handleColorChange = (color: string) => {
    setActiveColor(color);
    
    // If an object is selected, change its color
    const activeObject = fabricCanvas?.getActiveObject();
    if (activeObject) {
      activeObject.set('fill', color);
      fabricCanvas?.renderAll();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-elder-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <Palette className="w-8 h-8 text-primary" />
          Creative Doodle Space
        </h2>
        <p className="text-elder-lg text-muted-foreground">
          Express yourself through art - draw, create, and let your creativity flow
        </p>
      </div>

      {/* Toolbar */}
      <Card className="p-4 shadow-gentle">
        <div className="flex flex-wrap items-center gap-4">
          {/* Tools */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Tools:</span>
            <Button
              variant={activeTool === "select" ? "companionship" : "outline"}
              size="sm"
              onClick={() => handleToolClick("select")}
            >
              <MousePointer className="w-4 h-4" />
            </Button>
            <Button
              variant={activeTool === "draw" ? "companionship" : "outline"}
              size="sm"
              onClick={() => handleToolClick("draw")}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant={activeTool === "rectangle" ? "companionship" : "outline"}
              size="sm"
              onClick={() => handleToolClick("rectangle")}
            >
              <Square className="w-4 h-4" />
            </Button>
            <Button
              variant={activeTool === "circle" ? "companionship" : "outline"}
              size="sm"
              onClick={() => handleToolClick("circle")}
            >
              <CircleIcon className="w-4 h-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Brush Size */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Size:</span>
            {brushSizes.map((size) => (
              <Button
                key={size}
                variant={brushSize === size ? "companionship" : "outline"}
                size="sm"
                onClick={() => setBrushSize(size)}
                className="w-8 h-8 p-0"
              >
                {size}
              </Button>
            ))}
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleUndo}>
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleRedo}>
              <Redo2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="companionship" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Color Palette */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-muted-foreground">Colors:</span>
          </div>
          <div className="grid grid-cols-12 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`
                  w-8 h-8 rounded-lg border-2 transition-all hover:scale-110
                  ${activeColor === color ? 'border-foreground scale-110' : 'border-border'}
                  ${color === '#ffffff' ? 'border-muted-foreground' : ''}
                `}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Canvas */}
      <Card className="p-4 shadow-gentle">
        <div className="flex justify-center">
          <div className="border border-border rounded-lg shadow-lg overflow-hidden bg-white">
            <canvas ref={canvasRef} className="max-w-full" />
          </div>
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-4 shadow-gentle bg-muted/30">
        <h3 className="text-elder-lg font-semibold text-foreground mb-3">Creative Tips 🎨</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <p className="mb-2">• <strong>Drawing:</strong> Select the pencil tool and start drawing freely</p>
            <p className="mb-2">• <strong>Shapes:</strong> Add circles and rectangles, then drag to resize</p>
            <p>• <strong>Colors:</strong> Change colors by selecting from the palette</p>
          </div>
          <div>
            <p className="mb-2">• <strong>Selection:</strong> Use the pointer tool to move and resize objects</p>
            <p className="mb-2">• <strong>Brush Size:</strong> Choose different sizes for thick or thin lines</p>
            <p>• <strong>Save:</strong> Download your artwork when you're happy with it!</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Doodle;