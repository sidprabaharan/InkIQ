
import { TaskList } from "@/components/tasks/TaskList";
import { useTasks } from "@/context/TaskContext";
import { ClipboardList } from "lucide-react";

export default function Tasks() {
  const { tasks } = useTasks();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <ClipboardList className="h-6 w-6 mr-2" />
        <h1 className="text-2xl font-bold">Tasks</h1>
      </div>
      
      <TaskList tasks={tasks} />
    </div>
  );
}
