import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type Candy = '🍬' | '🍭' | '🍫' | '🍩' | '🧁' | '🍰' | null;

export const CandyCrushGame = () => {
  const [board, setBoard] = useState<Candy[][]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(20);
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const candies: Array<'🍬' | '🍭' | '🍫' | '🍩' | '🧁' | '🍰'> = ['🍬', '🍭', '🍫', '🍩', '🧁', '🍰'];

  const createBoard = (): Candy[][] => {
    const newBoard: Candy[][] = [];
    for (let i = 0; i < 8; i++) {
      const row: Candy[] = [];
      for (let j = 0; j < 8; j++) {
        row.push(candies[Math.floor(Math.random() * candies.length)]);
      }
      newBoard.push(row);
    }
    return newBoard;
  };

  useEffect(() => {
    setBoard(createBoard());
  }, []);

  const checkMatches = (boardToCheck: Candy[][]): { row: number; col: number }[] => {
    const matches: { row: number; col: number }[] = [];

    // Check horizontal matches
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 6; col++) {
        const candy = boardToCheck[row][col];
        if (
          candy !== null &&
          candy === boardToCheck[row][col + 1] &&
          candy === boardToCheck[row][col + 2]
        ) {
          matches.push({ row, col }, { row, col: col + 1 }, { row, col: col + 2 });
        }
      }
    }

    // Check vertical matches
    for (let col = 0; col < 8; col++) {
      for (let row = 0; row < 6; row++) {
        const candy = boardToCheck[row][col];
        if (
          candy !== null &&
          candy === boardToCheck[row + 1][col] &&
          candy === boardToCheck[row + 2][col]
        ) {
          matches.push({ row, col }, { row: row + 1, col }, { row: row + 2, col });
        }
      }
    }

    return matches;
  };

  const removeMatches = (matches: { row: number; col: number }[]) => {
    if (matches.length === 0) return;

    const newBoard = board.map(row => [...row]);
    const uniqueMatches = Array.from(new Set(matches.map(m => `${m.row}-${m.col}`))).map(s => {
      const [row, col] = s.split('-').map(Number);
      return { row, col };
    });

    uniqueMatches.forEach(({ row, col }) => {
      newBoard[row][col] = null;
    });

    setScore(prev => prev + uniqueMatches.length * 10);
    toast.success(`+${uniqueMatches.length * 10} points!`);

    // Drop candies down
    setTimeout(() => {
      for (let col = 0; col < 8; col++) {
        for (let row = 7; row >= 0; row--) {
          if (newBoard[row][col] === null) {
            for (let above = row - 1; above >= 0; above--) {
              if (newBoard[above][col] !== null) {
                newBoard[row][col] = newBoard[above][col];
                newBoard[above][col] = null;
                break;
              }
            }
          }
        }
      }

      // Fill empty spaces with new candies
      for (let col = 0; col < 8; col++) {
        for (let row = 0; row < 8; row++) {
          if (newBoard[row][col] === null) {
            newBoard[row][col] = candies[Math.floor(Math.random() * candies.length)];
          }
        }
      }

      setBoard(newBoard);
    }, 300);
  };

  const handleCandyClick = (row: number, col: number) => {
    if (gameOver || moves <= 0) return;

    if (!selected) {
      setSelected({ row, col });
    } else {
      const rowDiff = Math.abs(selected.row - row);
      const colDiff = Math.abs(selected.col - col);

      if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
        // Swap candies
        const newBoard = board.map(r => [...r]);
        const temp = newBoard[row][col];
        newBoard[row][col] = newBoard[selected.row][selected.col];
        newBoard[selected.row][selected.col] = temp;

        setBoard(newBoard);
        setMoves(prev => prev - 1);

        setTimeout(() => {
          const matches = checkMatches(newBoard);
          if (matches.length > 0) {
            removeMatches(matches);
          } else {
            // Swap back if no matches
            const revertBoard = newBoard.map(r => [...r]);
            revertBoard[selected.row][selected.col] = revertBoard[row][col];
            revertBoard[row][col] = temp;
            setBoard(revertBoard);
            toast("No matches! Try again");
            setMoves(prev => prev + 1);
          }
        }, 100);
      }

      setSelected(null);
    }

    if (moves <= 1) {
      setTimeout(() => {
        setGameOver(true);
        if (score > highScore) {
          setHighScore(score);
          toast.success(`New High Score: ${score}!`);
        }
      }, 500);
    }
  };

  const restartGame = () => {
    setBoard(createBoard());
    setScore(0);
    setMoves(20);
    setSelected(null);
    setGameOver(false);
  };

  return (
    <Card className="p-6 shadow-gentle">
      <div className="text-center mb-6">
        <h3 className="text-elder-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-7 h-7 text-pink-500" />
          Sweet Candy Match
        </h3>
        <div className="flex items-center justify-center gap-4 text-elder-base">
          <Badge variant="secondary">
            <Trophy className="w-4 h-4 mr-1" />
            High: {highScore}
          </Badge>
          <Badge variant="default">Score: {score}</Badge>
          <Badge variant="outline">Moves: {moves}</Badge>
        </div>
      </div>

      {gameOver ? (
        <div className="text-center space-y-4">
          <div className="text-elder-3xl font-bold text-primary">Game Over!</div>
          <p className="text-elder-xl">Final Score: {score}</p>
          <Button onClick={restartGame} size="lg" variant="default" className="text-elder-base">
            <RefreshCw className="w-5 h-5 mr-2" />
            Play Again
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-8 gap-1 max-w-md mx-auto">
            {board.map((row, rowIndex) =>
              row.map((candy, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCandyClick(rowIndex, colIndex)}
                  className={`
                    aspect-square text-4xl flex items-center justify-center
                    rounded-lg transition-all hover:scale-110
                    ${selected?.row === rowIndex && selected?.col === colIndex
                      ? 'bg-yellow-300 dark:bg-yellow-600 scale-110'
                      : 'bg-pink-100 dark:bg-pink-900 hover:bg-pink-200 dark:hover:bg-pink-800'
                    }
                  `}
                >
                  {candy}
                </button>
              ))
            )}
          </div>

          <p className="text-center text-elder-sm text-muted-foreground">
            Match 3 or more candies to score points!
          </p>
        </div>
      )}
    </Card>
  );
};