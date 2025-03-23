
import { useState } from "react";
import { Mail, Inbox, Send, Archive, Trash, Star, Tag, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ConnectEmailDialog } from "@/components/email/ConnectEmailDialog";

interface EmailSidebarProps {
  currentFolder: string;
  setCurrentFolder: (folder: string) => void;
  setSelectedEmail: (emailId: string | null) => void;
  unreadCount: number;
}

export function EmailSidebar({ 
  currentFolder, 
  setCurrentFolder, 
  setSelectedEmail,
  unreadCount 
}: EmailSidebarProps) {
  const [showConnectDialog, setShowConnectDialog] = useState(false);

  const handleFolderClick = (folder: string) => {
    setCurrentFolder(folder);
    setSelectedEmail(null);
  };

  return (
    <div className="w-60 border-r bg-white flex flex-col h-full">
      <div className="p-4">
        <Button 
          className="w-full rounded-2xl text-gray-700 bg-blue-100 hover:bg-blue-200 hover:shadow-md flex items-center justify-start px-6 py-4 h-14"
        >
          <Pencil size={18} className="mr-4" />
          <span>Compose</span>
        </Button>
      </div>

      <div className="overflow-auto flex-1">
        <button 
          onClick={() => handleFolderClick("inbox")} 
          className={`flex items-center justify-between w-full px-6 py-2 text-sm ${currentFolder === "inbox" ? "bg-blue-100 rounded-r-full font-medium text-blue-700" : "hover:bg-gray-100"}`}
        >
          <div className="flex items-center gap-4">
            <Inbox size={18} />
            <span>Inbox</span>
          </div>
          <Badge variant="outline" className="bg-transparent">
            {unreadCount}
          </Badge>
        </button>

        <button 
          onClick={() => handleFolderClick("starred")}
          className={`flex items-center justify-between w-full px-6 py-2 text-sm ${currentFolder === "starred" ? "bg-blue-100 rounded-r-full font-medium text-blue-700" : "hover:bg-gray-100"}`}
        >
          <div className="flex items-center gap-4">
            <Star size={18} />
            <span>Starred</span>
          </div>
        </button>

        <button 
          onClick={() => handleFolderClick("sent")}
          className={`flex items-center justify-between w-full px-6 py-2 text-sm ${currentFolder === "sent" ? "bg-blue-100 rounded-r-full font-medium text-blue-700" : "hover:bg-gray-100"}`}
        >
          <div className="flex items-center gap-4">
            <Send size={18} />
            <span>Sent</span>
          </div>
        </button>

        <button 
          onClick={() => handleFolderClick("archive")}
          className={`flex items-center justify-between w-full px-6 py-2 text-sm ${currentFolder === "archive" ? "bg-blue-100 rounded-r-full font-medium text-blue-700" : "hover:bg-gray-100"}`}
        >
          <div className="flex items-center gap-4">
            <Archive size={18} />
            <span>Archive</span>
          </div>
        </button>

        <button 
          onClick={() => handleFolderClick("trash")}
          className={`flex items-center justify-between w-full px-6 py-2 text-sm ${currentFolder === "trash" ? "bg-blue-100 rounded-r-full font-medium text-blue-700" : "hover:bg-gray-100"}`}
        >
          <div className="flex items-center gap-4">
            <Trash size={18} />
            <span>Trash</span>
          </div>
        </button>

        <Separator className="my-3" />

        <div className="px-4 py-2">
          <h3 className="text-sm font-medium mb-1 px-2">Labels</h3>
          <div className="space-y-1">
            <button className="flex items-center gap-4 w-full px-6 py-2 text-sm hover:bg-gray-100 rounded-r-full">
              <Tag size={18} className="text-green-500" />
              <span>Work</span>
            </button>
            <button className="flex items-center gap-4 w-full px-6 py-2 text-sm hover:bg-gray-100 rounded-r-full">
              <Tag size={18} className="text-blue-500" />
              <span>Personal</span>
            </button>
            <button className="flex items-center gap-4 w-full px-6 py-2 text-sm hover:bg-gray-100 rounded-r-full">
              <Tag size={18} className="text-red-500" />
              <span>Important</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 border-t mt-auto">
        <Button 
          variant="outline" 
          onClick={() => setShowConnectDialog(true)}
          className="w-full flex items-center justify-center gap-2"
        >
          <UserPlus size={16} />
          <span>Connect Account</span>
        </Button>
      </div>

      <ConnectEmailDialog open={showConnectDialog} onOpenChange={setShowConnectDialog} />
    </div>
  );
}

// Missing Pencil icon import
import { Pencil } from "lucide-react";
