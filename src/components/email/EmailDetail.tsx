
import { useState } from "react";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, MoreHorizontal, Reply, Trash, Archive, Star, FileText, Download, StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Email } from "@/data/mockEmails";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface EmailDetailProps {
  email: Email;
}

export function EmailDetail({ email }: EmailDetailProps) {
  const [isStarred, setIsStarred] = useState(email.starred);
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsStarred(!isStarred)}>
            {isStarred ? (
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ) : (
              <StarOff className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon">
            <Archive className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark as unread</DropdownMenuItem>
              <DropdownMenuItem>Add label</DropdownMenuItem>
              <DropdownMenuItem>Mute thread</DropdownMenuItem>
              <DropdownMenuItem>Report spam</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-xl font-bold mb-6">{email.subject}</h1>
          
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="h-10 w-10">
              <div className="bg-inkiq-primary text-white rounded-full h-full w-full flex items-center justify-center text-lg font-semibold">
                {email.from.name.charAt(0)}
              </div>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{email.from.name}</h3>
                  <p className="text-sm text-gray-500">
                    {`<${email.from.email}>`} to {email.to.map(to => to.name).join(", ")}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {format(new Date(email.date), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>
          </div>
          
          <div className="my-6 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: email.content }} />
          
          {email.attachments.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Attachments ({email.attachments.length})</h4>
              <div className="space-y-2">
                {email.attachments.map((attachment, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 border rounded-md p-3 hover:bg-gray-50"
                  >
                    <FileText className="h-8 w-8 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{attachment.name}</p>
                      <p className="text-xs text-gray-500">{attachment.size}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Separator />
      
      <div className="p-4">
        <div className="rounded-md border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <Reply className="h-4 w-4" />
              Reply
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowRight className="h-4 w-4" />
              Forward
            </Button>
          </div>
          <textarea 
            className="w-full h-24 p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-inkiq-primary text-sm"
            placeholder="Type your reply here..."
          />
          <div className="mt-2 flex justify-end">
            <Button size="sm">Send</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
