
import { useState } from "react";
import { Task } from "@/types/task";
import { TaskItem } from "./TaskItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskDialog } from "./TaskDialog";
import { Plus, Filter } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  customerId?: string;
  orderId?: string;
}

export function TaskList({ tasks, customerId, orderId }: TaskListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  
  // Apply filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || 
                          task.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-1" />
          <span className="text-sm mr-2">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-1" />
          <span className="text-sm mr-2">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
      
      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No tasks found. Create a new task to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
      
      <TaskDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        customerId={customerId}
        orderId={orderId}
      />
    </div>
  );
}
