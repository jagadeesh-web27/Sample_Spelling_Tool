import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Level {
  title: string;
  locked: boolean;
}

const Word: React.FC = () => {
  const [levels, setLevels] = useState<Level[]>([]);

  useEffect(() => {
    // Fetch levels from the backend
    axios
      .get("http://localhost:4001/levels?type=tenses")
      .then((response) => {
        console.log("Fetched levels:", response.data); // Log response to check if data is coming through
        if (response.data.length > 0 && response.data[0].tenses) {
          let fetchedLevels = response.data[0].tenses;

          // Restore unlocked levels from localStorage
          const storedProgress = JSON.parse(localStorage.getItem("unlockedLevels") || "{}");
          fetchedLevels = fetchedLevels.map((level: Level, index: number) => ({
            ...level,
            locked: index === 0 ? false : !(storedProgress[`tenses-${index}`] || false), // Only Level 1 is unlocked initially
          }));

          setLevels(fetchedLevels);
        } else {
          console.log("No tenses data found");
        }
      })
      .catch((error) => {
        console.error("Error fetching levels:", error);
      });
  }, []);

  return (
    <div>
      <nav>
        <Link to="/">Home</Link> / tenses
      </nav>
      <h2>tenses Levels</h2>
      <ul>
        {levels.map((level, index) => (
          <li key={index}>
            <Link to={`/words/level/${index}`}>
              <button disabled={level.locked}>
                {level.title}
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Word;