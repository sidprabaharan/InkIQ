
import React, { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PackingSlip } from './PackingSlip';
import { BoxLabelDialog } from './BoxLabelDialog';
import { StatusDropdown } from './StatusDropdown';
import { MoreHorizontal, ClipboardCopy, PackageCheck, PackagePlus } from 'lucide-react';

interface QuoteDetailHeaderProps {
  quoteId: string;
  status: string;
  customerInfo: {
    name: string;
    companyName: string;
    address1: string;
    address2?: string;
    city: string;
    stateProvince: string;
    zipCode: string;
    country: string;
    phone?: string;
    email?: string;
  };
  items: any[];
  poNumber?: string;
  nickName?: string;
}

export const QuoteDetailHeader: React.FC<QuoteDetailHeaderProps> = ({ 
  quoteId, 
  status, 
  customerInfo,
  items,
  poNumber = "",
  nickName = ""
}) => {
  const [isPackingSlipOpen, setIsPackingSlipOpen] = useState(false);
  const [isBoxLabelOpen, setIsBoxLabelOpen] = useState(false);
  
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
  };
  
  const handleOpenWorkOrder = () => {
    window.open(`/work-order/${quoteId}`, '_blank');
  };
  
  const customerDisplayInfo = {
    name: customerInfo.name,
    companyName: customerInfo.companyName
  };
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <div className="flex items-center gap-4 mb-2">
          <StatusDropdown currentStatus={status} />
          <span className="text-gray-500">PO# {poNumber}</span>
        </div>
        {nickName && <div className="text-lg">{nickName}</div>}
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={handleOpenWorkOrder}>
          <PackageCheck className="h-4 w-4 mr-2" />
          Work Order
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreHorizontal className="h-4 w-4 mr-2" />
              More Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsPackingSlipOpen(true)}>
              <PackageCheck className="h-4 w-4 mr-2" />
              Packing Slip
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsBoxLabelOpen(true)}>
              <PackagePlus className="h-4 w-4 mr-2" />
              Box Labels
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyUrl}>
              <ClipboardCopy className="h-4 w-4 mr-2" />
              Copy URL
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <PackingSlip 
        open={isPackingSlipOpen} 
        onOpenChange={setIsPackingSlipOpen}
        quoteId={quoteId}
        customerInfo={customerInfo}
        items={items}
      />
      
      <BoxLabelDialog
        open={isBoxLabelOpen}
        onOpenChange={setIsBoxLabelOpen}
        quoteId={quoteId}
        customerInfo={customerDisplayInfo}
        quoteNickname={nickName}
        poNumber={poNumber}
      />
    </div>
  );
};
