
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  ListChecks, 
  ArrowLeft,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskPriority, TaskProps, TaskStatus } from "@/types/task";
import { USERS } from "@/pages/Tasks";

export default function OrderTasks() {
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  
  // In a real application, you would fetch tasks for this order from an API
  useEffect(() => {
    // For demonstration, creating mock tasks with this order ID
    const mockOrderTasks: TaskProps[] = [
      { 
        id: '101', 
        title: 'Verify order details', 
        dueDate: new Date().toISOString(),
        status: 'pending', 
        responsible: 'Emma Coordinator',
        priority: 'high',
        notes: 'Ensure all measurements are correct before proceeding',
        orderNumber: id,
        orderId: id
      },
      { 
        id: '102', 
        title: 'Schedule client consultation', 
        dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        status: 'pending', 
        responsible: 'Jennifer Specialist',
        priority: 'medium',
        orderNumber: id,
        orderId: id
      }
    ];
    
    setTasks(mockOrderTasks);
  }, [id]);

  // Function to filter tasks based on search query
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.responsible.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // Toggle expanded task view
  const toggleExpandTask = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  // Add a new task for this order
  const addTask = (newTask: TaskProps) => {
    // Ensure the task is associated with this order
    const taskWithOrderId = {
      ...newTask,
      orderId: id,
      orderNumber: newTask.orderNumber || id
    };
    
    setTasks([taskWithOrderId, ...tasks]);
    toast({
      description: "New task created successfully",
    });
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to={`/work-orders/${id}`} className="flex items-center text-inkiq-primary hover:underline mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to Order</span>
          </Link>
          <ListChecks className="h-6 w-6 text-inkiq-primary" />
          <h1 className="text-2xl font-bold">Order #{id} Tasks</h1>
        </div>
        <CreateTaskDialog 
          onCreateTask={addTask} 
          initialOrderNumber={id?.toString()} 
        />
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
                onTaskUpdate={(fields) => updateTask(task.id, fields)}
                isExpanded={expandedTaskId === task.id}
                onToggleExpand={() => toggleExpandTask(task.id)}
              />
            ))
          ) : (
            <EmptyState query={searchQuery} orderId={id} />
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
            <EmptyState query={searchQuery} status="pending" orderId={id} />
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
            <EmptyState query={searchQuery} status="in-progress" orderId={id} />
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
            <EmptyState query={searchQuery} status="completed" orderId={id} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface EmptyStateProps {
  query: string;
  status?: string;
  orderId?: string;
}

function EmptyState({ query, status, orderId }: EmptyStateProps) {
  let message = "No tasks found";
  
  if (query) {
    message = `No tasks found matching "${query}"`;
  } else if (status) {
    message = `No ${status} tasks for Order #${orderId}`;
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
