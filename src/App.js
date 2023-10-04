import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './styles.css'

function App() {
  const [pomodoroTime, setPomodoroTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(pomodoroTime * 60);
  const [studyTimeToday, setStudyTimeToday] = useState(0);
  const [isPomodoroFinished, setIsPomodoroFinished] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [breakTimeElapsed, setBreakTimeElapsed] = useState(0);

  const toggleTimer = () => {
    setTimerRunning(!timerRunning);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimeRemaining(pomodoroTime * 60);
    setIsPomodoroFinished(false);
  };

  const saveStudyTime = () => {
    setStudyTimeToday((prevStudyTime) => prevStudyTime + (pomodoroTime * 60 - timeRemaining));
  };

  const applyCustomTime = () => {
    setTimeRemaining(pomodoroTime * 60);
    resetTimer();
  };

  const startBreakTime = () => {
    setIsModalOpen(false);
    setStudyTimeToday((prevStudyTime) => prevStudyTime + breakTimeElapsed);
    setTimeRemaining(breakTime * 60);
    setTimerRunning(true);
  };

  useEffect(() => {
    let interval;
    if (timerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0 && timerRunning) {
      setIsPomodoroFinished(true);
      setIsModalOpen(true);

      // Iniciar o contador de breakTimeElapsed em ordem crescente
      let breakInterval = setInterval(() => {
        setBreakTimeElapsed((prevBreakTimeElapsed) => prevBreakTimeElapsed + 1);
      }, 1000);

      // Quando o usuário iniciar o tempo de descanso, limpar o intervalo do contador
      return () => {
        clearInterval(breakInterval);
      };
    }

    return () => {
      clearInterval(interval);
    };
  }, [timerRunning, timeRemaining, pomodoroTime, breakTime, breakTimeElapsed]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="container">

      <h1 className="title">Pomodoro Timer</h1>

      <div className="customTime">
        <div>
          <label className='label'>Pomodoro Time (min):</label>
          <input className='input'
            type="number"
            value={pomodoroTime}
            onChange={(e) => setPomodoroTime(e.target.value)}
          />
        </div>
        <div>
          <label className='label'>Break Time (min):</label>
          <input className='input'
            type="number"
            value={breakTime}
            onChange={(e) => setBreakTime(e.target.value)}
          />
        </div>
      </div>

      <div>
          <button className='button' onClick={applyCustomTime}>Apply Custom Timer</button>
      </div>

      <main className='main'>
        <div>
          <button className='button' onClick={toggleTimer}>
            {timerRunning ? 'Pause' : 'Start'}
          </button>
          <p>Time Remaining: {Math.floor(timeRemaining / 60)}m {timeRemaining % 60}s</p>
      
          <button className='button' onClick={resetTimer}>Reset</button>
          <button className='button' onClick={saveStudyTime}>Save Study Time</button>
        </div>
        <div>
          <p>Today's Study Time: {formatTime(studyTimeToday)}</p>
        </div>
      </main>
      
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Pomodoro Finished"
      >
        <h2>Pomodoro Finished!</h2>
        <p>Additional Time: {formatTime(breakTimeElapsed)}</p>
        {isPomodoroFinished && (
          <button className='button' onClick={startBreakTime}>Start Break Time</button>
        )}
      </Modal>

    </div>
  );
}

export default App;
