export interface Memo {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isVoiceRecorded?: boolean;
}

export interface MemoFormData {
  content: string;
}
