// main.js

import { problemList } from './problems.js';

let currentIndex = 0;
let currentProblem = null;
let currentKana = "";
let inputBuffer = "";
let score = 0;
let miss = 0;
let timeLeft = 60;
let timer;
let bgmPlaying = false;
let bgm = new Audio("./bgm.mp3");
bgm.loop = true;

const kanjiText = document.getElementById("kanjiText");
const kanaText = document.getElementById("kanaText");
const resultDisplay = document.getElementById("result");
const startButton = document.getElementById("startButton");
const muteButton = document.getElementById("muteButton");
const timerDisplay = document.getElementById("small-timer");
const restartButton = document.getElementById("restartButton");
const inputBox = document.getElementById("inputBox");

function startGame() {
  document.getElementById("titleScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "block";
  restartButton && (restartButton.style.display = "none");
  resultDisplay.textContent = "";
  score = 0;
  miss = 0;
  timeLeft = 60;
  inputBuffer = "";
  currentIndex = 0;
  currentProblem = null;
  currentKana = "";
  bgm.play();
  bgmPlaying = true;
  updateMuteButton();
  nextProblem();
  updateTimer();
  inputBox.value = "";
  inputBox.focus();
  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function updateTimer() {
  timerDisplay.textContent = `${timeLeft}`;
}

function nextProblem() {
  if (currentIndex === 0) {
    currentProblem = problemList[0];
  } else {
    const rest = problemList.slice(1);
    currentProblem = rest[Math.floor(Math.random() * rest.length)];
  }
  currentKana = currentProblem.kana;
  kanjiText.textContent = currentProblem.kanji;
  kanaText.textContent = currentProblem.kana;
  inputBox.value = "";
  inputBox.focus();
  currentIndex++;
}

function handleInput(e) {
  const typed = e.target.value.trim();
  if (typed === currentKana) {
    score += currentKana.length;
    nextProblem();
  } else if (!currentKana.startsWith(typed)) {
    miss++;
  }
}

function endGame() {
  clearInterval(timer);
  kanjiText.textContent = "";
  kanaText.textContent = "";
  const total = score + miss;
  const speed = (score / 60).toFixed(2);
  let rank = "C";
  if (score >= 270) rank = "S";
  else if (score >= 220) rank = "A";
  else if (score >= 170) rank = "B";
  resultDisplay.innerHTML = `おつかれさまでした<br><span style="font-size: 2rem; color: #cd7d7f">ランク: ${rank}</span><br>
    正しく打ったキー: ${score}<br>
    ミスタイプ: ${miss}<br>
    平均タイプ数: ${speed} 回/秒`;
  restartButton && (restartButton.style.display = "inline-block");
  inputBox.blur();
}

function updateMuteButton() {
  if (muteButton) muteButton.textContent = bgmPlaying ? "BGM: OFF" : "BGM: ON";
}

function toggleMute() {
  if (bgm) {
    bgmPlaying = !bgmPlaying;
    bgm.muted = !bgmPlaying;
    updateMuteButton();
  }
}

startButton.addEventListener("click", () => {
  document.addEventListener("click", () => inputBox.focus());
  startGame();
});

restartButton && restartButton.addEventListener("click", () => {
  document.addEventListener("click", () => inputBox.focus());
  startGame();
});

muteButton && muteButton.addEventListener("click", toggleMute);
inputBox.addEventListener("input", handleInput);
