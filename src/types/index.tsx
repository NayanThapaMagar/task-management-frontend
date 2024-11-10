export interface UserConnection {
  _id: string;
  username: string;
  email: string;
}

export interface Comment {
  userId: string;
  text: string;
  createdAt: Date;
}

export interface TaskCreate {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string[];
}

export interface Task extends TaskCreate {
  _id: string;
  status: 'to do' | 'pending' | 'completed';
  creator: string;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

