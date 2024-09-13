import { IQuestion } from "./Interfaces/IQuestions";
import "./importIDs/ids";
import {
  answer1,
  answer2,
  answer3,
  answer4,
  answersContainer,
  deButton,
  difficultyText,
  easyButton,
  enButton,
  hardButton,
  highscore,
  inputUserName,
  language,
  questionElement,
  questionsContainer,
  restartBtn,
  resultsContainer,
  sendButton,
  startContainer,
} from "./importIDs/ids";

const baseURL = "https://vz-wd-24-01.github.io/typescript-quiz/questions/";

startContainer.style.display = "none";
questionsContainer.style.display = "none";
answersContainer.style.display = "none";
resultsContainer.style.display = "none";
restartBtn.style.display = "none";

let i = 0;
let de: boolean = false;
let userName = "";
let userScore = 0;

const scoreTag = document.getElementById("scoreTag") as HTMLParagraphElement;

// - language / difficulty buttons

deButton.addEventListener("click", (event: Event) => {
  event.preventDefault();
  language.style.display = "none";
  startContainer.style.display = "block";
  inputUserName.placeholder = "Gib deinen Namen ein";
  difficultyText.textContent = "Wähle einen Schwierigkeitsgrad aus";
  easyButton.textContent = "Leicht";
  hardButton.textContent = "Schwer";
  de = true;
});

enButton.addEventListener("click", (event: Event) => {
  event.preventDefault();
  language.style.display = "none";
  startContainer.style.display = "block";
});

// - Fetch questions

let hardQuestions: IQuestion[] = [];
let easyQuestions: IQuestion[] = [];

easyButton.addEventListener("click", async (event: Event) => {
  event.preventDefault();
  userName = inputUserName.value;
  easyQuestions = await fetchQuestions("easy");
  showQuestions(easyQuestions);
});

hardButton.addEventListener("click", async (event: Event) => {
  event.preventDefault();
  userName = inputUserName.value;
  hardQuestions = await fetchQuestions("hard");
  showQuestions(hardQuestions);
});

async function fetchQuestions(difficulty: string): Promise<IQuestion[]> {
  const url = de
    ? `${baseURL}${difficulty === "easy" ? "leicht.json" : "schwer.json"}`
    : `${baseURL}${difficulty}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    scoreTag.textContent = `Fetch error:", ${error}`;
    return [];
  }
}

// - Show questions

function showQuestions(questions: IQuestion[]) {
  if (questions.length === 0) {
    scoreTag.textContent = "Keine Fragen verfügbar.";
    return;
  }
  questionsContainer.style.display = "block";
  answersContainer.style.display = "block";
  startContainer.style.display = "none";
  changeQuestion(questions[i], questions);
}

// - Change questions

function changeQuestion(question: IQuestion, questions: IQuestion[]) {
  questionElement.textContent = question.question;
  answer1.textContent = question.answers[0];
  answer2.textContent = question.answers[1];
  answer3.textContent = question.answers[2];
  answer4.textContent = question.answers[3];

  const correctIndex = question.correct;
  let chosenIndex: number | undefined = undefined;

  [answer1, answer2, answer3, answer4].forEach((answer, index) => {
    answer.onclick = () => {
      chosenIndex = index;
    };
  });

  sendButton.onclick = () => {
    if (chosenIndex !== undefined) {
      if (chosenIndex === correctIndex) {
        userScore++;
        console.log(userScore);
        scoreTag.textContent = "Correct!";
      } else {
        scoreTag.textContent = "Wrong!";
      }
      i++;
      if (i < questions.length) {
        changeQuestion(questions[i], questions);
      } else {
        showResults();
      }
    }
  };
}

// - Show results

function showResults() {
  questionElement.style.display = "none";
  answersContainer.style.display = "none";
  sendButton.style.display = "none";
  resultsContainer.style.display = "block";
  restartBtn.style.display = "block";
  resultsContainer.innerHTML = `<h4>Your result: ${userScore}</h4>`;
  scoreTag.textContent = "";
  const actualUser: User = {userName, userScore}
  const highScore = saveScoresReturnHighScore(actualUser);
  const newPtag = document.createElement("p");
  newPtag.textContent = `your highscore is ${highScore}`;
  resultsContainer.appendChild(newPtag);
  console.log(`your highscore is ${highScore}`);
  // highscore.textContent += " " + highScore.toString();
}

// - Save highscore

type User = {
  userName: string;
  userScore: number;
}

function saveScoresReturnHighScore(user: User): Number {
  const scores: User[] = JSON.parse(localStorage.getItem("highscores") || "[]");
  scores.push(user);
  localStorage.setItem("highscores", JSON.stringify(scores));
  let highestScore = 0;
  scores.forEach((user: User) => {
    if (user.userScore > highestScore) {
      highestScore = user.userScore;
    }
  });
  return highestScore;
}

