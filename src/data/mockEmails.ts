
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
