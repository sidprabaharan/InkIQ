
import { useState } from "react";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, MoreHorizontal, Reply, Trash, Archive, Star, FileText, Download, StarOff, ReplyAll, Forward, CornerUpRight } from "lucide-react";
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
    <div className="h-full flex flex-col bg-white">
      <div className="py-3 px-4 border-b flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={() => setIsStarred(!isStarred)}>
            {isStarred ? (
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ) : (
              <StarOff className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
            <Archive className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
            <Trash className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
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
          <h1 className="text-xl font-semibold mb-3">{email.subject}</h1>
          
          <div className="flex items-start mb-4">
            <Avatar className="h-10 w-10 mr-4">
              <div className="bg-blue-500 text-white rounded-full h-full w-full flex items-center justify-center text-lg font-semibold">
                {email.from.name.charAt(0)}
              </div>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium">{email.from.name}</h3>
                    <span className="text-sm text-gray-500 ml-2">{`<${email.from.email}>`}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    to {email.to.map(to => to.name).join(", ")}
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="text-sm text-gray-500 mr-2">
                    {format(new Date(email.date), "MMM d, yyyy, h:mm a")}
                  </p>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <StarOff className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Reply</DropdownMenuItem>
                      <DropdownMenuItem>Forward</DropdownMenuItem>
                      <DropdownMenuItem>Print</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
          
          <div className="my-6 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: email.content }} />
          
          {email.attachments.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h4 className="text-sm font-medium mb-3">Attachments ({email.attachments.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {email.attachments.map((attachment, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 border rounded-md p-3 hover:bg-gray-50"
                  >
                    <FileText className="h-8 w-8 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-600">{attachment.name}</p>
                      <p className="text-xs text-gray-500">{attachment.size}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2 mb-3">
          <Button variant="outline" size="sm" className="rounded-full gap-2">
            <Reply className="h-4 w-4" />
            Reply
          </Button>
          <Button variant="outline" size="sm" className="rounded-full gap-2">
            <ReplyAll className="h-4 w-4" />
            Reply all
          </Button>
          <Button variant="outline" size="sm" className="rounded-full gap-2">
            <Forward className="h-4 w-4" />
            Forward
          </Button>
        </div>
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <textarea 
            className="w-full min-h-20 p-2 border-0 focus:outline-none focus:ring-0 text-sm resize-none"
            placeholder="Reply to this email..."
          />
          <div className="flex justify-between items-center mt-2 pt-2 border-t">
            <div></div>
            <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700">Send</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
