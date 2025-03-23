
import { useState } from "react";
import { format } from "date-fns";
import { 
  MoreHorizontal, Reply, Trash, Archive, Star, FileText, 
  Download, StarOff, ReplyAll, Forward, CornerUpRight,
  Printer, MailX, Tag, Clock, Flag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Email } from "@/data/mockEmails";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface EmailDetailProps {
  email: Email;
  onBackToInbox: () => void;
}

export function EmailDetail({ email, onBackToInbox }: EmailDetailProps) {
  const [isStarred, setIsStarred] = useState(email.starred);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const { toast } = useToast();
  
  const handleActionClick = (action: string) => {
    toast({
      title: action,
      description: `Email has been ${action.toLowerCase()}`,
    });
  };

  const handleReply = () => {
    if (replyContent.trim()) {
      toast({
        title: "Reply sent",
        description: "Your reply has been sent successfully",
      });
      setReplyContent("");
      setShowReplyBox(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto pt-4 px-4">
        {/* Email actions toolbar */}
        <div className="flex items-center justify-between mb-4 bg-white p-2 rounded-lg shadow-sm">
          <div className="flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={onBackToInbox}>
                    <CornerUpRight className="h-5 w-5 rotate-180" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Back to inbox</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleActionClick("Archived")}>
                    <Archive className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Archive</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleActionClick("Deleted")}>
                    <Trash className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleActionClick("Marked as unread")}>
                    <MailX className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Mark as unread</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleActionClick("Snoozed")}>
                    <Clock className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Snooze</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Separator orientation="vertical" className="h-6 mx-1" />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full" 
                    onClick={() => {
                      setIsStarred(!isStarred);
                      handleActionClick(isStarred ? "Unstarred" : "Starred");
                    }}
                  >
                    {isStarred ? (
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <Star className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isStarred ? "Unstar" : "Star"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleActionClick("Flagged")}>
                    <Flag className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Flag</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleActionClick("Printed")}>
                    <Printer className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Print</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>More</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => handleActionClick("Marked as unread")}>
                  Mark as unread
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleActionClick("Moved to spam")}>
                  Report spam
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleActionClick("Blocked")}>
                  Block sender
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleActionClick("Muted")}>
                  Mute conversation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleActionClick("Forwarded")}>
                  Forward as attachment
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleActionClick("Filtered")}>
                  Filter messages like this
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Subject and labels */}
        <div className="bg-white rounded-t-lg border p-6 mb-px">
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
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => handleActionClick("Label added")}>
                <Tag className="h-3.5 w-3.5 mr-1" />
                <span>Manage labels</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Email content */}
        <div className="bg-white rounded-b-lg border-x border-b p-6 mb-4">
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
                      <DropdownMenuItem onClick={() => setShowReplyBox(true)}>Reply</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleActionClick("Forwarded")}>Forward</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleActionClick("Printed")}>Print</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleActionClick("Marked as unread")}>Mark as unread</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleActionClick("Label added")}>Add label</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleActionClick("Deleted")}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="mt-6 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: email.content }} />
              
              {/* Attachments section */}
              {email.attachments.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="text-sm font-medium mb-3">Attachments ({email.attachments.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {email.attachments.map((attachment, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-3 border rounded-md p-3 hover:bg-gray-50 group"
                      >
                        <FileText className="h-8 w-8 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-600">{attachment.name}</p>
                          <p className="text-xs text-gray-500">{attachment.size}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleActionClick("Downloaded attachment")}
                        >
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
        
        {/* Quick reply actions */}
        <div className="bg-white rounded-lg border p-4 mb-4 shadow-sm">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="rounded-full text-gray-700 gap-2"
              onClick={() => setShowReplyBox(true)}
            >
              <Reply className="h-4 w-4" />
              <span>Reply</span>
            </Button>
            <Button 
              variant="outline" 
              className="rounded-full text-gray-700 gap-2"
              onClick={() => handleActionClick("Reply All clicked")}
            >
              <ReplyAll className="h-4 w-4" />
              <span>Reply all</span>
            </Button>
            <Button 
              variant="outline" 
              className="rounded-full text-gray-700 gap-2"
              onClick={() => handleActionClick("Forward clicked")}
            >
              <Forward className="h-4 w-4" />
              <span>Forward</span>
            </Button>
          </div>
        </div>
        
        {/* Reply box */}
        {showReplyBox && (
          <div className="bg-white rounded-lg border shadow-sm p-4 mb-6">
            <div className="flex items-start mb-4">
              <Avatar className="h-8 w-8 mr-3">
                <div className="bg-blue-500 text-white rounded-full h-full w-full flex items-center justify-center text-sm font-semibold">
                  M
                </div>
              </Avatar>
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-2">
                  <span>To: </span>
                  <span className="font-medium">{email.from.name}</span>
                  <span> {`<${email.from.email}>`}</span>
                </div>
                <textarea 
                  className="w-full min-h-24 p-2 border text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Reply to this email..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t">
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="rounded-md bg-blue-600 hover:bg-blue-700 px-4"
                  onClick={handleReply}
                >
                  Send
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500" onClick={() => setShowReplyBox(false)}>
                  Discard
                </Button>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => setShowReplyBox(false)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
