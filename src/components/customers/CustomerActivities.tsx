
import React from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function CustomerActivities() {
  return (
    <Card>
      <CardContent className="p-6 min-h-[200px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Calendar className="h-16 w-16 mx-auto mb-4 opacity-40" />
          <p className="text-lg">No activity data to show yet.</p>
        </div>
      </CardContent>
    </Card>
  );
}
