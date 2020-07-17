export interface User {
  id: number; //required
  username: string; //required
  password: string; //required
  image: string | null;
  email: string | null;
  google: string | null;
  github: string | null;
  gitlab: string | null;
  first_name: string | null;
  last_name: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface Task {
  id: number;
  title: string;
  category: string;
  content: string;
}
