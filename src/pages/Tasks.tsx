
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  ListChecks, 
  Plus,
  Search,
  Check,
  ChevronDown,
  Calendar,
  Clock,
  Edit,
  Save,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";

type TaskStatus = 'pending' | 'in-progress' | 'completed';
type TaskPriority = 'low' | 'medium' | 'high';

type TaskProps = {
  id: string;
  title: string;
  dueDate: string;
  status: TaskStatus;
  customer: string;
  priority: TaskPriority;
  notes?: string;
  assignedDate?: string;
};

export default function Tasks() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const mockTasks: TaskProps[] = [
    { 
      id: '1', 
      title: 'Follow up with ABC Corp', 
      dueDate: '2023-09-15', 
      assignedDate: '2023-09-10',
      status: 'pending', 
      customer: 'ABC Corporation', 
      priority: 'high',
      notes: 'Need to discuss pricing and timeline for the new project.' 
    },
    { 
      id: '2', 
      title: 'Send revised quote', 
      dueDate: '2023-09-18', 
      assignedDate: '2023-09-12',
      status: 'pending', 
      customer: 'XYZ Inc', 
      priority: 'medium',
      notes: 'Include the additional services they requested in the meeting.' 
    },
    { 
      id: '3', 
      title: 'Schedule installation', 
      dueDate: '2023-09-20', 
      assignedDate: '2023-09-05',
      status: 'pending', 
      customer: '123 Industries', 
      priority: 'low',
      notes: 'Verify their availability for the installation date.' 
    },
    { 
      id: '4', 
      title: 'Collect payment', 
      dueDate: '2023-09-10', 
      assignedDate: '2023-08-25',
      status: 'completed', 
      customer: 'Smith Design', 
      priority: 'high',
      notes: 'Invoice #12345 has been sent.' 
    },
    { 
      id: '5', 
      title: 'Order materials', 
      dueDate: '2023-09-12', 
      assignedDate: '2023-09-01',
      status: 'in-progress', 
      customer: 'Johnson Printing', 
      priority: 'medium',
      notes: 'Check inventory before placing the order.' 
    },
  ];

  const [tasks, setTasks] = useState<TaskProps[]>(mockTasks);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    toast({
      description: "Task status updated successfully",
    });
  };

  const updateTaskPriority = (taskId: string, newPriority: TaskPriority) => {
    console.log(`Updating task ${taskId} priority to ${newPriority}`);
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, priority: newPriority } : task
    );
    setTasks(updatedTasks);
    toast({
      description: "Task priority updated successfully",
    });
  };

  const updateTask = (taskId: string, updatedFields: Partial<TaskProps>) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, ...updatedFields } : task
    );
    setTasks(updatedTasks);
    toast({
      description: "Task updated successfully",
    });
  };

  const toggleExpandTask = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
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
  );
}

interface TaskCardProps {
  task: TaskProps;
  onStatusChange: (status: TaskStatus) => void;
  onPriorityChange: (priority: TaskPriority) => void;
  onTaskUpdate: (fields: Partial<TaskProps>) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function TaskCard({ 
  task, 
  onStatusChange, 
  onPriorityChange, 
  onTaskUpdate,
  isExpanded,
  onToggleExpand
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatStatus = (status: TaskStatus) => {
    return status === 'in-progress' 
      ? 'In Progress' 
      : status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleEditSave = () => {
    if (isEditing) {
      onTaskUpdate(editedTask);
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  return (
    <Card 
      className={`hover:shadow-md transition-all cursor-pointer ${isExpanded ? 'scale-[1.02]' : ''}`}
      onClick={() => !isEditing && onToggleExpand()}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            {isEditing ? (
              <Input 
                value={editedTask.title}
                onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                onClick={(e) => e.stopPropagation()}
                className="font-medium"
              />
            ) : (
              <h3 className="font-medium">{task.title}</h3>
            )}
            <p className="text-sm text-gray-500">
              {isEditing ? (
                <Input 
                  value={editedTask.customer}
                  onChange={(e) => setEditedTask({...editedTask, customer: e.target.value})}
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm"
                />
              ) : (
                `Responsible: ${task.customer}`
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Select
              value={task.priority}
              onValueChange={(value: TaskPriority) => {
                console.log(`Select changing priority to: ${value}`);
                onPriorityChange(value);
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <SelectTrigger className={`h-8 text-xs min-w-16 ${priorityColors[task.priority]}`}>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={task.status}
              onValueChange={(value: TaskStatus) => {
                console.log(`Select changing status to: ${value}`);
                onStatusChange(value);
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <SelectTrigger 
                className={`h-8 text-xs ${statusColors[task.status]} ${
                  task.status === 'in-progress' 
                    ? 'min-w-28' 
                    : task.status === 'completed' 
                      ? 'min-w-28' 
                      : 'min-w-24'
                }`}
              >
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
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                handleEditSave();
              }}
              className="h-8"
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            </Button>
            
            {isEditing && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                className="h-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            {isEditing ? (
              <Input 
                type="date"
                value={editedTask.dueDate}
                onChange={(e) => setEditedTask({...editedTask, dueDate: e.target.value})}
                onClick={(e) => e.stopPropagation()}
                className="text-sm h-8"
              />
            ) : (
              <p className="text-sm">Due: {formatDate(task.dueDate)}</p>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-3 animate-fade-in">
            <div>
              {isEditing ? (
                <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                  <label className="text-sm font-medium">Notes:</label>
                  <Textarea 
                    value={editedTask.notes || ''}
                    onChange={(e) => setEditedTask({...editedTask, notes: e.target.value})}
                    placeholder="Add notes here..."
                    className="mt-1"
                  />
                </div>
              ) : (
                <>
                  {task.notes && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Notes:</p>
                      <p className="text-sm mt-1 bg-gray-50 p-2 rounded">{task.notes}</p>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <p className="text-sm">Assigned: {task.assignedDate ? formatDate(task.assignedDate) : 'Not assigned'}</p>
            </div>
          </div>
        )}
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
