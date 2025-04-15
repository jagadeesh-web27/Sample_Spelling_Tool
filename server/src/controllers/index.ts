import { Request, Response } from "express";
import Level from "../models/Level";  // Adjust the path as necessary

export const getLevels = async (req: Request, res: Response) => {
  const { type } = req.query;

  try {
    let levels;
    if (type === "words") {
      levels = await Level.find({}, { words: 1, title: 1, locked: 1 });
    } else if (type === "sentences") {
      levels = await Level.find({}, { sentences: 1, title: 1, locked: 1 });
    } else if (type === "articles") {
      levels = await Level.find({}, { articles: 1, title: 1, locked: 1 });
    } else if (!type) {
      levels = await Level.find();
    } else {
      return res.status(400).json({ message: "Invalid type parameter" });
    }

    res.json(levels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching levels", error });
  }
};