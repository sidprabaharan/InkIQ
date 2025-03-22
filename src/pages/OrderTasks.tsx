
import { useParams, Link } from "react-router-dom";
import { useTasks } from "@/context/TaskContext";
import { TaskList } from "@/components/tasks/TaskList";
import { ClipboardList, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderTasks() {
  const { orderId } = useParams<{ orderId: string }>();
  const { getTasksByOrderId } = useTasks();
  
  const tasks = orderId ? getTasksByOrderId(orderId) : [];
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-2">
        <Link to={`/quotes/${orderId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Order
          </Button>
        </Link>
      </div>
      
      <div className="flex items-center mb-6">
        <ClipboardList className="h-6 w-6 mr-2" />
        <h1 className="text-2xl font-bold">Tasks for Order #{orderId}</h1>
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg mb-6">
        <div className="flex items-center mb-2">
          <FileText className="h-4 w-4 mr-2" />
          <h2 className="text-sm font-medium">Order Information</h2>
        </div>
        <p className="text-sm">Tasks related to order #{orderId}</p>
      </div>
      
      <TaskList tasks={tasks} orderId={orderId} />
    </div>
  );
}
