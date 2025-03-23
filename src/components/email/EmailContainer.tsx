
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmailList } from "@/components/email/EmailList";
import { EmailListHeader } from "@/components/email/EmailListHeader";
import { EmailListToolbar } from "@/components/email/EmailListToolbar";
import { EmailDetail } from "@/components/email/EmailDetail";

interface EmailContainerProps {
  selectedEmailData: any | null;
  selectedEmailId: string | null;
  folderEmails: any[];
  onSelectEmail: (emailId: string) => void;
  onBackToInbox: () => void;
}

export function EmailContainer({ 
  selectedEmailData, 
  selectedEmailId, 
  folderEmails, 
  onSelectEmail, 
  onBackToInbox 
}: EmailContainerProps) {
  return (
    <div className="flex-1 flex flex-col h-full">
      {selectedEmailData ? (
        /* Email Detail View */
        <EmailDetail email={selectedEmailData} onBackToInbox={onBackToInbox} />
      ) : (
        /* Email List View */
        <div className="flex-1 flex flex-col overflow-hidden">
          <EmailListHeader />
          <div className="flex-1 flex flex-col overflow-hidden">
            <EmailListToolbar />
            <ScrollArea className="flex-1">
              <EmailList 
                emails={folderEmails} 
                selectedEmailId={selectedEmailId}
                onSelectEmail={onSelectEmail}
              />
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
