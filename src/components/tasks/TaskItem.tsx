
import { useState } from "react";
import { Task } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskDialog } from "./TaskDialog";
import { Edit, Trash2, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useTasks } from "@/context/TaskContext";
import { useToast } from "@/hooks/use-toast";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { deleteTask, updateTask } = useTasks();
  const { toast } = useToast();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask(task.id);
      toast({
        title: "Task deleted",
        description: "Task has been deleted successfully"
      });
    }
  };

  const handleStatusChange = (status: Task['status']) => {
    updateTask(task.id, { status });
    toast({
      title: "Status updated",
      description: `Task status changed to ${status}`
    });
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch(priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">{task.description}</p>
            
            <div className="flex flex-wrap gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {task.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
              <div>
                <p className="font-medium">Due Date:</p>
                <p>{new Date(task.dueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-medium">Assigned To:</p>
                <p>{task.assignedTo}</p>
              </div>
            </div>
            
            {task.status !== 'completed' && task.status !== 'cancelled' && (
              <div className="flex flex-wrap gap-2 mt-2">
                {task.status !== 'in-progress' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8" 
                    onClick={() => handleStatusChange('in-progress')}
                  >
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    Start
                  </Button>
                )}
                {task.status !== 'completed' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8" 
                    onClick={() => handleStatusChange('completed')}
                  >
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    Complete
                  </Button>
                )}
                {task.status !== 'cancelled' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8" 
                    onClick={() => handleStatusChange('cancelled')}
                  >
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    Cancel
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <TaskDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        taskId={task.id} 
      />
    </>
  );
}
