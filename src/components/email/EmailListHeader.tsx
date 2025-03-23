
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function EmailListHeader() {
  return (
    <div className="h-16 border-b flex items-center px-4">
      <div className="w-full max-w-3xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Search in emails"
            className="pl-10 py-2 bg-gray-100 border-none rounded-full focus-visible:ring-gray-300"
          />
        </div>
      </div>
    </div>
  );
}
