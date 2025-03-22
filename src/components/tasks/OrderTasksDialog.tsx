
import { useState } from "react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Search, Clock, ListChecks, ArrowUpFromLine, Pencil, Edit2, Calendar, Image, User, ChevronDown, ChevronUp, X } from "lucide-react";
import { TaskImage, TaskProps, TaskStatus, TaskPriority } from "@/types/task";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TaskCard } from "@/components/tasks/TaskCard";

interface OrderTasksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteId: string;
}

export function OrderTasksDialog({ open, onOpenChange, quoteId }: OrderTasksDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskProps[]>([
    {
      id: `${quoteId}-task1`,
      title: "Follow up with ABC Corp",
      dueDate: "2023-09-15T15:30:00",
      status: "pending",
      responsible: "Emma Coordinator",
      priority: "high",
      notes: "Need to discuss pricing and timeline for the new project.",
      assignedDate: "2023-09-10T09:15:00",
      assignedBy: "John Manager",
      orderNumber: "12345",
      images: [
        { id: 'img1', url: '/placeholder.svg', name: 'Sample Document.jpg' }
      ]
    },
    {
      id: `${quoteId}-task2`,
      title: "Send revised quote",
      dueDate: "2023-09-18T17:00:00",
      status: "pending",
      responsible: "David Team Lead",
      priority: "medium",
      notes: "Include the additional services they requested in the meeting.",
      assignedDate: "2023-09-12T11:30:00",
      assignedBy: "Sarah Director",
      orderNumber: quoteId
    },
    {
      id: `${quoteId}-task3`,
      title: "Schedule installation",
      dueDate: "2023-09-20T10:00:00",
      status: "pending",
      responsible: "Jennifer Specialist",
      priority: "low",
      notes: "Verify their availability for the installation date.",
      assignedDate: "2023-09-05T14:45:00",
      assignedBy: "Mike Supervisor",
      orderNumber: quoteId
    },
  ]);
  
  const { toast } = useToast();

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.responsible.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle expanded task
  const toggleExpandTask = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  // Handle task status updates
  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    toast({
      description: "Task status updated successfully",
    });
  };

  // Handle task priority updates
  const updateTaskPriority = (taskId: string, newPriority: TaskPriority) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, priority: newPriority } : task
    );
    setTasks(updatedTasks);
    toast({
      description: "Task priority updated successfully",
    });
  };

  // Handle general task updates
  const updateTask = (taskId: string, updatedFields: Partial<TaskProps>) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, ...updatedFields } : task
    );
    setTasks(updatedTasks);
    toast({
      description: "Task updated successfully",
    });
  };

  // Add a new task for this order
  const addTask = (newTask: TaskProps) => {
    // Ensure the task is associated with this order
    const taskWithOrderId = {
      ...newTask,
      orderId: quoteId,
      orderNumber: newTask.orderNumber || quoteId
    };
    
    setTasks([taskWithOrderId, ...tasks]);
    toast({
      description: "New task created successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5" />
            <DialogTitle>Tasks for Order #{quoteId}</DialogTitle>
          </div>
          <DialogDescription>
            Manage tasks associated with this order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <div className="relative w-full mr-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <CreateTaskDialog
              onCreateTask={addTask}
              initialOrderNumber={quoteId}
              trigger={
                <Button className="whitespace-nowrap">
                  <ArrowUpFromLine className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              }
            />
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusChange={(status) => updateTaskStatus(task.id, status)}
                    onPriorityChange={(priority) => updateTaskPriority(task.id, priority)}
                    onTaskUpdate={(fields) => updateTask(task.id, fields)}
                    isExpanded={expandedTaskId === task.id}
                    onToggleExpand={() => toggleExpandTask(task.id)}
                  />
                ))
              ) : (
                <EmptyState query={searchQuery} />
              )}
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-4">
              {filteredTasks.filter(t => t.status === 'pending').length > 0 ? (
                filteredTasks
                  .filter(t => t.status === 'pending')
                  .map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onStatusChange={(status) => updateTaskStatus(task.id, status)}
                      onPriorityChange={(priority) => updateTaskPriority(task.id, priority)}
                      onTaskUpdate={(fields) => updateTask(task.id, fields)}
                      isExpanded={expandedTaskId === task.id}
                      onToggleExpand={() => toggleExpandTask(task.id)}
                    />
                  ))
              ) : (
                <EmptyState query={searchQuery} status="pending" />
              )}
            </TabsContent>
            
            <TabsContent value="in-progress" className="space-y-4">
              {filteredTasks.filter(t => t.status === 'in-progress').length > 0 ? (
                filteredTasks
                  .filter(t => t.status === 'in-progress')
                  .map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onStatusChange={(status) => updateTaskStatus(task.id, status)}
                      onPriorityChange={(priority) => updateTaskPriority(task.id, priority)}
                      onTaskUpdate={(fields) => updateTask(task.id, fields)}
                      isExpanded={expandedTaskId === task.id}
                      onToggleExpand={() => toggleExpandTask(task.id)}
                    />
                  ))
              ) : (
                <EmptyState query={searchQuery} status="in-progress" />
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4">
              {filteredTasks.filter(t => t.status === 'completed').length > 0 ? (
                filteredTasks
                  .filter(t => t.status === 'completed')
                  .map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onStatusChange={(status) => updateTaskStatus(task.id, status)}
                      onPriorityChange={(priority) => updateTaskPriority(task.id, priority)}
                      onTaskUpdate={(fields) => updateTask(task.id, fields)}
                      isExpanded={expandedTaskId === task.id}
                      onToggleExpand={() => toggleExpandTask(task.id)}
                    />
                  ))
              ) : (
                <EmptyState query={searchQuery} status="completed" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface EmptyStateProps {
  query: string;
  status?: string;
}

function EmptyState({ query, status }: EmptyStateProps) {
  let message = "No tasks found";
  
  if (query) {
    message = `No tasks found matching "${query}"`;
  } else if (status) {
    message = `No ${status} tasks`;
  }
  
  return (
    <div className="text-center py-10">
      <ListChecks className="mx-auto h-12 w-12 text-gray-300" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">{message}</h3>
      <p className="mt-1 text-sm text-gray-500">
        {!query ? "Create a task to get started." : "Try modifying your search."}
      </p>
    </div>
  );
}
