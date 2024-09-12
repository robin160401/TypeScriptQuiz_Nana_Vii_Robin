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
  resultsContainer,
  sendButton,
  startContainer,
} from "./importIDs/ids";

const baseURL = "https://vz-wd-24-01.github.io/typescript-quiz/questions/";

startContainer.style.display = "none";
questionsContainer.style.display = "none";
answersContainer.style.display = "none";
resultsContainer.style.display = "none";

let i = 0;
let de: boolean = false;
let userName = "";
const userPoints: number[] = [];
const userHighScore: number = 0;
let userScore = 0;

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

easyButton.addEventListener("click", async (event: Event) => {
  event.preventDefault();
  easyQuestions = await fetchEasyData();
  showQuestions(easyQuestions);
});

hardButton.addEventListener("click", async (event: Event) => {
  event.preventDefault();
  hardQuestions = await fetchHardData();
  showQuestions(hardQuestions);
});

let hardQuestions: IQuestion[] = [];
let easyQuestions: IQuestion[] = [];

// - fetch function

function showQuestions(questions: IQuestion[]){
  questionsContainer.style.display = "block";
  answersContainer.style.display = "block";
  startContainer.style.display = "none";
  changeQuestion(questions[0], questions);
}

async function fetchEasyData(): Promise<IQuestion[]> {
  if (de) {
    try {
      const response = await fetch(`${baseURL}leicht.json`);
      let data = await response.json();
      data.forEach((question: IQuestion) => {
        easyQuestions.push(question);
      });
    } catch (error) {}
  } else {
    try {
      const response = await fetch(`${baseURL}easy.json`);
      let data = await response.json();
      data.forEach((question: IQuestion) => {
        easyQuestions.push(question);
      });
    } catch (error) {}
  }
  return easyQuestions;
}

async function fetchHardData(): Promise<IQuestion[]> {
  if (de) {
    try {
      const response = await fetch(`${baseURL}schwer.json`);
      let data = await response.json();
      data.forEach((question: IQuestion) => {
        hardQuestions.push(question);
      });
    } catch (error) {}
  } else {
    try {
      const response = await fetch(`${baseURL}hard.json`);
      let data = await response.json();
      data.forEach((question: IQuestion) => {
        hardQuestions.push(question);
      });
    } catch (error) {}
  }
  return hardQuestions;
}

// - eventlistener p-tags

function changeQuestion(question: IQuestion, questions: IQuestion[]){
  removeScore();
  console.log(question);
    let chosenIndex: number;
    const correctIndex = question.correct;
    questionElement.textContent = question.question;
    answer1.textContent = question.answers[0];
    answer2.textContent = question.answers[1];
    answer3.textContent = question.answers[2];
    answer4.textContent = question.answers[3];
    answer1.addEventListener("click", () => {
      chosenIndex = 0;
    });
    answer2.addEventListener("click", () => {
      chosenIndex = 1;
    });
    answer3.addEventListener("click", () => {
      chosenIndex = 2;
    });
    answer4.addEventListener("click", () => {
      chosenIndex = 3;
    });
    sendButton.addEventListener("click", () => {
      console.log(chosenIndex);
      if (chosenIndex === correctIndex) {
        userScore++;
      }
      i++;
      changeQuestion(questions[i], questions);
      const score = document.createElement("p");
      score.setAttribute("class", "delete")
      resultsContainer.style.display = "block";
      score.textContent = userScore.toString();
      resultsContainer.appendChild(score);
    })
}

function removeScore(){
  const remove = document.querySelectorAll(".delete");
  remove.forEach((element) => {
    element.remove();
  })
}