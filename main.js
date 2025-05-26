// main.js(PC風判定)完成版

import { problemList } from './problems.js';

let currentIndex = 0;
let currentProblem = null;
let currentKana = "";
let inputIndex = 0;
let score = 0;
let miss = 0;
let timeLeft = 60;
let timer;
let bgmPlaying = true;
let bgm = new Audio("./assets/bgm.mp3");
bgm.loop = true;
bgm.volume = 0.3;

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const gameScreen = document.getElementById("gameScreen");
const titleScreen = document.getElementById("titleScreen");
const kanaText = document.getElementById("kanaText");
const kanjiText = document.getElementById("kanjiText");
const inputBox = document.getElementById("inputBox");
const timerDisplay = document.getElementById("small-timer");
const resultDisplay = document.getElementById("result");
const muteButton = document.getElementById("muteButton");

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
  inputBox.style.display = "inline-block";

  score = 0;
  miss = 0;
  timeLeft = 60;
  currentIndex = 0;
  inputIndex = 0;
  currentKana = "";
  currentProblem = null;

  const rest = problemList.slice(1);
  shuffledProblems = shuffleArray(rest);

  bgm.play();
  bgm.muted = !bgmPlaying;
  updateMuteButton();

  nextProblem();
  updateTimer();
  inputBox.value = "";
  inputBox.focus();

  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

function updateTimer() {
  timerDisplay.textContent = `残り${timeLeft}秒`;
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
  inputIndex = 0;
  kanjiText.textContent = currentProblem.kanji;
  kanaText.innerHTML = highlightKana(currentKana, inputIndex);
  inputBox.value = "";
  inputBox.focus();
  currentIndex++;
}

function highlightKana(kana, index) {
  return kana
    .split('')
    .map((char, i) => i < index ? `<span style="color: gray;">${char}</span>` : char)
    .join('');
}

function handleInput(e) {
  const typed = e.target.value.normalize("NFC").trim();
  const expected = currentKana[inputIndex];
  const typedChar = typed.slice(-1); // 最後に入力された1文字だけ判定

  if (typedChar === expected) {
    score++;
    inputIndex++;
    kanaText.innerHTML = highlightKana(currentKana, inputIndex);
    if (inputIndex >= currentKana.length) {
      nextProblem();
    }
  } else if (typed.length > 0) {
    miss++;
  }

  // 入力欄は常に空にして1文字ずつ打ち直させる
  inputBox.value = "";
}

function endGame() {
  inputBox.style.display = "none";
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
  document.addEventListener("click", () => inputBox.focus());
  startGame();
});

restartButton.addEventListener("click", () => {
  document.addEventListener("click", () => inputBox.focus());
  startGame();
});

muteButton.addEventListener("click", toggleMute);
inputBox.addEventListener("input", handleInput);
