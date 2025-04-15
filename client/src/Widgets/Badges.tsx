import React, { useState, useEffect } from "react";
import "../Styles/badges.css";

interface ScoreData {
  category: string;
  correct: number;
  total: number;
}

const getBadgeType = (percentage: number) => {
  if (percentage >= 80) return "Gold";
  if (percentage >= 50) return "Bronze";
  return "Silver";
};

const Badges: React.FC = () => {
  const [badges, setBadges] = useState<{ category: string; badge: string }[]>([]);

  useEffect(() => {
    const storedScores: ScoreData[] = JSON.parse(localStorage.getItem("scores") || "[]");

    if (storedScores.length > 0) {
      const categoryBadges = storedScores.map((score) => {
        const percentage = ((score.correct / score.total) * 100).toFixed(1);
        return { category: score.category, badge: getBadgeType(Number(percentage)) };
      });

      setBadges(categoryBadges);
    } else {
      setBadges([]);
    }
  }, []);

  return (
    <div className="badges-container">
      <h1>Your Achievements</h1>
      {badges.length > 0 ? (
        <div className="badges-list">
          {badges.map(({ category, badge }, index) => (
            <div key={index} className="badge-wrapper">
              <div className={`badge-hang ${badge.toLowerCase()}`}>
                <div className="nail">🪝</div>
                <div className="badge">
                  <span>
                    {badge === "Gold" ? "🥇" : badge === "Silver" ? "🥈" : "🥉"}<br />
                    {category}<br />{badge} Badge
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-badges-msg">No badges yet. Complete some quizzes to earn them!</p>
      )}
    </div>
  );
};

export default Badges;
