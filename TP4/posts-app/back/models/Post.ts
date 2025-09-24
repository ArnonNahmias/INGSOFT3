export interface Post {
  id: number;
  user_id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
  username?: string; // Para joins con usuarios
}

export interface CreatePostData {
  user_id: number;
  content: string;
}

export interface PostWithUser {
  id: number;
  content: string;
  created_at: Date;
  username: string;
}