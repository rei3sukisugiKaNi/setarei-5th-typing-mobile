// main.js（シークバー設置）

import { problemList } from './problems.js';

let currentIndex = 0;
let currentProblem = null;
let currentKana = "";
let inputBuffer = "";
let score = 0;
let miss = 0;
let timeLeft = 60;
let timer;
let bgmPlaying = true;
let bgm = new Audio(".bgm.mp3");
bgm.loop = true;
bgm.volume = 0.3;

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const gameScreen = document.getElementById("gameScreen");
const titleScreen = document.getElementById("titleScreen");
const kanaText = document.getElementById("kanaText");
const kanjiText = document.getElementById("kanjiText");
const timerDisplay = document.getElementById("small-timer");
const resultDisplay = document.getElementById("result");
const muteButton = document.getElementById("muteButton");
const progressBar = document.getElementById("progress-bar");

let shuffledProblems = [];

function shuffleArray(array) {
  const copied = [...array];
  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

function startGame() {
  titleScreen.style.display = "none";
  gameScreen.style.display = "block";
  resultDisplay.innerHTML = "";
  restartButton.style.display = "none";

  score = 0;
  miss = 0;
  timeLeft = 60;
  currentIndex = 0;
  inputBuffer = "";

  const rest = problemList.slice(1);
  shuffledProblems = shuffleArray(rest);

  bgm.play();
  bgm.muted = !bgmPlaying;
  updateMuteButton();

  nextProblem();
  updateTimer();
  updateProgressBar();

  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    updateProgressBar();
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

function updateTimer() {
  timerDisplay.textContent = `残り${timeLeft}秒`;
}

function updateProgressBar() {
  const percentage = ((60 - timeLeft) / 60) * 100;
  progressBar.style.width = `${percentage}%`;
}

function nextProblem() {
  if (currentIndex === 0) {
    currentProblem = problemList[0];
  } else {
    if (currentIndex - 1 >= shuffledProblems.length) {
      endGame();
      return;
    }
    currentProblem = shuffledProblems[currentIndex - 1];
  }

  currentKana = currentProblem.kana;
  kanjiText.textContent = currentProblem.kanji;
  kanaText.innerHTML = "";
  inputBuffer = "";

  for (let i = 0; i < currentKana.length; i++) {
    const span = document.createElement("span");
    span.textContent = currentKana[i];
    span.className = "kana-char";
    kanaText.appendChild(span);
  }

  currentIndex++;
}

function handleInput(e) {
  const input = e.data || "";
  if (!input) return;

  inputBuffer += input;

  const expectedChar = currentKana[inputBuffer.length - 1];
  const typedChar = input;
  const span = kanaText.children[inputBuffer.length - 1];

  if (typedChar === expectedChar) {
    score++;
    if (span) span.style.color = "gray";
    if (inputBuffer === currentKana) {
      setTimeout(nextProblem, 100);
    }
  } else {
    miss++;
  }
}

function endGame() {
  kanjiText.textContent = "";
  kanaText.textContent = "";

  const speed = (score / 60).toFixed(2);
  let rank = "C";
  if (score >= 270) rank = "S";
  else if (score >= 220) rank = "A";
  else if (score >= 170) rank = "B";

  resultDisplay.innerHTML = `おつかれさまでした<br><span class="rank">ランク: ${rank}</span><br>
    正しく打ったキー: ${score}<br>
    ミスタイプ: ${miss}<br>
    平均タイプ数: ${speed} 回/秒`;

  restartButton.style.display = "inline-block";
  progressBar.style.width = "0%";
}

function updateMuteButton() {
  muteButton.textContent = bgmPlaying ? "🔇 BGM: OFF" : "🔊 BGM: ON";
}

function toggleMute() {
  bgmPlaying = !bgmPlaying;
  bgm.muted = !bgmPlaying;
  updateMuteButton();
}

startButton.addEventListener("click", () => {
  document.addEventListener("keydown", handleInput);
  startGame();
});

restartButton.addEventListener("click", () => {
  document.addEventListener("keydown", handleInput);
  startGame();
});

muteButton.addEventListener("click", toggleMute);
