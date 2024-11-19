export interface User {
  _id: string;
  username: string;
  email: string;
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

export interface Comment {
  _id: string;
  userId: User | string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  _id: string;
  originatorId: User;
  recipientId: User;
  message: string;
  taskId?: Task | string;
  subtaskId?: SubTask | string;
  isRead: boolean;
  isSeen: boolean;
  createdAt: Date;
}