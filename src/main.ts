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
  inputUserName,
  language,
  questionElement,
  questionsContainer,
  restartBtn,
  resultsContainer,
  sendButton,
  startContainer,
} from "./importIDs/ids";

type User = {
  userName: string;
  userScore: number;
}

// Base URL zum späteren fetchen

const baseURL = "https://vz-wd-24-01.github.io/typescript-quiz/questions/";

// Alle HTML Elemente ausblenden

startContainer.style.display = "none";
questionsContainer.style.display = "none";
answersContainer.style.display = "none";
resultsContainer.style.display = "none";
restartBtn.style.display = "none";

// Spätere Variablen Deklarieren

let i = 0;
let de: boolean = false;
let userName = "";
let userScore = 0;

const scoreTag = document.createElement("p")

// Buttons um die Sprache auszuwählen und die Buttons für den Schwierigkeitsgrad anzuzeigen

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

// Je nach schwierigkeitsgrad die richtigen fragen in der richtigen Sprache fetchen

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

// Container für Fragen einblenden und Fragen aufrufen

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

// Frage Anzeigen und ändern

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
      answer.style.backgroundColor = "#66eea8";
    };
  });

  // Ausgeählte Frage absenden und abgleichen falls richtig gibt es einen Punkt
  // Counter hochzählen um zur nächsten Frage zu springen so lange bis es keine mehr gibt


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

// Endergebnis einblenden, Scores im Locale Storage speichern

function showResults() {
  questionElement.style.display = "none";
  answersContainer.style.display = "none";
  sendButton.style.display = "none";
  resultsContainer.style.display = "block";
  restartBtn.style.display = "block";
  resultsContainer.innerHTML = `<h4>Your result: ${userScore}</h4>`;
  const actualUser: User = {userName, userScore}
  const highScoreList = saveScoresReturnArray(actualUser);
  for (let i= 0; i < 10; i++){
    const newPtag = document.createElement("p");
    newPtag.textContent = `${highScoreList[i].userName} had ${highScoreList[i].userScore} Points`;
    resultsContainer.appendChild(newPtag);
  }
}

function saveScoresReturnArray(user: User): User[] {
  const scores: User[] = JSON.parse(localStorage.getItem("highscores") || "[]");
  scores.push(user);
  localStorage.setItem("highscores", JSON.stringify(scores));
  const sortedScores = scores.sort((a: User, b: User) => b.userScore - a.userScore);
  return sortedScores;
}