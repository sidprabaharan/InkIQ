
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TopBar() {
  return (
    <header className="h-16 border-b flex items-center justify-end px-6 bg-white">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="font-medium">Noraiz shahid</span>
          <span className="text-sm text-gray-500">Corporate</span>
        </div>
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://github.com/shadcn.png" alt="User" />
          <AvatarFallback>NS</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
