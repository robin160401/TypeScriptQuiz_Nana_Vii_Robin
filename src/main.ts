import { IQuestion } from "./Interfaces/IQuestions";
import "./importIDs/ids"
import { answer1, answer2, answer3, answer4, answersContainer, deButton, difficultyText, easyButton, enButton, hardButton, inputUserName, language, questionElement, questionsContainer, resultsContainer, sendButton, startContainer } from "./importIDs/ids";

const baseURL = "https://vz-wd-24-01.github.io/typescript-quiz/questions/";

startContainer.style.display = "none";
questionsContainer.style.display = "none";
answersContainer.style.display = "none";
resultsContainer.style.display = "none";

let de: boolean = false;
let userName = "";
const userPoints: number[] = [];
const userHighScore: number = 0;
let userScore = 0;

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

easyButton.addEventListener("click", () => {
  const easyQuestions: IQuestion[] = fetchEasyData();
  console.log(easyQuestions)
  console.log(userName);
});
hardButton.addEventListener("click", () => {
  const hardQuestions: IQuestion[] = fetchHardData();
  console.log(hardQuestions);
});

function showQuestions(questions: IQuestion[]){
  questionsContainer.style.display = "block";
  startContainer.style.display = "none";
  questions.forEach((question: IQuestion) => {
    let buttonPressed: boolean = false;
    let chosenIndex = 5;
    const correctIndex = question.correct;
    questionElement.textContent = question.question;
    answer1.textContent = question.answer[0];
    answer2.textContent = question.answer[1];
    answer3.textContent = question.answer[2];
    answer4.textContent = question.answer[3];
    answer1.addEventListener("click", () => {
      chosenIndex = 0;
    })
    answer2.addEventListener("click", () => {
      chosenIndex = 1;
    })
    answer3.addEventListener("click", () => {
      chosenIndex = 2;
    })
    answer4.addEventListener("click", () => {
      chosenIndex = 3;
    })
    sendButton.addEventListener("click", () => {
      if (chosenIndex === correctIndex){
        userScore++;
        buttonPressed = true;
      }
    })
    
  })
}

function fetchEasyData(): IQuestion[]{
  userName = inputUserName.value;
  const easyQuestions: IQuestion[] = [];
  if (de){
    fetch(`${baseURL}leicht.json`)
      .then((response: Response) => {
        if(!response.ok){
          throw new Error ("No response");
        }
        return response.json();
      })
      .then((data: any) => {
        data.forEach((data: IQuestion) => {
          easyQuestions.push(data);
        })
      })
  }
  else {
    fetch(`${baseURL}easy.json`)
      .then((response: Response) => {
        if(!response.ok){
          throw new Error ("No response");
        }
        return response.json();
      })
      .then((data: any) => {
        data.forEach((data: IQuestion) => {
          easyQuestions.push(data);
        })
      })
  }
  return easyQuestions;
}

function fetchHardData(): IQuestion[]{
  const hardQuestions: IQuestion[] = [];
  if (de){
    fetch(`${baseURL}schwer.json`)
      .then((response: Response) => {
        if(!response.ok){
          throw new Error ("No response");
        }
        return response.json();
      })
      .then((data: any) => {
        data.forEach((data: IQuestion) => {
          hardQuestions.push(data);
        })
      })
  }
  else {
    fetch(`${baseURL}hard.json`)
      .then((response: Response) => {
        if(!response.ok){
          throw new Error ("No response");
        }
        return response.json();
      })
      .then((data: any) => {
        data.forEach((data: IQuestion) => {
          hardQuestions.push(data);
        })
      })
  }
  return hardQuestions;
}