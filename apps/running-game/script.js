// 게임 상태 변수
let gameRunning = false;
let score = 0;
let speed = 1;
let playerPosition = 50; // 화면의 중앙 (%)
let obstacles = [];
let animationId;
let difficultyLevel = 1; // 난이도 레벨 추가

// DOM 요소
const player = document.getElementById("player");
const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");
const speedDisplay = document.getElementById("speed");
const startButton = document.getElementById("start-btn");
const resetButton = document.getElementById("reset-btn");

// 이벤트 리스너 등록
startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);
document.addEventListener("keydown", handleKeyPress);

// 키 입력 처리 함수
function handleKeyPress(e) {
  if (!gameRunning) return;

  switch (e.key) {
    case "ArrowLeft":
      // 왼쪽 화살표: 왼쪽으로 이동
      playerPosition = Math.max(5, playerPosition - 5);
      player.style.left = `${playerPosition}%`;
      break;
    case "ArrowRight":
      // 오른쪽 화살표: 오른쪽으로 이동
      playerPosition = Math.min(95, playerPosition + 5);
      player.style.left = `${playerPosition}%`;
      break;
    case "ArrowUp":
      // 위쪽 화살표: 속도 증가
      if (speed < 5) {
        // 최대 속도를 10에서 5로 낮춤
        speed += 0.5;
        speedDisplay.textContent = speed;
      }
      break;
    case "ArrowDown":
      // 아래쪽 화살표: 속도 감소
      if (speed > 1) {
        speed -= 0.5;
        speedDisplay.textContent = speed;
      }
      break;
  }
}

// 장애물 생성 함수
function createObstacle() {
  if (!gameRunning) return;

  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");

  // 랜덤 위치에 장애물 생성
  const position = Math.random() * 90 + 5; // 5% ~ 95% 사이
  obstacle.style.left = `${position}%`;
  obstacle.style.top = "0";

  gameArea.appendChild(obstacle);
  obstacles.push({
    element: obstacle,
    position: position,
    top: 0,
  });

  // 장애물 생성 주기를 속도와 난이도에 따라 조절 (더 긴 간격으로 수정)
  setTimeout(createObstacle, 3000 / speed);
}

// 장애물 이동 함수
function moveObstacles() {
  obstacles.forEach((obstacle, index) => {
    // 속도를 난이도에 따라 조절
    obstacle.top += speed * 0.7; // 이동 속도를 70%로 감소
    obstacle.element.style.top = `${obstacle.top}px`;

    // 장애물이 화면 아래로 벗어났는지 확인
    if (obstacle.top > gameArea.offsetHeight) {
      obstacle.element.remove();
      obstacles.splice(index, 1);
      // 점수 증가
      score += 10;
      scoreDisplay.textContent = score;
    } else if (checkCollision(obstacle)) {
      // 충돌 검사
      gameOver();
    }
  });
}

// 충돌 검사 함수
function checkCollision(obstacle) {
  const playerRect = player.getBoundingClientRect();
  const obstacleRect = obstacle.element.getBoundingClientRect();

  // 충돌 영역을 약간 줄여서 난이도 조정 (플레이어에게 더 유리하게)
  return !(
    playerRect.right - 5 < obstacleRect.left + 5 ||
    playerRect.left + 5 > obstacleRect.right - 5 ||
    playerRect.bottom - 5 < obstacleRect.top + 5 ||
    playerRect.top + 5 > obstacleRect.bottom - 5
  );
}

// 게임 업데이트 함수
function updateGame() {
  if (!gameRunning) return;

  moveObstacles();

  // 점수에 따라 속도 조정 (더 천천히 증가하도록 수정)
  if (score > 0 && score % 200 === 0) {
    // 100점마다 -> 200점마다
    speed = Math.min(5, speed + 0.3); // 증가량을 0.5에서 0.3으로 감소, 최대 속도 제한
    speedDisplay.textContent = speed.toFixed(1);
  }

  animationId = requestAnimationFrame(updateGame);
}

// 게임 시작 함수
function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  startButton.disabled = true;

  // 게임 시작 메시지
  alert("게임을 시작합니다! 방향키로 조작하세요.");

  createObstacle();
  updateGame();
}

// 게임 재시작 함수
function resetGame() {
  gameRunning = false;
  score = 0;
  speed = 1;
  playerPosition = 50;
  difficultyLevel = 1;

  // 화면 초기화
  cancelAnimationFrame(animationId);
  scoreDisplay.textContent = score;
  speedDisplay.textContent = speed;
  player.style.left = `${playerPosition}%`;

  // 장애물 제거
  obstacles.forEach((obstacle) => obstacle.element.remove());
  obstacles = [];

  // 버튼 상태 초기화
  startButton.disabled = false;
}

// 게임 오버 함수
function gameOver() {
  gameRunning = false;
  cancelAnimationFrame(animationId);
  alert(`게임 오버! 최종 점수: ${score}`);
  startButton.disabled = false;
}
