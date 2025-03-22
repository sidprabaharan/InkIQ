
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function Tasks() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock tasks data (in a real app, this would come from an API or context)
  const mockTasks = [
    { id: '1', title: 'Follow up with ABC Corp', dueDate: '2023-09-15', status: 'pending' as const, customer: 'ABC Corporation', priority: 'high' as const },
    { id: '2', title: 'Send revised quote', dueDate: '2023-09-18', status: 'pending' as const, customer: 'XYZ Inc', priority: 'medium' as const },
    { id: '3', title: 'Schedule installation', dueDate: '2023-09-20', status: 'pending' as const, customer: '123 Industries', priority: 'low' as const },
    { id: '4', title: 'Collect payment', dueDate: '2023-09-10', status: 'completed' as const, customer: 'Smith Design', priority: 'high' as const },
    { id: '5', title: 'Order materials', dueDate: '2023-09-12', status: 'in-progress' as const, customer: 'Johnson Printing', priority: 'medium' as const },
  ];

  // Filter tasks based on search query
  const filteredTasks = mockTasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // State for tasks (in a real app, this would be stored in a context or fetched from an API)
  const [tasks, setTasks] = useState(mockTasks);

  // Function to update task status
  const updateTaskStatus = (taskId: string, newStatus: TaskProps['status']) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    toast({
      description: "Task status updated successfully",
    });
  };

  // Function to update task priority
  const updateTaskPriority = (taskId: string, newPriority: TaskProps['priority']) => {
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

type TaskProps = {
  id: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  customer: string;
  priority: 'low' | 'medium' | 'high';
};

interface TaskCardProps {
  task: TaskProps;
  onStatusChange: (status: TaskProps['status']) => void;
  onPriorityChange: (priority: TaskProps['priority']) => void;
}

function TaskCard({ task, onStatusChange, onPriorityChange }: TaskCardProps) {
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
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
  const formatStatus = (status: TaskProps['status']) => {
    return status === 'in-progress' 
      ? 'In Progress' 
      : status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Format priority for display
  const formatPriority = (priority: TaskProps['priority']) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
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
            {/* Priority Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${priorityColors[task.priority]}`}>
                {formatPriority(task.priority)}
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onPriorityChange('low')} className="cursor-pointer">
                  <div className="flex items-center">
                    {task.priority === 'low' && <Check className="mr-2 h-4 w-4" />}
                    <span className={task.priority === 'low' ? 'font-medium' : ''}>Low</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onPriorityChange('medium')} className="cursor-pointer">
                  <div className="flex items-center">
                    {task.priority === 'medium' && <Check className="mr-2 h-4 w-4" />}
                    <span className={task.priority === 'medium' ? 'font-medium' : ''}>Medium</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onPriorityChange('high')} className="cursor-pointer">
                  <div className="flex items-center">
                    {task.priority === 'high' && <Check className="mr-2 h-4 w-4" />}
                    <span className={task.priority === 'high' ? 'font-medium' : ''}>High</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Status Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${statusColors[task.status]}`}>
                {formatStatus(task.status)}
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onStatusChange('pending')} className="cursor-pointer">
                  <div className="flex items-center">
                    {task.status === 'pending' && <Check className="mr-2 h-4 w-4" />}
                    <span className={task.status === 'pending' ? 'font-medium' : ''}>Pending</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange('in-progress')} className="cursor-pointer">
                  <div className="flex items-center">
                    {task.status === 'in-progress' && <Check className="mr-2 h-4 w-4" />}
                    <span className={task.status === 'in-progress' ? 'font-medium' : ''}>In Progress</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange('completed')} className="cursor-pointer">
                  <div className="flex items-center">
                    {task.status === 'completed' && <Check className="mr-2 h-4 w-4" />}
                    <span className={task.status === 'completed' ? 'font-medium' : ''}>Completed</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
