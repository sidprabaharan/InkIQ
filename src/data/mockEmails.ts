
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
  // Pamela Hunt Email Thread
  {
    id: "pamela-1",
    from: {
      name: "Pamela Hunt",
      email: "pamela@westernalliancetransport.com"
    },
    to: [
      {
        name: "Kiriakos",
        email: "kiriakos@merchradar.com"
      }
    ],
    subject: "Staff Merchandise Order - Western Alliance Transport",
    content: `
      <p>Hello,</p>
      <p>We'd like to order t-shirts, hoodies, and hats for our staff. We need them for an event next week. How much will this cost, and can you deliver?</p>
      <p>Pamela Hunt<br>
      Western Alliance Transport<br>
      514-512-9926</p>
    `,
    date: "2024-02-01T14:30:00",
    read: true,
    starred: false,
    attachments: [],
    folder: "inbox",
    labels: []
  },
  {
    id: "pamela-2",
    from: {
      name: "Kiriakos (inkIQ)",
      email: "kiriakos@merchradar.com"
    },
    to: [
      {
        name: "Pamela Hunt",
        email: "pamela@westernalliancetransport.com"
      }
    ],
    subject: "RE: Staff Merchandise Order - Western Alliance Transport",
    content: `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 12px 16px; border-radius: 8px; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 8px; color: white; font-size: 13px; font-weight: 600;">
          <div style="width: 10px; height: 10px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <div style="width: 4px; height: 4px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%;"></div>
          </div>
          AI-Generated Response • Auto-sent in 8 seconds
        </div>
      </div>
      
      <p>Hi Pamela,</p>
      <p>Thanks for reaching out—happy to help.</p>
      <p>I just need a few quick details so I can put together a quote and some mockups for you:</p>
      <ul>
        <li>Do you know which t-shirt, hoodie, and hat models you're looking for?</li>
        <li>Do you have a budget in mind?</li>
        <li>What colors do you want for each item?</li>
        <li>Can you send me a size/quantity breakdown?</li>
        <li>Can you send your logo(s) and let me know where you want them placed and how large?</li>
        <li>What exact date next week do you need delivery by?</li>
      </ul>
      <p>Looking forward to your reply.</p>
      <p>Thanks,<br>
      Kiriakos<br>
      Merch Radar<br>
      kiriakos@merchradar.com<br>
      514-834-6659<br>
      mercradar.com</p>
    `,
    date: "2024-02-01T14:30:08",
    read: true,
    starred: true,
    attachments: [],
    folder: "sent",
    labels: ["auto-reply"]
  },
  {
    id: "pamela-3",
    from: {
      name: "Pamela Hunt",
      email: "pamela@westernalliancetransport.com"
    },
    to: [
      {
        name: "Kiriakos",
        email: "kiriakos@merchradar.com"
      }
    ],
    subject: "RE: Staff Merchandise Order - Western Alliance Transport",
    content: `
      <p>Hi Kiriakos,</p>
      <p>We need everything delivered no later than next Thursday.</p>
      <p>Can you send me a few garment options? I'm not too picky—just something cotton for the tees and hoodies, and a hat with a buckle. Good quality but affordable.</p>
      <p><strong>Colors:</strong></p>
      <ul>
        <li>Black t-shirts and hoodies</li>
        <li>White hats</li>
        <li>For the tees and hoodies, we want the black part of the logo to be white</li>
      </ul>
      <p><strong>Quantities:</strong></p>
      <ul>
        <li>Tees & Hoodies: 20 small, 50 medium, 50 large, 20 XL</li>
        <li>Hats: 140 units</li>
      </ul>
      <p>I attached our logos.</p>
      <ul>
        <li>Print the full logo large on the front of the tees and hoodies</li>
        <li>Print the slogan large on the back</li>
        <li>Embroider just the logo on the front of the hats</li>
      </ul>
      <p>Let me know if you need anything else.</p>
      <p>Pamela Hunt<br>
      Western Alliance Transport<br>
      514-512-9926</p>
    `,
    date: "2024-02-03T09:15:00",
    read: true,
    starred: false,
    attachments: [
      {
        name: "western-alliance-logos.zip",
        size: "2.4 MB",
        type: "application/zip"
      }
    ],
    folder: "inbox",
    labels: ["requirements", "logos"]
  },
  {
    id: "pamela-4",
    from: {
      name: "Kiriakos (inkIQ)",
      email: "kiriakos@merchradar.com"
    },
    to: [
      {
        name: "Pamela Hunt",
        email: "pamela@westernalliancetransport.com"
      }
    ],
    subject: "RE: Staff Merchandise Order - Garment Options",
    content: `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 12px 16px; border-radius: 8px; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 8px; color: white; font-size: 13px; font-weight: 600;">
          <div style="width: 10px; height: 10px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <div style="width: 4px; height: 4px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%;"></div>
          </div>
          AI-Generated Response • Auto-curated product options
        </div>
      </div>
      
      <p>Hi Pamela,</p>
      <p>Thanks for the info—here are some great garment options with prices (includes decoration):</p>
      
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <h3 style="margin: 0 0 12px 0; color: #1e293b;">T-Shirts</h3>
        <ul>
          <li><strong>Gildan 5000</strong> – 100% cotton, boxy fit, durable. <span style="color: #059669; font-weight: bold;">$7.52</span></li>
          <li><strong>Gildan 64000</strong> – 100% cotton, slimmer fit, softer feel. <span style="color: #059669; font-weight: bold;">$8.36</span></li>
          <li><strong>Bella Canvas 3001C</strong> – Premium fit/feel, still budget-friendly. <span style="color: #059669; font-weight: bold;">$9.40</span></li>
        </ul>
      </div>
      
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <h3 style="margin: 0 0 12px 0; color: #1e293b;">Hoodies (100% cotton)</h3>
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 12px;">Hoodies are a bit tricky—cotton ones are harder to find at low prices. Let me know if you'd be open to blends for cheaper options.</p>
        <ul>
          <li><strong>Comfort Colors 1467</strong> – Lightweight, soft, <span style="color: #059669; font-weight: bold;">$30.44</span></li>
          <li><strong>Allmade AL400</strong> – French terry, lightweight, <span style="color: #059669; font-weight: bold;">$36.58</span></li>
          <li><strong>Stanley/Stella SXU028</strong> – Premium French terry, <span style="color: #059669; font-weight: bold;">$49.40</span></li>
          <li><strong>LA Apparel HF-09</strong> – Made in USA, heavy, boxy fit. <span style="color: #059669; font-weight: bold;">$52.75</span></li>
        </ul>
      </div>
      
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <h3 style="margin: 0 0 12px 0; color: #1e293b;">Hats</h3>
        <ul>
          <li><strong>Valucap VC300A</strong> – Unstructured, buckle closure. <span style="color: #059669; font-weight: bold;">$11.40</span></li>
          <li><strong>Valucap 9910</strong> – Structured, buckle closure. <span style="color: #059669; font-weight: bold;">$12.33</span></li>
        </ul>
      </div>
      
      <p>Let me know which ones you want so I can send over the quote and mockups.</p>
      <p>Thanks,<br>Kiriakos</p>
    `,
    date: "2024-02-04T11:22:00",
    read: true,
    starred: true,
    attachments: [],
    folder: "sent",
    labels: ["product-options"]
  },
  {
    id: "pamela-5",
    from: {
      name: "Pamela Hunt",
      email: "pamela@westernalliancetransport.com"
    },
    to: [
      {
        name: "Kiriakos",
        email: "kiriakos@merchradar.com"
      }
    ],
    subject: "RE: Staff Merchandise Order - Final Selection",
    content: `
      <p>Hey Kiriakos,</p>
      <p>Let's go with:</p>
      <ul>
        <li>Gildan 5000 t-shirt</li>
        <li>Comfort Colors 1467 hoodie</li>
        <li>Valucap VC300A hat</li>
      </ul>
      <p>Please send over the quote and mockups, and let me know the next steps.</p>
      <p>Pamela Hunt<br>
      Western Alliance Transport<br>
      514-512-9926</p>
    `,
    date: "2024-02-06T10:45:00",
    read: true,
    starred: false,
    attachments: [],
    folder: "inbox",
    labels: ["selection-made"]
  },
  {
    id: "pamela-6",
    from: {
      name: "Kiriakos (inkIQ)",
      email: "kiriakos@merchradar.com"
    },
    to: [
      {
        name: "Pamela Hunt",
        email: "pamela@westernalliancetransport.com"
      }
    ],
    subject: "RE: Staff Merchandise Order - Quote & Mockups",
    content: `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 12px 16px; border-radius: 8px; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 8px; color: white; font-size: 13px; font-weight: 600;">
          <div style="width: 10px; height: 10px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <div style="width: 4px; height: 4px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%;"></div>
          </div>
          AI-Generated Quote • Mockups created automatically
        </div>
      </div>
      
      <p>Hey Pamela,</p>
      <p>Just sent over the formal quote with mockups and instructions to get started. Let me know if you have any questions!</p>
      
      <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <h3 style="margin: 0 0 8px 0; color: #065f46;">Quote Summary</h3>
        <p style="margin: 0; color: #065f46;"><strong>Total: $12,000</strong> (420 items)</p>
        <p style="margin: 4px 0 0 0; color: #059669; font-size: 14px;">Ready for production • 5-7 business days</p>
      </div>
      
      <p>Thanks,<br>Kiriakos</p>
    `,
    date: "2024-02-07T09:18:00",
    read: true,
    starred: true,
    attachments: [
      {
        name: "western-alliance-quote-3046.pdf",
        size: "1.8 MB",
        type: "application/pdf"
      },
      {
        name: "mockup-previews.zip",
        size: "4.2 MB",
        type: "application/zip"
      }
    ],
    folder: "sent",
    labels: ["quote-sent"]
  },
  // Sarah Johnson Business Cards Thread
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
    labels: ["quote-request"]
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
    labels: ["quote"]
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
