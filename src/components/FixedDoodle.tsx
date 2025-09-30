import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Palette, Eraser, Download, Trash2, Undo } from "lucide-react";
import { toast } from "sonner";

const FixedDoodle = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState("#8b5cf6");
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);

  const colors = [
    "#8b5cf6", "#ec4899", "#3b82f6", "#10b981", 
    "#f59e0b", "#ef4444", "#6366f1", "#14b8a6"
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
      isDrawingMode: true,
    });

    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.color = activeColor;
    canvas.freeDrawingBrush.width = brushSize;

    setFabricCanvas(canvas);
    toast.success("Canvas ready! Start drawing! 🎨");

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas || !fabricCanvas.freeDrawingBrush) return;

    if (isEraser) {
      fabricCanvas.freeDrawingBrush.color = "#ffffff";
    } else {
      fabricCanvas.freeDrawingBrush.color = activeColor;
    }
  }, [activeColor, isEraser, fabricCanvas]);

  useEffect(() => {
    if (!fabricCanvas || !fabricCanvas.freeDrawingBrush) return;
    fabricCanvas.freeDrawingBrush.width = brushSize;
  }, [brushSize, fabricCanvas]);

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    toast.success("Canvas cleared! ✨");
  };

  const handleUndo = () => {
    if (!fabricCanvas) return;
    const objects = fabricCanvas.getObjects();
    if (objects.length > 0) {
      fabricCanvas.remove(objects[objects.length - 1]);
      fabricCanvas.renderAll();
      toast.success("Undone! ↩️");
    }
  };

  const handleDownload = () => {
    if (!fabricCanvas) return;
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1
    });
    const link = document.createElement('a');
    link.download = `shalala-art-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    toast.success("Artwork downloaded! 🎨");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
          <Palette className="w-8 h-8 text-primary" />
          Digital Art Canvas
        </h2>
        <p className="text-lg text-muted-foreground">
          Express yourself through colors and creativity
        </p>
      </div>

      <Card className="p-6 shadow-companionship">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          {/* Color Palette */}
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setActiveColor(color);
                  setIsEraser(false);
                }}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  activeColor === color && !isEraser
                    ? "border-foreground scale-110 shadow-lg"
                    : "border-border hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Eraser */}
          <Button
            onClick={() => setIsEraser(!isEraser)}
            variant={isEraser ? "companionship" : "outline"}
            size="sm"
          >
            <Eraser className="w-4 h-4" />
          </Button>

          {/* Brush Size */}
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Size: {brushSize}
            </span>
            <Slider
              value={[brushSize]}
              onValueChange={(value) => setBrushSize(value[0])}
              min={1}
              max={50}
              step={1}
              className="flex-1"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleUndo} variant="outline" size="sm">
              <Undo className="w-4 h-4 mr-1" />
              Undo
            </Button>
            <Button onClick={handleClear} variant="outline" size="sm">
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
            <Button onClick={handleDownload} variant="companionship" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="border border-border rounded-lg overflow-hidden shadow-gentle">
          <canvas ref={canvasRef} className="max-w-full" />
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-6 shadow-gentle bg-muted/30">
        <h3 className="text-lg font-semibold text-foreground mb-3">🎨 Painting Tips</h3>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Use different colors to express your emotions</li>
          <li>• Try different brush sizes for various effects</li>
          <li>• The eraser tool helps you refine your artwork</li>
          <li>• Don't worry about perfection - just enjoy creating!</li>
        </ul>
      </Card>
    </div>
  );
};

export default FixedDoodle;
