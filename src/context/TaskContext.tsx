
import React, { createContext, useContext, useState } from "react";
import { Task } from "@/types/task";

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt">) => Task;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
  getTasksByCustomerId: (customerId: string) => Task[];
  getTasksByOrderId: (orderId: string) => Task[];
}

// Sample tasks data
const sampleTasks: Task[] = [
  {
    id: "task-1",
    title: "Follow up on quote approval",
    description: "Contact John Doe about the pending quote approval for the business cards order",
    status: "pending",
    priority: "high",
    dueDate: "2023-12-15",
    createdAt: "2023-12-01",
    assignedTo: "Sarah Johnson",
    customerId: "customer-1"
  },
  {
    id: "task-2",
    title: "Send revised design mockup",
    description: "Prepare and send the revised design mockup for the brochure project",
    status: "in-progress",
    priority: "medium",
    dueDate: "2023-12-10",
    createdAt: "2023-11-28",
    assignedTo: "Mike Wilson",
    customerId: "customer-2"
  },
  {
    id: "task-3",
    title: "Schedule follow-up meeting",
    description: "Coordinate a follow-up meeting to discuss the packaging design project",
    status: "completed",
    priority: "low",
    dueDate: "2023-12-05",
    createdAt: "2023-11-25",
    assignedTo: "Emily Chen",
    customerId: "customer-3"
  },
  {
    id: "task-4",
    title: "Prepare invoice for completed job",
    description: "Create and send invoice for the completed banner printing job",
    status: "pending",
    priority: "high",
    dueDate: "2023-12-08",
    createdAt: "2023-12-01",
    assignedTo: "Sarah Johnson",
    orderId: "order-1"
  },
  {
    id: "task-5",
    title: "Order additional materials",
    description: "Order additional vinyl material for the upcoming signage project",
    status: "pending",
    priority: "urgent",
    dueDate: "2023-12-03",
    createdAt: "2023-12-01",
    assignedTo: "David Lopez",
    orderId: "order-2"
  }
];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const updateTask = (id: string, data: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...data } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const getTaskById = (id: string) => {
    return tasks.find(task => task.id === id);
  };

  const getTasksByCustomerId = (customerId: string) => {
    return tasks.filter(task => task.customerId === customerId);
  };

  const getTasksByOrderId = (orderId: string) => {
    return tasks.filter(task => task.orderId === orderId);
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      addTask, 
      updateTask, 
      deleteTask, 
      getTaskById,
      getTasksByCustomerId,
      getTasksByOrderId
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
