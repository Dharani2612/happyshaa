import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, ArrowLeft, ArrowRight, ArrowUp, Zap } from "lucide-react";
import { toast } from "sonner";

export const TempleRunGame = () => {
  const [gameState, setGameState] = useState({
    isPlaying: false,
    score: 0,
    distance: 0,
    speed: 5,
    playerLane: 1, // 0=left, 1=center, 2=right
    obstacles: [] as { lane: number; distance: number; type: 'rock' | 'tree' | 'gap' }[],
    coins: [] as { lane: number; distance: number }[],
    gameOver: false,
    highScore: 0
  });

  const gameLoopRef = useRef<number>();

  useEffect(() => {
    if (gameState.isPlaying && !gameState.gameOver) {
      gameLoopRef.current = window.setInterval(() => {
        updateGame();
      }, 50);
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.gameOver, gameState]);

  const updateGame = () => {
    setGameState(prev => {
      const newDistance = prev.distance + prev.speed;
      const newScore = prev.score + 1;

      // Move obstacles and coins closer
      const updatedObstacles = prev.obstacles
        .map(obs => ({ ...obs, distance: obs.distance - prev.speed }))
        .filter(obs => obs.distance > -50);

      const updatedCoins = prev.coins
        .map(coin => ({ ...coin, distance: coin.distance - prev.speed }))
        .filter(coin => coin.distance > -50);

      // Check collision with obstacles
      const collision = updatedObstacles.some(
        obs => obs.lane === prev.playerLane && obs.distance < 20 && obs.distance > -10
      );

      if (collision) {
        toast.error(`Game Over! Final Score: ${newScore}`);
        return {
          ...prev,
          gameOver: true,
          isPlaying: false,
          highScore: Math.max(prev.highScore, newScore)
        };
      }

      // Collect coins
      const collectedCoins = updatedCoins.filter(
        coin => coin.lane === prev.playerLane && coin.distance < 20 && coin.distance > -10
      );

      const filteredCoins = updatedCoins.filter(
        coin => !(coin.lane === prev.playerLane && coin.distance < 20 && coin.distance > -10)
      );

      const bonusScore = collectedCoins.length * 10;
      if (bonusScore > 0) {
        toast.success(`+${bonusScore} coins!`);
      }

      // Spawn new obstacles
      let newObstacles = [...updatedObstacles];
      if (Math.random() < 0.02) {
        const lane = Math.floor(Math.random() * 3);
        const type: 'rock' | 'tree' | 'gap' = ['rock', 'tree', 'gap'][Math.floor(Math.random() * 3)] as any;
        newObstacles.push({ lane, distance: 400, type });
      }

      // Spawn new coins
      let newCoins = [...filteredCoins];
      if (Math.random() < 0.03) {
        const lane = Math.floor(Math.random() * 3);
        newCoins.push({ lane, distance: 400 });
      }

      // Increase speed gradually
      const newSpeed = Math.min(prev.speed + 0.001, 12);

      return {
        ...prev,
        distance: newDistance,
        score: newScore + bonusScore,
        obstacles: newObstacles,
        coins: newCoins,
        speed: newSpeed
      };
    });
  };

  const moveLane = (direction: 'left' | 'right') => {
    setGameState(prev => {
      if (!prev.isPlaying || prev.gameOver) return prev;
      
      let newLane = prev.playerLane;
      if (direction === 'left' && prev.playerLane > 0) {
        newLane = prev.playerLane - 1;
      } else if (direction === 'right' && prev.playerLane < 2) {
        newLane = prev.playerLane + 1;
      }
      
      return { ...prev, playerLane: newLane };
    });
  };

  const startGame = () => {
    setGameState({
      isPlaying: true,
      score: 0,
      distance: 0,
      speed: 5,
      playerLane: 1,
      obstacles: [],
      coins: [],
      gameOver: false,
      highScore: gameState.highScore
    });
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameState.isPlaying || gameState.gameOver) return;
      
      if (e.key === 'ArrowLeft') moveLane('left');
      if (e.key === 'ArrowRight') moveLane('right');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.isPlaying, gameState.gameOver]);

  return (
    <Card className="p-6 shadow-gentle">
      <div className="text-center mb-6">
        <h3 className="text-elder-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
          <Zap className="w-7 h-7 text-yellow-500" />
          Temple Run Adventure
        </h3>
        <div className="flex items-center justify-center gap-4 text-elder-base">
          <Badge variant="secondary">
            <Trophy className="w-4 h-4 mr-1" />
            High Score: {gameState.highScore}
          </Badge>
          {gameState.isPlaying && (
            <Badge variant="default">Score: {gameState.score}</Badge>
          )}
        </div>
      </div>

      {!gameState.isPlaying && !gameState.gameOver && (
        <div className="text-center space-y-4">
          <p className="text-elder-lg text-muted-foreground">
            Swipe left and right to dodge obstacles and collect coins!
          </p>
          <Button onClick={startGame} size="lg" variant="default" className="text-elder-base">
            <Zap className="w-5 h-5 mr-2" />
            Start Running!
          </Button>
        </div>
      )}

      {gameState.gameOver && (
        <div className="text-center space-y-4">
          <div className="text-elder-3xl font-bold text-primary">Game Over!</div>
          <p className="text-elder-xl">Final Score: {gameState.score}</p>
          <Button onClick={startGame} size="lg" variant="default" className="text-elder-base">
            Play Again
          </Button>
        </div>
      )}

      {gameState.isPlaying && !gameState.gameOver && (
        <div className="space-y-4">
          {/* Game View */}
          <div className="relative h-96 bg-gradient-to-b from-amber-100 to-amber-300 dark:from-amber-900 dark:to-amber-700 rounded-lg overflow-hidden border-2 border-primary/20">
            {/* Path lanes */}
            <div className="absolute inset-0 flex">
              {[0, 1, 2].map(lane => (
                <div key={lane} className="flex-1 border-r border-amber-400/50 dark:border-amber-600/50" />
              ))}
            </div>

            {/* Obstacles */}
            {gameState.obstacles.map((obs, i) => (
              <div
                key={`obs-${i}`}
                className="absolute w-16 h-16 transition-all"
                style={{
                  left: `${obs.lane * 33.33 + 8.5}%`,
                  bottom: `${obs.distance}px`,
                  transform: 'translateY(100%)'
                }}
              >
                {obs.type === 'rock' && <div className="w-full h-full bg-gray-600 rounded-full" />}
                {obs.type === 'tree' && (
                  <div className="w-full h-full">
                    <div className="w-4 h-8 bg-amber-800 mx-auto" />
                    <div className="w-12 h-8 bg-green-600 rounded-full mx-auto -mt-2" />
                  </div>
                )}
                {obs.type === 'gap' && <div className="w-full h-4 bg-red-600" />}
              </div>
            ))}

            {/* Coins */}
            {gameState.coins.map((coin, i) => (
              <div
                key={`coin-${i}`}
                className="absolute w-8 h-8 bg-yellow-400 rounded-full animate-pulse"
                style={{
                  left: `${coin.lane * 33.33 + 16}%`,
                  bottom: `${coin.distance}px`,
                  transform: 'translateY(100%)'
                }}
              />
            ))}

            {/* Player */}
            <div
              className="absolute bottom-8 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg transition-all duration-200 shadow-lg"
              style={{ left: `${gameState.playerLane * 33.33 + 11}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => moveLane('left')}
              size="lg"
              variant="outline"
              className="h-16 w-20"
            >
              <ArrowLeft className="w-8 h-8" />
            </Button>
            <Button
              onClick={() => moveLane('right')}
              size="lg"
              variant="outline"
              className="h-16 w-20"
            >
              <ArrowRight className="w-8 h-8" />
            </Button>
          </div>

          <p className="text-center text-elder-sm text-muted-foreground">
            Use arrow keys or buttons to move
          </p>
        </div>
      )}
    </Card>
  );
};