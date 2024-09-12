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

easyButton.addEventListener("click", (event: Event) => {
  event.preventDefault();
  const easyQuestions: IQuestion[] = fetchEasyData();
  showQuestions(easyQuestions);
});
hardButton.addEventListener("click", async (event: Event) => {
  event.preventDefault();
  hardQuestions = await fetchHardData();
  showQuestions(hardQuestions);
});

let hardQuestions: IQuestion[] = [];

function showQuestions(questions: IQuestion[]) {
  questionsContainer.style.display = "block";
  answersContainer.style.display = "block";
  startContainer.style.display = "none";

  questions.forEach((question: IQuestion) => {
    console.log(question);
    let chosenIndex = 5;
    const correctIndex = question.correct;
    questionElement.textContent = question.question;
    console.log(question.question[2]);
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
    console.log(chosenIndex);
    sendButton.addEventListener("click", () => {
      if (chosenIndex === correctIndex) {
        userScore++;
      }
    });
  });
}

function fetchEasyData(): IQuestion[] {
  userName = inputUserName.value;
  const easyQuestions: IQuestion[] = [];
  if (de) {
    fetch(`${baseURL}leicht.json`)
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error("No response");
        }
        return response.json();
      })
      .then((data: any) => {
        data.forEach((data: IQuestion) => {
          easyQuestions.push(data);
        });
      });
  } else {
    fetch(`${baseURL}easy.json`)
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error("No response");
        }
        return response.json();
      })
      .then((data: any) => {
        data.forEach((data: IQuestion) => {
          easyQuestions.push(data);
        });
      });
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
        console.log(hardQuestions);
      });
    } catch (error) {}
  } else {
    fetch(`${baseURL}hard.json`)
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error("No response");
        }
        return response.json();
      })
      .then((data: any) => {
        data.forEach((data: IQuestion) => {
          hardQuestions.push(data);
        });
      });
  }
  return hardQuestions;
}
