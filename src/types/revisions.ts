export interface Revision {
  user: string;
  timestamp: string;
  contentformat?: string;
  contentmodel?: string;
  comment: string;
  '*'?: string;  // This contains the actual content, now optional
  anon?: string;  // Optional field for anonymous users
}