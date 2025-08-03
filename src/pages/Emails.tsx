import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { AccountSwitcher } from "@/components/emails/AccountSwitcher";
import { EmailSearchHeader } from "@/components/emails/EmailSearchHeader";
import { ModernEmailList } from "@/components/emails/ModernEmailList";
import { EnhancedEmailDetail } from "@/components/emails/EnhancedEmailDetail";
import { MultiAccountComposer } from "@/components/emails/MultiAccountComposer";
import { ConnectEmailDialog } from "@/components/email/ConnectEmailDialog";
import { mockEmailAccounts, mockEmails } from "@/data/mockEmailAccounts";
import type { EmailAccount, Email, EmailComposition } from "@/types/email";

export default function Emails() {
  const { toast } = useToast();
  
  // State
  const [accounts, setAccounts] = useState<EmailAccount[]>(mockEmailAccounts);
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [showComposer, setShowComposer] = useState(false);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'date' | 'sender' | 'subject'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'unread' | 'starred' | 'attachments'>('all');

  // Computed values
  const filteredEmails = useMemo(() => {
    let filtered = emails;

    // Filter by account
    if (selectedAccountId) {
      filtered = filtered.filter(email => email.accountId === selectedAccountId);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(email =>
        email.subject.toLowerCase().includes(query) ||
        email.from.name.toLowerCase().includes(query) ||
        email.from.email.toLowerCase().includes(query) ||
        email.content.toLowerCase().includes(query)
      );
    }

    // Filter by type
    switch (filterBy) {
      case 'unread':
        filtered = filtered.filter(email => !email.read);
        break;
      case 'starred':
        filtered = filtered.filter(email => email.starred);
        break;
      case 'attachments':
        filtered = filtered.filter(email => email.attachments.length > 0);
        break;
    }

    // Sort emails
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'sender':
          return (a.from.name || a.from.email).localeCompare(b.from.name || b.from.email);
        case 'subject':
          return a.subject.localeCompare(b.subject);
        default:
          return 0;
      }
    });

    return filtered;
  }, [emails, selectedAccountId, searchQuery, filterBy, sortBy]);

  const selectedEmail = selectedEmailId 
    ? emails.find(email => email.id === selectedEmailId) 
    : null;

  // Handlers
  const handleAccountSelect = (accountId: string | null) => {
    setSelectedAccountId(accountId);
    setSelectedEmailId(null);
    setSelectedEmails([]);
  };

  const handleEmailSelect = (emailId: string) => {
    setSelectedEmailId(emailId);
    setSelectedEmails([]);
    
    // Mark as read
    setEmails(prev => prev.map(email =>
      email.id === emailId ? { ...email, read: true } : email
    ));
    
    // Update unread count
    const email = emails.find(e => e.id === emailId);
    if (email && !email.read) {
      setAccounts(prev => prev.map(acc =>
        acc.id === email.accountId 
          ? { ...acc, unreadCount: Math.max(0, acc.unreadCount - 1) }
          : acc
      ));
    }
  };

  const handleStarToggle = (emailId: string) => {
    setEmails(prev => prev.map(email =>
      email.id === emailId ? { ...email, starred: !email.starred } : email
    ));
    
    const email = emails.find(e => e.id === emailId);
    toast({
      title: email?.starred ? "Removed from starred" : "Added to starred",
      description: `Email "${email?.subject}" ${email?.starred ? 'unstarred' : 'starred'}.`,
    });
  };

  const handleArchive = (emailIds: string[]) => {
    setEmails(prev => prev.map(email =>
      emailIds.includes(email.id) ? { ...email, folder: 'archive' } : email
    ));
    
    setSelectedEmails([]);
    if (selectedEmailId && emailIds.includes(selectedEmailId)) {
      setSelectedEmailId(null);
    }
    
    toast({
      title: "Emails archived",
      description: `${emailIds.length} email(s) moved to archive.`,
    });
  };

  const handleDelete = (emailIds: string[]) => {
    setEmails(prev => prev.map(email =>
      emailIds.includes(email.id) ? { ...email, folder: 'trash' } : email
    ));
    
    setSelectedEmails([]);
    if (selectedEmailId && emailIds.includes(selectedEmailId)) {
      setSelectedEmailId(null);
    }
    
    toast({
      title: "Emails deleted",
      description: `${emailIds.length} email(s) moved to trash.`,
    });
  };

  const handleSendEmail = (composition: EmailComposition) => {
    // Create new email object
    const newEmail: Email = {
      id: `email-${Date.now()}`,
      accountId: composition.from,
      from: {
        email: accounts.find(acc => acc.id === composition.from)?.email || '',
        name: accounts.find(acc => acc.id === composition.from)?.displayName || '',
      },
      to: composition.to.map(email => ({ email, name: email })),
      cc: composition.cc?.map(email => ({ email, name: email })),
      subject: composition.subject,
      content: composition.content,
      date: new Date().toISOString(),
      read: true,
      starred: false,
      folder: 'sent',
      labels: [],
      attachments: [],
      messageId: `msg-${Date.now()}`,
      importance: 'normal',
    };

    setEmails(prev => [newEmail, ...prev]);
    setShowComposer(false);
    
    toast({
      title: "Email sent",
      description: `Email sent to ${composition.to.join(', ')}.`,
    });
  };

  const handleAddAccount = () => {
    setShowConnectDialog(true);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Emails</h1>
          <Button onClick={() => setShowComposer(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Compose
          </Button>
        </div>
        
        <AccountSwitcher
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onAccountSelect={handleAccountSelect}
          onAddAccount={handleAddAccount}
        />
      </div>

      <div className="flex-1 flex overflow-hidden">
        {selectedEmail ? (
          /* Email Detail View */
          <EnhancedEmailDetail
            email={selectedEmail}
            accounts={accounts}
            onBack={() => setSelectedEmailId(null)}
            onStarToggle={handleStarToggle}
            onArchive={(emailId) => handleArchive([emailId])}
            onDelete={(emailId) => handleDelete([emailId])}
            onSendEmail={handleSendEmail}
          />
        ) : (
          /* Email List View */
          <div className="flex-1 flex flex-col overflow-hidden">
            <EmailSearchHeader
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              filterBy={filterBy}
              onFilterChange={setFilterBy}
            />
            
            <ModernEmailList
              emails={filteredEmails}
              selectedEmailId={selectedEmailId}
              onEmailSelect={handleEmailSelect}
              selectedEmails={selectedEmails}
              onEmailsSelect={setSelectedEmails}
              onStarToggle={handleStarToggle}
              onArchive={handleArchive}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>

      {/* Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <MultiAccountComposer
                accounts={accounts}
                onSend={handleSendEmail}
                onCancel={() => setShowComposer(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Connect Email Dialog */}
      <ConnectEmailDialog 
        open={showConnectDialog} 
        onOpenChange={setShowConnectDialog} 
      />
    </div>
  );
}