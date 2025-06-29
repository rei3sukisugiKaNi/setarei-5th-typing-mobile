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
let bgm = new Audio("bgm.mp3");
bgm.loop = true;
bgm.volume = 0.001;

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

const progressContainer = document.createElement("div");
progressContainer.id = "progress-container";
progressContainer.style.cssText = `
  position: absolute;
  bottom: 5%;
  left: 5%;
  width: 90%;
  height: 6px;
  background-color: #eee;
  border-radius: 3px;
  overflow: hidden;
  display: none;
  z-index: 1;
`;
const progressBar = document.createElement("div");
progressBar.id = "progress-bar";
progressBar.style.cssText = `
  width: 0%;
  height: 100%;
  background-color: red;
  transition: width 1s linear;
`;
progressContainer.appendChild(progressBar);
document.getElementById("gameScreen").appendChild(progressContainer);

function shuffleArray(array) {
  const copied = [...array];
  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}
function adjustedLength(text) {
  return text.split('').reduce((sum, char) => {
    return sum + (/[ゃゅょぁぃぅぇぉっ]/.test(char) ? 0.5 : 1);
  }, 0);
}

function startGame() {
  titleScreen.style.display = "none";
  gameScreen.style.display = "block";
  resultDisplay.innerHTML = "";
  restartButton.style.display = "none";
  inputBox.style.display = "inline-block";
  progressContainer.style.display = "block"; 

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

  progressBar.style.width = "0%"; 
  let elapsed = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    elapsed++;
    updateTimer();
    progressBar.style.width = `${(elapsed / 60) * 100}%`;
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

  const len = adjustedLength(currentProblem.kanji);
  if (len <= 13) {
    kanjiText.style.fontSize = "1.6rem";
  } else if (len <= 15) {
    kanjiText.style.fontSize = "1.4rem";
  } else if (len <= 16) {
    kanjiText.style.fontSize = "1.3rem";
  } else {
    kanjiText.style.fontSize = "1.6rem";
  }
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
  const typedChar = typed.slice(-1);

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
  inputBox.value = "";
}

function endGame() {
  inputBox.style.display = "none";
  kanjiText.textContent = "";
  kanaText.textContent = "";
  progressBar.style.width = "100%"; 

  const speed = (score / 60).toFixed(2);
  let rank = "C";
  if (score >= 210) rank = "S";
  else if (score >= 180) rank = "A";
  else if (score >= 150) rank = "B";

  resultDisplay.innerHTML = `<span class="rank">ランク: ${rank}</span><br>
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
