import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CapacityBadgeProps {
  current: number;
  total: number;
  utilizationPercentage: number;
}

export function CapacityBadge({ current, total, utilizationPercentage }: CapacityBadgeProps) {
  const getVariant = () => {
    if (utilizationPercentage >= 100) return "destructive";
    if (utilizationPercentage >= 80) return "secondary";
    return "default";
  };

  const getBgColor = () => {
    if (utilizationPercentage >= 100) return "bg-red-100 text-red-800 border-red-300";
    if (utilizationPercentage >= 80) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-green-100 text-green-800 border-green-300";
  };

  return (
    <div className={cn(
      "inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium",
      getBgColor()
    )}>
      {current}/{total}
    </div>
  );
}