
import { useState } from "react";
import { Mail, Inbox, Send, Archive, Trash, Star, Tag, Clock, UserPlus, MailPlus, Search, Filter } from "lucide-react";
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
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowConnectDialog(true)}
            className="flex items-center gap-2"
          >
            <UserPlus size={16} />
            Connect Account
          </Button>
          <Button className="flex items-center gap-2">
            <MailPlus size={16} />
            Compose
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-12rem)]">
        {/* Sidebar */}
        <div className="col-span-2 border rounded-md">
          <div className="p-3">
            <Button variant="default" className="w-full justify-start gap-2">
              <MailPlus size={16} />
              Compose
            </Button>
          </div>
          <Separator />
          <div className="py-2">
            <button 
              onClick={() => setCurrentFolder("inbox")} 
              className={`flex items-center justify-between w-full px-3 py-2 text-sm ${currentFolder === "inbox" ? "bg-inkiq-primary/10 text-inkiq-primary font-medium" : "hover:bg-gray-100"}`}
            >
              <div className="flex items-center gap-2">
                <Inbox size={16} />
                <span>Inbox</span>
              </div>
              <Badge>{mockEmails.filter(e => e.folder === "inbox" && !e.read).length}</Badge>
            </button>
            <button 
              onClick={() => setCurrentFolder("starred")} 
              className={`flex items-center justify-between w-full px-3 py-2 text-sm ${currentFolder === "starred" ? "bg-inkiq-primary/10 text-inkiq-primary font-medium" : "hover:bg-gray-100"}`}
            >
              <div className="flex items-center gap-2">
                <Star size={16} />
                <span>Starred</span>
              </div>
            </button>
            <button 
              onClick={() => setCurrentFolder("sent")} 
              className={`flex items-center justify-between w-full px-3 py-2 text-sm ${currentFolder === "sent" ? "bg-inkiq-primary/10 text-inkiq-primary font-medium" : "hover:bg-gray-100"}`}
            >
              <div className="flex items-center gap-2">
                <Send size={16} />
                <span>Sent</span>
              </div>
            </button>
            <button 
              onClick={() => setCurrentFolder("archive")} 
              className={`flex items-center justify-between w-full px-3 py-2 text-sm ${currentFolder === "archive" ? "bg-inkiq-primary/10 text-inkiq-primary font-medium" : "hover:bg-gray-100"}`}
            >
              <div className="flex items-center gap-2">
                <Archive size={16} />
                <span>Archive</span>
              </div>
            </button>
            <button 
              onClick={() => setCurrentFolder("trash")} 
              className={`flex items-center justify-between w-full px-3 py-2 text-sm ${currentFolder === "trash" ? "bg-inkiq-primary/10 text-inkiq-primary font-medium" : "hover:bg-gray-100"}`}
            >
              <div className="flex items-center gap-2">
                <Trash size={16} />
                <span>Trash</span>
              </div>
            </button>
          </div>
          <Separator />
          <div className="p-3">
            <h3 className="text-sm font-medium mb-2">Labels</h3>
            <div className="space-y-1">
              <button className="flex items-center gap-2 w-full px-2 py-1 text-sm hover:bg-gray-100 rounded">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Work</span>
              </button>
              <button className="flex items-center gap-2 w-full px-2 py-1 text-sm hover:bg-gray-100 rounded">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Personal</span>
              </button>
              <button className="flex items-center gap-2 w-full px-2 py-1 text-sm hover:bg-gray-100 rounded">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span>Important</span>
              </button>
            </div>
          </div>
        </div>

        {/* Email list */}
        <div className="col-span-3 border rounded-md overflow-hidden">
          <div className="p-3 border-b">
            <div className="flex items-center gap-2 mb-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search emails..." className="pl-8" />
              </div>
              <Button size="icon" variant="ghost">
                <Filter size={16} />
              </Button>
            </div>
            <div className="flex justify-between">
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px] h-8">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[130px] h-8">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <ScrollArea className="h-[calc(100%-5rem)]">
            <EmailList 
              emails={folderEmails} 
              selectedEmailId={selectedEmail}
              onSelectEmail={setSelectedEmail}
            />
          </ScrollArea>
        </div>

        {/* Email content */}
        <div className="col-span-7 border rounded-md overflow-hidden">
          {selectedEmailData ? (
            <EmailDetail email={selectedEmailData} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <Mail className="mx-auto h-12 w-12 mb-4" />
                <h3 className="font-medium mb-1">No email selected</h3>
                <p className="text-sm">Select an email from the list to view</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConnectEmailDialog open={showConnectDialog} onOpenChange={setShowConnectDialog} />
    </div>
  );
}
