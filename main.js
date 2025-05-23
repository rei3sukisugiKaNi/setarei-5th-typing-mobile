// main.js
import { problemList } from './problems.js';

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const titleScreen = document.getElementById("titleScreen");
const gameScreen = document.getElementById("gameScreen");
const kanjiText = document.getElementById("kanjiText");
const kanaText = document.getElementById("kanaText");
const inputBox = document.getElementById("inputBox");
const resultDisplay = document.getElementById("result");
const timerDisplay = document.getElementById("small-timer");
const muteButton = document.getElementById("muteButton");

let currentIndex = 0;
let currentProblem = null;
let score = 0;
let miss = 0;
let timeLeft = 60;
let timer = null;
let bgm = new Audio("./assets/bgm.mp3");
bgm.loop = true;
let bgmPlaying = true;

function startGame() {
  titleScreen.style.display = "none";
  gameScreen.style.display = "block";
  resultDisplay.innerHTML = "";
  restartButton.style.display = "none";
  inputBox.value = "";
  inputBox.focus();

  score = 0;
  miss = 0;
  currentIndex = 0;
  timeLeft = 60;
  timerDisplay.textContent = timeLeft;

  bgm.play();
  bgm.muted = false;
  bgmPlaying = true;
  updateMuteButton();

  nextProblem();

  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

function nextProblem() {
  if (currentIndex === 0) {
    currentProblem = problemList[0];
  } else {
    const rest = problemList.slice(1);
    currentProblem = rest[Math.floor(Math.random() * rest.length)];
  }
  kanjiText.textContent = currentProblem.kanji;
  kanaText.textContent = currentProblem.kana;
  inputBox.value = "";
  inputBox.focus();
  currentIndex++;
}

function handleInput() {
  const typed = inputBox.value.trim();
  if (typed === currentProblem.kana) {
    score += currentProblem.kana.length;
    nextProblem();
  } else if (!currentProblem.kana.startsWith(typed)) {
    miss++;
  }
}

function endGame() {
  kanjiText.textContent = "";
  kanaText.textContent = "";
  inputBox.blur();

  let rank = "C";
  if (score >= 270) rank = "S";
  else if (score >= 220) rank = "A";
  else if (score >= 170) rank = "B";

  const speed = (score / 60).toFixed(2);

  resultDisplay.innerHTML = `おつかれさまでした<br>
    <span class="rank">ランク: ${rank}</span><br>
    正しく打ったキー: ${score}<br>
    ミスタイプ: ${miss}<br>
    平均タイプ数: ${speed} 回/秒`;

  restartButton.style.display = "inline-block";
}

function toggleMute() {
  bgmPlaying = !bgmPlaying;
  bgm.muted = !bgmPlaying;
  updateMuteButton();
}

function updateMuteButton() {
  muteButton.textContent = bgmPlaying ? "BGM: OFF" : "BGM: ON";
}

startButton.addEventListener("click", () => {
  document.addEventListener("click", () => inputBox.focus());
  startGame();
});

restartButton.addEventListener("click", () => {
  document.addEventListener("click", () => inputBox.focus());
  startGame();
});

inputBox.addEventListener("input", handleInput);
muteButton.addEventListener("click", toggleMute);
