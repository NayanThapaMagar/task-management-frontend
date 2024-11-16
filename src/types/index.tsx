export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface Comment {
  _id: string;
  userId: User;
  text: string;
  createdAt: Date;
  updatedAt: Date;
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

export interface SubTask extends TaskCreate {
  _id: string;
  status: 'to do' | 'pending' | 'completed';
  creator: string;
  comments: Comment[];
  taskId: string;
  createdAt: Date;
  updatedAt: Date;
}

