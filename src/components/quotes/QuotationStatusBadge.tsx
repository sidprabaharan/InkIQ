
interface QuotationStatusBadgeProps {
  status: string;
}

export function QuotationStatusBadge({ status }: QuotationStatusBadgeProps) {
  let badgeClasses = "status-badge";
  
  switch (status) {
    case "Artwork- SP/DTF":
      badgeClasses += " bg-green-500";
      break;
    case "Purchase Orders":
      badgeClasses += " bg-purple-600";
      break;
    case "Achieved Quote":
      badgeClasses += " bg-black";
      break;
    case "Miscellaneous":
      badgeClasses += " bg-purple-900";
      break;
    case "Short Collections":
      badgeClasses += " bg-black";
      break;
    case "On Hold":
      badgeClasses += " bg-red-600";
      break;
    case "Quote Approval Sent":
      badgeClasses += " bg-blue-500";
      break;
    case "Artwork- EMB":
      badgeClasses += " bg-green-500";
      break;
    default:
      badgeClasses += " bg-gray-500";
  }
  
  return <span className={badgeClasses}>{status}</span>;
}
