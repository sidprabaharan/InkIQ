import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { EmailMessage } from '@/types/lead';
import { Send, Paperclip, Smile, Bold, Italic, Underline, List, Image } from 'lucide-react';

interface EmailComposerProps {
  replyTo?: EmailMessage | null;
  leadName?: string;
  onSend: (emailData: any) => void;
  onCancel: () => void;
}

export default function EmailComposer({ 
  replyTo, 
  leadName, 
  onSend, 
  onCancel 
}: EmailComposerProps) {
  const [to, setTo] = useState(replyTo?.from || '');
  const [subject, setSubject] = useState(
    replyTo ? `Re: ${replyTo.subject}` : `Follow-up: ${leadName} Print Order Inquiry`
  );
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  // Quick response templates for print shop
  const quickResponses = [
    {
      label: "Request Details",
      text: "Hi! Thank you for your inquiry. To provide you with an accurate quote, could you please share more details about what you're looking for?\n\n• What type of items do you need (t-shirts, hoodies, etc.)?\n• How many pieces in each size?\n• Do you have a logo or design ready?\n• Do you prefer embroidery or screen printing?\n• Where would you like the logo placed?\n\nI'll be happy to help you find the perfect solution!"
    },
    {
      label: "Logo Request",
      text: "Thanks for the details! Could you please send me your logo in a high-resolution format (PNG, PDF, or AI file)? This will help me create an accurate mockup and quote for you.\n\nIf you don't have a digital version, I can work with what you have and provide guidance on the best approach."
    },
    {
      label: "Quantity & Sizes",
      text: "Could you please let me know the breakdown of quantities and sizes you need? For example:\n\n• Small: 10 pieces\n• Medium: 20 pieces\n• Large: 15 pieces\n• XL: 5 pieces\n\nThis will help me calculate the most accurate pricing for your order."
    },
    {
      label: "Print Method Options",
      text: "For your logo, I can offer both embroidery and screen printing options:\n\n**Embroidery:**\n• More durable and professional look\n• Great for polos, jackets, hats\n• Works best with simpler designs\n\n**Screen Printing:**\n• Vibrant colors and fine details\n• More cost-effective for larger quantities\n• Great for t-shirts and flat surfaces\n\nWhich option would you prefer, or would you like me to recommend the best choice for your specific items?"
    }
  ];

  const insertQuickResponse = (text: string) => {
    setBody(body + (body ? '\n\n' : '') + text);
  };

  const handleSend = () => {
    const emailData = {
      to,
      subject,
      body,
      attachments,
      replyToId: replyTo?.id
    };
    onSend(emailData);
  };

  return (
    <div className="p-6 space-y-4">
      {/* Quick Response Templates */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Quick Responses</Label>
        <div className="flex flex-wrap gap-2">
          {quickResponses.map((template, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => insertQuickResponse(template.text)}
              className="text-xs"
            >
              {template.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Email Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="customer@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="body">Message</Label>
          <div className="border rounded-md">
            {/* Simple toolbar */}
            <div className="flex items-center space-x-1 p-2 border-b bg-muted/50">
              <Button variant="ghost" size="sm">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Underline className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <List className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button variant="ghost" size="sm">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Image className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type your message here..."
              className="min-h-[200px] border-0 focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <Badge key={index} variant="secondary">
                  <Paperclip className="h-3 w-3 mr-1" />
                  {file.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={!to || !subject || !body}>
            <Send className="h-4 w-4 mr-2" />
            Send Email
          </Button>
        </div>
      </div>
    </div>
  );
}