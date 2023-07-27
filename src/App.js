import React, { useState, useEffect } from "react";
import questions from "./questions.json";
import "./App.css";

const QuizApp = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showNextButton, setShowNextButton] = useState(false);
  const [shuffledChoices, setShuffledChoices] = useState([]);
  const [questionsAttempted, setQuestionsAttempted] = useState(0);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.length) {
      setSelectedChoice("");
      setShowNextButton(false); 
      setFeedbackMessage("");

      const currentQuestion = questions[currentQuestionIndex];
      const shuffledChoices = shuffleArray([
        ...currentQuestion.incorrect_answers,
        currentQuestion.correct_answer,
      ]);
      setShuffledChoices(shuffledChoices);
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
  
    setQuestionsAttempted(currentQuestionIndex + 1);
  }, [currentQuestionIndex]);

  const handleChoiceSelection = (event) => {
    setSelectedChoice(event.target.value);
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedChoice === currentQuestion.correct_answer) {
      setScore((prevScore) => prevScore + 1);
    }
    setSelectedChoice("");
    setShowNextButton(false);
    setFeedbackMessage("");
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="container">
        <div className="quiz-box">
          <h1>Quiz Completed!</h1>
          <p>Your final score is: {score}</p>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${(score / questions.length) * 100}%` }}
            ></div>
          </div>
          <p>Score: {score}/{questions.length}</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    
    <div className="container">
      <div className="quiz-box1">
        <div className="progress-bar-top">
          <div
            className="progress-bar-fill-top"
            style={{ width: `${(questionsAttempted / questions.length) * 100}%` }}
          ></div>
        </div>
        <div className="quiz-box">
        <div className="difficulty-level">
          {currentQuestion.difficulty === "easy" && "★☆☆☆☆"}
          {currentQuestion.difficulty === "medium" && "★★☆☆☆"}
          {currentQuestion.difficulty === "hard" && "★★★☆☆"}
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${(score / questions.length) * 100}%` }}
          ></div>
        </div>
        <div className="question-info">
          <p>
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <p>{decodeURIComponent(currentQuestion.category)}</p>
        </div>
        <div className="question-container">
          <p>{decodeURIComponent(currentQuestion.question)}</p>
          <ul>
            {shuffledChoices.map((choice, index) => (
              <li key={index}>
                <input
                  type="radio"
                  name="choice"
                  value={choice}
                  id={`choice-${index}`}
                  checked={selectedChoice === choice}
                  onChange={handleChoiceSelection}
                />
                <label
                  htmlFor={`choice-${index}`}
                  className={selectedChoice === choice ? "selected" : ""}
                >
                  {decodeURIComponent(choice)}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="feedback">
          <p>{feedbackMessage}</p>
          {showNextButton && (
            <button onClick={handleNextQuestion}>Next Question</button>
          )}
        </div>
        {!showNextButton && (
          <button
            onClick={() => {
              if (selectedChoice === currentQuestion.correct_answer) {
                setFeedbackMessage("Correct!");
              } else {
                setFeedbackMessage("Sorry. Please try again.");
              }
              setShowNextButton(true);
            }}
          >
            Submit
          </button>
        )}
      </div>
      </div>
    </div>
  );
};

export default QuizApp;
