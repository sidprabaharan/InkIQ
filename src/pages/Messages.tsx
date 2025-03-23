
import { useState } from "react";
import { mockEmails } from "@/data/mockEmails";
import { EmailSidebar } from "@/components/email/EmailSidebar";
import { EmailContainer } from "@/components/email/EmailContainer";
import { ConnectEmailDialog } from "@/components/email/ConnectEmailDialog";

export default function Messages() {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [currentFolder, setCurrentFolder] = useState("inbox");
  
  const selectedEmailData = selectedEmail 
    ? mockEmails.find(email => email.id === selectedEmail) 
    : null;

  const folderEmails = mockEmails.filter(email => email.folder === currentFolder);
  const unreadCount = mockEmails.filter(e => e.folder === "inbox" && !e.read).length;

  const handleBackToInbox = () => {
    setSelectedEmail(null);
  };
  
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Gmail-like sidebar */}
      <EmailSidebar 
        currentFolder={currentFolder}
        setCurrentFolder={setCurrentFolder}
        setSelectedEmail={setSelectedEmail}
        unreadCount={unreadCount}
      />

      {/* Main content area - conditionally displays list or detail */}
      <EmailContainer
        selectedEmailData={selectedEmailData}
        selectedEmailId={selectedEmail}
        folderEmails={folderEmails}
        onSelectEmail={setSelectedEmail}
        onBackToInbox={handleBackToInbox}
      />

      <ConnectEmailDialog open={showConnectDialog} onOpenChange={setShowConnectDialog} />
    </div>
  );
}
