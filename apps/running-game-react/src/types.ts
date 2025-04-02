// 장애물 객체 타입 정의
export interface Obstacle {
  id: number;
  position: number;
  top: number;
}

// 플레이어 타입 정의
export interface Player {
  id: number;
  position: number;
  isAlive: boolean;
  score: number;
  color: string;
}

// 게임 상태 타입 정의
export interface GameState {
  gameRunning: boolean;
  speed: number;
  players: Player[];
  obstacles: Obstacle[];
  difficultyLevel: number;
  multiplayerMode: boolean;
}
