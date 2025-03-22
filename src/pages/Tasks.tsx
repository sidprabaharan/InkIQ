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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

type TaskStatus = 'pending' | 'in-progress' | 'completed';
type TaskPriority = 'low' | 'medium' | 'high';

export const USERS = [
  { id: '1', name: 'John Manager' },
  { id: '2', name: 'Sarah Director' },
  { id: '3', name: 'Mike Supervisor' },
  { id: '4', name: 'Emma Coordinator' },
  { id: '5', name: 'David Team Lead' },
  { id: '6', name: 'Jennifer Specialist' },
  { id: '7', name: 'Michael Executive' },
  { id: '8', name: 'Olivia Associate' },
  { id: '9', name: 'Daniel Administrator' },
  { id: '10', name: 'Sophia Analyst' },
  { id: '11', name: 'James Consultant' },
  { id: '12', name: 'Emily Project Manager' },
];

type TaskProps = {
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
};

export default function Tasks() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const mockTasks: TaskProps[] = [
    { 
      id: '1', 
      title: 'Follow up with ABC Corp', 
      dueDate: '2023-09-15T15:30:00', 
      assignedDate: '2023-09-10T09:15:00',
      status: 'pending', 
      responsible: 'Emma Coordinator',
      priority: 'high',
      notes: 'Need to discuss pricing and timeline for the new project.',
      assignedBy: 'John Manager'
    },
    { 
      id: '2', 
      title: 'Send revised quote', 
      dueDate: '2023-09-18T17:00:00', 
      assignedDate: '2023-09-12T11:30:00',
      status: 'pending', 
      responsible: 'David Team Lead',
      priority: 'medium',
      notes: 'Include the additional services they requested in the meeting.',
      assignedBy: 'Sarah Director'
    },
    { 
      id: '3', 
      title: 'Schedule installation', 
      dueDate: '2023-09-20T10:00:00', 
      assignedDate: '2023-09-05T14:45:00',
      status: 'pending', 
      responsible: 'Jennifer Specialist',
      priority: 'low',
      notes: 'Verify their availability for the installation date.',
      assignedBy: 'Mike Supervisor'
    },
    { 
      id: '4', 
      title: 'Collect payment', 
      dueDate: '2023-09-10T12:00:00', 
      assignedDate: '2023-08-25T13:20:00',
      status: 'completed', 
      responsible: 'Michael Executive',
      priority: 'high',
      notes: 'Invoice #12345 has been sent.',
      assignedBy: 'Daniel Administrator'
    },
    { 
      id: '5', 
      title: 'Order materials', 
      dueDate: '2023-09-12T16:30:00', 
      assignedDate: '2023-09-01T08:45:00',
      status: 'in-progress', 
      responsible: 'Olivia Associate',
      priority: 'medium',
      notes: 'Check inventory before placing the order.',
      assignedBy: 'James Consultant'
    },
  ];

  const [tasks, setTasks] = useState<TaskProps[]>(mockTasks);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.responsible.toLowerCase().includes(searchQuery.toLowerCase())
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
  const [date, setDate] = useState<Date | undefined>(
    task.dueDate ? new Date(task.dueDate) : undefined
  );
  
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
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDateTime = (dateString: string) => {
    return `${formatDate(dateString)} at ${formatTime(dateString)}`;
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

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const currentDate = editedTask.dueDate ? new Date(editedTask.dueDate) : new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    
    date.setHours(hours);
    date.setMinutes(minutes);
    
    setDate(date);
    setEditedTask({...editedTask, dueDate: date.toISOString()});
  };

  const handleHourChange = (hour: number) => {
    const currentDate = editedTask.dueDate ? new Date(editedTask.dueDate) : new Date();
    const isPM = currentDate.getHours() >= 12;
    // If PM and hour selected is 1-11, add 12; if AM and hour is 12, set to 0
    const adjustedHour = isPM && hour < 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
    
    currentDate.setHours(adjustedHour);
    setEditedTask({...editedTask, dueDate: currentDate.toISOString()});
  };

  const handleMinuteChange = (minute: number) => {
    const currentDate = editedTask.dueDate ? new Date(editedTask.dueDate) : new Date();
    currentDate.setMinutes(minute);
    setEditedTask({...editedTask, dueDate: currentDate.toISOString()});
  };

  const handleAmPmChange = (isPm: boolean) => {
    const currentDate = editedTask.dueDate ? new Date(editedTask.dueDate) : new Date();
    let hours = currentDate.getHours();
    const isCurrentlyPm = hours >= 12;
    
    if (isPm && !isCurrentlyPm) {
      // Converting AM to PM
      hours += 12;
    } else if (!isPm && isCurrentlyPm) {
      // Converting PM to AM
      hours -= 12;
    }
    
    currentDate.setHours(hours);
    setEditedTask({...editedTask, dueDate: currentDate.toISOString()});
  };

  return (
    <Card 
      className={`hover:shadow-md transition-all cursor-pointer ${isExpanded ? 'scale-[1.02]' : ''}`}
      onClick={() => !isEditing && onToggleExpand()}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1 w-full max-w-lg">
            {isEditing ? (
              <Input 
                value={editedTask.title}
                onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                onClick={stopPropagation}
                className="font-medium text-base mb-4 border-gray-300 focus:border-primary"
                placeholder="Task title"
              />
            ) : (
              <h3 className="font-medium">{task.title}</h3>
            )}
            <p className="text-sm text-gray-500">
              {isEditing ? (
                <div onClick={stopPropagation} className="mt-4">
                  <label className="text-sm font-medium block mb-2">Responsible:</label>
                  <Select
                    value={editedTask.responsible}
                    onValueChange={(value: string) => setEditedTask({...editedTask, responsible: value})}
                  >
                    <SelectTrigger className="w-full bg-white border-gray-300">
                      <SelectValue placeholder="Select responsible person" />
                    </SelectTrigger>
                    <SelectContent>
                      {USERS.map((user) => (
                        <SelectItem key={user.id} value={user.name}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                `Responsible: ${task.responsible}`
              )}
            </p>
          </div>
          <div className="flex gap-2" onClick={stopPropagation}>
            <Select
              value={task.priority}
              onValueChange={(value: TaskPriority) => {
                console.log(`Select changing priority to: ${value}`);
                onPriorityChange(value);
              }}
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
        <div className="mt-3">
          {isEditing ? (
            <div className="flex flex-col space-y-4 mt-2" onClick={stopPropagation}>
              <div>
                <label className="text-sm font-medium block mb-2">Due Date & Time:</label>
                <div className="flex flex-col md:flex-row gap-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal bg-white border-gray-300 w-full md:w-[240px]",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal bg-white border-gray-300 w-full md:w-[140px]"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        <span>
                          {editedTask.dueDate 
                            ? format(new Date(editedTask.dueDate), "h:mm a") 
                            : "Select time"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-3 w-[280px]" align="start">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium">Hour</div>
                        <div className="text-sm font-medium">Minute</div>
                        <div className="text-sm font-medium">AM/PM</div>
                      </div>
                      <div className="flex justify-between gap-2">
                        <Select
                          value={(editedTask.dueDate 
                            ? new Date(editedTask.dueDate).getHours() % 12 || 12
                            : 12).toString()}
                          onValueChange={(value) => handleHourChange(parseInt(value))}
                        >
                          <SelectTrigger className="w-20 bg-white border-gray-300">
                            <SelectValue placeholder="Hour" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                              <SelectItem key={hour} value={hour.toString()}>
                                {hour}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select
                          value={(editedTask.dueDate 
                            ? new Date(editedTask.dueDate).getMinutes()
                            : 0).toString()}
                          onValueChange={(value) => handleMinuteChange(parseInt(value))}
                        >
                          <SelectTrigger className="w-20 bg-white border-gray-300">
                            <SelectValue placeholder="Min" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                              <SelectItem key={minute} value={minute.toString()}>
                                {minute.toString().padStart(2, '0')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select
                          value={editedTask.dueDate 
                            ? new Date(editedTask.dueDate).getHours() >= 12 ? "PM" : "AM"
                            : "AM"}
                          onValueChange={(value) => handleAmPmChange(value === "PM")}
                        >
                          <SelectTrigger className="w-20 bg-white border-gray-300">
                            <SelectValue placeholder="AM/PM" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AM">AM</SelectItem>
                            <SelectItem value="PM">PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <p className="text-sm">Due: {formatDateTime(task.dueDate)}</p>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4 animate-fade-in">
            <div>
              {isEditing ? (
                <div className="mt-2" onClick={stopPropagation}>
                  <label className="text-sm font-medium block mb-2">Notes:</label>
                  <Textarea 
                    value={editedTask.notes || ''}
                    onChange={(e) => setEditedTask({...editedTask, notes: e.target.value})}
                    placeholder="Add notes here..."
                    className="min-h-[100px] border-gray-300 bg-white"
                  />
                </div>
              ) : (
                <>
                  {task.notes && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Notes:</p>
                      <p className="text-sm mt-1 bg-gray-50 p-3 rounded border border-gray-100">{task.notes}</p>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <p className="text-sm">
                {task.assignedDate 
                  ? <>
                      Assigned: {formatDateTime(task.assignedDate)} 
                      {task.assignedBy && <span> by {task.assignedBy}</span>}
                    </> 
                  : 'Not assigned'}
              </p>
            </div>

            {isEditing && (
              <div onClick={stopPropagation} className="mt-2">
                <label className="text-sm font-medium block mb-2">Assigned By:</label>
                <Select
                  value={editedTask.assignedBy || ''}
                  onValueChange={(value: string) => setEditedTask({...editedTask, assignedBy: value})}
                >
                  <SelectTrigger className="w-full bg-white border-gray-300">
                    <SelectValue placeholder="Select who assigned this task" />
                  </SelectTrigger>
                  <SelectContent>
                    {USERS.map((user) => (
                      <SelectItem key={user.id} value={user.name}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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
