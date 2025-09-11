import { useState } from "react";
import { Brain, CheckCircle, Play, Pause, RotateCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface Exercise {
  id: string;
  title: string;
  description: string;
  type: "cbt" | "breathing" | "mindfulness" | "grounding";
  duration: number; // in minutes
  steps: string[];
}

const exercises: Exercise[] = [
  {
    id: "thought-challenging",
    title: "Thought Challenging",
    description: "Identify and reframe negative thought patterns using CBT techniques.",
    type: "cbt",
    duration: 10,
    steps: [
      "Identify the negative thought that's bothering you",
      "Ask yourself: Is this thought realistic? What evidence supports it?",
      "Consider alternative, more balanced perspectives",
      "Replace the thought with a more helpful, realistic one",
      "Notice how this new thought makes you feel"
    ]
  },
  {
    id: "box-breathing",
    title: "Box Breathing",
    description: "A calming breathing technique to reduce anxiety and stress.",
    type: "breathing",
    duration: 5,
    steps: [
      "Sit comfortably with your back straight",
      "Breathe in through your nose for 4 counts",
      "Hold your breath for 4 counts",
      "Exhale through your mouth for 4 counts",
      "Hold empty for 4 counts, then repeat"
    ]
  },
  {
    id: "body-scan",
    title: "Body Scan Meditation",
    description: "Progressive relaxation technique to release tension and increase awareness.",
    type: "mindfulness",
    duration: 15,
    steps: [
      "Lie down or sit comfortably",
      "Close your eyes and take three deep breaths",
      "Start at the top of your head, notice any sensations",
      "Slowly move your attention down through your body",
      "Spend 30 seconds on each body part",
      "Release any tension you notice along the way"
    ]
  },
  {
    id: "five-four-three-two-one",
    title: "5-4-3-2-1 Grounding",
    description: "Use your senses to ground yourself in the present moment.",
    type: "grounding",
    duration: 3,
    steps: [
      "Name 5 things you can see around you",
      "Name 4 things you can touch",
      "Name 3 things you can hear",
      "Name 2 things you can smell",
      "Name 1 thing you can taste"
    ]
  }
];

export const CBTExercises = () => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { toast } = useToast();

  const getTypeColor = (type: Exercise["type"]) => {
    switch (type) {
      case "cbt":
        return "bg-primary/20 text-primary";
      case "breathing":
        return "bg-green-500/20 text-green-700";
      case "mindfulness":
        return "bg-purple-500/20 text-purple-700";
      case "grounding":
        return "bg-orange-500/20 text-orange-700";
    }
  };

  const getTypeIcon = (type: Exercise["type"]) => {
    switch (type) {
      case "cbt":
        return "🧠";
      case "breathing":
        return "🌬️";
      case "mindfulness":
        return "🧘";
      case "grounding":
        return "🌍";
    }
  };

  const startExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setCurrentStep(0);
    setTimeRemaining(exercise.duration * 60); // Convert to seconds
    setIsActive(false);
  };

  const toggleTimer = () => {
    if (!isActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsActive(false);
            toast({
              title: "Exercise Complete! 🎉",
              description: "Great job completing your wellness exercise. How do you feel?",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    setIsActive(!isActive);
  };

  const resetExercise = () => {
    setSelectedExercise(null);
    setCurrentStep(0);
    setIsActive(false);
    setTimeRemaining(0);
  };

  const nextStep = () => {
    if (selectedExercise && currentStep < selectedExercise.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (selectedExercise) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 shadow-therapeutic border-primary/10">
          {/* Exercise Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center text-2xl">
              {getTypeIcon(selectedExercise.type)}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{selectedExercise.title}</h2>
            <p className="text-muted-foreground">{selectedExercise.description}</p>
          </div>

          {/* Timer */}
          <div className="text-center mb-8">
            <div className="text-4xl font-bold text-primary mb-2">
              {formatTime(timeRemaining)}
            </div>
            <div className="flex justify-center gap-2">
              <Button
                variant="therapeutic"
                size="sm"
                onClick={toggleTimer}
                disabled={timeRemaining === 0}
              >
                {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isActive ? "Pause" : "Start"}
              </Button>
              <Button variant="outline" size="sm" onClick={resetExercise}>
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Step {currentStep + 1} of {selectedExercise.steps.length}</span>
              <span>{Math.round(((currentStep + 1) / selectedExercise.steps.length) * 100)}%</span>
            </div>
            <Progress value={((currentStep + 1) / selectedExercise.steps.length) * 100} />
          </div>

          {/* Current Step */}
          <Card className="p-6 bg-gradient-healing border-primary/20 mb-6">
            <h3 className="font-semibold text-foreground mb-3">
              Step {currentStep + 1}
            </h3>
            <p className="text-foreground leading-relaxed">
              {selectedExercise.steps[currentStep]}
            </p>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous Step
            </Button>
            <Button
              variant="therapeutic"
              onClick={nextStep}
              disabled={currentStep === selectedExercise.steps.length - 1}
            >
              Next Step
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
          <Brain className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">CBT & Mindfulness Exercises</h2>
        <p className="text-muted-foreground">Evidence-based techniques to support your mental wellness</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exercises.map((exercise) => (
          <Card
            key={exercise.id}
            className="p-6 shadow-gentle border-primary/10 hover:shadow-therapeutic transition-therapeutic cursor-pointer"
            onClick={() => startExercise(exercise)}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{getTypeIcon(exercise.type)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground">{exercise.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(exercise.type)}`}>
                    {exercise.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {exercise.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Timer className="w-3 h-3" />
                    {exercise.duration} minutes
                  </div>
                  <Button variant="calming" size="sm">
                    Start Exercise
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="mt-8 p-6 shadow-gentle border-primary/10 bg-gradient-calm">
        <h3 className="font-semibold text-accent-foreground mb-4">Quick Relief Techniques</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="healing"
            className="h-auto p-4 flex-col gap-2"
            onClick={() => startExercise(exercises.find(e => e.id === "box-breathing")!)}
          >
            <span className="text-2xl">🌬️</span>
            <span className="text-sm">Quick Breathing</span>
          </Button>
          <Button
            variant="healing"
            className="h-auto p-4 flex-col gap-2"
            onClick={() => startExercise(exercises.find(e => e.id === "five-four-three-two-one")!)}
          >
            <span className="text-2xl">🌍</span>
            <span className="text-sm">Grounding</span>
          </Button>
          <Button
            variant="healing"
            className="h-auto p-4 flex-col gap-2"
            onClick={() => startExercise(exercises.find(e => e.id === "thought-challenging")!)}
          >
            <span className="text-2xl">🧠</span>
            <span className="text-sm">Reframe Thoughts</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};