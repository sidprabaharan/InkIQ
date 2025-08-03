import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EmailThread, EmailMessage } from '@/types/lead';
import { formatDistanceToNow } from 'date-fns';
import { Mail, Reply, Forward, Archive, Star, Paperclip } from 'lucide-react';
import EmailComposer from './EmailComposer';
import EmailMessageCard from './EmailMessageCard';

interface EmailThreadDialogProps {
  emailThread: EmailThread | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadName?: string;
}

export default function EmailThreadDialog({ 
  emailThread, 
  open, 
  onOpenChange, 
  leadName 
}: EmailThreadDialogProps) {
  const [showComposer, setShowComposer] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<EmailMessage | null>(null);

  if (!emailThread) return null;

  const handleReply = (message?: EmailMessage) => {
    setReplyToMessage(message || null);
    setShowComposer(true);
  };

  const handleSendEmail = (emailData: any) => {
    // This will integrate with backend later
    console.log('Sending email:', emailData);
    setShowComposer(false);
    setReplyToMessage(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-background/95 backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-lg">{emailThread.subject}</DialogTitle>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{emailThread.participants.join(', ')}</span>
                <Badge variant="outline" className="text-xs">
                  {emailThread.messages.length} messages
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
              <Button size="sm" onClick={() => handleReply()}>
                <Reply className="h-4 w-4 mr-2" />
                Reply
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Messages */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 py-4">
              {emailThread.messages.map((message, index) => (
                <EmailMessageCard
                  key={message.id}
                  message={message}
                  isLast={index === emailThread.messages.length - 1}
                  onReply={() => handleReply(message)}
                />
              ))}
            </div>
          </ScrollArea>

          {/* Composer */}
          {showComposer && (
            <div className="border-t bg-background/50">
              <EmailComposer
                replyTo={replyToMessage}
                leadName={leadName}
                onSend={handleSendEmail}
                onCancel={() => {
                  setShowComposer(false);
                  setReplyToMessage(null);
                }}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}