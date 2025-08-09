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
  // Pamela Hunt Email Thread - Initial Message
  {
    id: "pamela-thread-1",
    accountId: "account-1",
    from: {
      email: "pamela@westernalliancetransport.com",
      name: "Pamela Hunt",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=400&h=400&fit=crop&crop=face"
    },
    to: [{ email: "steve@theprintcompany.com", name: "Steve Balboni" }],
    subject: "Staff Merchandise Order - Western Alliance Transport",
    content: `Hello,

We'd like to order t-shirts, hoodies, and hats for our staff. We need them for an event next week. How much will this cost, and can you deliver?

Pamela Hunt
Western Alliance Transport
514-512-9926

---

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 12px 16px; border-radius: 8px; margin: 16px 0;">
  <div style="display: flex; align-items: center; gap: 8px; color: white; font-size: 13px; font-weight: 600;">
    <div style="width: 10px; height: 10px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
      <div style="width: 4px; height: 4px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%;"></div>
    </div>
    AI-Generated Response • Auto-sent in 8 seconds
  </div>
</div>

**From: Steve Balboni (The Print Company) <steve@theprintcompany.com>**
**Date: February 1st, 2024 at 9:30:08 AM**

Hi Pamela,

Thanks for reaching out—happy to help.

I just need a few quick details so I can put together a quote and some mockups for you:
• Do you know which t-shirt, hoodie, and hat models you're looking for?
• Do you have a budget in mind?
• What colors do you want for each item?
• Can you send me a size/quantity breakdown?
• Can you send your logo(s) and let me know where you want them placed and how large?
• What exact date next week do you need delivery by?

Looking forward to your reply.

Thanks,
Steve Balboni
The Print Company
steve@theprintcompany.com
514-834-6659
theprintcompany.com

---

**From: Pamela Hunt <pamela@westernalliancetransport.com>**
**Date: February 3rd, 2024 at 2:15 PM**

Hi Steve,

We need everything delivered no later than next Thursday.

Can you send me a few garment options? I'm not too picky—just something cotton for the tees and hoodies, and a hat with a buckle. Good quality but affordable.

**Colors:**
• Black t-shirts and hoodies
• White hats
• For the tees and hoodies, we want the black part of the logo to be white

**Quantities:**
• Tees & Hoodies: 20 small, 50 medium, 50 large, 20 XL
• Hats: 140 units

I attached our logos.
• Print the full logo large on the front of the tees and hoodies
• Print the slogan large on the back
• Embroider just the logo on the front of the hats

Let me know if you need anything else.

Pamela Hunt
Western Alliance Transport
514-512-9926

---

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 12px 16px; border-radius: 8px; margin: 16px 0;">
  <div style="display: flex; align-items: center; gap: 8px; color: white; font-size: 13px; font-weight: 600;">
    <div style="width: 10px; height: 10px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
      <div style="width: 4px; height: 4px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%;"></div>
    </div>
    AI-Generated Response • Auto-curated product options
  </div>
</div>

**From: Steve Balboni (The Print Company) <steve@theprintcompany.com>**
**Date: February 4th, 2024 at 11:22 AM**

Hi Pamela,

Thanks for the info—here are some great garment options with prices (includes decoration):

**T-Shirts**
• **Gildan 5000** – 100% cotton, boxy fit, durable. **$7.52**
• **Gildan 64000** – 100% cotton, slimmer fit, softer feel. **$8.36**
• **Bella Canvas 3001C** – Premium fit/feel, still budget-friendly. **$9.40**

**Hoodies (100% cotton)**
Hoodies are a bit tricky—cotton ones are harder to find at low prices. Let me know if you'd be open to blends for cheaper options.
• **Comfort Colors 1467** – Lightweight, soft, **$30.44**
• **Allmade AL400** – French terry, lightweight, **$36.58**
• **Stanley/Stella SXU028** – Premium French terry, **$49.40**
• **LA Apparel HF-09** – Made in USA, heavy, boxy fit. **$52.75**

**Hats**
• **Valucap VC300A** – Unstructured, buckle closure. **$11.40**
• **Valucap 9910** – Structured, buckle closure. **$12.33**

Let me know which ones you want so I can send over the quote and mockups.

Thanks,
Steve Balboni

---

**From: Pamela Hunt <pamela@westernalliancetransport.com>**
**Date: February 6th, 2024 at 10:45 AM**

Hey Steve,

Let's go with:
• Gildan 5000 t-shirt
• Comfort Colors 1467 hoodie
• Valucap VC300A hat

Please send over the quote and mockups, and let me know the next steps.

Pamela Hunt
Western Alliance Transport
514-512-9926

---

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 12px 16px; border-radius: 8px; margin: 16px 0;">
  <div style="display: flex; align-items: center; gap: 8px; color: white; font-size: 13px; font-weight: 600;">
    <div style="width: 10px; height: 10px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
      <div style="width: 4px; height: 4px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%;"></div>
    </div>
    AI-Generated Quote • Mockups created automatically
  </div>
</div>

**From: Steve Balboni (The Print Company) <steve@theprintcompany.com>**
**Date: February 7th, 2024 at 9:18 AM**

Hey Pamela,

Just sent over the formal quote with mockups and instructions to get started. Let me know if you have any questions!

**Quote Summary**
**Total: $12,000** (420 items)
Ready for production • 5-7 business days

Thanks,
Steve Balboni`,
    date: "2024-02-07T09:18:00Z",
    read: false,
    starred: true,
    folder: "inbox",
    labels: [],
    attachments: [
      {
        id: "att-logos",
        name: "western-alliance-logos.zip",
        size: 2400000,
        type: "application/zip",
        url: "/attachments/western-alliance-logos.zip"
      },
      {
        id: "att-quote",
        name: "western-alliance-quote-3046.pdf",
        size: 1800000,
        type: "application/pdf",
        url: "/attachments/western-alliance-quote-3046.pdf"
      }
    ],
    threadId: "thread-pamela",
    messageId: "msg-pamela-thread",
    importance: "high"
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
    labels: ["quote-request"],
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