import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Brain, 
  Puzzle, 
  Target, 
  Trophy, 
  BookOpen, 
  Music, 
  Heart,
  Star,
  Zap,
  Timer,
  Award,
  Sparkles,
  Gamepad2,
  Candy
} from "lucide-react";
import { toast } from "sonner";
import { TempleRunGame } from "./TempleRunGame";
import { CandyCrushGame } from "./CandyCrushGame";

const InterestingGames = () => {
  // Word Association Game
  const [wordGame, setWordGame] = useState({
    currentWord: "Rainbow",
    userInput: "",
    score: 0,
    chain: ["Rainbow"],
    timeLeft: 30
  });

  // Trivia Game
  const [triviaGame, setTriviaGame] = useState({
    currentQuestion: 0,
    score: 0,
    answered: false,
    selectedAnswer: ""
  });

  // Pattern Memory Game
  const [patternGame, setPatternGame] = useState({
    sequence: [] as number[],
    userSequence: [] as number[],
    isShowing: false,
    level: 1
  });

  const triviaQuestions = [
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correct: "Mars"
    },
    {
      question: "What is the largest mammal in the world?",
      options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
      correct: "Blue Whale"
    },
    {
      question: "In which year did World War II end?",
      options: ["1944", "1945", "1946", "1947"],
      correct: "1945"
    },
    {
      question: "What is the capital of Australia?",
      options: ["Sydney", "Melbourne", "Brisbane", "Canberra"],
      correct: "Canberra"
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Michelangelo"],
      correct: "Leonardo da Vinci"
    }
  ];

  // Word Association Game Logic
  const handleWordSubmit = () => {
    if (wordGame.userInput.trim()) {
      const newChain = [...wordGame.chain, wordGame.userInput.trim()];
      setWordGame(prev => ({
        ...prev,
        chain: newChain,
        score: prev.score + 10,
        userInput: "",
        currentWord: wordGame.userInput.trim()
      }));
      toast(`Great connection! Chain: ${newChain.length} words`);
    }
  };

  // Trivia Game Logic
  const handleTriviaAnswer = (answer: string) => {
    setTriviaGame(prev => ({ ...prev, selectedAnswer: answer, answered: true }));
    
    const isCorrect = answer === triviaQuestions[triviaGame.currentQuestion].correct;
    if (isCorrect) {
      setTriviaGame(prev => ({ ...prev, score: prev.score + 100 }));
      toast("🎉 Correct! Well done!");
    } else {
      toast("Not quite right, but great try!");
    }

    setTimeout(() => {
      if (triviaGame.currentQuestion < triviaQuestions.length - 1) {
        setTriviaGame(prev => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
          answered: false,
          selectedAnswer: ""
        }));
      } else {
        toast(`🏆 Game Complete! Final Score: ${triviaGame.score + (isCorrect ? 100 : 0)}`);
      }
    }, 2000);
  };

  // Pattern Memory Game Logic
  const generatePattern = () => {
    const newSequence = Array.from({ length: patternGame.level + 2 }, () => Math.floor(Math.random() * 4));
    setPatternGame(prev => ({ ...prev, sequence: newSequence, isShowing: true, userSequence: [] }));
    
    setTimeout(() => {
      setPatternGame(prev => ({ ...prev, isShowing: false }));
    }, (patternGame.level + 2) * 1000);
  };

  const handlePatternClick = (index: number) => {
    if (patternGame.isShowing) return;
    
    const newUserSequence = [...patternGame.userSequence, index];
    setPatternGame(prev => ({ ...prev, userSequence: newUserSequence }));
    
    if (newUserSequence.length === patternGame.sequence.length) {
      const isCorrect = newUserSequence.every((val, i) => val === patternGame.sequence[i]);
      if (isCorrect) {
        toast(`🌟 Perfect! Level ${patternGame.level} completed!`);
        setPatternGame(prev => ({ ...prev, level: prev.level + 1 }));
        setTimeout(() => generatePattern(), 1500);
      } else {
        toast("Oops! Let's try again from level 1");
        setPatternGame(prev => ({ ...prev, level: 1, sequence: [], userSequence: [] }));
      }
    }
  };

  const games = [
    {
      id: "temple-run",
      title: "Temple Run Adventure",
      icon: Zap,
      description: "Run, dodge obstacles, and collect coins in this thrilling endless runner!",
      gradient: "from-yellow-400 to-orange-400"
    },
    {
      id: "candy-crush",
      title: "Sweet Candy Match",
      icon: Candy,
      description: "Match 3 or more candies to score points and reach the highest level!",
      gradient: "from-pink-400 to-purple-400"
    },
    {
      id: "word-association",
      title: "Word Association Chain",
      icon: BookOpen,
      description: "Create a chain of connected words and see how creative you can get!",
      gradient: "from-purple-400 to-pink-400"
    },
    {
      id: "trivia",
      title: "Knowledge Quiz",
      icon: Brain,
      description: "Test your knowledge with fun trivia questions from various topics!",
      gradient: "from-blue-400 to-purple-400"
    },
    {
      id: "pattern-memory",
      title: "Pattern Memory",
      icon: Target,
      description: "Remember and repeat the color patterns to advance levels!",
      gradient: "from-green-400 to-blue-400"
    }
  ];

  const [activeGame, setActiveGame] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-elder-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          Fun & Engaging Games
        </h2>
        <p className="text-elder-lg text-muted-foreground">
          Exercise your mind with these delightful and challenging games
        </p>
      </div>

      {/* Game Selection */}
      {!activeGame && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => {
            const IconComponent = game.icon;
            return (
              <Card key={game.id} className="p-6 shadow-gentle hover:shadow-companionship transition-all cursor-pointer group" onClick={() => setActiveGame(game.id)}>
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${game.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-elder-xl font-semibold text-foreground mb-2">{game.title}</h3>
                <p className="text-elder-base text-muted-foreground mb-4">{game.description}</p>
                <Button variant="outline" className="w-full">
                  Play Now
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      {/* Temple Run Game */}
      {activeGame === "temple-run" && (
        <div>
          <Button variant="outline" onClick={() => setActiveGame(null)} className="mb-4">
            ← Back to Games
          </Button>
          <TempleRunGame />
        </div>
      )}

      {/* Candy Crush Game */}
      {activeGame === "candy-crush" && (
        <div>
          <Button variant="outline" onClick={() => setActiveGame(null)} className="mb-4">
            ← Back to Games
          </Button>
          <CandyCrushGame />
        </div>
      )}

      {/* Word Association Game */}
      {activeGame === "word-association" && (
        <Card className="p-6 shadow-gentle">
          <div className="text-center mb-6">
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" onClick={() => setActiveGame(null)}>
                ← Back to Games
              </Button>
              <Badge variant="secondary" className="text-elder-base">
                <Trophy className="w-4 h-4 mr-1" />
                Score: {wordGame.score}
              </Badge>
            </div>
            <h3 className="text-elder-2xl font-bold text-foreground mb-2">Word Association Chain</h3>
            <p className="text-elder-lg text-muted-foreground">Connect words that relate to each other!</p>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <p className="text-elder-lg text-muted-foreground mb-2">Current word:</p>
              <div className="text-elder-3xl font-bold text-primary bg-gradient-primary bg-clip-text text-transparent">
                {wordGame.currentWord}
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                value={wordGame.userInput}
                onChange={(e) => setWordGame(prev => ({ ...prev, userInput: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && handleWordSubmit()}
                placeholder="Enter a related word..."
                className="text-elder-base"
              />
              <Button onClick={handleWordSubmit} variant="default">
                <Zap className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-elder-base font-medium text-foreground">Your word chain:</p>
              <div className="flex flex-wrap gap-2">
                {wordGame.chain.map((word, index) => (
                  <Badge key={index} variant={index === wordGame.chain.length - 1 ? "default" : "secondary"}>
                    {word}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Trivia Game */}
      {activeGame === "trivia" && (
        <Card className="p-6 shadow-gentle">
          <div className="text-center mb-6">
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" onClick={() => setActiveGame(null)}>
                ← Back to Games
              </Button>
              <Badge variant="secondary" className="text-elder-base">
                <Award className="w-4 h-4 mr-1" />
                Score: {triviaGame.score}
              </Badge>
            </div>
            <h3 className="text-elder-2xl font-bold text-foreground mb-2">Knowledge Quiz</h3>
            <p className="text-elder-lg text-muted-foreground">
              Question {triviaGame.currentQuestion + 1} of {triviaQuestions.length}
            </p>
          </div>

          {triviaGame.currentQuestion < triviaQuestions.length && (
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-elder-xl font-semibold text-foreground mb-6">
                  {triviaQuestions[triviaGame.currentQuestion].question}
                </h4>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {triviaQuestions[triviaGame.currentQuestion].options.map((option) => (
                  <Button
                    key={option}
                    variant={
                      triviaGame.answered
                        ? option === triviaQuestions[triviaGame.currentQuestion].correct
                          ? "default"
                          : option === triviaGame.selectedAnswer
                          ? "destructive"
                          : "outline"
                        : "outline"
                    }
                    onClick={() => !triviaGame.answered && handleTriviaAnswer(option)}
                    disabled={triviaGame.answered}
                    className="p-4 text-elder-base h-auto"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Pattern Memory Game */}
      {activeGame === "pattern-memory" && (
        <Card className="p-6 shadow-gentle">
          <div className="text-center mb-6">
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" onClick={() => setActiveGame(null)}>
                ← Back to Games
              </Button>
              <Badge variant="secondary" className="text-elder-base">
                <Star className="w-4 h-4 mr-1" />
                Level: {patternGame.level}
              </Badge>
            </div>
            <h3 className="text-elder-2xl font-bold text-foreground mb-2">Pattern Memory</h3>
            <p className="text-elder-lg text-muted-foreground">
              {patternGame.sequence.length === 0 ? "Ready to start?" : patternGame.isShowing ? "Watch the pattern!" : "Repeat the pattern!"}
            </p>
          </div>

          <div className="space-y-6">
            {patternGame.sequence.length === 0 ? (
              <div className="text-center">
                <Button onClick={generatePattern} variant="default" size="lg">
                  <Target className="w-5 h-5 mr-2" />
                  Start Level {patternGame.level}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {[0, 1, 2, 3].map((index) => (
                  <Button
                    key={index}
                    onClick={() => handlePatternClick(index)}
                    variant="outline"
                    className={`h-24 w-full transition-all ${
                      patternGame.isShowing && patternGame.sequence[patternGame.userSequence.length] === index
                        ? `bg-gradient-to-br ${
                            index === 0 ? 'from-red-400 to-red-600' :
                            index === 1 ? 'from-blue-400 to-blue-600' :
                            index === 2 ? 'from-green-400 to-green-600' :
                            'from-yellow-400 to-yellow-600'
                          } text-white`
                        : patternGame.userSequence.includes(index)
                        ? 'bg-muted'
                        : ''
                    }`}
                    disabled={patternGame.isShowing}
                  >
                    <div className={`w-8 h-8 rounded-full ${
                      index === 0 ? 'bg-red-500' :
                      index === 1 ? 'bg-blue-500' :
                      index === 2 ? 'bg-green-500' :
                      'bg-yellow-500'
                    }`} />
                  </Button>
                ))}
              </div>
            )}

            {patternGame.sequence.length > 0 && (
              <div className="text-center">
                <p className="text-elder-base text-muted-foreground">
                  Progress: {patternGame.userSequence.length} / {patternGame.sequence.length}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Game Benefits */}
      <Card className="p-4 shadow-gentle bg-gradient-companionship">
        <h3 className="text-elder-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Benefits of Playing Games
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-elder-base text-muted-foreground">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            <span>Improves memory and cognition</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span>Enhances focus and attention</span>
          </div>
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-primary" />
            <span>Provides joyful entertainment</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InterestingGames;