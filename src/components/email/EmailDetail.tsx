
import { useState } from "react";
import { format } from "date-fns";
import { MoreHorizontal, Reply, Trash, Archive, Star, FileText, Download, StarOff, ReplyAll, Forward, CornerUpRight } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface EmailDetailProps {
  email: Email;
}

export function EmailDetail({ email }: EmailDetailProps) {
  const [isStarred, setIsStarred] = useState(email.starred);
  
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-5xl mx-auto pt-4 px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">{email.subject}</h1>
          
          <div className="flex items-center space-x-2">
            {email.labels?.map(label => (
              <Badge 
                key={label} 
                variant="outline" 
                className={`text-xs px-2 py-1 ${
                  label === 'work' ? 'border-green-500 text-green-700 bg-green-50' :
                  label === 'personal' ? 'border-blue-500 text-blue-700 bg-blue-50' :
                  label === 'important' ? 'border-red-500 text-red-700 bg-red-50' : ''
                }`}
              >
                {label}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-6 mb-4">
          <div className="flex items-start">
            <Avatar className="h-10 w-10 mr-4">
              <div className="bg-blue-500 text-white rounded-full h-full w-full flex items-center justify-center text-lg font-semibold">
                {email.from.name.charAt(0)}
              </div>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
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
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => setIsStarred(!isStarred)}>
                    {isStarred ? (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
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
                      <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                      <DropdownMenuItem>Add label</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="mt-6 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: email.content }} />
              
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
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-4 mb-6">
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
