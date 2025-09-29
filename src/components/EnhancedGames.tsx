import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Gamepad2, 
  Trophy, 
  RotateCcw, 
  Play, 
  Pause,
  Star,
  Zap,
  Brain,
  Target,
  Shuffle
} from "lucide-react";
import { toast } from "sonner";

const EnhancedGames = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-elder-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <Gamepad2 className="w-8 h-8 text-primary" />
          Fun & Engaging Games
        </h2>
        <p className="text-elder-lg text-muted-foreground">
          Exercise your mind with these entertaining and challenging games
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <WordPuzzleGame />
        <NumberSequenceGame />
        <PatternMatchingGame />
        <RiddleGame />
        <MathChallengeGame />
      </div>
    </div>
  );
};

// Color Memory Game
const ColorMemoryGame = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const colors = [
    { id: 0, color: "bg-red-400", name: "Red" },
    { id: 1, color: "bg-blue-400", name: "Blue" },
    { id: 2, color: "bg-green-400", name: "Green" },
    { id: 3, color: "bg-yellow-400", name: "Yellow" },
    { id: 4, color: "bg-purple-400", name: "Purple" },
    { id: 5, color: "bg-pink-400", name: "Pink" }
  ];

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    const newSequence = [Math.floor(Math.random() * 6)];
    setSequence(newSequence);
    setPlayerSequence([]);
    showSequence(newSequence);
  };

  const showSequence = (seq: number[]) => {
    setIsShowingSequence(true);
    // Implementation for showing sequence would go here
    setTimeout(() => setIsShowingSequence(false), seq.length * 1000);
  };

  const handleColorClick = (colorId: number) => {
    if (isShowingSequence || !isPlaying) return;

    const newPlayerSequence = [...playerSequence, colorId];
    setPlayerSequence(newPlayerSequence);

    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      setGameOver(true);
      setIsPlaying(false);
      toast("Game Over! Try again! 🎮");
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setScore(score + 1);
      const nextSequence = [...sequence, Math.floor(Math.random() * 6)];
      setSequence(nextSequence);
      setPlayerSequence([]);
      showSequence(nextSequence);
      toast("Great job! Next level! ⭐");
    }
  };

  return (
    <Card className="p-6 shadow-gentle">
      <div className="text-center mb-4">
        <h3 className="text-elder-xl font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Color Memory
        </h3>
        <p className="text-elder-sm text-muted-foreground">Remember and repeat the color sequence</p>
        <Badge variant="secondary" className="mt-2">Score: {score}</Badge>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {colors.map((color) => (
          <Button
            key={color.id}
            onClick={() => handleColorClick(color.id)}
            className={`${color.color} h-16 hover:opacity-80 transition-all border-2 border-transparent hover:border-white`}
            disabled={isShowingSequence || !isPlaying}
          />
        ))}
      </div>

      <div className="flex gap-2 justify-center">
        <Button onClick={startGame} variant="companionship" size="sm">
          <Play className="w-4 h-4 mr-1" />
          {isPlaying ? "New Game" : "Start"}
        </Button>
      </div>

      {gameOver && (
        <div className="text-center mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-elder-base font-semibold">Final Score: {score}</p>
          <p className="text-elder-sm text-muted-foreground">Great effort! 🌟</p>
        </div>
      )}
    </Card>
  );
};

// Word Puzzle Game
const WordPuzzleGame = () => {
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [userGuess, setUserGuess] = useState("");
  const [score, setScore] = useState(0);
  const [hints, setHints] = useState(3);

  const words = [
    { word: "BUTTERFLY", hint: "Colorful flying insect" },
    { word: "SUNSHINE", hint: "Bright light from the sky" },
    { word: "RAINBOW", hint: "Colorful arc in the sky" },
    { word: "GARDEN", hint: "Where flowers grow" },
    { word: "MUSIC", hint: "Pleasant sounds and melodies" },
    { word: "SMILE", hint: "Happy facial expression" },
    { word: "FRIENDSHIP", hint: "Close bond between people" },
    { word: "KINDNESS", hint: "Being gentle and caring" }
  ];

  const [currentWordObj, setCurrentWordObj] = useState(words[0]);

  const scrambleWord = (word: string) => {
    return word.split('').sort(() => Math.random() - 0.5).join('');
  };

  const newWord = () => {
    const wordObj = words[Math.floor(Math.random() * words.length)];
    setCurrentWordObj(wordObj);
    setCurrentWord(wordObj.word);
    setScrambledWord(scrambleWord(wordObj.word));
    setUserGuess("");
  };

  const checkAnswer = () => {
    if (userGuess.toUpperCase() === currentWord) {
      setScore(score + 1);
      toast("Excellent! 🎉");
      newWord();
    } else {
      toast("Try again! 🤔");
      setUserGuess("");
    }
  };

  const useHint = () => {
    if (hints > 0) {
      setHints(hints - 1);
      toast(`Hint: ${currentWordObj.hint} 💡`);
    }
  };

  useEffect(() => {
    newWord();
  }, []);

  return (
    <Card className="p-6 shadow-gentle">
      <div className="text-center mb-4">
        <h3 className="text-elder-xl font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
          <Shuffle className="w-5 h-5 text-primary" />
          Word Puzzle
        </h3>
        <p className="text-elder-sm text-muted-foreground">Unscramble the letters to form a word</p>
        <div className="flex gap-2 justify-center mt-2">
          <Badge variant="secondary">Score: {score}</Badge>
          <Badge variant="outline">Hints: {hints}</Badge>
        </div>
      </div>

      <div className="text-center mb-4">
        <div className="text-elder-2xl font-bold text-primary mb-4 tracking-wider bg-muted/30 p-4 rounded-lg">
          {scrambledWord}
        </div>
        
        <input
          type="text"
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
          placeholder="Your answer..."
          className="w-full p-3 text-elder-base text-center border border-border rounded-lg focus:ring-primary focus:border-primary"
          onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
        />
      </div>

      <div className="flex gap-2 justify-center">
        <Button onClick={checkAnswer} variant="companionship" size="sm">
          <Trophy className="w-4 h-4 mr-1" />
          Check
        </Button>
        <Button onClick={useHint} variant="outline" size="sm" disabled={hints === 0}>
          <Zap className="w-4 h-4 mr-1" />
          Hint
        </Button>
        <Button onClick={newWord} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4 mr-1" />
          New Word
        </Button>
      </div>
    </Card>
  );
};

// Number Sequence Game
const NumberSequenceGame = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(1);

  const generateSequence = () => {
    const patterns = [
      // Arithmetic sequences
      (start: number, diff: number) => Array.from({length: 4}, (_, i) => start + i * diff),
      // Geometric sequences
      (start: number, ratio: number) => Array.from({length: 4}, (_, i) => start * Math.pow(ratio, i)),
      // Fibonacci-like
      () => {
        const seq = [1, 1];
        for (let i = 2; i < 4; i++) {
          seq.push(seq[i-1] + seq[i-2]);
        }
        return seq;
      }
    ];

    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    let newSequence;
    
    if (pattern === patterns[2]) {
      newSequence = pattern(1, 1); // Fibonacci needs start values
    } else if (pattern === patterns[1]) {
      newSequence = pattern(2, 2); // Start with 2, multiply by 2
    } else {
      const start = Math.floor(Math.random() * 10) + 1;
      const diff = Math.floor(Math.random() * 5) + 1;
      newSequence = pattern(start, diff);
    }

    setSequence(newSequence);
    setUserAnswer("");
  };

  const checkAnswer = () => {
    const answer = parseInt(userAnswer);
    let expectedNext;

    // Determine pattern and calculate next number
    if (sequence.length >= 3) {
      const diff1 = sequence[1] - sequence[0];
      const diff2 = sequence[2] - sequence[1];
      
      if (diff1 === diff2) {
        // Arithmetic sequence
        expectedNext = sequence[sequence.length - 1] + diff1;
      } else if (sequence[1] / sequence[0] === sequence[2] / sequence[1]) {
        // Geometric sequence
        expectedNext = sequence[sequence.length - 1] * (sequence[1] / sequence[0]);
      } else {
        // Fibonacci-like
        expectedNext = sequence[sequence.length - 1] + sequence[sequence.length - 2];
      }

      if (answer === expectedNext) {
        setScore(score + 1);
        toast("Perfect! 🎯");
        generateSequence();
      } else {
        toast(`Not quite! The answer was ${expectedNext} 🤔`);
        generateSequence();
      }
    }
  };

  useEffect(() => {
    generateSequence();
  }, []);

  return (
    <Card className="p-6 shadow-gentle">
      <div className="text-center mb-4">
        <h3 className="text-elder-xl font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Number Sequence
        </h3>
        <p className="text-elder-sm text-muted-foreground">Find the pattern and next number</p>
        <Badge variant="secondary" className="mt-2">Score: {score}</Badge>
      </div>

      <div className="text-center mb-4">
        <div className="flex justify-center items-center gap-2 mb-4">
          {sequence.map((num, index) => (
            <div key={index} className="w-12 h-12 bg-primary/10 border-2 border-primary rounded-lg flex items-center justify-center text-elder-lg font-bold">
              {num}
            </div>
          ))}
          <div className="w-12 h-12 bg-muted border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center text-elder-lg font-bold">
            ?
          </div>
        </div>

        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Next number?"
          className="w-32 p-2 text-elder-base text-center border border-border rounded-lg focus:ring-primary focus:border-primary"
          onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
        />
      </div>

      <div className="flex gap-2 justify-center">
        <Button onClick={checkAnswer} variant="companionship" size="sm">
          <Trophy className="w-4 h-4 mr-1" />
          Check
        </Button>
        <Button onClick={generateSequence} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4 mr-1" />
          New Sequence
        </Button>
      </div>
    </Card>
  );
};

// Pattern Matching Game - Simple version
const PatternMatchingGame = () => {
  const [pattern, setPattern] = useState<string[]>([]);
  const [userPattern, setUserPattern] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const shapes = ["🔴", "🔵", "🟡", "🟢", "🟣", "🟠"];

  const generatePattern = () => {
    const length = 4;
    const newPattern = Array.from({length}, () => shapes[Math.floor(Math.random() * shapes.length)]);
    setPattern(newPattern);
    setUserPattern([]);
  };

  const addToUserPattern = (shape: string) => {
    if (userPattern.length < pattern.length) {
      setUserPattern([...userPattern, shape]);
    }
  };

  const checkPattern = () => {
    if (JSON.stringify(pattern) === JSON.stringify(userPattern)) {
      setScore(score + 1);
      toast("Perfect match! 🎉");
      generatePattern();
    } else {
      toast("Try again! 🤔");
      setUserPattern([]);
    }
  };

  useEffect(() => {
    generatePattern();
  }, []);

  return (
    <Card className="p-6 shadow-gentle">
      <div className="text-center mb-4">
        <h3 className="text-elder-xl font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          Pattern Match
        </h3>
        <p className="text-elder-sm text-muted-foreground">Recreate the pattern shown</p>
        <Badge variant="secondary" className="mt-2">Score: {score}</Badge>
      </div>

      <div className="text-center mb-4">
        <div className="mb-4">
          <p className="text-elder-sm text-muted-foreground mb-2">Pattern to copy:</p>
          <div className="flex justify-center gap-2">
            {pattern.map((shape, index) => (
              <div key={index} className="w-12 h-12 border-2 border-primary rounded-lg flex items-center justify-center text-2xl">
                {shape}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-elder-sm text-muted-foreground mb-2">Your pattern:</p>
          <div className="flex justify-center gap-2">
            {Array.from({length: pattern.length}).map((_, index) => (
              <div key={index} className="w-12 h-12 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center text-2xl">
                {userPattern[index] || ""}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {shapes.map((shape) => (
            <Button
              key={shape}
              onClick={() => addToUserPattern(shape)}
              variant="outline"
              className="w-12 h-12 p-0 text-2xl"
              disabled={userPattern.length >= pattern.length}
            >
              {shape}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <Button onClick={checkPattern} variant="companionship" size="sm" disabled={userPattern.length !== pattern.length}>
          <Trophy className="w-4 h-4 mr-1" />
          Check
        </Button>
        <Button onClick={() => setUserPattern([])} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4 mr-1" />
          Clear
        </Button>
        <Button onClick={generatePattern} variant="outline" size="sm">
          New Pattern
        </Button>
      </div>
    </Card>
  );
};

// Riddle Game
const RiddleGame = () => {
  const riddles = [
    { question: "What has keys but no locks, space but no room?", answer: "KEYBOARD", hint: "You use it to type" },
    { question: "What gets wet while drying?", answer: "TOWEL", hint: "Found in the bathroom" },
    { question: "What has a face and two hands but no arms?", answer: "CLOCK", hint: "It tells time" },
    { question: "What can travel around the world while staying in a corner?", answer: "STAMP", hint: "Found on mail" },
    { question: "What has one eye but cannot see?", answer: "NEEDLE", hint: "Used for sewing" }
  ];

  const [currentRiddle, setCurrentRiddle] = useState(riddles[0]);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const newRiddle = () => {
    const riddle = riddles[Math.floor(Math.random() * riddles.length)];
    setCurrentRiddle(riddle);
    setUserAnswer("");
    setShowHint(false);
  };

  const checkAnswer = () => {
    if (userAnswer.toUpperCase() === currentRiddle.answer) {
      setScore(score + 1);
      toast("Brilliant! 🧠");
      newRiddle();
    } else {
      toast("Think again! 🤔");
      setUserAnswer("");
    }
  };

  return (
    <Card className="p-6 shadow-gentle">
      <div className="text-center mb-4">
        <h3 className="text-elder-xl font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Riddle Challenge
        </h3>
        <p className="text-elder-sm text-muted-foreground">Solve the riddle</p>
        <Badge variant="secondary" className="mt-2">Score: {score}</Badge>
      </div>

      <div className="text-center mb-4">
        <div className="bg-muted/30 p-4 rounded-lg mb-4">
          <p className="text-elder-base font-medium text-foreground">{currentRiddle.question}</p>
        </div>

        {showHint && (
          <div className="bg-primary/10 p-3 rounded-lg mb-4">
            <p className="text-elder-sm text-primary">💡 Hint: {currentRiddle.hint}</p>
          </div>
        )}

        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Your answer..."
          className="w-full p-3 text-elder-base text-center border border-border rounded-lg focus:ring-primary focus:border-primary"
          onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
        />
      </div>

      <div className="flex gap-2 justify-center">
        <Button onClick={checkAnswer} variant="companionship" size="sm">
          <Trophy className="w-4 h-4 mr-1" />
          Answer
        </Button>
        <Button onClick={() => setShowHint(true)} variant="outline" size="sm" disabled={showHint}>
          <Zap className="w-4 h-4 mr-1" />
          Hint
        </Button>
        <Button onClick={newRiddle} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4 mr-1" />
          New Riddle
        </Button>
      </div>
    </Card>
  );
};

// Math Challenge Game
const MathChallengeGame = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(1);

  const generateQuestion = () => {
    const operations = ['+', '-', '×'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1, num2, result;
    
    switch (difficulty) {
      case 1:
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        break;
      case 2:
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        break;
      default:
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 100) + 1;
    }

    switch (operation) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = num1 - num2;
        break;
      case '×':
        result = num1 * num2;
        break;
      default:
        result = num1 + num2;
    }

    setQuestion(`${num1} ${operation} ${num2} = ?`);
    setAnswer(result);
    setUserAnswer("");
  };

  const checkAnswer = () => {
    if (parseInt(userAnswer) === answer) {
      setScore(score + 1);
      toast("Correct! 🎯");
      if (score > 0 && score % 5 === 0) {
        setDifficulty(Math.min(difficulty + 1, 3));
        toast("Level up! 🚀");
      }
      generateQuestion();
    } else {
      toast(`Not quite! The answer was ${answer} 🤔`);
      generateQuestion();
    }
  };

  useEffect(() => {
    generateQuestion();
  }, [difficulty]);

  return (
    <Card className="p-6 shadow-gentle">
      <div className="text-center mb-4">
        <h3 className="text-elder-xl font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Math Challenge
        </h3>
        <p className="text-elder-sm text-muted-foreground">Solve the math problem</p>
        <div className="flex gap-2 justify-center mt-2">
          <Badge variant="secondary">Score: {score}</Badge>
          <Badge variant="outline">Level: {difficulty}</Badge>
        </div>
      </div>

      <div className="text-center mb-4">
        <div className="text-elder-2xl font-bold text-primary mb-4 bg-muted/30 p-4 rounded-lg">
          {question}
        </div>

        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Your answer..."
          className="w-32 p-3 text-elder-base text-center border border-border rounded-lg focus:ring-primary focus:border-primary"
          onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
        />
      </div>

      <div className="flex gap-2 justify-center">
        <Button onClick={checkAnswer} variant="companionship" size="sm">
          <Trophy className="w-4 h-4 mr-1" />
          Check
        </Button>
        <Button onClick={generateQuestion} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4 mr-1" />
          New Problem
        </Button>
      </div>
    </Card>
  );
};

export default EnhancedGames;