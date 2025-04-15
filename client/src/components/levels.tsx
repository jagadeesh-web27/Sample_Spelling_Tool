import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./levels.css";

interface Word {
  hint: string;
  word: string;
}

interface Sentence {
  hint: string;
  sentence: string;
}

interface Article {
  title: string;
  content: string;
}

interface Level<T> {
  title: string;
  locked: boolean;
  data: T[];
}

const Level: React.FC = () => {
  const { type, levelIndex } = useParams<{ type: string; levelIndex: string }>();
  const [levels, setLevels] = useState<Level<any>[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [wrongResults, setWrongResults] = useState<{ word: string; userAnswer: string }[]>([]);
  const [dataAvailable, setDataAvailable] = useState(true);
  const [isPlaying, setIsPlaying] = useState<{ [key: number]: boolean }>({});
  const navigate = useNavigate();
  //const [showNextExercisePopup, setShowNextExercisePopup] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [showNextExercisePopup, setShowNextExercisePopup] = useState(false);

  const levelHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (type && levelIndex) {
      axios.get(`http://localhost:4001/levels`)
        .then((response) => {
          if (response.data[0][type]) {
            let fetchedLevels = response.data[0][type];
            const storedProgress = JSON.parse(localStorage.getItem("unlockedLevels") || "{}");
            fetchedLevels = fetchedLevels.map((level: Level<any>, index: number) => ({
              ...level,
              locked: index === 0 ? false : !(storedProgress[`${type}-${index}`] || false),
            }));

            setLevels(fetchedLevels);
            setCurrentLevel(parseInt(levelIndex));
          } else {
            setDataAvailable(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching levels:", error);
          setDataAvailable(false);
        });
    }
  }, [type, levelIndex]);

  useEffect(() => {
    if (currentLevel !== null && levels.length > 0 && levels[currentLevel].locked) {
      setCurrentLevel(0);
    }
  }, [currentLevel, levels]);

  useEffect(() => {
    setAnswers({});
    setCorrectCount(0);
    setWrongCount(0);
    setLevelCompleted(false);
    setWrongResults([]);
  }, [type, levelIndex]);

  useEffect(() => {
    if (levelHeadingRef.current) {
      levelHeadingRef.current.focus();
    }
  }, [currentLevel]);

  const handleAnswerChange = (index: number, userAnswer: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [index]: userAnswer,
    }));
  };

  const handleAnswerBlur = (index: number) => {
    if (currentLevel === null || !levels[currentLevel]) return;

    const userAnswer = answers[index];
    const correctAnswer = levels[currentLevel].data[index]?.word || levels[currentLevel].data[index]?.sentence || levels[currentLevel].data[index]?.content;

    if (userAnswer === undefined || !correctAnswer) return;

    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      setCorrectCount((prevCount) => prevCount + 1);
    } else {
      setWrongCount((prevCount) => prevCount + 1);
      setWrongResults((prevResults) => [...prevResults, { word: correctAnswer, userAnswer: userAnswer || "" }]);
    }
  };

  const handleLevelCompletion = () => {
    setLevelCompleted(true);
    const updatedLevels = [...levels];

    if (currentLevel !== null) {
      if (currentLevel < levels.length - 1) {
        updatedLevels[currentLevel + 1].locked = false;
        localStorage.setItem("unlockedLevels", JSON.stringify({
          ...JSON.parse(localStorage.getItem("unlockedLevels") || "{}"),
          [`${type}-${currentLevel + 1}`]: true,
        }));
      }
      setLevels(updatedLevels);
    }
    const existingScores = JSON.parse(localStorage.getItem("scores") || "[]");
    const category = type || "Unknown";
    const totalQuestions = currentLevel !== null ? levels[currentLevel]?.data.length || 0 : 0;

    const categoryIndex = existingScores.findIndex((score: any) => score.category === category);

    if (categoryIndex !== -1) {
      existingScores[categoryIndex].correct += correctCount;
      existingScores[categoryIndex].total += totalQuestions;
    } else {
      existingScores.push({
        category: category,
        correct: correctCount,
        total: totalQuestions,
      });
    }

    localStorage.setItem("scores", JSON.stringify(existingScores));
  };

  const resetProgress = () => {
    localStorage.removeItem("unlockedLevels");
    localStorage.removeItem("scores");
    const resetLevels = levels.map((level, index) => ({ ...level, locked: index !== 0 }));
    setLevels(resetLevels);
    setCurrentLevel(0);
  };

  const handleReadOut = (index: number, text: string, mode: "normal" | "slow" | "spell" = "normal") => {
    const utterance = new SpeechSynthesisUtterance(text);
  
    // Handle different reading modes
    if (mode === "slow") {
      utterance.rate = 0.4; // Slow speed
    } else if (mode === "spell") {
      utterance.text = text.split("").join(" "); // Spaces between letters
      utterance.rate = 0.6;
    }
  
    utterance.onstart = () => {
      setIsPlaying((prevState) => ({ ...prevState, [index]: true }));
    };
    utterance.onend = () => {
      setIsPlaying((prevState) => ({ ...prevState, [index]: false }));
    };
  
    speechSynthesis.speak(utterance);
  };
  const handleNextLevel = () => {
    if (currentLevel !== null && currentLevel < levels.length - 1) {
      // Move to the next level
      navigate(`/${type}/level/${currentLevel + 1}`);
    } else {
      // Show the popup for next exercise
      setShowNextExercisePopup(true);
    }
  };
  const getNextExerciseType = () => {
    setShowNextExercisePopup(false); // Ensure popup closes before switching exercise
  
    const exerciseOrder = ["words", "sentences", "articles", "tenses"];
    const currentIndex = exerciseOrder.indexOf(type || "");
  
    return currentIndex !== -1 && currentIndex < exerciseOrder.length - 1
      ? exerciseOrder[currentIndex + 1]
      : exerciseOrder[0]; // If all exercises are completed, restart from "words"
  };
  
  useEffect(() => {
    if (showNextExercisePopup && popupRef.current) {
      const focusableElements = popupRef.current.querySelectorAll("button");
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus(); // Move focus to the first button
      }
  
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault(); // Prevent default popup closing
          //closeButtonRef.current?.focus(); // Move focus to "Stay Here" button
          setShowNextExercisePopup(false); // Close the popup
        }
  
        // Trap focus inside the popup
        const focusable = Array.from(popupRef.current!.querySelectorAll("button")) as HTMLElement[];
        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];
  
        if (event.key === "Tab") {
          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [showNextExercisePopup]); 
  const handleClosePopup = () => {
    setShowNextExercisePopup(false);
    closeButtonRef.current?.focus();
  };

  return (
    <div className="level-container">
      <nav aria-label="Breadcrumb">
        <Link to="/">Home</Link> / 
        {type && <Link to={`/${type}`}>{type.charAt(0).toUpperCase() + type.slice(1)}</Link>} / 
        Level {currentLevel !== null ? currentLevel + 1 : ""}
      </nav>
  
      <div className="button-container">
        <button 
          className={type === "words" ? "active" : ""} 
          onClick={() => navigate("/words/level/0")}
          aria-pressed={type === "words"}
          tabIndex={0}
        >
          Words
        </button>
        <button 
          className={type === "sentences" ? "active" : ""} 
          onClick={() => navigate("/sentences/level/0")}
          aria-pressed={type === "sentences"}
          tabIndex={0}
        >
          Sentences
        </button>
        <button 
          className={type === "articles" ? "active" : ""} 
          onClick={() => navigate("/articles/level/0")}
          aria-pressed={type === "articles"}
          tabIndex={0}
        >
          Articles
        </button>
      </div>
  
      {currentLevel !== null && levels[currentLevel] && (
        <div className="level-content">
          <h2 ref={levelHeadingRef} tabIndex={0}>{levels[currentLevel].title}</h2>
          {dataAvailable ? (
            <ul>
              {levels[currentLevel].data.map((item, index) => (
                <li key={index} className="level-item" tabIndex={0}>
                  <p>
                    {item.hint}
                    {/* Spell Out Letter by Letter */}
                    <span
                      onClick={() => handleReadOut(index, item.sentence || item.word || item.content, "spell")}
                      className="speaker-icon"
                      tabIndex={0}
                      role="button"
                      aria-label={`Spell out ${item.sentence || item.word || item.content} letter by letter`}
                    >
                      🔡
                    </span>
                  </p>
                  
                  <div className="input-container">
                    <input
                      type="text"
                      placeholder="Enter answer"
                      value={answers[index] || ""}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      onBlur={() => handleAnswerBlur(index)}
                      className="next-line-input"
                      tabIndex={0}
                      aria-label={`Answer input for ${item.hint}`}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p tabIndex={0}>No data available for this level.</p>
          )}
  
          {!levelCompleted && dataAvailable && (
            <button onClick={handleLevelCompletion} tabIndex={0} aria-label="Complete Level">
              {currentLevel < levels.length - 1 ? "Finish Level" : "Complete Level"}
            </button>
          )}
  
          {levelCompleted && (
            <div className="results" aria-live="polite">
              <h2 tabIndex={0}>Results for {levels[currentLevel].title}</h2>
              <p tabIndex={0}>Correct Answers: {correctCount}</p>
              <p tabIndex={0}>Wrong Answers: {wrongCount}</p>
              <ul>
                {wrongResults.map((result, index) => (
                  <li key={index} tabIndex={0}>
                    <p>Answer: {result.word} - Your Answer: {result.userAnswer} - Wrong</p>
                  </li>
                ))}
              </ul>
              <button onClick={handleNextLevel} tabIndex={0} aria-label="Go to next level">Next Level</button>
            </div>
          )}
        </div>
      )}
      <button onClick={resetProgress} tabIndex={0} aria-label="Reset Progress">Reset Progress</button>
      {showNextExercisePopup && (
  <div
    className="popup"
    role="dialog"
    aria-labelledby="popup-title"
    aria-describedby="popup-description"
    aria-modal="true"
    ref={popupRef}
  >
    <div className="popup-content">
      <h3 id="popup-title" tabIndex={-1}>Congratulations! You've completed all levels.</h3>
      <p id="popup-description" tabIndex={-1}>Would you like to proceed to the next exercise?</p>
      <button onClick={() => navigate(`/${getNextExerciseType()}/level/0`)} tabIndex={0}>
        Next Exercise
      </button>
      <button onClick={handleClosePopup} ref={closeButtonRef}>
        Stay Here
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default Level;