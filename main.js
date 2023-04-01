const timeEl = document.getElementById("time");
const levelEl = document.getElementById("level");

const ovalMessangers = document.querySelectorAll(".oval");

const number_1 = document.getElementById("number1");
const number_2 = document.getElementById("number2");
const operationElm = document.getElementById("operation");
const answersContent = document.querySelector(".answers-section");

const overlay = document.querySelector(".overlay");
const newgame = document.querySelector(".newgame");
const correctAnswer = document.querySelector(".correctAnswers");

newgame.addEventListener("click", () => {
  overlay.classList.add("none");

  ovalMessangers.forEach((elm) => {
    elm.classList.remove("failed", "correct", "unchance");
  });

  second = 10;
  LEVEL_COUNTER = 1;
  correct = 0;

  init();
});

// let correctAnswerIndex;

const MAX_NUMBER = 20;
const INTERVAL = 10;
const operations = ["-", "+", "*"];
let answerBtnArray = [];
let LEVEL_COUNTER = 1;
let second = 10;
let correct = 0;
let interval;

// timing functions
function timeGo() {
  let currentecond = second;
  if (currentecond > 60) {
    let minutes = Math.floor(currentecond / 60);
    let seconds = currentecond % 60;

    time.textContent = `time: 0${minutes}:${
      seconds >= 10 ? seconds : "0" + seconds
    }`;
  } else {
    time.textContent = `time: 00:${
      currentecond >= 10 ? currentecond : "0" + currentecond
    }`;
  }

  if (second == 0) {
    clearInterval(interval);
    ovalMessangers[LEVEL_COUNTER - 1].classList.add("unchance");
    if (LEVEL_COUNTER < 10) {
      nextLevel();
    } else {
      resultGame();
    }
  }
  second--;
}

// logic functions;

function randomNumber(max, min = 0) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateAnswers(answer) {
  const answers = [answer];

  for (let i = 1; i <= 3; i++) {
    const randAnswer = randomNumber(answer + INTERVAL, answer - INTERVAL);
    if (!answers.includes(randAnswer)) answers[i] = randAnswer;
    else i--;
  }

  return answers.sort(() => Math.random() - 0.5);
}

function generateQuestion() {
  const number1 = randomNumber(MAX_NUMBER);
  const number2 = randomNumber(MAX_NUMBER);
  const operator = operations[randomNumber(operations.length)];
  const correctAnswer = eval(`${number1} ${operator} ${number2}`);
  const answers = generateAnswers(correctAnswer);
  return {
    number1,
    number2,
    operator,
    correctAnswer,
    answers,
  };
}

// let answer = generateQuestion();

function renderQuestion({
  number1,
  number2,
  operator,
  correctAnswer,
  answers,
}) {
  levelEl.textContent = `level: ${LEVEL_COUNTER}/10`;

  interval = setInterval(timeGo, 1000);
  number_1.textContent = number1;
  number_2.textContent = number2;
  operationElm.textContent = operator;
  let correctAnswerIndex = answers.indexOf(correctAnswer);

  [...answersContent.children].forEach((elm) => elm.remove());
  const fragment = document.createDocumentFragment();

  for (let answer of answers) {
    const answer_btn = document.createElement("button");
    answer_btn.classList.add("answer");
    answer_btn.textContent = answer;
    answerBtnArray.push(answer_btn);
    const checker = answer == correctAnswer;
    answer_btn.addEventListener("click", () =>
      handleAnswer(answer_btn, checker, correctAnswerIndex)
    );
    fragment.appendChild(answer_btn);
  }

  answersContent.appendChild(fragment);
}

function handleAnswer(element, checker, correctAnswerIndex) {
  answerBtnArray.forEach((elm) => elm.classList.add("usernone"));
  element.classList.add(checker ? "correct" : "failed");
  if (checker) correct++;
  answersContent.children[correctAnswerIndex].classList.add("correct");
  ovalMessangers[LEVEL_COUNTER - 1].classList.add(
    checker ? "correct" : "failed"
  );
  if (LEVEL_COUNTER < 10) {
    setTimeout(() => {
      nextLevel(checker);
    }, 1200);
  } else {
    resultGame();
  }
}

function nextLevel(isCorrect) {
  if (isCorrect) {
    second = 11 + second;
  } else {
    second = 8;
  }
  console.log(correct);

  LEVEL_COUNTER++;
  init();
}

function resultGame() {
  console.log(correct);
  clearInterval(interval);
  correctAnswer.textContent = `correct answers: ${correct}/10`;
  setTimeout(() => {
    overlay.classList.remove("none");
  }, 1000);
}

function init() {
  clearInterval(interval);
  const question = generateQuestion();
  renderQuestion(question);
}

init();
