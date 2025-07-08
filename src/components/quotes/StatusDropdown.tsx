
import { Check, Image, Package, Tag, CheckCircle2, Ban, Clock, AlertCircle, Truck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface StatusDropdownProps {
  currentStatus: string;
  onStatusChange: (newStatus: string) => void;
}

export function StatusDropdown({ currentStatus, onStatusChange }: StatusDropdownProps) {
  const { toast } = useToast();
  
  const handleStatusSelect = (status: string) => {
    onStatusChange(status);
    toast({
      title: "Status Updated",
      description: `Quote status changed to "${status}"`,
    });
  };

  // Define the status options with their styling - focused on line item production statuses
  const statusOptions = [
    // Blue statuses
    { name: "Quote", color: "bg-blue-500 text-white", icon: <Tag className="h-4 w-4 mr-2" /> },
    
    // Green statuses
    { name: "Artwork", color: "bg-green-500 text-white", icon: <Image className="h-4 w-4 mr-2" /> },
    
    // Orange statuses  
    { name: "Production", color: "bg-orange-400 text-white", icon: <Package className="h-4 w-4 mr-2" /> },
    
    // Purple statuses
    { name: "Quality Control", color: "bg-purple-600 text-white", icon: <CheckCircle2 className="h-4 w-4 mr-2" /> },
    { name: "Shipping", color: "bg-purple-500 text-white", icon: <Truck className="h-4 w-4 mr-2" /> },
    
    // Yellow/Green statuses
    { name: "Complete", color: "bg-green-600 text-white", icon: <Check className="h-4 w-4 mr-2" /> },
    
    // Red statuses
    { name: "On Hold", color: "bg-red-600 text-white", icon: <Clock className="h-4 w-4 mr-2" /> },
    { name: "Canceled", color: "bg-red-800 text-white", icon: <Ban className="h-4 w-4 mr-2" /> },
  ];

  // Determine if current status is any type of Artwork status
  const isArtworkStatus = currentStatus.toLowerCase().includes('artwork');
  
  // Display status should be Artwork if it's any artwork variation
  const displayStatus = isArtworkStatus ? "Artwork" : currentStatus;
  
  // Find the class for the current status button
  let currentStatusData = statusOptions.find(option => option.name === displayStatus);
  
  // If not found (could be a custom or old status format), try to match by category
  if (!currentStatusData) {
    if (isArtworkStatus) {
      currentStatusData = statusOptions.find(option => option.name === "Artwork");
    } else {
      // Fix: Add the required 'name' property to the default fallback object
      currentStatusData = { 
        name: "Unknown Status", 
        color: "bg-gray-500 text-white", 
        icon: <Tag className="h-4 w-4 mr-2" /> 
      };
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`px-3 py-1 h-auto rounded-full text-sm font-normal ${currentStatusData.color}`}
        >
          {displayStatus}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-[70vh] overflow-y-auto bg-white">
        {statusOptions.map((status, index) => (
          <DropdownMenuItem 
            key={index}
            className={`${status.color} my-1 rounded-md`}
            onClick={() => handleStatusSelect(status.name)}
          >
            {status.icon}
            {status.name}
            {status.name === displayStatus && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="bg-gray-100 text-gray-600 my-1 rounded-md"
          onClick={() => toast({
            title: "Customize Status",
            description: "Custom status feature will be implemented in the future",
          })}
        >
          Customize Status
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
