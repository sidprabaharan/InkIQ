import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Star, Paperclip, Archive, Trash2, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Email } from "@/types/email";

interface ModernEmailListProps {
  emails: Email[];
  selectedEmailId: string | null;
  onEmailSelect: (emailId: string) => void;
  selectedEmails: string[];
  onEmailsSelect: (emailIds: string[]) => void;
  onStarToggle: (emailId: string) => void;
  onArchive: (emailIds: string[]) => void;
  onDelete: (emailIds: string[]) => void;
}

export function ModernEmailList({
  emails,
  selectedEmailId,
  onEmailSelect,
  selectedEmails,
  onEmailsSelect,
  onStarToggle,
  onArchive,
  onDelete,
}: ModernEmailListProps) {
  const [hoveredEmail, setHoveredEmail] = useState<string | null>(null);

  const handleEmailSelect = (emailId: string) => {
    const isSelected = selectedEmails.includes(emailId);
    if (isSelected) {
      onEmailsSelect(selectedEmails.filter(id => id !== emailId));
    } else {
      onEmailsSelect([...selectedEmails, emailId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedEmails.length === emails.length) {
      onEmailsSelect([]);
    } else {
      onEmailsSelect(emails.map(email => email.id));
    }
  };

  if (emails.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="h-24 w-24 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📧</span>
          </div>
          <h3 className="text-lg font-medium mb-2">No emails found</h3>
          <p className="text-muted-foreground">
            There are no emails in this folder or account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      {selectedEmails.length > 0 && (
        <div className="border-b px-4 py-2 bg-muted/5">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedEmails.length === emails.length}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-muted-foreground">
              {selectedEmails.length} selected
            </span>
            <div className="flex items-center gap-1 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onArchive(selectedEmails)}
              >
                <Archive className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(selectedEmails)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Email List */}
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {emails.map((email) => (
            <div
              key={email.id}
              className={`group flex items-center gap-3 p-4 hover:bg-muted/5 cursor-pointer transition-colors ${
                selectedEmailId === email.id ? 'bg-muted/10' : ''
              } ${!email.read ? 'bg-primary/5' : ''}`}
              onMouseEnter={() => setHoveredEmail(email.id)}
              onMouseLeave={() => setHoveredEmail(null)}
              onClick={() => onEmailSelect(email.id)}
            >
              {/* Selection Checkbox */}
              <Checkbox
                checked={selectedEmails.includes(email.id)}
                onCheckedChange={() => handleEmailSelect(email.id)}
                onClick={(e) => e.stopPropagation()}
              />

              {/* Star */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStarToggle(email.id);
                }}
                className="text-muted-foreground hover:text-yellow-500"
              >
                <Star
                  className={`h-4 w-4 ${
                    email.starred ? 'fill-yellow-500 text-yellow-500' : ''
                  }`}
                />
              </button>

              {/* Avatar */}
              <Avatar className="h-10 w-10">
                <AvatarImage src={email.from.avatar} />
                <AvatarFallback>
                  {email.from.name[0]?.toUpperCase() || email.from.email[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Email Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm truncate ${!email.read ? 'font-semibold' : 'font-medium'}`}>
                    {email.from.name || email.from.email}
                  </span>
                  {email.labels.map((label) => (
                    <Badge key={label} variant="secondary" className="text-xs">
                      {label}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm truncate flex-1 ${!email.read ? 'font-medium' : ''}`}>
                    {email.subject}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    - {email.content.substring(0, 100)}...
                  </span>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {email.attachments.length > 0 && (
                  <Paperclip className="h-4 w-4" />
                )}
                <span className="whitespace-nowrap">
                  {formatDistanceToNow(new Date(email.date), { addSuffix: true })}
                </span>
              </div>

              {/* Actions (on hover) */}
              {hoveredEmail === email.id && (
                <div className="flex items-center gap-1 opacity-100 group-hover:opacity-100">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onArchive([email.id])}>
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete([email.id])}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}