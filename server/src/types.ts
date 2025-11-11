export interface StudyOutput {
  lectureTitle: string;
  transcript?: string;
  summary: string;
  studyActivities: string[];
  questions: {
    question: string;
    answer?: string;
  }[];
  studyPlan: string[];
}
