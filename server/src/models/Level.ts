import mongoose from "mongoose";
import { ILevel, IWord, ISentence, IArticle } from "../types/ILevel";

// Word schema
const WordSchema = new mongoose.Schema<IWord>({
  hint: { type: String, required: true },
  word: { type: String, required: true },
});

// Sentence schema
const SentenceSchema = new mongoose.Schema<ISentence>({
  hint: { type: String, required: true },
  sentence: { type: String, required: true },
});

// Article schema
const ArticleSchema = new mongoose.Schema<IArticle>({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

// Level schema
const LevelSchema = new mongoose.Schema<ILevel>({
  title: { type: String, required: true },
  locked: { type: Boolean, default: true },
  words: { type: [WordSchema], required: true },
  sentences: { type: [SentenceSchema], required: true },
  articles: { type: [ArticleSchema], required: true },
});

// Level model
const Level = mongoose.model<ILevel>("Level", LevelSchema);

export default Level;