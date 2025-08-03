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

      {/* Email Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 max-w-4xl mx-auto">
          {/* Email Header */}
          <div className="mb-6">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={email.from.avatar} />
                <AvatarFallback>
                  {email.from.name[0]?.toUpperCase() || email.from.email[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{email.from.name || email.from.email}</span>
                  {senderAccount && (
                    <Badge variant="outline" className="text-xs">
                      to {senderAccount.email}
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground mb-2">
                  <span>to {email.to.map(recipient => recipient.email).join(', ')}</span>
                  {email.cc && email.cc.length > 0 && (
                    <span className="ml-2">
                      cc {email.cc.map(recipient => recipient.email).join(', ')}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{format(new Date(email.date), 'PPP p')}</span>
                  <span>({formatDistanceToNow(new Date(email.date), { addSuffix: true })})</span>
                </div>
              </div>
            </div>

            {/* Labels */}
            {email.labels.length > 0 && (
              <div className="flex gap-2 mb-4">
                {email.labels.map((label) => (
                  <Badge key={label} variant="secondary">
                    {label}
                  </Badge>
                ))}
              </div>
            )}

            {/* Attachments */}
            {email.attachments.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Paperclip className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {email.attachments.length} attachment{email.attachments.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {email.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/5"
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
          </div>

          <Separator className="mb-6" />

          {/* Email Body */}
          <div className="mb-8">
            {email.htmlContent ? (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: email.htmlContent }}
              />
            ) : (
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {email.content}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mb-6">
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
            <div className="border rounded-lg p-4 bg-muted/5">
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