
export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskImage = {
  id: string;
  url: string;
  name: string;
};

export interface TaskProps {
  id: string;
  title: string;
  dueDate: string; // ISO format date-time string
  dueTime?: string; 
  status: TaskStatus;
  responsible: string;
  priority: TaskPriority;
  notes?: string;
  assignedDate?: string; // ISO format date-time string
  assignedBy?: string;
  orderNumber?: string;
  orderId?: string; // Added orderId to match the usage in OrderTasksDialog
  images?: TaskImage[];
}
