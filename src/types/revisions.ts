export interface Revision {
  id: number;
  parentId: number;
  user: string;
  timestamp: string;
  comment: string;
  content: string;
  '*': string;
  diff?: {
    diff: string;
    toRevId: number;
  };
}