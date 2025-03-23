
import { useState } from "react";
import { format } from "date-fns";
import { CheckCircle2, Star, StarOff } from "lucide-react";
import { Email } from "@/data/mockEmails";
import { Badge } from "@/components/ui/badge";

interface EmailListProps {
  emails: Email[];
  selectedEmailId: string | null;
  onSelectEmail: (id: string) => void;
}

export function EmailList({ emails, selectedEmailId, onSelectEmail }: EmailListProps) {
  const [hoveredEmail, setHoveredEmail] = useState<string | null>(null);
  const [starredEmails, setStarredEmails] = useState<Record<string, boolean>>(
    emails.reduce((acc, email) => {
      acc[email.id] = email.starred;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const toggleStar = (e: React.MouseEvent, emailId: string) => {
    e.stopPropagation();
    setStarredEmails(prev => ({
      ...prev,
      [emailId]: !prev[emailId]
    }));
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return format(date, "h:mm a");
    } else if (diffInDays < 7) {
      return format(date, "EEE");
    } else {
      return format(date, "MMM d");
    }
  };

  return (
    <div className="divide-y">
      {emails.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <p>No emails found</p>
        </div>
      ) : (
        emails.map((email) => (
          <div
            key={email.id}
            className={`p-3 cursor-pointer ${
              selectedEmailId === email.id ? "bg-inkiq-primary/5" : email.read ? "" : "bg-blue-50"
            } hover:bg-gray-100`}
            onClick={() => onSelectEmail(email.id)}
            onMouseEnter={() => setHoveredEmail(email.id)}
            onMouseLeave={() => setHoveredEmail(null)}
          >
            <div className="flex items-start gap-2">
              <button
                onClick={(e) => toggleStar(e, email.id)}
                className="mt-0.5 text-gray-400 hover:text-yellow-400"
              >
                {starredEmails[email.id] ? (
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ) : (
                  <StarOff className="h-4 w-4" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className={`font-medium text-sm truncate ${!email.read ? "font-semibold" : ""}`}>
                    {email.from.name}
                  </h4>
                  <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                    {getRelativeTime(email.date)}
                  </span>
                </div>
                <h3 className={`text-sm truncate ${!email.read ? "font-semibold" : ""}`}>
                  {email.subject}
                </h3>
                <p className="text-xs text-gray-500 truncate mt-1">
                  {email.content.replace(/<[^>]*>/g, " ").slice(0, 100)}...
                </p>
                
                <div className="flex items-center mt-2 gap-2">
                  {email.labels?.map(label => (
                    <Badge 
                      key={label} 
                      variant="outline" 
                      className={`text-xs px-1.5 py-0 h-5 ${
                        label === 'work' ? 'border-green-500 text-green-700' :
                        label === 'personal' ? 'border-blue-500 text-blue-700' :
                        label === 'important' ? 'border-red-500 text-red-700' : ''
                      }`}
                    >
                      {label}
                    </Badge>
                  ))}
                  
                  {email.attachments.length > 0 && (
                    <span className="text-xs text-gray-500 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      {email.attachments.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
