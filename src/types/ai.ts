export type AISuggestion = {
  title: string;
  detail: string;
};

export type AILogicIssues = {
  title: string;
  detail: string;
};

export type AiFeedback = {
  what_works_well: string;
  suggestions: AISuggestion[];
  logic_issues: AILogicIssues[];
};
