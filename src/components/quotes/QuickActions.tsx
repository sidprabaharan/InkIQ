import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mail, 
  Printer, 
  Download, 
  Copy, 
  Package, 
  Truck, 
  FileText,
  Edit,
  MessageSquare
} from "lucide-react";

interface QuickActionsProps {
  onSendEmail?: () => void;
  onPrint?: () => void;
  onDownload?: () => void;
  onDuplicate?: () => void;
  onPackingSlip?: () => void;
  onShippingLabel?: () => void;
  onGenerateInvoice?: () => void;
  onEdit?: () => void;
  onAddNote?: () => void;
}

export function QuickActions({
  onSendEmail,
  onPrint,
  onDownload,
  onDuplicate,
  onPackingSlip,
  onShippingLabel,
  onGenerateInvoice,
  onEdit,
  onAddNote
}: QuickActionsProps) {
  const primaryActions = [
    {
      label: "Send Email",
      icon: Mail,
      onClick: onSendEmail,
      variant: "default" as const,
      className: "bg-blue-600 hover:bg-blue-700"
    },
    {
      label: "Print Quote",
      icon: Printer,
      onClick: onPrint,
      variant: "outline" as const
    },
    {
      label: "Generate Invoice",
      icon: FileText,
      onClick: onGenerateInvoice,
      variant: "outline" as const
    }
  ];

  const secondaryActions = [
    {
      label: "Download PDF",
      icon: Download,
      onClick: onDownload
    },
    {
      label: "Duplicate",
      icon: Copy,
      onClick: onDuplicate
    },
    {
      label: "Edit Quote",
      icon: Edit,
      onClick: onEdit
    },
    {
      label: "Packing Slip",
      icon: Package,
      onClick: onPackingSlip
    },
    {
      label: "Shipping Label",
      icon: Truck,
      onClick: onShippingLabel
    },
    {
      label: "Add Note",
      icon: MessageSquare,
      onClick: onAddNote
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Actions */}
        <div className="grid grid-cols-1 gap-2">
          {primaryActions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              className={`justify-start gap-2 h-10 ${action.className || ''}`}
              onClick={action.onClick}
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </Button>
          ))}
        </div>

        {/* Secondary Actions */}
        <div className="pt-2 border-t border-border">
          <div className="grid grid-cols-2 gap-2">
            {secondaryActions.map((action) => (
              <Button
                key={action.label}
                variant="ghost"
                size="sm"
                className="justify-start gap-2 h-9"
                onClick={action.onClick}
              >
                <action.icon className="h-3 w-3" />
                <span className="text-xs">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}