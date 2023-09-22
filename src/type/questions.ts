export type QuestionOption = {
  [key: string]: string;
};
  
export type Question = {
  id: number;
  options: QuestionOption;
  question: string;
  phase?: number | string;
};
  
export type QuestionResponse = {
  questions: Question[];
  totalPages: number;
  totalQuestions: number;
};
