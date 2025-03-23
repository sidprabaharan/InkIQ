
import { useState } from "react";
import { Mail, Inbox, Send, Archive, Trash, Star, Tag, Clock, UserPlus, MailPlus, Search, Filter, Pencil, Checkbox } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockEmails } from "@/data/mockEmails";
import { EmailList } from "@/components/email/EmailList";
import { EmailDetail } from "@/components/email/EmailDetail";
import { ConnectEmailDialog } from "@/components/email/ConnectEmailDialog";

export default function Messages() {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [currentFolder, setCurrentFolder] = useState("inbox");
  
  const selectedEmailData = selectedEmail 
    ? mockEmails.find(email => email.id === selectedEmail) 
    : null;

  const folderEmails = mockEmails.filter(email => email.folder === currentFolder);
  
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Gmail-like sidebar */}
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
            onClick={() => setCurrentFolder("inbox")} 
            className={`flex items-center justify-between w-full px-6 py-2 text-sm ${currentFolder === "inbox" ? "bg-blue-100 rounded-r-full font-medium text-blue-700" : "hover:bg-gray-100"}`}
          >
            <div className="flex items-center gap-4">
              <Inbox size={18} />
              <span>Inbox</span>
            </div>
            <Badge variant="outline" className="bg-transparent">
              {mockEmails.filter(e => e.folder === "inbox" && !e.read).length}
            </Badge>
          </button>

          <button 
            onClick={() => setCurrentFolder("starred")} 
            className={`flex items-center justify-between w-full px-6 py-2 text-sm ${currentFolder === "starred" ? "bg-blue-100 rounded-r-full font-medium text-blue-700" : "hover:bg-gray-100"}`}
          >
            <div className="flex items-center gap-4">
              <Star size={18} />
              <span>Starred</span>
            </div>
          </button>

          <button 
            onClick={() => setCurrentFolder("sent")} 
            className={`flex items-center justify-between w-full px-6 py-2 text-sm ${currentFolder === "sent" ? "bg-blue-100 rounded-r-full font-medium text-blue-700" : "hover:bg-gray-100"}`}
          >
            <div className="flex items-center gap-4">
              <Send size={18} />
              <span>Sent</span>
            </div>
          </button>

          <button 
            onClick={() => setCurrentFolder("archive")} 
            className={`flex items-center justify-between w-full px-6 py-2 text-sm ${currentFolder === "archive" ? "bg-blue-100 rounded-r-full font-medium text-blue-700" : "hover:bg-gray-100"}`}
          >
            <div className="flex items-center gap-4">
              <Archive size={18} />
              <span>Archive</span>
            </div>
          </button>

          <button 
            onClick={() => setCurrentFolder("trash")} 
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
      </div>

      {/* Email content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header with search */}
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

        {/* Email list and detail area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Email list */}
          <div className="w-80 border-r flex flex-col overflow-hidden">
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

            <ScrollArea className="flex-1">
              <EmailList 
                emails={folderEmails} 
                selectedEmailId={selectedEmail}
                onSelectEmail={setSelectedEmail}
              />
            </ScrollArea>
          </div>

          {/* Email detail */}
          <div className="flex-1 overflow-hidden">
            {selectedEmailData ? (
              <EmailDetail email={selectedEmailData} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Mail className="mx-auto h-16 w-16 mb-4 text-gray-300" />
                  <h3 className="font-medium mb-1">No email selected</h3>
                  <p className="text-sm">Select an email from the list to view</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConnectEmailDialog open={showConnectDialog} onOpenChange={setShowConnectDialog} />
    </div>
  );
}
