
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
import { Search, Clock, ListChecks, ArrowUpFromLine, Pencil, User, Check, X } from "lucide-react";
import { TaskProps, TaskStatus, TaskPriority } from "@/types/task";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { TaskCard } from "@/components/tasks/TaskCard";

interface OrderTasksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteId: string;
}

export function OrderTasksDialog({ open, onOpenChange, quoteId }: OrderTasksDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<TaskProps | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
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

  // Open task details dialog
  const openTaskDetails = (task: TaskProps) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Format: Sep 15, 2023 at 3:30 PM
      return `${format(date, "MMM d, yyyy")} at ${
        format(date, "h:mm a").replace("AM", "am").replace("PM", "pm")
      }`;
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <>
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
                  className="pl-10 bg-white border-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <CreateTaskDialog
                onCreateTask={addTask}
                initialOrderNumber={quoteId}
                trigger={
                  <Button className="whitespace-nowrap bg-blue-600 hover:bg-blue-700">
                    <ArrowUpFromLine className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                }
              />
            </div>

            <div className="bg-gray-50 p-1 rounded-lg">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full grid grid-cols-4 bg-transparent h-10 mb-0">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:bg-white rounded-md data-[state=active]:shadow-none"
                  >
                    All Tasks
                  </TabsTrigger>
                  <TabsTrigger 
                    value="pending" 
                    className="data-[state=active]:bg-white rounded-md data-[state=active]:shadow-none"
                  >
                    Pending
                  </TabsTrigger>
                  <TabsTrigger 
                    value="in-progress" 
                    className="data-[state=active]:bg-white rounded-md data-[state=active]:shadow-none"
                  >
                    In Progress
                  </TabsTrigger>
                  <TabsTrigger 
                    value="completed" 
                    className="data-[state=active]:bg-white rounded-md data-[state=active]:shadow-none"
                  >
                    Completed
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-4 mt-4">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onStatusChange={(status) => updateTaskStatus(task.id, status)}
                        onPriorityChange={(priority) => updateTaskPriority(task.id, priority)}
                        onTaskUpdate={(fields) => updateTask(task.id, fields)}
                        onClick={() => openTaskDetails(task)}
                      />
                    ))
                  ) : (
                    <EmptyTaskList query={searchQuery} />
                  )}
                </TabsContent>
                
                <TabsContent value="pending" className="space-y-4 mt-4">
                  {filteredTasks.filter(t => t.status === "pending").length > 0 ? (
                    filteredTasks
                      .filter(t => t.status === "pending")
                      .map(task => (
                        <TaskRow
                          key={task.id}
                          task={task}
                          onStatusChange={(status) => updateTaskStatus(task.id, status)}
                          onPriorityChange={(priority) => updateTaskPriority(task.id, priority)}
                          onTaskUpdate={(fields) => updateTask(task.id, fields)}
                          onClick={() => openTaskDetails(task)}
                        />
                      ))
                  ) : (
                    <EmptyTaskList query={searchQuery} status="pending" />
                  )}
                </TabsContent>
                
                <TabsContent value="in-progress" className="space-y-4 mt-4">
                  {filteredTasks.filter(t => t.status === "in-progress").length > 0 ? (
                    filteredTasks
                      .filter(t => t.status === "in-progress")
                      .map(task => (
                        <TaskRow
                          key={task.id}
                          task={task}
                          onStatusChange={(status) => updateTaskStatus(task.id, status)}
                          onPriorityChange={(priority) => updateTaskPriority(task.id, priority)}
                          onTaskUpdate={(fields) => updateTask(task.id, fields)}
                          onClick={() => openTaskDetails(task)}
                        />
                      ))
                  ) : (
                    <EmptyTaskList query={searchQuery} status="in-progress" />
                  )}
                </TabsContent>
                
                <TabsContent value="completed" className="space-y-4 mt-4">
                  {filteredTasks.filter(t => t.status === "completed").length > 0 ? (
                    filteredTasks
                      .filter(t => t.status === "completed")
                      .map(task => (
                        <TaskRow
                          key={task.id}
                          task={task}
                          onStatusChange={(status) => updateTaskStatus(task.id, status)}
                          onPriorityChange={(priority) => updateTaskPriority(task.id, priority)}
                          onTaskUpdate={(fields) => updateTask(task.id, fields)}
                          onClick={() => openTaskDetails(task)}
                        />
                      ))
                  ) : (
                    <EmptyTaskList query={searchQuery} status="completed" />
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Detail Dialog */}
      {selectedTask && (
        <Dialog open={showTaskDetails} onOpenChange={setShowTaskDetails}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl">{selectedTask.title}</DialogTitle>
                <DialogClose className="absolute right-4 top-4 p-0 opacity-70 hover:opacity-100">
                  <X className="h-4 w-4" />
                </DialogClose>
              </div>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge 
                  className={`${getStatusBadgeStyles(selectedTask.status)}`}
                >
                  {getStatusLabel(selectedTask.status)}
                </Badge>
                <Badge 
                  className={`${getPriorityBadgeStyles(selectedTask.priority)}`}
                >
                  {getPriorityLabel(selectedTask.priority)}
                </Badge>
              </div>
              
              <div className="space-y-4 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">Assigned to: <span className="font-medium">{selectedTask.responsible}</span></span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">Due: <span className="font-medium">{formatDueDate(selectedTask.dueDate, selectedTask.dueTime)}</span></span>
                </div>
                
                {selectedTask.notes && (
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium">Notes</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedTask.notes}</p>
                  </div>
                )}
                
                {selectedTask.orderNumber && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Order: <span className="font-medium">#{selectedTask.orderNumber}</span></span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between border-t border-gray-200 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const nextStatus: Record<TaskStatus, TaskStatus> = {
                      pending: 'in-progress',
                      'in-progress': 'completed',
                      completed: 'pending'
                    };
                    updateTaskStatus(selectedTask.id, nextStatus[selectedTask.status]);
                    setSelectedTask({...selectedTask, status: nextStatus[selectedTask.status]});
                  }}
                >
                  {selectedTask.status === 'completed' ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      <span>Mark as Pending</span>
                    </>
                  ) : selectedTask.status === 'in-progress' ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      <span>Mark as Complete</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Start Task</span>
                    </>
                  )}
                </Button>
                <Button variant="outline">
                  <Pencil className="h-4 w-4 mr-2" />
                  <span>Edit</span>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

interface TaskRowProps {
  task: TaskProps;
  onStatusChange: (status: TaskStatus) => void;
  onPriorityChange: (priority: TaskPriority) => void;
  onTaskUpdate: (fields: Partial<TaskProps>) => void;
  onClick: () => void;
}

function TaskRow({ task, onStatusChange, onPriorityChange, onTaskUpdate, onClick }: TaskRowProps) {
  return (
    <div 
      className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium">{task.title}</h3>
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <PriorityBadge priority={task.priority} onChange={(p) => onPriorityChange(p)} />
            <StatusBadge status={task.status} onChange={(s) => onStatusChange(s)} />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600">Order: #{task.orderNumber}</p>
        <p className="text-sm text-gray-600">Responsible: {task.responsible}</p>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <Clock className="h-4 w-4 mr-2 text-gray-400" />
          <span>Due: {formatDueDate(task.dueDate, task.dueTime)}</span>
        </div>
      </div>
    </div>
  );
}

function formatDueDate(dueDate: string, dueTime?: string) {
  try {
    const date = new Date(dueDate);
    const formattedDate = format(date, "MMM d, yyyy");
    
    if (dueTime) {
      return `${formattedDate} at ${dueTime}`;
    }
    
    return formattedDate;
  } catch (error) {
    return "Invalid date";
  }
}

function getStatusBadgeStyles(status: TaskStatus) {
  switch (status) {
    case 'pending':
      return 'bg-blue-100 text-blue-800';
    case 'in-progress':
      return 'bg-purple-100 text-purple-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getStatusLabel(status: TaskStatus) {
  if (status === 'in-progress') return 'In Progress';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getPriorityBadgeStyles(priority: TaskPriority) {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getPriorityLabel(priority: TaskPriority) {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

interface PriorityBadgeProps {
  priority: TaskPriority;
  onChange: (priority: TaskPriority) => void;
}

function PriorityBadge({ priority, onChange }: PriorityBadgeProps) {
  const getBadgeStyles = () => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLabel = () => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  return (
    <Badge 
      className={`cursor-pointer ${getBadgeStyles()}`}
      onClick={() => {
        const nextPriority: Record<TaskPriority, TaskPriority> = {
          high: 'medium',
          medium: 'low',
          low: 'high'
        };
        onChange(nextPriority[priority]);
      }}
    >
      {getLabel()}
    </Badge>
  );
}

interface StatusBadgeProps {
  status: TaskStatus;
  onChange: (status: TaskStatus) => void;
}

function StatusBadge({ status, onChange }: StatusBadgeProps) {
  const getBadgeStyles = () => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLabel = () => {
    if (status === 'in-progress') return 'In Progress';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Badge 
      className={`cursor-pointer ${getBadgeStyles()}`}
      onClick={() => {
        const nextStatus: Record<TaskStatus, TaskStatus> = {
          pending: 'in-progress',
          'in-progress': 'completed',
          completed: 'pending'
        };
        onChange(nextStatus[status]);
      }}
    >
      {getLabel()}
    </Badge>
  );
}

interface EmptyTaskListProps {
  query: string;
  status?: TaskStatus;
}

function EmptyTaskList({ query, status }: EmptyTaskListProps) {
  let message = "No tasks found";
  
  if (query) {
    message = `No tasks found matching "${query}"`;
  } else if (status) {
    message = `No ${status === 'in-progress' ? 'in-progress' : status} tasks`;
  }
  
  return (
    <div className="text-center py-10 border border-gray-200 rounded-lg bg-white">
      <ListChecks className="mx-auto h-12 w-12 text-gray-300" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">{message}</h3>
      <p className="mt-1 text-sm text-gray-500">
        {!query ? "Create a task to get started." : "Try modifying your search."}
      </p>
    </div>
  );
}
