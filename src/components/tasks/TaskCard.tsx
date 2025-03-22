
import { useState } from "react";
import { format } from "date-fns";
import { 
  CalendarIcon, 
  Clock, 
  Edit2, 
  ChevronDown, 
  ChevronUp,
  Trash,
  MessageCircle,
  Users,
  PlusCircle,
  Image
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TaskProps, TaskStatus, TaskPriority } from "@/types/task";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskCardProps {
  task: TaskProps;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onStatusChange: (status: TaskStatus) => void;
  onPriorityChange: (priority: TaskPriority) => void;
  onTaskUpdate: (fields: Partial<TaskProps>) => void;
}

export function TaskCard({ 
  task, 
  isExpanded, 
  onToggleExpand,
  onStatusChange,
  onPriorityChange,
  onTaskUpdate
}: TaskCardProps) {
  const { toast } = useToast();
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(task.notes || "");
  
  const priorityColors = {
    high: "bg-red-100 text-red-800 hover:bg-red-200",
    medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    low: "bg-blue-100 text-blue-800 hover:bg-blue-200"
  };
  
  const statusColors = {
    pending: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    "in-progress": "bg-purple-100 text-purple-800 hover:bg-purple-200",
    completed: "bg-green-100 text-green-800 hover:bg-green-200"
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "";
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };
  
  const formatTime = (dateString: string) => {
    try {
      if (!dateString) return "";
      return format(new Date(dateString), "h:mm a");
    } catch (error) {
      return "";
    }
  };
  
  const handleNotesUpdate = () => {
    setEditingNotes(false);
    onTaskUpdate({ notes });
  };
  
  const handleDeleteTask = () => {
    toast({
      title: "Task deleted",
      description: "The task has been removed"
    });
    // In a real app, you would add delete functionality here
  };

  const getStatusLabel = (status: TaskStatus) => {
    if (status === 'in-progress') return 'In Progress';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getPriorityLabel = (priority: TaskPriority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{task.title}</CardTitle>
            {task.orderNumber && (
              <CardDescription>
                Order #{task.orderNumber}
              </CardDescription>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Edit2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => setEditingNotes(true)}
              >
                Edit Notes
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="text-red-600" 
                onClick={handleDeleteTask}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          <div className="relative">
            <Select
              value={task.priority}
              onValueChange={(value) => onPriorityChange(value as TaskPriority)}
            >
              <SelectTrigger className={`h-9 px-3 py-1 rounded-sm border-none ${priorityColors[task.priority as TaskPriority]}`}>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative">
            <Select
              value={task.status}
              onValueChange={(value) => onStatusChange(value as TaskStatus)}
            >
              <SelectTrigger className={`h-9 px-3 py-1 rounded-sm border-none ${statusColors[task.status as TaskStatus]}`}>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>Due: {formatDate(task.dueDate)}</span>
            {task.dueTime && (
              <>
                <Clock className="h-4 w-4 ml-3 mr-2" />
                <span>{task.dueTime}</span>
              </>
            )}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>
              Assigned to: {task.responsible}
              {task.assignedBy && ` by ${task.assignedBy}`}
            </span>
          </div>
        </div>
      </CardContent>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            {editingNotes ? (
              <div className="space-y-2">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes..."
                  className="min-h-[100px]"
                />
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setNotes(task.notes || "");
                      setEditingNotes(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleNotesUpdate}
                  >
                    Save Notes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-sm font-medium">Notes:</div>
                <p className="text-sm text-gray-600 min-h-[40px]">
                  {task.notes || "No notes added."}
                </p>
              </div>
            )}
            
            {task.images && task.images.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Attachments:</div>
                <div className="flex flex-wrap gap-2">
                  {task.images.map((image) => (
                    <div key={image.id} className="border rounded p-2 flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      <span className="text-sm">{image.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {task.assignedDate && (
              <div className="text-xs text-gray-500">
                Created on {formatDate(task.assignedDate)}
              </div>
            )}
          </div>
        </CardContent>
      )}
      
      <CardFooter className="border-t bg-gray-50 p-2">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarFallback>
                {getInitials(task.responsible)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-600">
              {task.responsible}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs" 
              onClick={() => {
                toast({
                  description: "Comments feature coming soon"
                });
              }}
            >
              <MessageCircle className="h-3.5 w-3.5 mr-1" />
              Comment
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleExpand}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
