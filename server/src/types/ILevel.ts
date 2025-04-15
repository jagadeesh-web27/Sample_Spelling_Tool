// ILevel.ts
export interface IWord {
  hint: string;
  word: string;
}

export interface ISentence {
  hint: string;
  sentence: string;
}

export interface IArticle {
  title: string;
  content: string;
}

export interface ILevel {
  title: string;
  locked: boolean;
  words: IWord[];
  sentences: ISentence[];
  articles: IArticle[];
}