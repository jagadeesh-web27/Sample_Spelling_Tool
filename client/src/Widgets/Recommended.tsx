import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/recommended.css";

interface LevelData {
  hint?: string;
  word?: string;
  sentence?: string;
  content?: string;
  title?: string; // For articles
}

interface LevelFromDB {
  _id: string;
  title: string;
  data: LevelData[];
  locked: boolean; // We will ignore this for recommendation logic
}

interface ApiResponse {
  _id: string;
  words: LevelFromDB[];
  sentences: LevelFromDB[];
  articles: LevelFromDB[];
}

interface Score {
  category: string;
  correct: number;
  total: number;
}

interface RecommendedLevel extends LevelFromDB {
  categoryKey: string;
  levelNumber: number;
  displayTitle: string; // Title to display in the recommendation card
}

const Recommended: React.FC = () => {
  const [lowScoreExercises, setLowScoreExercises] = useState<RecommendedLevel[]>([]);
  const [currentLevel, setCurrentLevel] = useState<RecommendedLevel | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [wrongResults, setWrongResults] = useState<{ word: string; userAnswer: string }[]>([]);
  const [showNextExercisePopup, setShowNextExercisePopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching levels for recommendations based on scores and local unlock status...");
    const storedScores = JSON.parse(localStorage.getItem("scores") || "[]") as Score[];
    const storedProgress = JSON.parse(localStorage.getItem("unlockedLevels") || "{}");
    console.log("Stored Scores:", storedScores);
    console.log("Stored Progress:", storedProgress);

    axios.get<ApiResponse[]>("http://localhost:4001/levels")
      .then((response) => {
        console.log("Levels fetched:", response.data);
        if (response.data && Array.isArray(response.data)) {
          let recommendedLevels: RecommendedLevel[] = [];

          response.data.forEach((categoryObject) => {
            Object.keys(categoryObject).forEach((categoryKey) => {
              const levelsArray = categoryObject[categoryKey as keyof ApiResponse];
              if (Array.isArray(levelsArray)) {
                levelsArray.forEach((level, index) => {
                  const scoreData = storedScores.find((score) => score.category === categoryKey);
                  const isUnlocked = index === 0 || storedProgress[`${categoryKey}-${index}`];
                  const levelNumber = index + 1;
                  const categoryDisplayName = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
                  const displayTitle = `${categoryDisplayName} - Level ${levelNumber}`;

                  if (isUnlocked && scoreData && scoreData.total > 0 && (scoreData.correct / scoreData.total) * 100 < 50) {
                    recommendedLevels.push({
                      ...level,
                      categoryKey,
                      levelNumber,
                      displayTitle,
                      title: level.title, // Keep the original title for fetching
                    });
                  } else if (isUnlocked && !scoreData && index === 0) {
                    recommendedLevels.push({
                      ...level,
                      categoryKey,
                      levelNumber,
                      displayTitle,
                      title: level.title, // Keep the original title for fetching
                    });
                  }
                });
              }
            });
          });

          // Remove duplicates
          const uniqueRecommendedLevels = recommendedLevels.filter((level, index, self) =>
            index === self.findIndex((l) => l.title === level.title && l.categoryKey === level.categoryKey)
          );

          setLowScoreExercises(uniqueRecommendedLevels);
          console.log("Final lowScoreExercises:", uniqueRecommendedLevels);
        }
      })
      .catch((error) => console.error("Error fetching levels:", error));
  }, []);

  const handleLevelClick = (level: RecommendedLevel) => {
    setCurrentLevel(level);
    setAnswers(new Array(level.data.length).fill(""));
    setLevelCompleted(false);
    setCorrectCount(0);
    setWrongCount(0);
    setWrongResults([]);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleAnswerBlur = (index: number) => {
    // Handle answer blur logic here
  };

  const handleLevelCompletion = () => {
    let correct = 0;
    let wrong = 0;
    const wrongResultsTemp: { word: string; userAnswer: string }[] = [];

    currentLevel?.data.forEach((item, index) => {
      const correctAnswer = (item.word || item.sentence || item.content)?.toLowerCase();
      const userAnswer = answers[index]?.toLowerCase();
      if (userAnswer === correctAnswer) {
        correct++;
      } else {
        wrong++;
        wrongResultsTemp.push({ word: correctAnswer || "", userAnswer: userAnswer || "" });
      }
    });
    setCorrectCount(correct);
    setWrongCount(wrong);
    setWrongResults(wrongResultsTemp);
    setLevelCompleted(true);

    // Update scores in localStorage
    const storedScores = JSON.parse(localStorage.getItem("scores") || "[]") as Score[];
    const category = currentLevel?.categoryKey;
    const scoreIndex = storedScores.findIndex((score) => score.category === category);

    if (scoreIndex !== -1) {
      storedScores[scoreIndex].correct += correct;
      storedScores[scoreIndex].total += currentLevel?.data.length || 0;
    } else {
      storedScores.push({
        category: category || "",
        correct: correct,
        total: currentLevel?.data.length || 0,
      });
    }
    localStorage.setItem("scores", JSON.stringify(storedScores));

    // No direct unlocking from here
  };

  const resetProgress = () => {
    localStorage.removeItem("scores");
    localStorage.removeItem("unlockedLevels");
    fetchRecommendedLevels();
  };

  const fetchRecommendedLevels = () => {
    console.log("Fetching recommended levels based on scores and local unlock status...");
    const storedScores = JSON.parse(localStorage.getItem("scores") || "[]") as Score[];
    const storedProgress = JSON.parse(localStorage.getItem("unlockedLevels") || "{}");

    axios.get<ApiResponse[]>("http://localhost:4001/levels")
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          let recommendedLevels: RecommendedLevel[] = [];
          response.data.forEach((categoryObject) => {
            Object.keys(categoryObject).forEach((categoryKey) => {
              const levelsArray = categoryObject[categoryKey as keyof ApiResponse];
              if (Array.isArray(levelsArray)) {
                levelsArray.forEach((level, index) => {
                  const scoreData = storedScores.find((score) => score.category === categoryKey);
                  const isUnlocked = index === 0 || storedProgress[`${categoryKey}-${index}`];
                  const levelNumber = index + 1;
                  const categoryDisplayName = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
                  const displayTitle = `${categoryDisplayName} - Level ${levelNumber}`;

                  if (isUnlocked && scoreData && scoreData.total > 0 && (scoreData.correct / scoreData.total) * 100 < 50) {
                    recommendedLevels.push({
                      ...level,
                      categoryKey,
                      levelNumber,
                      displayTitle,
                      title: level.title, // Keep the original title for fetching
                    });
                  } else if (isUnlocked && !scoreData && index === 0) {
                    recommendedLevels.push({
                      ...level,
                      categoryKey,
                      levelNumber,
                      displayTitle,
                      title: level.title, // Keep the original title for fetching
                    });
                  }
                });
              }
            });
          });
          const uniqueRecommendedLevels = recommendedLevels.filter((level, index, self) =>
            index === self.findIndex((l) => l.title === level.title && l.categoryKey === l.categoryKey)
          );
          setLowScoreExercises(uniqueRecommendedLevels);
          console.log("Updated lowScoreExercises:", uniqueRecommendedLevels);
        }
      })
      .catch(error => console.error("Error fetching recommended levels:", error));
  };

  const handleClosePopup = () => {
    setShowNextExercisePopup(false);
    closeButtonRef.current?.focus();
  };

  const handleReadOut = (index: number, content: string, mode: string) => {
    console.log(`Read out: ${content} in mode: ${mode}`);
  };

  const getNextExerciseType = () => {
    return "words"; // Placeholder
  };

  return (
    <div className="recommended-container">
      <h2>Recommended Exercises</h2>
      {currentLevel === null ? (
        lowScoreExercises.length > 0 ? (
          <div className="recommended-cards">
            {lowScoreExercises.map((level, index) => (
              <div
                key={index}
                className="recommended-card"
                onClick={() => handleLevelClick(level)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleLevelClick(level);
                  }
                }}
                aria-label={`Recommended exercise: ${level.displayTitle}, click to start`}
              >
                <p>{level.displayTitle}</p>
                <p>Practice this level to improve your score!</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No recommended exercises available based on your performance yet. Start practicing in the different categories!</p>
        )
      ) : (
        <div className="level-content">
          <h2 tabIndex={0}>{currentLevel.title}</h2> {/* Use the original title here */}
          {currentLevel.data.length > 0 ? (
            <ul>
              {currentLevel.data.map((item, index) => (
                <li key={index} className="level-item">
                  <p>
                    {item.hint}
                    <span
                      onClick={() => handleReadOut(index, item.sentence || item.word || item.content || "", "spell")}
                      className="speaker-icon"
                      role="button"
                      aria-label={`Spell out ${item.sentence || item.word || item.content || ""} letter by letter`}
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
                      aria-label={`Answer input for ${item.hint}`}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No data available for this level.</p>
          )}
          {!levelCompleted && currentLevel.data.length > 0 && (
            <button onClick={handleLevelCompletion} aria-label="Complete Level">
              Complete Level
            </button>
          )}
          {levelCompleted && (
            <div className="results" aria-live="polite">
              <h2>Results for {currentLevel.title}</h2> {/* Use the original title here */}
              <p>Correct Answers: {correctCount}</p>
              <p>Wrong Answers: {wrongCount}</p>
              <ul>
                {wrongResults.map((result, index) => (
                  <li key={index}>
                    <p>Answer: {result.word} - Your Answer: {result.userAnswer} - Wrong</p>
                  </li>
                ))}
              </ul>
              <button onClick={() => setCurrentLevel(null)} aria-label="Go Back to Recommended Exercises">
                Back to Recommended
              </button>
            </div>
          )}
        </div>
      )}
      <button onClick={resetProgress} aria-label="Reset Progress">Reset Progress</button>
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
            <h3 id="popup-title" tabIndex={-1}>Congratulations! You've completed all recommended exercises.</h3>
            <p id="popup-description" tabIndex={-1}>Would you like to proceed to the next exercise type?</p>
            <button onClick={() => navigate(`/${getNextExerciseType()}/level/0`)} tabIndex={0}>
              Next Exercise
            </button>
            <button onClick={() => setShowNextExercisePopup(false)} ref={closeButtonRef}>
              Stay Here
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommended;