import { useState } from "react";
import { Send, Paperclip, X, Bold, Italic, Underline } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { EmailAccount, Email, EmailComposition } from "@/types/email";

interface MultiAccountComposerProps {
  accounts: EmailAccount[];
  mode?: 'compose' | 'reply' | 'replyAll' | 'forward';
  originalEmail?: Email;
  onSend: (composition: EmailComposition) => void;
  onCancel: () => void;
}

export function MultiAccountComposer({
  accounts,
  mode = 'compose',
  originalEmail,
  onSend,
  onCancel,
}: MultiAccountComposerProps) {
  const [fromAccount, setFromAccount] = useState(
    originalEmail ? originalEmail.accountId : accounts[0]?.id || ''
  );
  const [to, setTo] = useState(
    mode === 'reply' || mode === 'replyAll' 
      ? originalEmail?.from.email || '' 
      : ''
  );
  const [cc, setCc] = useState(
    mode === 'replyAll' 
      ? originalEmail?.to.filter(r => r.email !== accounts.find(a => a.id === fromAccount)?.email).map(r => r.email).join(', ') || ''
      : ''
  );
  const [subject, setSubject] = useState(
    originalEmail 
      ? `${mode === 'forward' ? 'Fwd: ' : 'Re: '}${originalEmail.subject}`
      : ''
  );
  const [body, setBody] = useState(
    mode === 'forward' && originalEmail
      ? `\n\n---------- Forwarded message ---------\nFrom: ${originalEmail.from.email}\nDate: ${originalEmail.date}\nSubject: ${originalEmail.subject}\nTo: ${originalEmail.to.map(r => r.email).join(', ')}\n\n${originalEmail.content}`
      : mode === 'reply' || mode === 'replyAll' && originalEmail
      ? `\n\nOn ${originalEmail.date}, ${originalEmail.from.email} wrote:\n> ${originalEmail.content.split('\n').join('\n> ')}`
      : ''
  );
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showCc, setShowCc] = useState(mode === 'replyAll');

  const selectedAccount = accounts.find(acc => acc.id === fromAccount);

  const quickResponses = [
    "Thank you for your email. I'll review this and get back to you shortly.",
    "I'll look into this and provide an update by end of day.",
    "Thanks for reaching out. Let me check on this for you.",
    "I appreciate your patience. I'll have an answer for you soon.",
  ];

  const handleFileAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    const composition: EmailComposition = {
      from: fromAccount,
      to: to.split(',').map(email => email.trim()).filter(Boolean),
      cc: cc ? cc.split(',').map(email => email.trim()).filter(Boolean) : undefined,
      subject,
      content: body,
      signature: selectedAccount?.displayName,
      attachments,
      replyToId: mode === 'reply' || mode === 'replyAll' ? originalEmail?.id : undefined,
      threadId: originalEmail?.threadId,
    };
    
    onSend(composition);
  };

  const insertQuickResponse = (response: string) => {
    setBody(prev => prev + (prev ? '\n\n' : '') + response);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {mode === 'compose' ? 'New Email' :
           mode === 'reply' ? 'Reply' :
           mode === 'replyAll' ? 'Reply All' : 'Forward'}
        </h3>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {/* From Account */}
        <div className="space-y-2">
          <Label htmlFor="from">From</Label>
          <Select value={fromAccount} onValueChange={setFromAccount}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${
                      account.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <span>{account.displayName}</span>
                    <span className="text-muted-foreground">({account.email})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* To */}
        <div className="space-y-2">
          <Label htmlFor="to">To</Label>
          <Input
            id="to"
            placeholder="recipient@example.com"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        {/* CC */}
        {showCc && (
          <div className="space-y-2">
            <Label htmlFor="cc">CC</Label>
            <Input
              id="cc"
              placeholder="cc@example.com"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
            />
          </div>
        )}

        {!showCc && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCc(true)}
            className="text-xs"
          >
            Add CC
          </Button>
        )}

        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="Email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {/* Quick Responses */}
        {mode === 'reply' || mode === 'replyAll' ? (
          <div className="space-y-2">
            <Label className="text-xs">Quick Responses</Label>
            <div className="flex flex-wrap gap-2">
              {quickResponses.map((response, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => insertQuickResponse(response)}
                  className="text-xs h-8"
                >
                  {response.substring(0, 30)}...
                </Button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Body */}
        <div className="space-y-2">
          <Label htmlFor="body">Message</Label>
          <div className="border rounded-md">
            {/* Simple formatting toolbar */}
            <div className="border-b p-2 flex gap-1">
              <Button variant="ghost" size="sm">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Underline className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              id="body"
              placeholder="Write your message..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[200px] border-none resize-none focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs">Attachments</Label>
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <Badge key={index} variant="secondary" className="gap-2">
                  {file.name}
                  <button
                    onClick={() => removeAttachment(index)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button onClick={handleSend} className="gap-2">
            <Send className="h-4 w-4" />
            Send
          </Button>
          
          <input
            type="file"
            multiple
            onChange={handleFileAttach}
            className="hidden"
            id="attach-files"
          />
          <Label htmlFor="attach-files" asChild>
            <Button variant="outline" className="gap-2 cursor-pointer">
              <Paperclip className="h-4 w-4" />
              Attach
            </Button>
          </Label>
        </div>

        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}