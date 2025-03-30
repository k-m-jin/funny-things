export interface Memo {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isVoiceRecorded?: boolean;
  category?: string;
  tags?: string[];
}

export interface MemoFormData {
  content: string;
  category?: string;
  tags?: string[];
}
