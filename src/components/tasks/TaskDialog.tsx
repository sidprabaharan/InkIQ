
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTasks } from "@/context/TaskContext";
import { Task } from "@/types/task";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon } from "lucide-react";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId?: string;
  customerId?: string;
  orderId?: string;
}

export function TaskDialog({ open, onOpenChange, taskId, customerId, orderId }: TaskDialogProps) {
  const { addTask, updateTask, getTaskById } = useTasks();
  const { toast } = useToast();
  
  const existingTask = taskId ? getTaskById(taskId) : undefined;
  
  const [formData, setFormData] = useState<Partial<Task>>(
    existingTask || {
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      dueDate: new Date().toISOString().split('T')[0],
      assignedTo: "",
      customerId,
      orderId
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (existingTask) {
        updateTask(existingTask.id, formData);
        toast({
          title: "Task updated",
          description: "Task has been updated successfully"
        });
      } else {
        addTask(formData as Omit<Task, "id" | "createdAt">);
        toast({
          title: "Task created",
          description: "New task has been created successfully"
        });
      }
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save task",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{existingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <Input
              id="title"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority || "medium"}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status || "pending"}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium">Due Date</label>
              <div className="relative">
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate || ""}
                  onChange={handleChange}
                  required
                />
                <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="assignedTo" className="text-sm font-medium">Assigned To</label>
              <Input
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{existingTask ? "Update" : "Create"} Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
