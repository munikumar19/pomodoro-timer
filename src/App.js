import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [workTime, setWorkTime] = useState(25);
  const [workSeconds, setWorkSeconds] = useState(0);
  const [breakTime, setBreakTime] = useState(5);
  const [breakSeconds, setBreakSeconds] = useState(0);

  const [time, setTime] = useState((25 * 60) + 0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  // const [darkMode, setDarkMode] = useState(false);
  const [goal, setGoal] = useState(8);
  const [history, setHistory] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  // Notification permission
  useEffect(() => {
    Notification.requestPermission();
  }, []);

  // Load LocalStorage
  useEffect(() => {
    const savedWork = localStorage.getItem("workTime");
    const savedBreak = localStorage.getItem("breakTime");
    const savedSessions = localStorage.getItem("sessions");
    const savedHistory = localStorage.getItem("history");

    if (savedWork) setWorkTime(Number(savedWork));
    if (savedBreak) setBreakTime(Number(savedBreak));
    if (savedSessions) setSessions(Number(savedSessions));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Save LocalStorage
  useEffect(() => {
    localStorage.setItem("workTime", workTime);
    localStorage.setItem("breakTime", breakTime);
    localStorage.setItem("sessions", sessions);
    localStorage.setItem("history", JSON.stringify(history));
  }, [workTime, breakTime, sessions, history]);

  // Timer Logic
  useEffect(() => {
    let timer;

    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime(prev => prev - 1);
      }, 1000);
    }

    // TIME FINISHED
    if (time === 0) {
      setIsRunning(false);
      setShowAlert(true);

      const audio = new Audio("/bell.mp3");
      audio.play().catch(() => {});


      setSessions(prev => prev + 1);

      const today = new Date().toLocaleDateString();
      setHistory(prev => [...prev, { date: today, session: prev.length + 1 }]);
    }

    return () => clearInterval(timer);
  }, [isRunning, time]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="container dark">
      <h1 className="brand">FocusFlow</h1>
      <p className="tagline">Stay focused. Track progress. Improve productivity.</p>

      {/* <button onClick={() => setDarkMode(!darkMode)}>Toggle Dark Mode</button> */}

      <h2>Focus Time</h2>

      {/* Circular Timer */}
      <div className="timer-wrapper">
        <svg className="progress-ring" width="180" height="180">
          <circle className="progress-ring-bg" cx="90" cy="90" r="80" strokeWidth="10" />
          <circle
            className="progress-ring-fill"
            cx="90"
            cy="90"
            r="80"
            strokeWidth="10"
            style={{
              strokeDasharray: 502,
              strokeDashoffset: 502 - (time / ((workTime * 60) + Number(workSeconds))) * 502
            }}
          />
        </svg>

        <div className="timer-text">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
      </div>

      {/* TIME UP MESSAGE */}
      {showAlert && (
      <div className="timeup-overlay">
        <div className="timeup-content">
        <div className="timeup-icon">⏰</div>

        <h1>Session Complete</h1>
        <p>Great focus! Take a short break and recharge.</p>

        <div className="timeup-actions">
          <button
            className="primary-btn"
            onClick={() => {
              setShowAlert(false);
              setTime((workTime * 60) + Number(workSeconds));
            }}
          >
            Start Next Session
          </button>

          <button
            className="secondary-btn"
            onClick={() => setShowAlert(false)}
          >
            Close
          </button>
        </div>
      </div>

      </div>
      )}


      <div className="buttons">
        <button onClick={() => {
          setIsRunning(true);
          setShowAlert(false);
        }}>Start</button>

        <button onClick={() => setIsRunning(false)}>Pause</button>

        <button onClick={() => {
          setTime((workTime * 60) + Number(workSeconds));
          setShowAlert(false);
        }}>Reset</button>
      </div>

      {/* Settings */}
      <div className="settings card">
        <h3>Settings</h3>

        <label>Work Minutes:</label>
        <input
          type="number"
          value={workTime}
          onChange={(e) => setWorkTime(e.target.value)}
        />

        <label>Work Seconds:</label>
        <input
          type="number"
          min="0"
          max="59"
          value={workSeconds}
          onChange={(e) => setWorkSeconds(e.target.value)}
        />

        <br />

        <label>Break Minutes:</label>
        <input
          type="number"
          value={breakTime}
          onChange={(e) => setBreakTime(e.target.value)}
        />

        <label>Break Seconds:</label>
        <input
          type="number"
          min="0"
          max="59"
          value={breakSeconds}
          onChange={(e) => setBreakSeconds(e.target.value)}
        />
      </div>

      {/* Goal */}
      <div className="tracker card">
        <h3>Daily Goal</h3>
        <input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} />
        <p>Progress: {sessions} / {goal}</p>

        <div className="progress-bar">
          <div
            className={`progress-fill ${sessions >= goal ? "complete" : ""}`}
            style={{ width: `${(sessions / goal) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* History */}
      <div className="history card">
        <h3>Session History</h3>
        <ul>
          {history.map((item, index) => (
            <li key={index}>
              {item.date} — Session #{item.session}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
