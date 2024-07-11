export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  status: string;
  completed: boolean;
};
