import React, { useState, useEffect, useRef } from "react";
import { GameState, Obstacle, Player } from "../types";
import "../styles/RunningGame.css";

const RunningGame: React.FC = () => {
  // 게임 상태 관리
  const [gameState, setGameState] = useState<GameState>({
    gameRunning: false,
    speed: 1,
    players: [
      // 첫 번째 플레이어 (왼쪽)
      {
        id: 1,
        position: 30,
        isAlive: true,
        score: 0,
        color: "#ff5252", // 빨간색
      },
      // 두 번째 플레이어 (오른쪽)
      {
        id: 2,
        position: 70,
        isAlive: true,
        score: 0,
        color: "#4CAF50", // 초록색
      },
    ],
    obstacles: [],
    difficultyLevel: 1,
    multiplayerMode: true,
  });

  // 싱글 모드와 멀티 모드 전환
  const [isMultiplayer, setIsMultiplayer] = useState<boolean>(true);

  // refs
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const playerRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const obstaclesRef = useRef<Map<number, HTMLDivElement>>(new Map());
  const animationRef = useRef<number>(0);
  const lastObstacleId = useRef<number>(0);

  // 키보드 입력 처리
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameState.gameRunning) return;

      // 첫 번째 플레이어 조작: WASD
      // 두 번째 플레이어 조작: 화살표 키
      setGameState((prev) => {
        const newPlayers = [...prev.players];

        switch (e.key) {
          // 첫 번째 플레이어 조작: A, D
          case "a":
          case "A":
            if (newPlayers[0].isAlive) {
              newPlayers[0].position = Math.max(5, newPlayers[0].position - 5);
            }
            break;
          case "d":
          case "D":
            if (newPlayers[0].isAlive) {
              newPlayers[0].position = Math.min(95, newPlayers[0].position + 5);
            }
            break;

          // 두 번째 플레이어 조작: 왼쪽, 오른쪽 화살표
          case "ArrowLeft":
            if (isMultiplayer && newPlayers[1].isAlive) {
              newPlayers[1].position = Math.max(5, newPlayers[1].position - 5);
            } else if (!isMultiplayer && newPlayers[0].isAlive) {
              // 싱글 모드일 때는 화살표 키로 첫 번째 플레이어 조작
              newPlayers[0].position = Math.max(5, newPlayers[0].position - 5);
            }
            break;
          case "ArrowRight":
            if (isMultiplayer && newPlayers[1].isAlive) {
              newPlayers[1].position = Math.min(95, newPlayers[1].position + 5);
            } else if (!isMultiplayer && newPlayers[0].isAlive) {
              // 싱글 모드일 때는 화살표 키로 첫 번째 플레이어 조작
              newPlayers[0].position = Math.min(95, newPlayers[0].position + 5);
            }
            break;

          // 게임 속도 조절
          case "ArrowUp":
            return {
              ...prev,
              speed: prev.speed < 5 ? prev.speed + 0.5 : prev.speed,
            };
          case "ArrowDown":
            return {
              ...prev,
              speed: prev.speed > 1 ? prev.speed - 0.5 : prev.speed,
            };
          default:
            break;
        }

        return {
          ...prev,
          players: newPlayers,
        };
      });
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState.gameRunning, isMultiplayer]);

  // 플레이어 위치 업데이트
  useEffect(() => {
    gameState.players.forEach((player) => {
      if (playerRefs.current.has(player.id)) {
        const playerEl = playerRefs.current.get(player.id);
        if (playerEl) {
          playerEl.style.left = `${player.position}%`;
        }
      }
    });
  }, [gameState.players]);

  // 장애물 생성
  useEffect(() => {
    if (!gameState.gameRunning) return;

    const createObstacle = () => {
      if (!gameState.gameRunning) return;

      const newId = lastObstacleId.current + 1;
      lastObstacleId.current = newId;

      // 랜덤 위치에 장애물 생성
      const position = Math.random() * 90 + 5; // 5% ~ 95% 사이

      setGameState((prev) => ({
        ...prev,
        obstacles: [...prev.obstacles, { id: newId, position, top: 0 }],
      }));

      // 다음 장애물 생성 예약
      setTimeout(createObstacle, 3000 / gameState.speed);
    };

    // 게임 시작 후 일정 시간 후에 첫 장애물 생성 (즉시 생성하지 않음)
    const timerId = setTimeout(createObstacle, 2000);
    return () => clearTimeout(timerId);
  }, [gameState.gameRunning, gameState.speed]);

  // 충돌 감지 함수
  const checkCollision = (player: Player, obstacle: Obstacle): boolean => {
    if (
      !playerRefs.current.has(player.id) ||
      !obstaclesRef.current.has(obstacle.id)
    )
      return false;

    const playerEl = playerRefs.current.get(player.id);
    const obstacleEl = obstaclesRef.current.get(obstacle.id);

    if (!playerEl || !obstacleEl) return false;

    const playerRect = playerEl.getBoundingClientRect();
    const obstacleRect = obstacleEl.getBoundingClientRect();

    // 충돌 감지 영역을 약간 줄임 (더 관대하게)
    return !(
      playerRect.right - 10 < obstacleRect.left + 10 ||
      playerRect.left + 10 > obstacleRect.right - 10 ||
      playerRect.bottom - 10 < obstacleRect.top + 10 ||
      playerRect.top + 10 > obstacleRect.bottom - 10
    );
  };

  // 게임 업데이트 (애니메이션 프레임)
  useEffect(() => {
    if (!gameState.gameRunning) return;

    const updateGame = () => {
      if (!gameAreaRef.current) return;

      // 장애물 이동 및 충돌 감지
      setGameState((prev) => {
        const gameAreaHeight = gameAreaRef.current!.offsetHeight;
        let updatedObstacles = [...prev.obstacles];
        let updatedPlayers = [...prev.players];
        let allPlayersDead = true;

        // 장애물 업데이트
        updatedObstacles = updatedObstacles.map((obstacle) => {
          const newTop = obstacle.top + prev.speed * 0.7;
          return { ...obstacle, top: newTop };
        });

        // 장애물 제거 및 점수 증가 처리
        const remainingObstacles = [];
        for (const obstacle of updatedObstacles) {
          if (obstacle.top > gameAreaHeight) {
            // 화면을 벗어난 장애물: 점수 증가
            updatedPlayers = updatedPlayers.map((player) =>
              player.isAlive ? { ...player, score: player.score + 10 } : player
            );
            // 장애물 DOM 요소 제거
            if (obstaclesRef.current.has(obstacle.id)) {
              obstaclesRef.current.delete(obstacle.id);
            }
          } else {
            // 화면 내 장애물: 충돌 검사
            updatedPlayers.forEach((player, index) => {
              if (player.isAlive && checkCollision(player, obstacle)) {
                updatedPlayers[index] = { ...player, isAlive: false };
              }
            });
            remainingObstacles.push(obstacle);
          }
        }

        // 모든 플레이어가 죽었는지 확인
        allPlayersDead = updatedPlayers.every((player) => !player.isAlive);

        // 모든 플레이어가 죽었다면 게임 오버
        if (allPlayersDead) {
          setTimeout(() => gameOver(updatedPlayers), 100);
          return { ...prev, gameRunning: false };
        }

        // 점수에 따른 속도 조정
        let newSpeed = prev.speed;
        // 살아있는 플레이어 중 최고 점수 확인
        const alivePlayers = updatedPlayers.filter((p) => p.isAlive);
        if (alivePlayers.length > 0) {
          const maxScore = Math.max(...alivePlayers.map((p) => p.score));
          if (
            maxScore > 0 &&
            maxScore % 200 === 0 &&
            alivePlayers.some(
              (p) =>
                p.score === maxScore &&
                p.score > 0 &&
                p.score !== prev.players.find((pp) => pp.id === p.id)?.score
            )
          ) {
            newSpeed = Math.min(5, prev.speed + 0.3);
          }
        }

        return {
          ...prev,
          obstacles: remainingObstacles,
          players: updatedPlayers,
          speed: newSpeed,
        };
      });

      animationRef.current = requestAnimationFrame(updateGame);
    };

    animationRef.current = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(animationRef.current);
  }, [gameState.gameRunning]);

  // 게임 모드 전환
  const toggleGameMode = () => {
    if (gameState.gameRunning) return; // 게임 중에는 모드 변경 불가

    setIsMultiplayer(!isMultiplayer);

    setGameState((prev) => {
      const newPlayers = isMultiplayer
        ? [{ ...prev.players[0], position: 50, isAlive: true, score: 0 }] // 싱글 모드로 전환: 첫 번째 플레이어만
        : [
            { ...prev.players[0], position: 30, isAlive: true, score: 0 }, // 멀티 모드로 전환: 두 명의 플레이어
            {
              id: 2,
              position: 70,
              isAlive: true,
              score: 0,
              color: "#4CAF50",
            },
          ];

      return {
        ...prev,
        players: newPlayers,
        multiplayerMode: !isMultiplayer,
      };
    });
  };

  // 게임 시작
  const startGame = () => {
    if (gameState.gameRunning) return;

    // 장애물과 플레이어 초기화
    obstaclesRef.current.clear();

    const modeText = isMultiplayer ? "멀티플레이어" : "싱글플레이어";
    alert(
      `${modeText} 게임을 시작합니다!\n\n${isMultiplayer ? "플레이어1: A,D 키\n플레이어2: ←,→ 화살표 키" : "플레이어: ←,→ 화살표 키"}`
    );

    setGameState((prev) => ({
      ...prev,
      gameRunning: true,
      obstacles: [], // 장애물 초기화
      players: prev.players.map((player) => ({
        ...player,
        isAlive: true,
        score: 0,
      })),
    }));
  };

  // 게임 재시작
  const resetGame = () => {
    // 모든 장애물 요소 제거
    obstaclesRef.current.clear();

    setGameState((prev) => ({
      ...prev,
      gameRunning: false,
      speed: 1,
      obstacles: [],
      difficultyLevel: 1,
      players: prev.players.map((player) => ({
        ...player,
        isAlive: true,
        score: 0,
        position: player.id === 1 ? (isMultiplayer ? 30 : 50) : 70,
      })),
    }));
  };

  // 게임 오버
  const gameOver = (players: Player[] = gameState.players) => {
    cancelAnimationFrame(animationRef.current);

    // 최고 점수 계산 (전달받은 최신 플레이어 상태 사용)
    const highestScore = Math.max(...players.map((p) => p.score));
    const winners = players.filter((p) => p.score === highestScore);

    if (isMultiplayer) {
      if (winners.length > 1) {
        alert(`게임 오버! 무승부입니다!\n최종 점수: ${highestScore}`);
      } else {
        const winner = winners[0];
        alert(
          `게임 오버! 플레이어 ${winner.id}의 승리!\n최종 점수: ${winner.score}`
        );
      }
    } else {
      alert(`게임 오버! 최종 점수: ${highestScore}`);
    }
  };

  return (
    <div className="game-container">
      <div className="game-mode">
        <button
          onClick={toggleGameMode}
          disabled={gameState.gameRunning}
          className={isMultiplayer ? "multiplayer-btn" : "singleplayer-btn"}
        >
          {isMultiplayer ? "멀티플레이어 모드" : "싱글플레이어 모드"}
        </button>
      </div>

      <div className="game-info">
        {gameState.players.map((player) => (
          <div
            key={player.id}
            className="player-info"
            style={{ color: player.color }}
          >
            <div className="player-status">
              플레이어 {player.id} {player.isAlive ? "🏃" : "💀"}
            </div>
            <div className="score">
              점수: <span>{player.score}</span>
            </div>
          </div>
        ))}
        <div className="speed">
          속도: <span>{gameState.speed.toFixed(1)}</span>
        </div>
      </div>

      <div id="game-area" ref={gameAreaRef}>
        {gameState.players.map(
          (player) =>
            player.isAlive && (
              <div
                key={player.id}
                className={`player player-${player.id}`}
                ref={(el) => {
                  if (el) playerRefs.current.set(player.id, el);
                }}
                style={{
                  left: `${player.position}%`,
                  backgroundColor: player.color,
                }}
              ></div>
            )
        )}
        <div id="track"></div>

        {gameState.obstacles.map((obstacle) => (
          <div
            key={obstacle.id}
            className="obstacle"
            ref={(el) => {
              if (el) {
                obstaclesRef.current.set(obstacle.id, el);
                el.style.left = `${obstacle.position}%`;
                el.style.top = `${obstacle.top}px`;
              }
            }}
          ></div>
        ))}
      </div>

      <div className="controls">
        <p>
          {isMultiplayer
            ? "플레이어1: A, D 키 / 플레이어2: ←, → 화살표 키"
            : "플레이어: ←, → 화살표 키"}
          <br />
          게임 속도: ↑, ↓ 화살표 키
        </p>
        <button
          id="start-btn"
          onClick={startGame}
          disabled={gameState.gameRunning}
        >
          게임 시작
        </button>
        <button id="reset-btn" onClick={resetGame}>
          재시작
        </button>
      </div>
    </div>
  );
};

export default RunningGame;
