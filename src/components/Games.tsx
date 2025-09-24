import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  const [wordPuzzle, setWordPuzzle] = useState({
    words: ['HAPPY', 'PEACE', 'LOVE', 'CALM', 'JOY'],
    currentWord: 'HAPPY',
    guessedLetters: [] as string[],
    score: 0
  });

  const [colorPattern, setColorPattern] = useState({
    sequence: [] as string[],
    playerSequence: [] as string[],
    isShowingPattern: false,
    level: 1,
    score: 0
  });

  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

  const initializeColorGame = () => {
    const newSequence = Array.from({length: 3}, () => 
      colors[Math.floor(Math.random() * colors.length)]
    );
    setColorPattern({
      sequence: newSequence,
      playerSequence: [],
      isShowingPattern: true,
      level: 1,
      score: 0
    });
    
    // Hide pattern after 3 seconds
    setTimeout(() => {
      setColorPattern(prev => ({ ...prev, isShowingPattern: false }));
    }, 3000);
  };

  const handleColorClick = (color: string) => {
    if (colorPattern.isShowingPattern) return;
    
    const newPlayerSequence = [...colorPattern.playerSequence, color];
    
    if (newPlayerSequence.length === colorPattern.sequence.length) {
      // Check if sequences match
      const isCorrect = newPlayerSequence.every((color, index) => 
        color === colorPattern.sequence[index]
      );
      
      if (isCorrect) {
        const newScore = colorPattern.score + colorPattern.level * 10;
        toast(`Perfect! Level ${colorPattern.level + 1} 🌈`);
        
        // Generate next level
        setTimeout(() => {
          const nextLevel = colorPattern.level + 1;
          const newSequence = Array.from({length: nextLevel + 2}, () => 
            colors[Math.floor(Math.random() * colors.length)]
          );
          
          setColorPattern({
            sequence: newSequence,
            playerSequence: [],
            isShowingPattern: true,
            level: nextLevel,
            score: newScore
          });
          
          setTimeout(() => {
            setColorPattern(prev => ({ ...prev, isShowingPattern: false }));
          }, 3000 + (nextLevel * 500));
        }, 1000);
      } else {
        toast("Oops! Try again 💜");
        setColorPattern(prev => ({ ...prev, playerSequence: [] }));
      }
    } else {
      setColorPattern(prev => ({ ...prev, playerSequence: newPlayerSequence }));
    }
  };

  const guessLetter = (letter: string) => {
    if (wordPuzzle.guessedLetters.includes(letter)) return;
    
    const newGuessedLetters = [...wordPuzzle.guessedLetters, letter];
    let newScore = wordPuzzle.score;
    
    if (wordPuzzle.currentWord.includes(letter)) {
      newScore += 10;
      toast("Good guess! ⭐");
    }
    
    setWordPuzzle(prev => ({
      ...prev,
      guessedLetters: newGuessedLetters,
      score: newScore
    }));
    
    // Check if word is complete
    const isComplete = wordPuzzle.currentWord.split('').every(letter => 
      newGuessedLetters.includes(letter)
    );
    
    if (isComplete) {
      toast("Word completed! 🎉");
      setTimeout(() => {
        const remainingWords = wordPuzzle.words.filter(w => w !== wordPuzzle.currentWord);
        if (remainingWords.length > 0) {
          const nextWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
          setWordPuzzle({
            words: wordPuzzle.words,
            currentWord: nextWord,
            guessedLetters: [],
            score: newScore + 50
          });
        } else {
          toast("All words completed! Amazing! 🏆");
        }
      }, 1500);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-elder-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <Gamepad2 className="w-8 h-8 text-primary" />
          Fun Wellness Games
        </h2>
        <p className="text-elder-lg text-muted-foreground">
          Colorful games to brighten your day and boost your mood
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Memory Game */}
        <Card className="p-6 shadow-colorful bg-gradient-primary/5 border-2 border-primary/20">
          <div className="text-center mb-6">
            <h3 className="text-elder-xl font-semibold text-foreground mb-2">🌸 Memory Garden</h3>
            <p className="text-muted-foreground">Match the beautiful symbols</p>
            <Button onClick={initializeMemoryGame} className="mt-4 bg-gradient-fun shadow-colorful" variant="companionship">
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
                  aspect-square rounded-xl border-3 cursor-pointer 
                  flex items-center justify-center text-2xl transition-all hover:scale-105
                  ${card.isFlipped || card.isMatched 
                    ? 'bg-gradient-fun border-white shadow-colorful transform scale-105' 
                    : 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300 hover:from-purple-200 hover:to-pink-200'
                  }
                  ${card.isMatched ? 'opacity-75 animate-pulse' : ''}
                `}
              >
                {(card.isFlipped || card.isMatched) ? (
                  <span className="drop-shadow-lg">{card.value}</span>
                ) : (
                  <span className="text-purple-400 font-bold">?</span>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Color Pattern Game */}
        <Card className="p-6 shadow-colorful bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
          <div className="text-center mb-6">
            <h3 className="text-elder-xl font-semibold text-foreground mb-2">🌈 Color Memory</h3>
            <p className="text-muted-foreground">Watch the pattern, then repeat it</p>
            <div className="flex items-center justify-center gap-4 mt-2">
              <Badge variant="secondary">Level: {colorPattern.level}</Badge>
              <Badge variant="secondary">Score: {colorPattern.score}</Badge>
            </div>
            <Button onClick={initializeColorGame} className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500" variant="companionship">
              <RefreshCw className="w-4 h-4 mr-2" />
              Start Game
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorClick(color)}
                disabled={colorPattern.isShowingPattern}
                className={`
                  w-full h-16 rounded-xl transition-all transform hover:scale-105 shadow-lg
                  ${colorPattern.isShowingPattern && colorPattern.sequence.includes(color) 
                    ? 'animate-pulse ring-4 ring-white' 
                    : ''
                  }
                  ${colorPattern.playerSequence.includes(color) 
                    ? 'ring-2 ring-gray-600' 
                    : ''
                  }
                  ${color === 'red' ? 'bg-gradient-to-br from-red-400 to-red-600' :
                    color === 'blue' ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                    color === 'green' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                    color === 'yellow' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                    color === 'purple' ? 'bg-gradient-to-br from-purple-400 to-purple-600' :
                    'bg-gradient-to-br from-orange-400 to-orange-600'
                  }
                  ${colorPattern.isShowingPattern ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
              />
            ))}
          </div>
          
          {colorPattern.isShowingPattern && (
            <p className="text-center mt-4 text-blue-600 font-medium animate-pulse">
              Watch the pattern... ✨
            </p>
          )}
        </Card>

        {/* Word Puzzle Game */}
        <Card className="p-6 shadow-colorful bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="text-center mb-6">
            <h3 className="text-elder-xl font-semibold text-foreground mb-2">💭 Word Vibes</h3>
            <p className="text-muted-foreground">Guess the positive word</p>
            <Badge variant="secondary" className="mt-2">Score: {wordPuzzle.score}</Badge>
          </div>
          
          <div className="space-y-4">
            {/* Word Display */}
            <div className="flex justify-center gap-2 mb-6">
              {wordPuzzle.currentWord.split('').map((letter, index) => (
                <div
                  key={index}
                  className="w-12 h-12 border-2 border-green-300 rounded-lg bg-white flex items-center justify-center text-xl font-bold text-green-800"
                >
                  {wordPuzzle.guessedLetters.includes(letter) ? letter : '_'}
                </div>
              ))}
            </div>
            
            {/* Letter Buttons */}
            <div className="grid grid-cols-6 gap-2">
              {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
                <Button
                  key={letter}
                  size="sm"
                  variant={wordPuzzle.guessedLetters.includes(letter) ? "secondary" : "outline"}
                  onClick={() => guessLetter(letter)}
                  disabled={wordPuzzle.guessedLetters.includes(letter)}
                  className="h-8 text-xs"
                >
                  {letter}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Breathing Exercise */}
        <Card className="p-6 shadow-colorful bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200">
          <div className="text-center mb-6">
            <h3 className="text-elder-xl font-semibold text-foreground mb-2">💨 Breathing Rainbow</h3>
            <p className="text-muted-foreground">Follow the colorful circle to breathe calmly</p>
          </div>
          
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-40 h-40">
              <div 
                className={`
                  w-full h-full rounded-full border-4 border-pink-300 
                  flex items-center justify-center transition-all duration-1000
                  ${breathingPhase === 'inhale' ? 'scale-125 bg-gradient-to-br from-blue-200 to-purple-200 shadow-lg' : ''}
                  ${breathingPhase === 'hold' ? 'scale-125 bg-gradient-to-br from-purple-200 to-pink-200 shadow-xl' : ''}
                  ${breathingPhase === 'exhale' ? 'scale-75 bg-gradient-to-br from-green-200 to-blue-200 shadow-md' : ''}
                  ${breathingPhase === 'rest' ? 'scale-100 bg-gradient-to-br from-yellow-200 to-orange-200 shadow-sm' : ''}
                `}
              >
                <Heart className="w-10 h-10 text-pink-600 drop-shadow-lg" />
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-elder-lg font-medium text-foreground capitalize">
                {breathingActive ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-pulse">✨</span>
                    {breathingPhase}
                    <span className="animate-pulse">✨</span>
                  </span>
                ) : 'Ready to breathe'}
              </p>
              <p className="text-muted-foreground mt-2">
                {breathingActive 
                  ? (breathingPhase === 'inhale' ? '🌈 Breathe in slowly...' :
                     breathingPhase === 'hold' ? '💜 Hold your breath...' :
                     breathingPhase === 'exhale' ? '💚 Breathe out slowly...' :
                     '☀️ Rest and prepare...')
                  : 'Click to start a colorful 1-minute breathing exercise'
                }
              </p>
            </div>
            
            <Button 
              onClick={startBreathingExercise} 
              disabled={breathingActive}
              className="bg-gradient-to-r from-pink-500 to-rose-500 shadow-colorful"
              variant="companionship"
              size="lg"
            >
              {breathingActive ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">🌸</span>
                  Breathing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>🌈</span>
                  Start Breathing
                </span>
              )}
            </Button>
          </div>
        </Card>

        {/* Daily Affirmations */}
        <Card className="p-6 shadow-colorful md:col-span-3 bg-gradient-rainbow/10 border-2 border-purple-200">
          <div className="text-center">
            <h3 className="text-elder-xl font-semibold text-foreground mb-6 flex items-center justify-center gap-2">
              ✨ Rainbow Affirmations ✨
            </h3>
            
            <div className="bg-gradient-fun/20 rounded-xl p-8 mb-6 border-2 border-white/50 shadow-lg">
              <div className="animate-pulse mb-4">
                <Sparkles className="w-10 h-10 text-purple-600 mx-auto mb-2" />
                <div className="flex justify-center gap-2">
                  <span className="text-2xl">🌟</span>
                  <span className="text-2xl">💜</span>
                  <span className="text-2xl">🌈</span>
                </div>
              </div>
              <p className="text-elder-2xl font-bold text-transparent bg-gradient-fun bg-clip-text leading-relaxed drop-shadow-sm">
                "{affirmations[affirmationIndex]}"
              </p>
            </div>
            
            <Button 
              onClick={nextAffirmation} 
              className="bg-gradient-fun shadow-colorful hover:scale-105 transition-transform" 
              variant="companionship" 
              size="lg"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              ✨ New Magic Words ✨
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Games;