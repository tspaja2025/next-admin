import type { Email } from "@/lib/types";

export const mockEmails: Email[] = [
  {
    id: "1",
    sender: "Sarah Johnson",
    senderEmail: "sarah.johnson@company.com",
    recipient: "me@gmail.com",
    subject: "Q4 Budget Review Meeting",
    content: `Hi there,

I hope this email finds you well. I wanted to reach out regarding our upcoming Q4 budget review meeting scheduled for next week.

We'll be covering:
- Revenue projections for Q4
- Department budget allocations
- Cost optimization opportunities
- Strategic initiatives for next year

Please come prepared with your department's current spending analysis and any budget requests for Q1 next year.

The meeting is scheduled for Tuesday at 2:00 PM in Conference Room B. Please let me know if you have any conflicts.

Best regards,
Sarah Johnson
Finance Director`,
    timestamp: new Date("2024-01-15T10:30:00"),
    isRead: false,
    isStarred: true,
    folder: "inbox",
    attachments: [],
  },
  {
    id: "2",
    sender: "GitHub",
    senderEmail: "notifications@github.com",
    recipient: "me@gmail.com",
    subject: "[Repository] New pull request submitted",
    content: `A new pull request has been submitted to your repository.

Pull Request: #247 - Add user authentication feature
Author: @johndoe
Branch: feature/user-auth -> main

Changes include:
- JWT token implementation
- User registration and login forms
- Password encryption
- Session management

Please review the changes and provide feedback.

View Pull Request: https://github.com/repo/pull/247

Best regards,
GitHub Team`,
    timestamp: new Date("2024-01-15T09:15:00"),
    isRead: true,
    isStarred: false,
    folder: "inbox",
    attachments: [],
  },
  {
    id: "3",
    sender: "Marketing Team",
    senderEmail: "marketing@company.com",
    recipient: "me@gmail.com",
    subject: "New Product Launch Campaign",
    content: `Hello Team,

Exciting news! We're launching our new product line next month and need your input on the marketing campaign.

Campaign Details:
- Launch Date: February 15th
- Target Audience: Tech professionals aged 25-45
- Budget: $50,000
- Channels: Social media, email, content marketing

We need to finalize:
1. Creative assets and messaging
2. Content calendar
3. Influencer partnerships
4. Launch event planning

Please review the attached campaign brief and let me know your thoughts by Friday.

Thanks,
Marketing Team`,
    timestamp: new Date("2024-01-14T16:45:00"),
    isRead: true,
    isStarred: false,
    folder: "inbox",
    attachments: [],
  },
  {
    id: "4",
    sender: "LinkedIn",
    senderEmail: "messaging@linkedin.com",
    recipient: "me@gmail.com",
    subject: "You have 3 new connection requests",
    content: `Hi there,

You have 3 new connection requests waiting for your response:

1. Alex Thompson - Software Engineer at TechCorp
2. Maria Garcia - Product Manager at Innovation Labs
3. David Chen - UX Designer at Creative Studio

These professionals would like to connect with you on LinkedIn. You can accept or decline their requests from your LinkedIn inbox.

Stay connected,
LinkedIn Team`,
    timestamp: new Date("2024-01-14T14:20:00"),
    isRead: false,
    isStarred: false,
    folder: "inbox",
    attachments: [],
  },
  {
    id: "5",
    sender: "Netflix",
    senderEmail: "info@netflix.com",
    recipient: "me@gmail.com",
    subject: "New releases this week",
    content: `Discover what's new on Netflix this week!

🎬 New Movies:
- "The Digital Heist" - Action thriller
- "Midnight in Paris Revisited" - Romantic comedy
- "Ocean's Deep" - Documentary

📺 New Series:
- "Tech Titans" Season 2 - Biography series
- "The Future is Now" - Sci-fi drama
- "Cooking with Champions" - Culinary show

🔥 Trending Now:
- "Space Explorers" continues to top the charts
- "Mystery Manor" has everyone talking
- "Comedy Central Live" brings the laughs

Happy streaming!
The Netflix Team`,
    timestamp: new Date("2024-01-14T12:00:00"),
    isRead: true,
    isStarred: true,
    folder: "inbox",
    attachments: [],
  },
  {
    id: "6",
    sender: "Me",
    senderEmail: "me@gmail.com",
    recipient: "client@business.com",
    subject: "Project proposal and timeline",
    content: `Dear Client,

Thank you for considering our services for your upcoming project. I'm excited to present our proposal and timeline.

Project Overview:
We'll be developing a comprehensive web application with the following features:
- User authentication and authorization
- Real-time data dashboard
- Mobile-responsive design
- Third-party API integrations

Timeline:
Phase 1 (Weeks 1-2): UI/UX Design and wireframes
Phase 2 (Weeks 3-6): Frontend development
Phase 3 (Weeks 7-9): Backend development and API integration
Phase 4 (Weeks 10-12): Testing and deployment

Total Project Duration: 12 weeks
Investment: $25,000

I'm confident we can deliver exceptional results within this timeframe. Let's schedule a call to discuss any questions you might have.

Best regards,
[Your Name]`,
    timestamp: new Date("2024-01-13T15:30:00"),
    isRead: true,
    isStarred: false,
    folder: "sent",
    attachments: [],
  },
];
