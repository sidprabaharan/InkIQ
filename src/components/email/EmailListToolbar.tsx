
import { Archive, Trash } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function EmailListToolbar() {
  return (
    <div className="p-2 border-b flex items-center">
      <Checkbox className="rounded-none mr-2" />
      <Select defaultValue="all">
        <SelectTrigger className="w-24 h-8 border-0">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="none">None</SelectItem>
          <SelectItem value="read">Read</SelectItem>
          <SelectItem value="unread">Unread</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="flex items-center ml-auto gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Archive className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
