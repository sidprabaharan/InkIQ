
import { useState } from "react";
import { format } from "date-fns";
import { CheckCircle2, Star, StarOff } from "lucide-react";
import { Email } from "@/data/mockEmails";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

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
    <div>
      {emails.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <p>No emails found</p>
        </div>
      ) : (
        emails.map((email) => (
          <div
            key={email.id}
            className={`flex py-2 px-4 border-b hover:shadow-sm cursor-pointer ${
              selectedEmailId === email.id ? "bg-blue-50" : email.read ? "" : "font-medium"
            }`}
            onClick={() => onSelectEmail(email.id)}
            onMouseEnter={() => setHoveredEmail(email.id)}
            onMouseLeave={() => setHoveredEmail(null)}
          >
            <div className="flex items-center space-x-4 w-full">
              <div className="flex items-center space-x-3">
                <Checkbox className="rounded-none" />
                <button
                  onClick={(e) => toggleStar(e, email.id)}
                  className="text-gray-400 hover:text-yellow-400"
                >
                  {starredEmails[email.id] ? (
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ) : (
                    <StarOff className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              <div className="flex-1 min-w-0 ml-2">
                <div className="flex items-center">
                  <span className={`mr-2 truncate font-medium w-40 ${!email.read ? "text-black" : "text-gray-600"}`}>
                    {email.from.name}
                  </span>
                  <div className="flex-1 flex">
                    <p className={`truncate mr-2 ${!email.read ? "font-medium text-black" : "text-gray-600"}`}>
                      {email.subject}
                      <span className="text-gray-500 mx-1">-</span>
                      <span className="text-gray-500 truncate">{email.content.replace(/<[^>]*>/g, " ").slice(0, 60)}</span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {email.labels?.map(label => (
                      <Badge 
                        key={label} 
                        variant="outline" 
                        className={`text-xs px-1.5 py-0 h-5 ${
                          label === 'work' ? 'border-green-500 text-green-700 bg-green-50' :
                          label === 'personal' ? 'border-blue-500 text-blue-700 bg-blue-50' :
                          label === 'important' ? 'border-red-500 text-red-700 bg-red-50' : ''
                        }`}
                      >
                        {label}
                      </Badge>
                    ))}
                    
                    {email.attachments.length > 0 && (
                      <span className="text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </span>
                    )}
                    
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {getRelativeTime(email.date)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
