import type { EmailAccount, Email } from "@/types/email";

export const mockEmailAccounts: EmailAccount[] = [
  {
    id: "account-1",
    email: "john@inkiq.com",
    provider: "gmail",
    isConnected: true,
    status: "online",
    unreadCount: 5,
    displayName: "John Smith",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    lastSynced: new Date("2024-01-15T09:30:00Z"),
  },
  {
    id: "account-2",
    email: "support@inkiq.com",
    provider: "outlook",
    isConnected: true,
    status: "online",
    unreadCount: 12,
    displayName: "InkIQ Support",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
    lastSynced: new Date("2024-01-15T09:25:00Z"),
  },
  {
    id: "account-3",
    email: "sales@inkiq.com",
    provider: "gmail",
    isConnected: true,
    status: "syncing",
    unreadCount: 3,
    displayName: "InkIQ Sales",
    lastSynced: new Date("2024-01-15T09:00:00Z"),
  }
];

export const mockEmails: Email[] = [
  // Pamela Hunt Email Thread
  {
    id: "pamela-1",
    accountId: "account-1",
    from: {
      email: "pamela@westernalliancetransport.com",
      name: "Pamela Hunt",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=400&h=400&fit=crop&crop=face"
    },
    to: [{ email: "kiriakos@merchradar.com", name: "Kiriakos" }],
    subject: "Staff Merchandise Order - Western Alliance Transport",
    content: "Hello,\n\nWe'd like to order t-shirts, hoodies, and hats for our staff. We need them for an event next week. How much will this cost, and can you deliver?\n\nPamela Hunt\nWestern Alliance Transport\n514-512-9926",
    date: "2024-02-01T14:30:00Z",
    read: true,
    starred: false,
    folder: "inbox",
    labels: ["new-inquiry", "urgent"],
    attachments: [],
    threadId: "thread-pamela",
    messageId: "msg-pamela-1",
    importance: "high"
  },
  {
    id: "pamela-2",
    accountId: "account-1",
    from: {
      email: "kiriakos@merchradar.com",
      name: "Kiriakos (inkIQ)",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    },
    to: [{ email: "pamela@westernalliancetransport.com", name: "Pamela Hunt" }],
    subject: "RE: Staff Merchandise Order - Western Alliance Transport",
    content: "<div style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 12px 16px; border-radius: 8px; margin-bottom: 16px;\"><div style=\"display: flex; align-items: center; gap: 8px; color: white; font-size: 13px; font-weight: 600;\"><div style=\"width: 10px; height: 10px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;\"><div style=\"width: 4px; height: 4px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%;\"></div></div>AI-Generated Response • Auto-sent in 8 seconds</div></div><p>Hi Pamela,</p><p>Thanks for reaching out—happy to help.</p><p>I just need a few quick details so I can put together a quote and some mockups for you:</p><ul><li>Do you know which t-shirt, hoodie, and hat models you're looking for?</li><li>Do you have a budget in mind?</li><li>What colors do you want for each item?</li><li>Can you send me a size/quantity breakdown?</li><li>Can you send your logo(s) and let me know where you want them placed and how large?</li><li>What exact date next week do you need delivery by?</li></ul><p>Looking forward to your reply.</p><p>Thanks,<br>Kiriakos<br>Merch Radar<br>kiriakos@merchradar.com<br>514-834-6659<br>mercradar.com</p>",
    date: "2024-02-01T14:30:08Z",
    read: true,
    starred: true,
    folder: "sent",
    labels: ["ai-generated", "auto-reply"],
    attachments: [],
    threadId: "thread-pamela",
    messageId: "msg-pamela-2",
    importance: "normal"
  },
  {
    id: "email-1",
    accountId: "account-1",
    from: {
      email: "client@acmecorp.com",
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=400&h=400&fit=crop&crop=face"
    },
    to: [{ email: "john@inkiq.com", name: "John Smith" }],
    subject: "Print Quote Request - 500 Business Cards",
    content: "Hi John,\n\nI need a quote for 500 business cards with the following specifications:\n- Premium cardstock\n- Full color, double-sided\n- Matte finish\n- Standard business card size\n\nCould you please provide pricing and turnaround time?\n\nThanks,\nSarah",
    date: "2024-01-15T08:30:00Z",
    read: false,
    starred: false,
    folder: "inbox",
    labels: ["urgent", "quote-request"],
    attachments: [
      {
        id: "att-1",
        name: "business-card-design.pdf",
        size: 2048000,
        type: "application/pdf",
        url: "/attachments/business-card-design.pdf"
      }
    ],
    threadId: "thread-1",
    messageId: "msg-1",
    importance: "high"
  },
  {
    id: "email-2",
    accountId: "account-2",
    from: {
      email: "inquiry@smallbiz.com",
      name: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
    },
    to: [{ email: "support@inkiq.com", name: "InkIQ Support" }],
    subject: "Custom T-shirt Printing for Company Event",
    content: "Hello,\n\nWe're planning a company retreat and need custom t-shirts for 50 employees. We'd like:\n- 100% cotton shirts\n- Company logo on front\n- Event date on back\n- Various sizes (S-XXL)\n\nCan you help us with this order?\n\nBest,\nMike",
    date: "2024-01-15T07:45:00Z",
    read: false,
    starred: true,
    folder: "inbox",
    labels: ["custom-print"],
    attachments: [
      {
        id: "att-2",
        name: "company-logo.png",
        size: 1024000,
        type: "image/png",
        url: "/attachments/company-logo.png"
      }
    ],
    threadId: "thread-2",
    messageId: "msg-2",
    importance: "normal"
  },
  {
    id: "email-3",
    accountId: "account-1",
    from: {
      email: "orders@bigclient.com",
      name: "Emma Davis",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
    },
    to: [{ email: "john@inkiq.com", name: "John Smith" }],
    cc: [{ email: "sales@inkiq.com", name: "InkIQ Sales" }],
    subject: "Bulk Order - Marketing Materials",
    content: "Hi John,\n\nWe need to place a bulk order for our upcoming marketing campaign:\n- 10,000 flyers (A4, full color)\n- 2,000 brochures (tri-fold)\n- 500 posters (A2 size)\n\nPlease send a detailed quote with volume discounts.\n\nRegards,\nEmma",
    date: "2024-01-15T06:15:00Z",
    read: true,
    starred: false,
    folder: "inbox",
    labels: ["bulk-order", "priority"],
    attachments: [],
    threadId: "thread-3",
    messageId: "msg-3",
    importance: "high"
  },
  {
    id: "email-4",
    accountId: "account-3",
    from: {
      email: "lead@startup.com",
      name: "Alex Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    },
    to: [{ email: "sales@inkiq.com", name: "InkIQ Sales" }],
    subject: "Startup Package Inquiry",
    content: "Hi there,\n\nWe're a new startup and need a complete branding package:\n- Logo design\n- Business cards\n- Letterheads\n- Email signatures\n\nDo you offer startup packages? What would be the cost?\n\nThanks,\nAlex",
    date: "2024-01-14T16:20:00Z",
    read: true,
    starred: false,
    folder: "inbox",
    labels: ["startup", "branding"],
    attachments: [],
    threadId: "thread-4",
    messageId: "msg-4",
    importance: "normal"
  },
  {
    id: "email-5",
    accountId: "account-2",
    from: {
      email: "admin@school.edu",
      name: "Jennifer Wilson",
      avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=400&fit=crop&crop=face"
    },
    to: [{ email: "support@inkiq.com", name: "InkIQ Support" }],
    subject: "School Newsletter Printing",
    content: "Dear InkIQ Team,\n\nOur school needs monthly newsletter printing:\n- 1,000 copies per month\n- A4 size, black and white\n- Standard paper quality\n\nCan you provide a monthly subscription service?\n\nBest regards,\nJennifer Wilson\nPrincipal",
    date: "2024-01-14T14:10:00Z",
    read: false,
    starred: false,
    folder: "inbox",
    labels: ["education", "subscription"],
    attachments: [],
    threadId: "thread-5",
    messageId: "msg-5",
    importance: "normal"
  }
];