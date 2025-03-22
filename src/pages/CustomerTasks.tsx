
import { useParams, Link } from "react-router-dom";
import { useTasks } from "@/context/TaskContext";
import { useCustomers } from "@/context/CustomersContext";
import { TaskList } from "@/components/tasks/TaskList";
import { ClipboardList, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomerTasks() {
  const { customerId } = useParams<{ customerId: string }>();
  const { getTasksByCustomerId } = useTasks();
  const { getCustomerById } = useCustomers();
  
  const customer = customerId ? getCustomerById(customerId) : undefined;
  const tasks = customerId ? getTasksByCustomerId(customerId) : [];
  
  if (!customer) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p>Customer not found.</p>
        <Link to="/customers">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-2">
        <Link to="/customers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>
      
      <div className="flex items-center mb-6">
        <ClipboardList className="h-6 w-6 mr-2" />
        <h1 className="text-2xl font-bold">Tasks for {customer.companyName}</h1>
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg mb-6">
        <div className="flex items-center mb-2">
          <User className="h-4 w-4 mr-2" />
          <h2 className="text-sm font-medium">Customer Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><span className="font-medium">Contact:</span> {customer.firstName} {customer.lastName}</p>
            <p><span className="font-medium">Email:</span> {customer.email}</p>
          </div>
          <div>
            <p><span className="font-medium">Phone:</span> {customer.phoneNumber}</p>
            <p><span className="font-medium">Industry:</span> {customer.industry}</p>
          </div>
        </div>
      </div>
      
      <TaskList tasks={tasks} customerId={customerId} />
    </div>
  );
}
