import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  ListChecks, 
  Plus,
  Search,
  Check,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";

// Define types consistently at the top of the file
type TaskStatus = 'pending' | 'in-progress' | 'completed';
type TaskPriority = 'low' | 'medium' | 'high';

type TaskProps = {
  id: string;
  title: string;
  dueDate: string;
  status: TaskStatus;
  customer: string;
  priority: TaskPriority;
};

export default function Tasks() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock tasks data with consistent typings
  const mockTasks: TaskProps[] = [
    { id: '1', title: 'Follow up with ABC Corp', dueDate: '2023-09-15', status: 'pending', customer: 'ABC Corporation', priority: 'high' },
    { id: '2', title: 'Send revised quote', dueDate: '2023-09-18', status: 'pending', customer: 'XYZ Inc', priority: 'medium' },
    { id: '3', title: 'Schedule installation', dueDate: '2023-09-20', status: 'pending', customer: '123 Industries', priority: 'low' },
    { id: '4', title: 'Collect payment', dueDate: '2023-09-10', status: 'completed', customer: 'Smith Design', priority: 'high' },
    { id: '5', title: 'Order materials', dueDate: '2023-09-12', status: 'in-progress', customer: 'Johnson Printing', priority: 'medium' },
  ];

  // Filter tasks based on search query
  const filteredTasks = mockTasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // State for tasks with the proper type annotation
  const [tasks, setTasks] = useState<TaskProps[]>(mockTasks);

  // Function to update task status with proper typing
  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    toast({
      description: "Task status updated successfully",
    });
  };

  // Function to update task priority with proper typing
  const updateTaskPriority = (taskId: string, newPriority: TaskPriority) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, priority: newPriority } : task
    );
    setTasks(updatedTasks);
    toast({
      description: "Task priority updated successfully",
    });
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ListChecks className="h-6 w-6 text-inkiq-primary" />
          <h1 className="text-2xl font-bold">Tasks</h1>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search tasks..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
                />
              ))
          ) : (
            <EmptyState query={searchQuery} status="completed" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface TaskCardProps {
  task: TaskProps;
  onStatusChange: (status: TaskStatus) => void;
  onPriorityChange: (priority: TaskPriority) => void;
}

function TaskCard({ task, onStatusChange, onPriorityChange }: TaskCardProps) {
  const priorityColors: Record<TaskPriority, string> = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800'
  };

  const statusColors = {
    'pending': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    'completed': 'bg-green-100 text-green-800'
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Format status for display
  const formatStatus = (status: TaskStatus) => {
    return status === 'in-progress' 
      ? 'In Progress' 
      : status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-medium">{task.title}</h3>
            <p className="text-sm text-gray-500">Responsible: {task.customer}</p>
          </div>
          <div className="flex gap-2">
            {/* Priority Select */}
            <Select
              value={task.priority}
              onValueChange={(value: TaskPriority) => onPriorityChange(value)}
            >
              <SelectTrigger className={`h-8 text-xs ${priorityColors[task.priority]}`}>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Status Select */}
            <Select
              value={task.status}
              onValueChange={(value: TaskStatus) => onStatusChange(value)}
            >
              <SelectTrigger className={`h-8 text-xs ${statusColors[task.status]}`}>
                <SelectValue placeholder="Status">
                  {formatStatus(task.status)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-sm">Due: {formatDate(task.dueDate)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ query, status }: { query: string, status?: string }) {
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
