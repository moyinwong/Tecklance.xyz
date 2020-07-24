export interface User {
  id: number;
  username: string; //required
  password: string; //required
  image_user: string; //required
  email: string; //required
  remain_amt: number;
  google: string;
  github: string;
  gitlab: string;
  first_name: string;
  last_name: string;
  bank_name: string;
  bank_account: string;
  freelancer_intro: string;
  isAdmin: Boolean;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  title: string;
  category: string;
  content: string;
  image_task: string;
  creator_id: number;
}

export interface Usertask {
  id: number;
  user_id: number;
  task_id: number;
}

export interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  message_content: string;
  message_status: string;
  created_at: string;
}

export interface Task_submissions {
  id: number;
  task_id: number;
  filename: string;
}
