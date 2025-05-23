// main.js
import { problemList } from './problems.js';

let currentIndex = 0;
let currentProblem = null;
let currentKana = "";
let score = 0;
let miss = 0;
let timeLeft = 60;
let timer;
let bgmPlaying = true;

const bgm = new Audio("./assets/bgm.mp3");
bgm.loop = true;
bgm.volume = 0.3; // 🔉 音量を調整（0.0 ～ 1.0）

const titleScreen = document.getElementById("titleScreen");
const gameScreen = document.getElementById("gameScreen");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const kanaText = document.getElementById("kanaText");
const kanjiText = document.getElementById("kanjiText");
const inputBox = document.getElementById("inputBox");
const resultDisplay = document.getElementById("result");
const timerDisplay = document.getElementById("small-timer");
const muteButton = document.getElementById("muteButton");

function startGame() {
  titleScreen.style.display = "none";
  gameScreen.style.display = "block";
  restartButton.style.display = "none";
  resultDisplay.textContent = "";

  currentIndex = 0;
  score = 0;
  miss = 0;
  timeLeft = 60;

  bgm.play();
  bgmPlaying = true;
  updateMuteButton();
  updateTimer();

  nextProblem();

  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function updateTimer() {
  timerDisplay.textContent = `残り${timeLeft}秒`;
}

function nextProblem() {
  const current = problemList[currentIndex % problemList.length];
  currentProblem = current;
  currentKana = current.kana;
  kanjiText.textContent = current.kanji;
  kanaText.textContent = current.kana;
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
  inputBox.style.display = "none";

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
  inputBox.blur();
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
  startGame();
});

restartButton.addEventListener("click", () => {
  inputBox.style.display = "inline-block";
  startGame();
});

muteButton.addEventListener("click", toggleMute);
inputBox.addEventListener("input", handleInput);
document.addEventListener("click", () => inputBox.focus());
