// script.js

// --- CONFIGURATION ---
const WORK_DURATION = 25 * 60; // in seconds
const BREAK_DURATION = 5 * 60;

const progressCircle = document.getElementById('progress');
const FULL_DASH_ARRAY = 565.48; // circumference of the circle (2 * π * r)

// --- STATE TRACKERS ---
let isWorkSession = true;
let timeLeft = WORK_DURATION;
let timerRunning = false;
let interval = null;
let pomodoroCount = 0;

// --- FORMAT TIME TO MM:SS ---
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
}

// --- TICK FUNCTION (1 second interval) ---
function tick() {
  if (timeLeft > 0) {
    timeLeft--;
    updateDisplay();
  } else {
    clearInterval(interval);
    timerRunning = false;

    // Auto-switch session
    isWorkSession = !isWorkSession;
    timeLeft = isWorkSession ? WORK_DURATION : BREAK_DURATION;

    if (isWorkSession) pomodoroCount++;

    updateDisplay();
    startTimer(); // Automatically start next session
  }
    // Animate timer on every tick
    timerDisplay.classList.remove('animate'); // reset class
    void timerDisplay.offsetWidth; // trigger reflow
    timerDisplay.classList.add('animate');    // re-add animation
}

// --- START TIMER ---
function startTimer() {
  if (!timerRunning) {
    interval = setInterval(tick, 1000);
    timerRunning = true;
  }
}

// --- RESET TIMER ---
function resetTimer() {
  clearInterval(interval);
  timerRunning = false;
  timeLeft = isWorkSession ? WORK_DURATION : BREAK_DURATION;
  updateDisplay();
}

// --- DOM LINK (to be connected later) ---
function updateDisplay() {
    timerDisplay.textContent = formatTime(timeLeft);
    sessionLabel.textContent = isWorkSession ? "Focus Time" : "Break Time";
    pomodoroDisplay.textContent = `Pomodoros Completed: ${pomodoroCount}`;
  
    // Animate progress circle
    const sessionDuration = isWorkSession ? WORK_DURATION : BREAK_DURATION;
    const progress = timeLeft / sessionDuration;
    progressCircle.style.strokeDashoffset = FULL_DASH_ARRAY * (1 - progress);
  }
  

// --- DOM ELEMENTS ---
const timerDisplay = document.getElementById('timer');
const sessionLabel = document.getElementById('session-label');
const pomodoroDisplay = document.getElementById('pomodoro-count');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');

// --- DISPLAY UPDATER ---
function updateDisplay() {
  timerDisplay.textContent = formatTime(timeLeft);
  sessionLabel.textContent = isWorkSession ? "Focus Time" : "Break Time";
  pomodoroDisplay.textContent = `Pomodoros Completed: ${pomodoroCount}`;
}

// --- BUTTON EVENTS ---
startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

// --- Initialize display on page load ---
updateDisplay();
