
import { cva } from "class-variance-authority";

interface QuotationStatusBadgeProps {
  status: string;
}

const statusVariants = cva(
  "inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-normal",
  {
    variants: {
      variant: {
        quote: "bg-blue-500 text-white",
        quoteApprovalSent: "bg-blue-500 text-white",
        quoteApproved: "bg-blue-500 text-white",
        artwork: "bg-green-500 text-white",
        purchaseOrders: "bg-purple-600 text-white",
        production: "bg-orange-400 text-white",
        shipping: "bg-purple-500 text-white",
        complete: "bg-yellow-400 text-white",
        miscellaneous: "bg-purple-900 text-white",
        canceled: "bg-black text-white",
        achievedQuote: "bg-black text-white",
        shortCollections: "bg-black text-white",
        onHold: "bg-red-600 text-white",
        default: "bg-gray-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export function QuotationStatusBadge({ status }: QuotationStatusBadgeProps) {
  // Function to convert status to a variant key (lowercase, no spaces)
  const getVariant = (status: string): string => {
    const normalizedStatus = status.toLowerCase().replace(/\s+/g, '');
    
    // Map status to variant
    const statusMap: Record<string, string> = {
      'quote': 'quote',
      'quoteapprovalsent': 'quoteApprovalSent',
      'quoteapproved': 'quoteApproved',
      'artwork': 'artwork',
      'artwork-specialty': 'artwork',
      'artwork-emb': 'artwork',
      'artwork-sp': 'artwork',
      'artwork-dtf': 'artwork',
      'artwork-embsp': 'artwork',
      'artwork-embstf': 'artwork',
      'artwork-spdtf': 'artwork',
      'artwork-empspdtf': 'artwork',
      'purchaseorders': 'purchaseOrders',
      'production': 'production',
      'shipping': 'shipping',
      'complete': 'complete',
      'miscellaneous': 'miscellaneous',
      'canceled': 'canceled',
      'achievedquote': 'achievedQuote',
      'shortcollections': 'shortCollections',
      'onhold': 'onHold',
    };
    
    return statusMap[normalizedStatus] || 'default';
  };

  const variant = getVariant(status);
  
  return (
    <span className={statusVariants({ variant: variant as any })}>
      {status}
    </span>
  );
}
