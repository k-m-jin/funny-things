import React from "react";
import RunningGame from "./components/RunningGame";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>달리기 게임</h1>
        <p>React와 TypeScript로 만든 멀티플레이어 달리기 게임</p>
      </header>
      <main>
        <RunningGame />
      </main>
      <footer>
        <p>
          <strong>조작 방법:</strong>
          <br />
          플레이어1: A, D 키로 좌우 이동
          <br />
          플레이어2: ←, → 화살표 키로 좌우 이동
          <br />
          게임 속도 조절: ↑, ↓ 화살표 키
        </p>
      </footer>
    </div>
  );
}

export default App;
