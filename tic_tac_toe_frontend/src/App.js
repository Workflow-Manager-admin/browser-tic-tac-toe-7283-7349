import React, { useState, useEffect } from "react";
import "./App.css";

// --- Logic Helpers ---

// PUBLIC_INTERFACE
function calculateWinner(squares) {
  /** Returns "X", "O", "Tie" or null. */
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6],            // Diags
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a]; // "X" or "O"
    }
  }
  if (squares.every(Boolean)) return "Tie";
  return null;
}

// --- Components ---

// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  /** Renders a single square button for the board */
  return (
    <button
      className={`ttt-square${highlight ? " highlight" : ""}`}
      onClick={onClick}
      disabled={Boolean(value)}
      aria-label={value ? `Cell ${value}` : `Empty cell`}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, winLine }) {
  /** Renders the 3x3 board grid */
  function renderSquare(idx) {
    const highlight = winLine?.includes(idx);
    return (
      <Square
        key={idx}
        value={squares[idx]}
        onClick={() => onSquareClick(idx)}
        highlight={highlight}
      />
    );
  }
  // 3 rows of 3 cols
  return (
    <div className="ttt-board">
      {[0, 1, 2].map(row => (
        <div key={row} className="ttt-board-row">
          {[0, 1, 2].map(col =>
            renderSquare(row * 3 + col)
          )}
        </div>
      ))}
    </div>
  );
}

// --- Main App ---

// PUBLIC_INTERFACE
function App() {
  /** Primary App component for Tic-Tac-Toe game UI and logic */

  // Game state
  const [squares, setSquares] = useState(Array(9).fill(null)); // Board state
  const [xIsNext, setXIsNext] = useState(true); // Who's turn
  const [winner, setWinner] = useState(null); // "X", "O", "Tie", null
  const [winLine, setWinLine] = useState([]); // Winning line cells
  const [score, setScore] = useState({ X: 0, O: 0, Tie: 0 }); // Score tracking

  // --- Logic Hooks ---

  useEffect(() => {
    const result = calculateWinner(squares);
    if (result) {
      setWinner(result);
      if (result === "Tie") {
        setScore(s => ({ ...s, Tie: s.Tie + 1 }));
        setWinLine([]);
      } else {
        setScore(s => ({ ...s, [result]: s[result] + 1 }));
        // Find winLine for highlight
        setWinLine(findWinLine(squares, result));
      }
    }
  }, [squares]);

  // Helper to find which line is the winning line
  function findWinLine(board, player) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (
        board[a] === player &&
        board[a] === board[b] &&
        board[a] === board[c]
      ) {
        return line;
      }
    }
    return [];
  }

  // --- Event Handlers ---

  // PUBLIC_INTERFACE
  function handleSquareClick(idx) {
    if (winner || squares[idx]) return; // Prevent playing on finished game or filled square
    const nextSquares = squares.slice();
    nextSquares[idx] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(x => !x);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setWinLine([]);
  }

  // --- UI State ---

  let statusText;
  if (winner === "Tie") {
    statusText = "It's a tie!";
  } else if (winner) {
    statusText = `Winner: ${winner}`;
  } else {
    statusText = `Next: ${xIsNext ? "X" : "O"}`;
  }

  // --- THEME ---

  // Always light theme per requirements, but keep dark toggle logic for future extension
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', "light");
  }, []);

  // --- Render ---

  return (
    <div className="App">
      <header className="ttt-header">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <section className="ttt-score-section">
          <div className="ttt-score" aria-label="Score for X">
            <span className="ttt-score-label">X</span>
            <span className="ttt-score-value">{score.X}</span>
          </div>
          <div className="ttt-score" aria-label="Score for ties">
            <span className="ttt-score-label">Tie</span>
            <span className="ttt-score-value">{score.Tie}</span>
          </div>
          <div className="ttt-score" aria-label="Score for O">
            <span className="ttt-score-label">O</span>
            <span className="ttt-score-value">{score.O}</span>
          </div>
        </section>
      </header>
      <main className="ttt-main">
        <div className="ttt-status">{statusText}</div>
        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          winLine={winLine}
        />
        <button
          className="ttt-restart-btn"
          onClick={handleRestart}
          aria-label="Restart Game"
        >
          Restart Game
        </button>
      </main>
      <footer className="ttt-footer">
        <span>Tic Tac Toe &mdash; Modern React | Light Theme</span>
      </footer>
    </div>
  );
}

export default App;
