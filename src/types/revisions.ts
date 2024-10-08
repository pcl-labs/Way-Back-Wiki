export interface Revision {
  id: number;
  parentId: number;
  user: string;
  timestamp: string;
  comment: string;
  content: string;
  '*': string;
  // Add any other properties that your revision objects have
}