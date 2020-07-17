export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Task {
  id: number;
  title: string;
  category: string;
  content: string;
}