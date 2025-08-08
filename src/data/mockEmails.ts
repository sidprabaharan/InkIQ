
export interface Email {
  id: string;
  from: {
    name: string;
    email: string;
  };
  to: {
    name: string;
    email: string;
  }[];
  subject: string;
  content: string;
  date: string;
  read: boolean;
  starred: boolean;
  attachments: {
    name: string;
    size: string;
    type: string;
  }[];
  folder: 'inbox' | 'sent' | 'draft' | 'archive' | 'trash' | 'starred';
  labels?: string[];
}

export const mockEmails: Email[] = [
  {
    id: "sarah-business-cards-1",
    from: {
      name: "Sarah Johnson",
      email: "sarah@company.com"
    },
    to: [
      {
        name: "John",
        email: "john@inkiq.com"
      }
    ],
    subject: "Print Quote Request - 500 Business Cards",
    content: `
      <p>Hi John,</p>
      <p>I need a quote for 500 business cards with the following specifications:</p>
      <ul>
        <li>Premium cardstock</li>
        <li>Full color, double-sided</li>
        <li>Matte finish</li>
        <li>Standard business card size</li>
      </ul>
      <p>Could you please provide pricing and turnaround time?</p>
      <p>Thanks,<br>Sarah</p>
    `,
    date: "2024-01-15T03:30:00",
    read: true,
    starred: false,
    attachments: [
      {
        name: "business-card-design.pdf",
        size: "2.0 MB",
        type: "application/pdf"
      }
    ],
    folder: "inbox",
    labels: ["quote-request", "urgent"]
  },
  {
    id: "sarah-business-cards-ai-reply",
    from: {
      name: "inkIQ AI Assistant",
      email: "ai@inkiq.com"
    },
    to: [
      {
        name: "Sarah Johnson",
        email: "sarah@company.com"
      }
    ],
    subject: "RE: Print Quote Request - 500 Business Cards",
    content: `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 8px; color: white; font-size: 14px; font-weight: 600;">
          <div style="width: 12px; height: 12px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <div style="width: 6px; height: 6px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%;"></div>
          </div>
          AI-Generated Quote • Confidence: 98%
        </div>
      </div>
      
      <p>Hi Sarah,</p>
      
      <p>Thank you for your business card quote request! I've analyzed your requirements and attachment, and I'm happy to provide you with the following quote:</p>
      
      <div style="background: #f8f9ff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <h3 style="margin: 0 0 12px 0; color: #1e293b;">Quote Details</h3>
        <p><strong>Quantity:</strong> 500 business cards</p>
        <p><strong>Material:</strong> Premium 16pt cardstock</p>
        <p><strong>Printing:</strong> Full color, double-sided (4/4)</p>
        <p><strong>Finish:</strong> Matte coating</p>
        <p><strong>Size:</strong> Standard 3.5" x 2"</p>
        <br>
        <p style="font-size: 18px; font-weight: bold; color: #059669;">Total Price: $89.50</p>
        <p style="color: #6b7280; font-size: 14px;">Includes design review and proofing</p>
      </div>
      
      <p><strong>Turnaround Time:</strong> 3-5 business days after artwork approval</p>
      
      <p>I've reviewed your design file and it looks great! The resolution and bleed are perfect for printing. We can proceed immediately once you approve this quote.</p>
      
      <p>To move forward:</p>
      <ol>
        <li>Reply to approve this quote</li>
        <li>We'll send a digital proof within 24 hours</li>
        <li>Once approved, production begins immediately</li>
      </ol>
      
      <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px; margin: 16px 0;">
        <p style="margin: 0; color: #065f46; font-size: 14px;">
          <strong>⚡ Fast Track Option:</strong> Need them sooner? We can expedite for next-day delivery (+$25)
        </p>
      </div>
      
      <p>Let me know if you have any questions or would like to proceed!</p>
      
      <p>Best regards,<br>
      inkIQ AI Assistant<br>
      <span style="color: #6b7280; font-size: 12px;">This quote was automatically generated and reviewed by our AI system</span></p>
    `,
    date: "2024-01-15T03:32:00",
    read: true,
    starred: true,
    attachments: [],
    folder: "sent",
    labels: ["ai-generated", "quote"]
  },
  {
    id: "1",
    from: {
      name: "John Doe",
      email: "john.doe@example.com"
    },
    to: [
      {
        name: "Me",
        email: "me@example.com"
      }
    ],
    subject: "Quote Approval for Project X",
    content: `
      <p>Hello,</p>
      <p>I've reviewed the quote for Project X and everything looks good. We're ready to proceed with the order.</p>
      <p>Let me know the next steps to get started.</p>
      <p>Best regards,<br>John</p>
    `,
    date: "2023-05-15T10:30:00",
    read: false,
    starred: true,
    attachments: [],
    folder: "inbox",
    labels: ["work"]
  },
  {
    id: "2",
    from: {
      name: "Sarah Johnson",
      email: "sarah.j@example.com"
    },
    to: [
      {
        name: "Me",
        email: "me@example.com"
      }
    ],
    subject: "Invoice #INV-2023-056 Payment Confirmation",
    content: `
      <p>Hi there,</p>
      <p>This email is to confirm that payment for Invoice #INV-2023-056 has been processed successfully.</p>
      <p>Amount: $1,450.00<br>
      Date: May 12, 2023<br>
      Payment Method: Credit Card</p>
      <p>Thank you for your business!</p>
      <p>Regards,<br>Sarah Johnson<br>Accounting Department</p>
    `,
    date: "2023-05-12T15:45:00",
    read: true,
    starred: false,
    attachments: [
      {
        name: "receipt-2023-056.pdf",
        size: "156 KB",
        type: "application/pdf"
      }
    ],
    folder: "inbox"
  },
  {
    id: "3",
    from: {
      name: "Mike Williams",
      email: "mike.w@example.com"
    },
    to: [
      {
        name: "Me",
        email: "me@example.com"
      }
    ],
    subject: "New Product Design Feedback",
    content: `
      <p>Hey,</p>
      <p>I've had a chance to review the new product designs, and I have some feedback I'd like to share.</p>
      <p>Overall, the designs look great, but I think we should reconsider the color scheme for the main interface. The current blue might be a bit too intense for extended use.</p>
      <p>I've attached some alternative color palettes that might work better.</p>
      <p>Let me know your thoughts!</p>
      <p>Cheers,<br>Mike</p>
    `,
    date: "2023-05-10T09:15:00",
    read: true,
    starred: true,
    attachments: [
      {
        name: "color-palettes.png",
        size: "3.2 MB",
        type: "image/png"
      },
      {
        name: "design-notes.docx",
        size: "78 KB",
        type: "application/docx"
      }
    ],
    folder: "inbox",
    labels: ["work", "important"]
  },
  {
    id: "4",
    from: {
      name: "Emily Chen",
      email: "emily.c@example.com"
    },
    to: [
      {
        name: "Me",
        email: "me@example.com"
      }
    ],
    subject: "Weekend Team Building Event",
    content: `
      <p>Hi team,</p>
      <p>I'm excited to announce our upcoming team building event this weekend!</p>
      <p>We'll be meeting at Green Park on Saturday at 10 AM for a day of fun activities and team challenges.</p>
      <p>Please let me know if you'll be able to attend by Thursday. Lunch and refreshments will be provided.</p>
      <p>Looking forward to seeing everyone there!</p>
      <p>Best,<br>Emily</p>
    `,
    date: "2023-05-09T11:20:00",
    read: false,
    starred: false,
    attachments: [],
    folder: "inbox",
    labels: ["personal"]
  },
  {
    id: "5",
    from: {
      name: "Alex Turner",
      email: "alex.turner@example.com"
    },
    to: [
      {
        name: "Me",
        email: "me@example.com"
      }
    ],
    subject: "Urgent: Server Downtime Notice",
    content: `
      <p>ATTENTION ALL USERS:</p>
      <p>We will be performing emergency server maintenance today from 2 PM to 4 PM EST due to some critical security updates.</p>
      <p>During this time, the system will be completely unavailable. Please make sure to save your work and log out before 2 PM to prevent any data loss.</p>
      <p>We apologize for the short notice and any inconvenience this may cause.</p>
      <p>IT Support Team</p>
    `,
    date: "2023-05-08T13:00:00",
    read: true,
    starred: true,
    attachments: [],
    folder: "inbox",
    labels: ["important"]
  },
  {
    id: "6",
    from: {
      name: "Me",
      email: "me@example.com"
    },
    to: [
      {
        name: "Robert Davis",
        email: "robert.d@example.com"
      }
    ],
    subject: "RE: Project Timeline Update",
    content: `
      <p>Hi Robert,</p>
      <p>Thanks for your email about the project timeline.</p>
      <p>After reviewing the schedule, I think we can definitely meet the proposed deadlines. I've already started working on the initial phase and should have something to share by the end of the week.</p>
      <p>Let's schedule a quick call on Friday to discuss progress?</p>
      <p>Best regards,</p>
    `,
    date: "2023-05-07T16:30:00",
    read: true,
    starred: false,
    attachments: [],
    folder: "sent"
  },
  {
    id: "7",
    from: {
      name: "Me",
      email: "me@example.com"
    },
    to: [
      {
        name: "Sales Team",
        email: "sales@example.com"
      }
    ],
    subject: "Q2 Sales Report and Strategy",
    content: `
      <p>Dear Sales Team,</p>
      <p>Attached is the Q2 sales report for your review. Overall, we've seen a 15% increase in sales compared to Q1, which is excellent progress!</p>
      <p>Key areas of growth:</p>
      <ul>
        <li>Enterprise clients (up 22%)</li>
        <li>Software services (up 18%)</li>
        <li>East coast region (up 24%)</li>
      </ul>
      <p>Let's discuss strategies to build on this momentum during our team meeting next Monday.</p>
      <p>Great work, everyone!</p>
    `,
    date: "2023-05-05T10:15:00",
    read: true,
    starred: true,
    attachments: [
      {
        name: "Q2-Sales-Report.pdf",
        size: "2.4 MB",
        type: "application/pdf"
      },
      {
        name: "Sales-Data-Q2.xlsx",
        size: "1.8 MB",
        type: "application/xlsx"
      }
    ],
    folder: "sent"
  }
];
