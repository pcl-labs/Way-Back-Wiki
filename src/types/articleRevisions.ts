export interface ArticleRevision {
  id: number;
  title: string;
  titleSlug: string;
  parentId?: number;
  user: string;
  timestamp: string;
  comment: string;
}