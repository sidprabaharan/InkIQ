
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
} from "@/components/ui/dialog";
import { Search, PlusCircle, ListChecks } from "lucide-react";
import { TaskCard } from "@/components/tasks/TaskCard";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { TaskProps, TaskStatus, TaskPriority } from "@/types/task";
import { useToast } from "@/hooks/use-toast";

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
      title: "Review artwork files",
      dueDate: new Date().toISOString(),
      dueTime: "14:00",
      status: "pending",
      responsible: "Emma Coordinator",
      priority: "high",
      notes: "Check the dimensions and colors before approving",
      orderNumber: quoteId,
      orderId: quoteId
    },
    {
      id: `${quoteId}-task2`,
      title: "Send proof to customer",
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      status: "pending",
      responsible: "Jennifer Specialist",
      priority: "medium",
      orderNumber: quoteId,
      orderId: quoteId
    },
  ]);
  const { toast } = useToast();

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.responsible.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle expanded task view
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
          <DialogTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5" />
            Tasks for Order #{quoteId}
          </DialogTitle>
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
                  <PlusCircle className="h-4 w-4 mr-2" />
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
                    isExpanded={expandedTaskId === task.id}
                    onToggleExpand={() => toggleExpandTask(task.id)}
                    onStatusChange={(status) => updateTaskStatus(task.id, status)}
                    onPriorityChange={(priority) => updateTaskPriority(task.id, priority)}
                    onTaskUpdate={(fields) => updateTask(task.id, fields)}
                  />
                ))
              ) : (
                <div className="text-center py-10">
                  <ListChecks className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No tasks found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery ? "Try modifying your search" : "Create a task to get started"}
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-4">
              {filteredTasks.filter(t => t.status === "pending").length > 0 ? (
                filteredTasks
                  .filter(t => t.status === "pending")
                  .map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isExpanded={expandedTaskId === task.id}
                      onToggleExpand={() => toggleExpandTask(task.id)}
                      onStatusChange={(status) => updateTaskStatus(task.id, status)}
                      onPriorityChange={(priority) => updateTaskPriority(task.id, priority)}
                      onTaskUpdate={(fields) => updateTask(task.id, fields)}
                    />
                  ))
              ) : (
                <div className="text-center py-10">
                  <ListChecks className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No pending tasks</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery ? "Try modifying your search" : "Create a task to get started"}
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="in-progress" className="space-y-4">
              {filteredTasks.filter(t => t.status === "in-progress").length > 0 ? (
                filteredTasks
                  .filter(t => t.status === "in-progress")
                  .map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isExpanded={expandedTaskId === task.id}
                      onToggleExpand={() => toggleExpandTask(task.id)}
                      onStatusChange={(status) => updateTaskStatus(task.id, status)}
                      onPriorityChange={(priority) => updateTaskPriority(task.id, priority)}
                      onTaskUpdate={(fields) => updateTask(task.id, fields)}
                    />
                  ))
              ) : (
                <div className="text-center py-10">
                  <ListChecks className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No in-progress tasks</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery ? "Try modifying your search" : "Create a task to get started"}
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4">
              {filteredTasks.filter(t => t.status === "completed").length > 0 ? (
                filteredTasks
                  .filter(t => t.status === "completed")
                  .map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isExpanded={expandedTaskId === task.id}
                      onToggleExpand={() => toggleExpandTask(task.id)}
                      onStatusChange={(status) => updateTaskStatus(task.id, status)}
                      onPriorityChange={(priority) => updateTaskPriority(task.id, priority)}
                      onTaskUpdate={(fields) => updateTask(task.id, fields)}
                    />
                  ))
              ) : (
                <div className="text-center py-10">
                  <ListChecks className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No completed tasks</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery ? "Try modifying your search" : "Create a task to get started"}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
