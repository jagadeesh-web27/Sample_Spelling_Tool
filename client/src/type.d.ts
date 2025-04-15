// Word interface for each word object in the level
interface IWord {
  hint: string;    // Hint for the word (e.g., "First letter: P")
  word: string;    // The correct word (e.g., "Pen")
}

// Level interface for each level
interface ILevel {
  _id: string;       // Unique identifier for the level
  title: string;     // Title of the level (e.g., "Level 1")
  locked: boolean;   // Whether the level is locked
  words: IWord[];    // Array of words in this level
}

// Props for passing level data into components
type LevelProps = {
  level: ILevel;  // Level object passed into components
}

// API response format
type ApiDataType = {
  message: string;       // Message, e.g., "Data fetched successfully"
  status: string;        // Status of the request (e.g., "success")
  levels: ILevel[];      // Array of levels
  level?: ILevel;        // Optional level, used for individual level fetch
}
