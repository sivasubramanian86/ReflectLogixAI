export interface JournalModel {
  id: string;
  userId: string;
  title: string;
  content: string;
  language: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  wordCount: number;
  tokenCountEstimated: number;
  isSensitive?: boolean;
  detoxMode?: boolean;
}
