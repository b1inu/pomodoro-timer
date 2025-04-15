// --- CONFIGURATION ---
let WORK_DURATION = 25 * 60;
let BREAK_DURATION = 5 * 60;

// --- STATE ---
let isWorkSession = true;
let timeLeft = WORK_DURATION;
let timerRunning = false;
let interval = null;
let pomodoroCount = parseInt(localStorage.getItem('pomodoroCount')) || 0;

// --- DOM ELEMENTS ---
const timerDisplay = document.getElementById('timer');
const sessionLabel = document.getElementById('session-label');
const pomodoroDisplay = document.getElementById('pomodoro-count');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const toggleSettingsBtn = document.getElementById('toggle-settings');
const themeToggleBtn = document.getElementById('theme-toggle');
const settingsPanel = document.getElementById('settings-panel');
const workInput = document.getElementById('work-input');
const breakInput = document.getElementById('break-input');
const applySettingsBtn = document.getElementById('apply-settings');
const resetAllBtn = document.getElementById('reset-all');
const progressCircle = document.getElementById('progress');
const FULL_DASH_ARRAY = 565.48;

// --- TIMER FUNCTIONS ---
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(timeLeft);
  sessionLabel.textContent = isWorkSession ? "Focus Time" : "Break Time";
  pomodoroDisplay.textContent = `Pomodoros Completed: ${pomodoroCount}`;

  const sessionDuration = isWorkSession ? WORK_DURATION : BREAK_DURATION;
  const progress = timeLeft / sessionDuration;
  progressCircle.style.strokeDashoffset = FULL_DASH_ARRAY * (1 - progress);

  // Animate pulse
  timerDisplay.classList.remove('animate');
  void timerDisplay.offsetWidth;
  timerDisplay.classList.add('animate');
}

function tick() {
  if (timeLeft > 0) {
    timeLeft--;
    updateDisplay();
  } else {
    clearInterval(interval);
    timerRunning = false;
    isWorkSession = !isWorkSession;
    timeLeft = isWorkSession ? WORK_DURATION : BREAK_DURATION;

    if (isWorkSession) {
      pomodoroCount++;
      localStorage.setItem('pomodoroCount', pomodoroCount);
    }

    updateDisplay();
    startTimer();
  }
}

function startTimer() {
  if (!timerRunning) {
    interval = setInterval(tick, 1000);
    timerRunning = true;
  }
}

function resetTimer() {
  clearInterval(interval);
  timerRunning = false;
  timeLeft = isWorkSession ? WORK_DURATION : BREAK_DURATION;
  updateDisplay();
}

// --- SETTINGS ---
toggleSettingsBtn.addEventListener('click', () => {
  settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
});

applySettingsBtn.addEventListener('click', () => {
  const newWork = parseInt(workInput.value);
  const newBreak = parseInt(breakInput.value);

  if (newWork > 0 && newBreak > 0) {
    WORK_DURATION = newWork * 60;
    BREAK_DURATION = newBreak * 60;
    timeLeft = isWorkSession ? WORK_DURATION : BREAK_DURATION;
    resetTimer();
  }
});

resetAllBtn.addEventListener('click', () => {
  localStorage.clear();
  pomodoroCount = 0;

  workInput.value = 25;
  breakInput.value = 5;
  WORK_DURATION = 25 * 60;
  BREAK_DURATION = 5 * 60;

  isWorkSession = true;
  timeLeft = WORK_DURATION;
  timerRunning = false;
  clearInterval(interval);

  settingsPanel.style.display = 'none';
  updateDisplay();
});

// --- THEME ---
function applyTheme(theme) {
  document.body.classList.toggle('light', theme === 'light');
  localStorage.setItem('theme', theme);
}

themeToggleBtn.addEventListener('click', () => {
  const newTheme = document.body.classList.contains('light') ? 'dark' : 'light';
  applyTheme(newTheme);
});

const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

// --- BUTTONS ---
startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

// --- INITIAL DISPLAY ---
updateDisplay();

// --- IDLE DETECTION ---
let lastActivityTime = Date.now();
const IDLE_LIMIT = 60 * 1000;

['mousemove', 'keydown', 'mousedown', 'touchstart'].forEach(event => {
  document.addEventListener(event, () => {
    lastActivityTime = Date.now();
  });
});

setInterval(() => {
  const now = Date.now();
  if (timerRunning && now - lastActivityTime > IDLE_LIMIT) {
    clearInterval(interval);
    timerRunning = false;
    console.log("⏸️ Timer paused due to inactivity.");
  }
}, 10000);
