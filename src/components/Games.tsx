import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Heart, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const Games = () => {
  const [memoryCards, setMemoryCards] = useState<Array<{id: number, value: string, isFlipped: boolean, isMatched: boolean}>>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [breathingActive, setBreathingActive] = useState(false);
  const [affirmationIndex, setAffirmationIndex] = useState(0);

  const affirmations = [
    "You are worthy of love and kindness",
    "You have the strength to overcome challenges", 
    "You deserve peace and happiness",
    "You are making progress every day",
    "You matter and your feelings are valid",
    "You are capable of amazing things"
  ];

  const initializeMemoryGame = () => {
    const cardValues = ['🌸', '🌺', '🦋', '🌈', '🕊️', '🌙', '⭐', '🌻'];
    const cards = [...cardValues, ...cardValues].map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false
    }));
    
    // Shuffle cards
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    setMemoryCards(cards);
    setSelectedCards([]);
  };

  const handleCardClick = (cardId: number) => {
    if (selectedCards.length === 2) return;
    if (memoryCards[cardId].isFlipped || memoryCards[cardId].isMatched) return;

    const newCards = [...memoryCards];
    newCards[cardId].isFlipped = true;
    setMemoryCards(newCards);

    const newSelected = [...selectedCards, cardId];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (newCards[first].value === newCards[second].value) {
        setTimeout(() => {
          newCards[first].isMatched = true;
          newCards[second].isMatched = true;
          setMemoryCards([...newCards]);
          setSelectedCards([]);
          toast("Great match! 🌟");
        }, 1000);
      } else {
        setTimeout(() => {
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setMemoryCards([...newCards]);
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  const startBreathingExercise = () => {
    setBreathingActive(true);
    const cycle = () => {
      setBreathingPhase('inhale');
      setTimeout(() => setBreathingPhase('hold'), 4000);
      setTimeout(() => setBreathingPhase('exhale'), 8000);
      setTimeout(() => setBreathingPhase('rest'), 12000);
    };
    
    cycle();
    const interval = setInterval(cycle, 16000);
    
    setTimeout(() => {
      clearInterval(interval);
      setBreathingActive(false);
      setBreathingPhase('inhale');
      toast("Great job on your breathing exercise! 🧘‍♀️");
    }, 60000); // 1 minute
  };

  const nextAffirmation = () => {
    setAffirmationIndex((prev) => (prev + 1) % affirmations.length);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-elder-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <Gamepad2 className="w-8 h-8 text-primary" />
          Wellness Games
        </h2>
        <p className="text-elder-lg text-muted-foreground">
          Gentle games to help you relax and feel better
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Memory Game */}
        <Card className="p-6 shadow-gentle">
          <div className="text-center mb-6">
            <h3 className="text-elder-xl font-semibold text-foreground mb-2">Memory Garden</h3>
            <p className="text-muted-foreground">Match the beautiful symbols</p>
            <Button onClick={initializeMemoryGame} className="mt-4" variant="companionship">
              <RefreshCw className="w-4 h-4 mr-2" />
              New Game
            </Button>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {memoryCards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`
                  aspect-square rounded-lg border-2 border-border cursor-pointer 
                  flex items-center justify-center text-2xl transition-all
                  ${card.isFlipped || card.isMatched 
                    ? 'bg-primary/10 border-primary' 
                    : 'bg-muted hover:bg-muted/70'
                  }
                  ${card.isMatched ? 'opacity-60' : ''}
                `}
              >
                {(card.isFlipped || card.isMatched) ? card.value : '?'}
              </div>
            ))}
          </div>
        </Card>

        {/* Breathing Exercise */}
        <Card className="p-6 shadow-gentle">
          <div className="text-center mb-6">
            <h3 className="text-elder-xl font-semibold text-foreground mb-2">Breathing Circle</h3>
            <p className="text-muted-foreground">Follow the circle to breathe calmly</p>
          </div>
          
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-32 h-32">
              <div 
                className={`
                  w-full h-full rounded-full border-4 border-primary/30 
                  flex items-center justify-center transition-all duration-1000
                  ${breathingPhase === 'inhale' ? 'scale-125 bg-primary/20' : ''}
                  ${breathingPhase === 'hold' ? 'scale-125 bg-primary/30' : ''}
                  ${breathingPhase === 'exhale' ? 'scale-75 bg-primary/10' : ''}
                  ${breathingPhase === 'rest' ? 'scale-100 bg-primary/5' : ''}
                `}
              >
                <Heart className="w-8 h-8 text-primary" />
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-elder-lg font-medium text-foreground capitalize">
                {breathingActive ? breathingPhase : 'Ready to breathe'}
              </p>
              <p className="text-muted-foreground mt-2">
                {breathingActive 
                  ? (breathingPhase === 'inhale' ? 'Breathe in slowly...' :
                     breathingPhase === 'hold' ? 'Hold your breath...' :
                     breathingPhase === 'exhale' ? 'Breathe out slowly...' :
                     'Rest and prepare...')
                  : 'Click to start a 1-minute breathing exercise'
                }
              </p>
            </div>
            
            <Button 
              onClick={startBreathingExercise} 
              disabled={breathingActive}
              variant="companionship"
              size="lg"
            >
              {breathingActive ? 'Breathing...' : 'Start Breathing Exercise'}
            </Button>
          </div>
        </Card>

        {/* Daily Affirmations */}
        <Card className="p-6 shadow-gentle md:col-span-2">
          <div className="text-center">
            <h3 className="text-elder-xl font-semibold text-foreground mb-6">Daily Affirmations</h3>
            
            <div className="bg-gradient-primary/10 rounded-lg p-8 mb-6">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
              <p className="text-elder-xl font-medium text-foreground leading-relaxed">
                "{affirmations[affirmationIndex]}"
              </p>
            </div>
            
            <Button onClick={nextAffirmation} variant="companionship" size="lg">
              <RefreshCw className="w-4 h-4 mr-2" />
              New Affirmation
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Games;