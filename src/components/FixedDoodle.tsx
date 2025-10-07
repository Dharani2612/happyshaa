import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush, Circle, Rect, Triangle, Line, Text as FabricText, Path, Polygon } from "fabric";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Palette, Eraser, Download, Trash2, Undo, Circle as CircleIcon, Square, Triangle as TriangleIcon, Pencil, Minus, Type, Star, Heart, Sparkles, RotateCw } from "lucide-react";
import { toast } from "sonner";

const FixedDoodle = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState("#8b5cf6");
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  const [activeTool, setActiveTool] = useState<"draw" | "circle" | "square" | "triangle" | "line" | "text" | "star" | "heart">("draw");
  const [textInput, setTextInput] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [actionCount, setActionCount] = useState(0);

  const colors = [
    "#8b5cf6", "#ec4899", "#3b82f6", "#10b981", 
    "#f59e0b", "#ef4444", "#6366f1", "#14b8a6",
    "#f97316", "#a855f7", "#06b6d4", "#84cc16"
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth > 900 ? 900 : window.innerWidth - 48,
      height: 600,
      backgroundColor: "#ffffff",
      isDrawingMode: true,
    });

    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.color = activeColor;
    canvas.freeDrawingBrush.width = brushSize;

    setFabricCanvas(canvas);
    
    const welcomeMessages = [
      "Your creative journey begins! 🎨✨",
      "Canvas is ready for your masterpiece! 🌟",
      "Let your imagination flow freely! 💫",
      "Time to create something beautiful! 🎭",
      "Your blank canvas awaits your magic! ✨",
      "Ready to paint your emotions! 🌈"
    ];
    toast.success(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]);

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
    const clearMessages = [
      "Fresh start! Your canvas is clean! ✨",
      "Ready for a new creation! 🎨",
      "Blank slate, endless possibilities! 🌟",
      "Cleared! Time for something new! 💫",
      "Fresh canvas, fresh ideas! 🎭",
      "All clear! What will you create next? 🌈"
    ];
    toast.success(clearMessages[Math.floor(Math.random() * clearMessages.length)]);
  };

  const handleUndo = () => {
    if (!fabricCanvas) return;
    const objects = fabricCanvas.getObjects();
    if (objects.length > 0) {
      fabricCanvas.remove(objects[objects.length - 1]);
      fabricCanvas.renderAll();
      const undoMessages = [
        "Step back taken! ↩️",
        "Reversed! Try again! 🔄",
        "Undone! Keep creating! ✨",
        "One step back, two steps forward! 💫",
        "Removed! No worries! 🎨",
        "Take your time, perfection takes patience! 🌟"
      ];
      toast.success(undoMessages[Math.floor(Math.random() * undoMessages.length)]);
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
    const downloadMessages = [
      "Your masterpiece is saved! 🎨✨",
      "Art preserved! Beautiful work! 🌟",
      "Downloaded! Your creativity is captured! 💫",
      "Saved forever! Amazing creation! 🎭",
      "Your art is now yours to keep! 🌈",
      "Masterpiece downloaded! So proud of you! 💕"
    ];
    toast.success(downloadMessages[Math.floor(Math.random() * downloadMessages.length)]);
  };

  const handleToolChange = (tool: "draw" | "circle" | "square" | "triangle" | "line" | "text" | "star" | "heart") => {
    if (!fabricCanvas) return;
    
    setActiveTool(tool);
    setIsEraser(false);
    setShowTextInput(tool === "text");
    
    if (tool === "draw") {
      fabricCanvas.isDrawingMode = true;
      const drawMessages = [
        "Free drawing mode! Express yourself! ✏️",
        "Pencil ready! Let your hand flow! 🎨",
        "Draw anything your heart desires! 💫",
        "Time to sketch your thoughts! ✨"
      ];
      toast.success(drawMessages[Math.floor(Math.random() * drawMessages.length)]);
    } else if (tool === "text") {
      fabricCanvas.isDrawingMode = false;
      toast.info("Type your text and click 'Add Text' to place it! 📝");
    } else {
      fabricCanvas.isDrawingMode = false;
      
      let shape;
      const randomX = Math.random() * 400 + 100;
      const randomY = Math.random() * 300 + 100;
      
      if (tool === "circle") {
        shape = new Circle({
          left: randomX,
          top: randomY,
          radius: 50,
          fill: activeColor,
          stroke: activeColor,
          strokeWidth: 2,
        });
      } else if (tool === "square") {
        shape = new Rect({
          left: randomX,
          top: randomY,
          width: 100,
          height: 100,
          fill: activeColor,
          stroke: activeColor,
          strokeWidth: 2,
        });
      } else if (tool === "triangle") {
        shape = new Triangle({
          left: randomX,
          top: randomY,
          width: 100,
          height: 100,
          fill: activeColor,
          stroke: activeColor,
          strokeWidth: 2,
        });
      } else if (tool === "line") {
        shape = new Line([randomX, randomY, randomX + 150, randomY + 100], {
          stroke: activeColor,
          strokeWidth: brushSize,
        });
      } else if (tool === "star") {
        const starPoints = [];
        const outerRadius = 50;
        const innerRadius = 25;
        for (let i = 0; i < 10; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / 5 - Math.PI / 2;
          starPoints.push({
            x: randomX + radius * Math.cos(angle),
            y: randomY + radius * Math.sin(angle)
          });
        }
        shape = new Polygon(starPoints, {
          fill: activeColor,
          stroke: activeColor,
          strokeWidth: 2,
        });
      } else if (tool === "heart") {
        const heartPath = "M 0,20 C -20,0 -40,10 -40,30 C -40,50 -20,70 0,80 C 20,70 40,50 40,30 C 40,10 20,0 0,20 Z";
        shape = new Path(heartPath, {
          left: randomX,
          top: randomY,
          fill: activeColor,
          stroke: activeColor,
          strokeWidth: 2,
          scaleX: 1,
          scaleY: 1
        });
      }
      
      if (shape) {
        fabricCanvas.add(shape);
        fabricCanvas.setActiveObject(shape);
        fabricCanvas.renderAll();
        
        setActionCount(prev => prev + 1);
        const shapeMessages = [
          `Beautiful ${tool}! Love it! 🎨`,
          `${tool} placed! Keep creating! ✨`,
          `Gorgeous ${tool} added! 💫`,
          `Perfect ${tool}! Your art is blooming! 🌟`,
          `${tool} looks amazing there! 🎭`,
          `Wonderful choice! That ${tool} is perfect! 💕`,
          `${tool} added! You're doing great! 🌈`,
          `Love that ${tool}! So creative! ✨`
        ];
        toast.success(shapeMessages[Math.floor(Math.random() * shapeMessages.length)]);
        
        // Encouraging messages every few actions
        if (actionCount > 0 && actionCount % 5 === 0) {
          const encouragements = [
            "You're creating something truly special! Keep going! 🌟",
            "Your artistic skills are shining through! 💫",
            "Every stroke adds more beauty! Don't stop! ✨",
            "This is turning out wonderfully! 🎨",
            "You have such a creative eye! Amazing! 💕"
          ];
          setTimeout(() => {
            toast(encouragements[Math.floor(Math.random() * encouragements.length)], {
              duration: 3000,
            });
          }, 1000);
        }
      }
    }
  };

  const handleAddText = () => {
    if (!fabricCanvas || !textInput.trim()) return;
    
    const text = new FabricText(textInput, {
      left: Math.random() * 400 + 100,
      top: Math.random() * 300 + 100,
      fontSize: 30,
      fill: activeColor,
      fontFamily: 'Arial',
    });
    
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
    
    const textMessages = [
      "Text added! Words on canvas! 📝✨",
      "Your message is now art! 💫",
      "Beautiful text! Perfect placement! 🌟",
      "Words that shine! Love it! ✨",
      "Text looks fantastic! 🎨"
    ];
    toast.success(textMessages[Math.floor(Math.random() * textMessages.length)]);
    
    setTextInput("");
    setShowTextInput(false);
    setActiveTool("draw");
    fabricCanvas.isDrawingMode = true;
  };

  const handleRotateSelected = () => {
    if (!fabricCanvas) return;
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      activeObject.rotate((activeObject.angle || 0) + 15);
      fabricCanvas.renderAll();
      const rotateMessages = [
        "Rotated! New perspective! 🔄",
        "Spin it! Looking good! ✨",
        "Angle changed! Perfect! 💫",
        "Turned! Love that rotation! 🌟"
      ];
      toast.success(rotateMessages[Math.floor(Math.random() * rotateMessages.length)]);
    } else {
      toast.info("Select a shape first to rotate it! 🎯");
    }
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
          {/* Drawing Tools */}
          <div className="flex gap-2 border-r border-border pr-4">
            <Button
              onClick={() => handleToolChange("draw")}
              variant={activeTool === "draw" && !isEraser ? "default" : "outline"}
              size="sm"
              title="Free Draw"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => handleToolChange("line")}
              variant={activeTool === "line" ? "default" : "outline"}
              size="sm"
              title="Line"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => handleToolChange("text")}
              variant={activeTool === "text" ? "default" : "outline"}
              size="sm"
              title="Add Text"
            >
              <Type className="w-4 h-4" />
            </Button>
          </div>

          {/* Shape Tools */}
          <div className="flex gap-2 border-r border-border pr-4">
            <Button
              onClick={() => handleToolChange("circle")}
              variant={activeTool === "circle" ? "default" : "outline"}
              size="sm"
              title="Circle"
            >
              <CircleIcon className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => handleToolChange("square")}
              variant={activeTool === "square" ? "default" : "outline"}
              size="sm"
              title="Square"
            >
              <Square className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => handleToolChange("triangle")}
              variant={activeTool === "triangle" ? "default" : "outline"}
              size="sm"
              title="Triangle"
            >
              <TriangleIcon className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => handleToolChange("star")}
              variant={activeTool === "star" ? "default" : "outline"}
              size="sm"
              title="Star"
            >
              <Star className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => handleToolChange("heart")}
              variant={activeTool === "heart" ? "default" : "outline"}
              size="sm"
              title="Heart"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>

          {/* Color Palette */}
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setActiveColor(color);
                  setIsEraser(false);
                  if (fabricCanvas?.freeDrawingBrush) {
                    fabricCanvas.freeDrawingBrush.color = color;
                  }
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
            onClick={() => {
              setIsEraser(!isEraser);
              setActiveTool("draw");
              if (fabricCanvas) fabricCanvas.isDrawingMode = true;
            }}
            variant={isEraser ? "default" : "outline"}
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
          <div className="flex gap-2 border-l border-border pl-4">
            <Button onClick={handleRotateSelected} variant="outline" size="sm" title="Rotate Selected">
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button onClick={handleUndo} variant="outline" size="sm">
              <Undo className="w-4 h-4 mr-1" />
              Undo
            </Button>
            <Button onClick={handleClear} variant="outline" size="sm">
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
            <Button onClick={handleDownload} variant="default" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Save Art
            </Button>
          </div>
        </div>

        {/* Text Input Field */}
        {showTextInput && (
          <div className="flex gap-2 mb-4 items-center">
            <Input
              type="text"
              placeholder="Type your text here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddText()}
              className="flex-1"
            />
            <Button onClick={handleAddText} size="sm">
              <Sparkles className="w-4 h-4 mr-1" />
              Add Text
            </Button>
          </div>
        )}

        {/* Canvas */}
        <div className="border border-border rounded-lg overflow-hidden shadow-gentle">
          <canvas ref={canvasRef} className="max-w-full" />
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-6 shadow-gentle bg-gradient-to-br from-primary/5 to-accent/5">
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          Creative Tips
        </h3>
        <ul className="space-y-2 text-muted-foreground">
          <li>• <strong>Draw Mode:</strong> Freehand drawing with adjustable brush size</li>
          <li>• <strong>Shapes:</strong> Add circles, squares, triangles, stars, and hearts!</li>
          <li>• <strong>Text:</strong> Add meaningful words to your artwork</li>
          <li>• <strong>Colors:</strong> Express emotions with our vibrant color palette</li>
          <li>• <strong>Rotate:</strong> Select any shape and click rotate to change its angle</li>
          <li>• <strong>Layers:</strong> Shapes can be moved, resized, and layered freely</li>
          <li>• <strong>Experiment:</strong> Don't worry about perfection - just enjoy creating!</li>
          <li>• <strong>Art Therapy:</strong> Creating art helps reduce stress and express feelings</li>
        </ul>
      </Card>
    </div>
  );
};

export default FixedDoodle;
