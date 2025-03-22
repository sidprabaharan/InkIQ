
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
  Image,
  Calendar
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
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

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
  const [viewImageIndex, setViewImageIndex] = useState<number | null>(null);
  
  const priorityColors = {
    high: "bg-red-50 text-red-600 hover:bg-red-100",
    medium: "bg-amber-50 text-amber-600 hover:bg-amber-100",
    low: "bg-blue-50 text-blue-600 hover:bg-blue-100"
  };
  
  const statusColors = {
    pending: "bg-gray-50 text-gray-600 hover:bg-gray-100",
    "in-progress": "bg-purple-50 text-purple-800 hover:bg-purple-100",
    completed: "bg-green-50 text-green-600 hover:bg-green-100"
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
  
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `${format(date, "MMM d, yyyy")} at ${format(date, "h:mm a")}`;
    } catch (error) {
      return "Invalid date";
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
    return status === 'in-progress' 
      ? 'In Progress' 
      : status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-3 w-full">
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold">{task.title}</h3>
              {task.orderNumber && (
                <p className="text-sm text-foreground">Order: #{task.orderNumber}</p>
              )}
              <p className="text-sm text-foreground mt-1">
                Responsible: {task.responsible}
              </p>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                <span>Due: {formatDateTime(task.dueDate)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 ml-4">
            <Badge
              className={`cursor-pointer px-4 py-1.5 ${priorityColors[task.priority]}`}
              onClick={() => {
                const nextPriority: Record<TaskPriority, TaskPriority> = {
                  high: 'medium',
                  medium: 'low',
                  low: 'high'
                };
                onPriorityChange(nextPriority[task.priority]);
              }}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} {task.priority === 'high' ? '↓' : task.priority === 'low' ? '↑' : '↕'}
            </Badge>
            
            <Badge
              className={`cursor-pointer px-4 py-1.5 ${statusColors[task.status]}`}
              onClick={() => {
                const nextStatus: Record<TaskStatus, TaskStatus> = {
                  pending: 'in-progress',
                  'in-progress': 'completed',
                  completed: 'pending'
                };
                onStatusChange(nextStatus[task.status]);
              }}
            >
              {getStatusLabel(task.status)} {task.status !== 'completed' ? '↓' : '↑'}
            </Badge>
            
            {isExpanded && (
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add edit functionality
                }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-6 space-y-4 animate-in">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Notes:</h4>
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
                <div className="bg-gray-50 p-3 rounded border border-gray-100">
                  <p className="text-sm text-gray-600">{task.notes || "No notes added."}</p>
                </div>
              )}
            </div>
            
            {task.images && task.images.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  <h4 className="text-sm font-medium">Attachments:</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {task.images.map((image, index) => (
                    <div key={image.id} className="relative">
                      <Dialog open={viewImageIndex === index} onOpenChange={() => setViewImageIndex(null)}>
                        <DialogContent className="sm:max-w-[80vw] p-1">
                          <img 
                            src={image.url} 
                            alt={image.name} 
                            className="w-full h-auto max-h-[80vh] object-contain"
                          />
                        </DialogContent>
                      </Dialog>
                      <div 
                        className="cursor-pointer"
                        onClick={() => setViewImageIndex(index)}
                      >
                        <img
                          src={image.url}
                          alt={image.name}
                          className="h-16 w-full object-cover rounded-md border border-gray-200"
                        />
                        <p className="text-xs mt-1 truncate">{image.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-gray-400" />
              <p>
                Assigned: {task.assignedDate ? formatDateTime(task.assignedDate) : "Not assigned"} 
                {task.assignedBy && <span> by {task.assignedBy}</span>}
              </p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end bg-gray-50 p-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleExpand}
          className="h-8"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
