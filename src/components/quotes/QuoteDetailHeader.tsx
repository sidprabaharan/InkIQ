import { Button } from "@/components/ui/button";
import { ChevronRight, Printer, Copy, ListChecks, MessageCircle, Edit, Link, File, Trash, Download, DollarSign, Truck, Package, ListPlus, Wrench, Box } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StatusDropdown } from "./StatusDropdown";
import { useState } from "react";
import { PackingSlip } from "./PackingSlip";
import { ShippingLabelDialog } from "./ShippingLabelDialog";
import { BoxLabelDialog } from "./BoxLabelDialog";
import { TaskPriority, TaskProps, TaskStatus } from "@/types/task";
import { TasksHeader } from "@/components/tasks/TasksHeader";
import { TaskSearch } from "@/components/tasks/TaskSearch";
import { TasksList } from "@/components/tasks/TasksList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface QuoteDetailHeaderProps {
  quoteId: string;
  status: string;
  customerInfo?: any;
  items?: any[];
}

export function QuoteDetailHeader({ 
  quoteId, 
  status: initialStatus, 
  customerInfo, 
  items = [] 
}: QuoteDetailHeaderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState(initialStatus);
  const [packingSlipOpen, setPackingSlipOpen] = useState(false);
  const [shippingLabelOpen, setShippingLabelOpen] = useState(false);
  const [boxLabelOpen, setBoxLabelOpen] = useState(false);
  const [tasksDialogOpen, setTasksDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<TaskProps[]>([
    { 
      id: '101', 
      title: 'Verify quote details', 
      dueDate: new Date().toISOString(),
      status: 'pending', 
      responsible: 'Emma Coordinator',
      priority: 'high',
      notes: 'Ensure all measurements are correct before proceeding',
      orderNumber: quoteId,
      orderId: quoteId
    },
    { 
      id: '102', 
      title: 'Schedule client consultation', 
      dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      status: 'pending', 
      responsible: 'Jennifer Specialist',
      priority: 'medium',
      orderNumber: quoteId,
      orderId: quoteId
    }
  ]);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  
  const isInvoice = !status.toLowerCase().startsWith('quote');
  const documentType = isInvoice ? "Invoice" : "Quote";
  
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.responsible.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDuplicate = () => {
    toast({
      title: `${documentType} duplicated`,
      description: `A new ${documentType.toLowerCase()} has been created based on this one`,
    });
    navigate("/quotes/new");
  };
  
  const handlePrint = () => {
    toast({
      title: `Printing ${documentType.toLowerCase()}`,
      description: `The ${documentType.toLowerCase()} would be sent to the printer in a real application`,
    });
    window.print();
  };
  
  const handleEditDocument = () => {
    toast({
      title: `Edit ${documentType}`,
      description: `Editing ${documentType.toLowerCase()} #${quoteId}`,
    });
  };
  
  const handleDocumentLink = () => {
    toast({
      title: `${documentType} Link Generated`,
      description: "Link copied to clipboard",
    });
  };
  
  const handlePackingSlip = () => {
    setPackingSlipOpen(true);
  };
  
  const handleShipping = () => {
    setShippingLabelOpen(true);
  };
  
  const handleBoxLabel = () => {
    setBoxLabelOpen(true);
  };
  
  const handleAddLineItemsToPO = () => {
    toast({
      title: "Add to PO",
      description: "Adding line items to purchase order",
    });
  };
  
  const handleWorkOrder = () => {
    const workOrderUrl = `/work-orders/${quoteId}`;
    window.open(workOrderUrl, '_blank');
    toast({
      title: "Work Order",
      description: `Work order for ${documentType.toLowerCase()} #${quoteId} opened in new tab`,
    });
  };
  
  const handlePrintBoxLabels = () => {
    setBoxLabelOpen(true);
  };
  
  const handleDownloadPDF = () => {
    toast({
      title: "Download PDF",
      description: `Downloading ${documentType.toLowerCase()} PDF`,
    });
  };
  
  const handlePaymentExpenses = () => {
    toast({
      title: "Payment/Expenses",
      description: `Managing payment and expenses for ${documentType.toLowerCase()} #${quoteId}`,
    });
  };
  
  const handleApproval = () => {
    toast({
      title: "Approval",
      description: `Processing approval for ${documentType.toLowerCase()} #${quoteId}`,
    });
  };
  
  const handleDelete = () => {
    toast({
      title: `${documentType} deleted`,
      description: `The ${documentType.toLowerCase()} has been deleted`,
    });
    navigate("/quotes");
  };
  
  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

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

  const addTask = (newTask: TaskProps) => {
    const taskWithOrderId = {
      ...newTask,
      orderId: quoteId,
      orderNumber: newTask.orderNumber || quoteId
    };
    
    setTasks([taskWithOrderId, ...tasks]);
    toast({
      description: "New task created successfully",
    });
  };

  const handleViewAllTasks = () => {
    navigate(`/work-orders/${quoteId}/tasks`);
  };
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex gap-4 items-center">
        <h1 className="text-2xl font-semibold">{documentType} #{quoteId}</h1>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          onClick={() => setTasksDialogOpen(true)}
        >
          <ListChecks className="h-4 w-4" />
          Tasks
        </Button>
        
        <Button variant="outline" size="sm" className="gap-1">
          <MessageCircle className="h-4 w-4" />
          Messages
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <StatusDropdown currentStatus={status} onStatusChange={handleStatusChange} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              More Actions <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white">
            <DropdownMenuItem onClick={handleApproval}>
              Approval
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEditDocument}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDocumentLink}>
              <Link className="h-4 w-4 mr-2" />
              {documentType} Link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePackingSlip}>
              <Package className="h-4 w-4 mr-2" />
              Packing Slip
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShipping}>
              <Truck className="h-4 w-4 mr-2" />
              Shipping
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleBoxLabel}>
              <Box className="h-4 w-4 mr-2" />
              Box Label
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAddLineItemsToPO}>
              <ListPlus className="h-4 w-4 mr-2" />
              Add Line Items to PO
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleWorkOrder}>
              <Wrench className="h-4 w-4 mr-2" />
              Work Order
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePaymentExpenses}>
              <DollarSign className="h-4 w-4 mr-2" />
              Payment/Expenses
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDuplicate}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash className="h-4 w-4 mr-2" />
              Delete {documentType}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Dialog open={tasksDialogOpen} onOpenChange={setTasksDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tasks for {documentType} #{quoteId}</DialogTitle>
            <DialogDescription>
              View and manage tasks associated with this {documentType.toLowerCase()}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <div className="flex justify-between items-center">
              <TasksHeader 
                title={`${documentType} #${quoteId} Tasks`}
                onCreateTask={addTask}
                initialOrderNumber={quoteId}
              />
            </div>
            
            <TaskSearch 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Search tasks..."
            />
            
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Tasks</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <TasksList
                  tasks={filteredTasks}
                  expandedTaskId={expandedTaskId}
                  toggleExpandTask={toggleExpandTask}
                  onStatusChange={updateTaskStatus}
                  onPriorityChange={updateTaskPriority}
                  onTaskUpdate={updateTask}
                  searchQuery={searchQuery}
                  orderId={quoteId}
                />
              </TabsContent>
              
              <TabsContent value="pending">
                <TasksList
                  tasks={filteredTasks}
                  expandedTaskId={expandedTaskId}
                  toggleExpandTask={toggleExpandTask}
                  onStatusChange={updateTaskStatus}
                  onPriorityChange={updateTaskPriority}
                  onTaskUpdate={updateTask}
                  status="pending"
                  searchQuery={searchQuery}
                  orderId={quoteId}
                />
              </TabsContent>
              
              <TabsContent value="in-progress">
                <TasksList
                  tasks={filteredTasks}
                  expandedTaskId={expandedTaskId}
                  toggleExpandTask={toggleExpandTask}
                  onStatusChange={updateTaskStatus}
                  onPriorityChange={updateTaskPriority}
                  onTaskUpdate={updateTask}
                  status="in-progress"
                  searchQuery={searchQuery}
                  orderId={quoteId}
                />
              </TabsContent>
              
              <TabsContent value="completed">
                <TasksList
                  tasks={filteredTasks}
                  expandedTaskId={expandedTaskId}
                  toggleExpandTask={toggleExpandTask}
                  onStatusChange={updateTaskStatus}
                  onPriorityChange={updateTaskPriority}
                  onTaskUpdate={updateTask}
                  status="completed"
                  searchQuery={searchQuery}
                  orderId={quoteId}
                />
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end">
              <Button onClick={handleViewAllTasks} variant="outline">
                View All Tasks
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <PackingSlip
        open={packingSlipOpen}
        onOpenChange={setPackingSlipOpen}
        quoteId={quoteId}
        customerInfo={customerInfo}
        items={items || []}
      />
      
      <ShippingLabelDialog
        open={shippingLabelOpen}
        onOpenChange={setShippingLabelOpen}
        quoteId={quoteId}
        customerInfo={customerInfo}
      />
      
      <BoxLabelDialog
        open={boxLabelOpen}
        onOpenChange={setBoxLabelOpen}
        quoteId={quoteId}
        customerInfo={customerInfo}
        orderNickname="Project Care Quote"
      />
    </div>
  );
}
