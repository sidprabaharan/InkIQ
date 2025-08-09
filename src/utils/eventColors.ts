import { CalendarEventCategory } from "@/pages/Calendar";

export const getEventColor = (category: CalendarEventCategory, priority?: "low" | "medium" | "high"): string => {
  // Priority colors override category colors
  if (priority === "high") {
    return "#DC2626"; // Red for high priority
  }
  
  switch (category) {
    case "production_job":
      return "#3B82F6"; // Blue
    case "meeting":
      return "#10B981"; // Green
    case "customer_call":
      return "#8B5CF6"; // Purple
    case "follow_up":
      return "#F59E0B"; // Orange
    case "artwork_approval":
      return "#EF4444"; // Red
    case "order":
      return "#06B6D4"; // Cyan
    case "work":
      return "#84CC16"; // Lime
    case "personal":
      return "#6B7280"; // Gray
    case "task":
      return "#F97316"; // Orange
    default:
      return "#3B82F6"; // Default blue
  }
};

export const getEventColorWithOpacity = (category: CalendarEventCategory, priority?: "low" | "medium" | "high", opacity: number = 0.2): string => {
  const baseColor = getEventColor(category, priority);
  return `${baseColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};