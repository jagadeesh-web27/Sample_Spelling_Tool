import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/totalScore.css";

interface ScoreData {
  category: string;
  correct: number;
  total: number;
}

const getPerformanceLabel = (percentage: number) => {
  if (percentage >= 80) return { label: "Good", className: "good" };
  if (percentage >= 50) return { label: "Average", className: "average" };
  return { label: "Bad", className: "bad" };
};

const TotalScore: React.FC = () => {
  const [scores, setScores] = useState<ScoreData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedScores = JSON.parse(localStorage.getItem("scores") || "[]");
    setScores(storedScores);
  }, []);

  return (
    <div className="total-score-container" role="main" aria-label="Total Score Summary">
      <h1 id="total-score-heading">Your Performance</h1>

      <div className="score-cards">
        {scores.map((score, index) => {
          const percentage = ((score.correct / score.total) * 100).toFixed(1);
          const { label, className } = getPerformanceLabel(Number(percentage));

          return (
            <div key={index} className="score-card">
              <h2>{score.category}</h2>
              <p>Correct: {score.correct} / {score.total}</p>
              <p className="performance-label" style={{ color: className }}>{label}</p>
              
              {/* Progress Bar */}
              <div className="progress-container">
                <div 
                  className={`progress-bar ${className}`} 
                  style={{ width: `${percentage}%` }}>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="back-button" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
};

export default TotalScore;
