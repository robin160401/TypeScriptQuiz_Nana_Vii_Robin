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

// ! neue variable zum anzeigen für error o. falsch/richtig
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
  easyQuestions = await fetchQuestions("easy");
  showQuestions(easyQuestions);
});

hardButton.addEventListener("click", async (event: Event) => {
  event.preventDefault();
  hardQuestions = await fetchQuestions("hard");
  showQuestions(hardQuestions);
});

// ! ich hab mich doof gesucht um die fetchFNs zu verkürzen = ternary operator!!
// - sorry Robin, aber ich find den Code so schöner 😂

async function fetchQuestions(difficulty: string): Promise<IQuestion[]> {
  const url = de // ? de aus zeile 45
    ? // ? wenn de = true dann -> leicht oder schwer
      `${baseURL}${difficulty === "easy" ? "leicht.json" : "schwer.json"}`
    : // ? wenn de = false -> easy & hard aus dem easyButton & hardButton ⬆️
      `${baseURL}${difficulty}.json`;
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

// ? showQuestions() ist an eine logischere Stelle gerutscht (nach fetch)

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
  // removeScore();
  questionElement.textContent = question.question;
  answer1.textContent = question.answers[0];
  answer2.textContent = question.answers[1];
  answer3.textContent = question.answers[2];
  answer4.textContent = question.answers[3];

  const correctIndex = question.correct;
  let chosenIndex: number | undefined = undefined; //? wenn der uns undefined ausspuckt, kann er auch undefined sein  - außerdem hat er so nicht mehr nach Frage 5 abgebrochen

  // ? beim googlen gefunden, angepasst, funktioniert! warum, keine ahnung
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
        scoreTag.textContent = "Correct!"; //? hier könnte man wieder ein if else für deutsch und englisch machen, hatte ich aber keine Lust mehr zu!
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
  saveHighscore(userScore);
}

// - Save highscore

function saveHighscore(score: number) {
  const highScores = JSON.parse(localStorage.getItem("highscores") || "[]");
  highScores.push({ name: userName, score: score });
  localStorage.setItem("highscores", JSON.stringify(highScores));
}

// - Remove score
// -brauchen wir gar nicht mehr
// function removeScore() {
//   resultsContainer.innerHTML = "";
// }
