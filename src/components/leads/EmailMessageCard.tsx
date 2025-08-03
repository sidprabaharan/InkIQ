import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { EmailMessage } from '@/types/lead';
import { formatDistanceToNow } from 'date-fns';
import { Reply, Forward, MoreHorizontal, Star, Paperclip } from 'lucide-react';

interface EmailMessageCardProps {
  message: EmailMessage;
  isLast: boolean;
  onReply: () => void;
}

export default function EmailMessageCard({ 
  message, 
  isLast, 
  onReply 
}: EmailMessageCardProps) {
  const [isExpanded, setIsExpanded] = useState(isLast);
  
  const senderInitials = message.from.split('@')[0].slice(0, 2).toUpperCase();
  const senderName = message.from.split('@')[0];
  const timestamp = new Date(message.timestamp);

  return (
    <div className={`border rounded-lg ${isLast ? 'border-primary/20' : 'border-border'}`}>
      {/* Message Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{senderInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">{senderName}</span>
              {!message.isRead && (
                <Badge variant="default" className="h-2 w-2 p-0 rounded-full" />
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {timestamp.toLocaleDateString()} at {timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })} • {formatDistanceToNow(timestamp, { addSuffix: true })}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {isLast && (
            <Badge variant="secondary" className="text-xs">
              Latest
            </Badge>
          )}
          <Button variant="ghost" size="sm">
            <Star className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Message Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          <div className="text-sm leading-relaxed whitespace-pre-line">
            {message.body}
          </div>

          {/* Attachments placeholder */}
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Paperclip className="h-3 w-3" />
            <span>No attachments</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 pt-2">
            <Button variant="outline" size="sm" onClick={onReply}>
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>
            <Button variant="ghost" size="sm">
              <Forward className="h-3 w-3 mr-1" />
              Forward
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}