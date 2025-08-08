import { useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import {
  ArrowLeft,
  Star,
  Archive,
  Trash2,
  Reply,
  ReplyAll,
  Forward,
  Download,
  MoreHorizontal,
  Paperclip,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MultiAccountComposer } from "./MultiAccountComposer";
import type { Email, EmailAccount } from "@/types/email";

interface EnhancedEmailDetailProps {
  email: Email;
  accounts: EmailAccount[];
  onBack: () => void;
  onStarToggle: (emailId: string) => void;
  onArchive: (emailId: string) => void;
  onDelete: (emailId: string) => void;
  onSendEmail: (composition: any) => void;
}

export function EnhancedEmailDetail({
  email,
  accounts,
  onBack,
  onStarToggle,
  onArchive,
  onDelete,
  onSendEmail,
}: EnhancedEmailDetailProps) {
  const [showComposer, setShowComposer] = useState(false);
  const [composerMode, setComposerMode] = useState<'reply' | 'replyAll' | 'forward'>('reply');

  const senderAccount = accounts.find(acc => acc.id === email.accountId);

  const handleReply = (mode: 'reply' | 'replyAll' | 'forward') => {
    setComposerMode(mode);
    setShowComposer(true);
  };

  const handleDownloadAttachment = (attachment: any) => {
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse the threaded conversation from content
  const parseConversation = (content: string) => {
    const messages = [];
    const parts = content.split('---').filter(part => part.trim());
    
    for (const part of parts) {
      const trimmedPart = part.trim();
      
      // Check if it's an AI response (contains the AI badge)
      if (trimmedPart.includes('AI-Generated Response')) {
        const lines = trimmedPart.split('\n');
        let fromLine = lines.find(line => line.startsWith('**From:'));
        let dateLine = lines.find(line => line.startsWith('**Date:'));
        
        if (fromLine && dateLine) {
          const fromMatch = fromLine.match(/\*\*From:\s*(.+?)\s*<(.+?)>\*\*/);
          const dateMatch = dateLine.match(/\*\*Date:\s*(.+?)\*\*/);
          
          if (fromMatch && dateMatch) {
            const messageContent = lines.slice(
              lines.findIndex(line => line.startsWith('**Date:')) + 1
            ).join('\n').trim();
            
            messages.push({
              id: `msg-${messages.length + 1}`,
              from: { name: fromMatch[1], email: fromMatch[2] },
              content: messageContent,
              date: dateMatch[1],
              isAI: true,
              aiType: trimmedPart.includes('Auto-sent') ? 'auto-reply' : 
                     trimmedPart.includes('Auto-curated') ? 'product-options' : 'quote'
            });
          }
        }
      } 
      // Check if it's a regular message (contains From: pattern)
      else if (trimmedPart.includes('**From:')) {
        const lines = trimmedPart.split('\n');
        let fromLine = lines.find(line => line.startsWith('**From:'));
        let dateLine = lines.find(line => line.startsWith('**Date:'));
        
        if (fromLine && dateLine) {
          const fromMatch = fromLine.match(/\*\*From:\s*(.+?)\s*<(.+?)>\*\*/);
          const dateMatch = dateLine.match(/\*\*Date:\s*(.+?)\*\*/);
          
          if (fromMatch && dateMatch) {
            const messageContent = lines.slice(
              lines.findIndex(line => line.startsWith('**Date:')) + 1
            ).join('\n').trim();
            
            messages.push({
              id: `msg-${messages.length + 1}`,
              from: { name: fromMatch[1], email: fromMatch[2] },
              content: messageContent,
              date: dateMatch[1],
              isAI: false
            });
          }
        }
      }
      // Initial message (first part without From: pattern)
      else if (messages.length === 0) {
        messages.push({
          id: 'msg-initial',
          from: email.from,
          content: trimmedPart,
          date: format(new Date(email.date), 'MMMM do, yyyy \'at\' h:mm a'),
          isAI: false
        });
      }
    }
    
    return messages;
  };

  const conversationMessages = parseConversation(email.content);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex-1">
            <h1 className="text-lg font-semibold truncate">{email.subject}</h1>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStarToggle(email.id)}
            >
              <Star
                className={`h-4 w-4 ${
                  email.starred ? 'fill-yellow-500 text-yellow-500' : ''
                }`}
              />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={() => onArchive(email.id)}>
              <Archive className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={() => onDelete(email.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* iMessage-style Conversation */}
      <ScrollArea className="flex-1">
        <div className="p-4 max-w-4xl mx-auto space-y-4">
          {/* Labels at top */}
          {email.labels.length > 0 && (
            <div className="flex gap-2 justify-center mb-6">
              {email.labels.map((label) => (
                <Badge key={label} variant="secondary">
                  {label}
                </Badge>
              ))}
            </div>
          )}

          {/* Attachments at top */}
          {email.attachments.length > 0 && (
            <div className="mb-6 bg-muted/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Paperclip className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {email.attachments.length} attachment{email.attachments.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {email.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-background/50"
                  >
                    <div className="h-8 w-8 rounded bg-muted/20 flex items-center justify-center">
                      <Paperclip className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{attachment.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {(attachment.size / 1024 / 1024).toFixed(1)} MB
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadAttachment(attachment)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message Bubbles */}
          {conversationMessages.map((message, index) => {
            const isOutgoing = message.from.email?.includes('kiriakos') || message.from.email?.includes('merchradar');
            
            return (
              <div key={message.id} className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`max-w-[70%] ${isOutgoing ? 'order-2' : 'order-1'}`}>
                  {/* AI Badge for outgoing AI messages */}
                  {message.isAI && isOutgoing && (
                    <div className="mb-2 flex justify-end">
                      <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        <div className="w-2 h-2 bg-white rounded-full flex items-center justify-center">
                          <div className="w-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        </div>
                        {message.aiType === 'auto-reply' ? 'Auto-sent in 8 seconds' :
                         message.aiType === 'product-options' ? 'Auto-curated products' :
                         'AI-generated quote'}
                      </div>
                    </div>
                  )}
                  
                  {/* Message Bubble */}
                  <div className={`rounded-2xl px-4 py-3 ${
                    isOutgoing 
                      ? 'bg-blue-500 text-white rounded-br-sm' 
                      : 'bg-muted rounded-bl-sm'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                  
                  {/* Timestamp and sender */}
                  <div className={`mt-1 flex items-center gap-2 text-xs text-muted-foreground ${
                    isOutgoing ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className="font-medium">{message.from.name}</span>
                    <span>•</span>
                    <span>{message.date}</span>
                  </div>
                </div>
                
                {/* Avatar */}
                <div className={`${isOutgoing ? 'order-1 mr-3' : 'order-2 ml-3'} flex-shrink-0`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.from.avatar} />
                    <AvatarFallback className="text-xs">
                      {message.from.name?.[0]?.toUpperCase() || message.from.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            );
          })}

          {/* Action Buttons */}
          <div className="flex gap-2 justify-center pt-6">
            <Button onClick={() => handleReply('reply')} className="gap-2">
              <Reply className="h-4 w-4" />
              Reply
            </Button>
            <Button variant="outline" onClick={() => handleReply('replyAll')} className="gap-2">
              <ReplyAll className="h-4 w-4" />
              Reply All
            </Button>
            <Button variant="outline" onClick={() => handleReply('forward')} className="gap-2">
              <Forward className="h-4 w-4" />
              Forward
            </Button>
          </div>

          {/* Composer */}
          {showComposer && (
            <div className="border rounded-lg p-4 bg-muted/5 mt-6">
              <MultiAccountComposer
                accounts={accounts}
                mode={composerMode}
                originalEmail={email}
                onSend={onSendEmail}
                onCancel={() => setShowComposer(false)}
              />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}