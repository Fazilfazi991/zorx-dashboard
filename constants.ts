
import { Client, Priority, Status, Task, Team, Campaign, Idea, User, LeaveRequest, AttendanceRecord, Holiday, QuarterlyTarget, QuarterlySalesData, OvertimeRecord } from './types';

const ADMIN_PASSWORD = 'zorxdxb@1234';
const STAFF_PASSWORD = '1234';
const ADMIN_NAMES = ['Thameem', 'Fazil', 'Ajzal', 'Salman', 'Ayisha'];

export const MOTIVATIONAL_QUOTES = [
  "{name}, this year we are going to achieve everything you have dreamed of.",
  "Are you ready to make magic happen today, {name}?",
  "{name}, your potential is limitless. Let us achieve greatness!",
  "The team is stronger with you here, {name}.",
  "Big ideas start with you, {name}.",
  "{name}, turn your obstacles into opportunities.",
  "Continue pushing boundaries, {name}.",
  "Believe in your vision, {name}. The results will follow.",
  "{name}, make today a masterpiece.",
  "Your hard work is building our future, {name}.",
  "Innovation distinguishes between a leader and a follower, {name}.",
  "{name}, excellence is not an act, but a habit."
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Fazil', email: 'fazil@zorx.agency' },
  { id: 'u2', name: 'Ajzal', email: 'ajzal@zorx.agency' },
  { id: 'u3', name: 'Salman', email: 'salman@zorx.agency' },
  { id: 'u4', name: 'Thameem', email: 'thameem@zorx.agency' },
  { id: 'u5', name: 'Ayisha', email: 'ayisha@zorx.agency' },
  { id: 'u6', name: 'Saleema', email: 'saleema@zorx.agency' },
  { id: 'u7', name: 'Anshif', email: 'anshif@zorx.agency' },
  { id: 'u8', name: 'Akhil', email: 'akhil@zorx.agency' },
  { id: 'u9', name: 'Jefla', email: 'jefla@zorx.agency' },
  { id: 'u10', name: 'Ahalya', email: 'ahalya@zorx.agency' },
  { id: 'u11', name: 'Arya', email: 'arya@zorx.agency' },
  { id: 'u12', name: 'Nahidha', email: 'nahidha@zorx.agency' },
  { id: 'u13', name: 'Anjana', email: 'anjana@zorx.agency' },
].map(u => ({
  ...u,
  password: ADMIN_NAMES.includes(u.name) ? ADMIN_PASSWORD : STAFF_PASSWORD
}));

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Bridgewater',
    industry: 'Financial Services',
    contactPerson: 'James Bridge',
    email: 'james@bridgewater.com',
    status: 'Active',
    avatarUrl: 'https://ui-avatars.com/api/?name=Bridgewater&background=0D8ABC&color=fff',
  },
  {
    id: 'c2',
    name: 'Lets Fade',
    industry: 'Grooming & Lifestyle',
    contactPerson: 'Marcus Fade',
    email: 'marcus@letsfade.com',
    status: 'Active',
    avatarUrl: 'https://ui-avatars.com/api/?name=Lets+Fade&background=10b981&color=fff',
  },
  {
    id: 'c3',
    name: 'AudioPro',
    industry: 'Audio Equipment',
    contactPerson: 'Sarah Sound',
    email: 'sarah@audiopro.com',
    status: 'Active',
    avatarUrl: 'https://ui-avatars.com/api/?name=Audio+Pro&background=6366f1&color=fff',
  },
  {
    id: 'c4',
    name: 'Neonlight',
    industry: 'Lighting & Decor',
    contactPerson: 'Leo Neon',
    email: 'leo@neonlight.com',
    status: 'Active',
    avatarUrl: 'https://ui-avatars.com/api/?name=Neonlight&background=f59e0b&color=fff',
  },
  {
    id: 'c5',
    name: 'WeCare',
    industry: 'Healthcare',
    contactPerson: 'Dr. Emily',
    email: 'emily@wecare.com',
    status: 'Active',
    avatarUrl: 'https://ui-avatars.com/api/?name=WeCare&background=ef4444&color=fff',
  },
  {
    id: 'c6',
    name: 'Al Sarab Cafe',
    industry: 'Hospitality',
    contactPerson: 'Ahmed',
    email: 'manager@alsarab.com',
    status: 'Active',
    avatarUrl: 'https://ui-avatars.com/api/?name=Al+Sarab&background=8b5cf6&color=fff',
  },
  {
    id: 'c7',
    name: 'Tonio & Senora',
    industry: 'Fashion Retail',
    contactPerson: 'Antonio',
    email: 'info@tonioandsenora.com',
    status: 'Active',
    avatarUrl: 'https://ui-avatars.com/api/?name=Tonio+Senora&background=ec4899&color=fff',
  },
  {
    id: 'c8',
    name: 'Lamplus',
    industry: 'Interior Design',
    contactPerson: 'Lana Lamp',
    email: 'lana@lamplus.com',
    status: 'Onboarding',
    avatarUrl: 'https://ui-avatars.com/api/?name=Lamplus&background=14b8a6&color=fff',
  },
  {
    id: 'c9',
    name: 'Zappo',
    industry: 'E-commerce',
    contactPerson: 'Zach',
    email: 'zach@zappo.com',
    status: 'Active',
    avatarUrl: 'https://ui-avatars.com/api/?name=Zappo&background=f97316&color=fff',
  },
  {
    id: 'c10',
    name: 'Styleloom',
    industry: 'Fashion',
    contactPerson: 'Stella',
    email: 'stella@styleloom.com',
    status: 'Active',
    avatarUrl: 'https://ui-avatars.com/api/?name=Styleloom&background=84cc16&color=fff',
  },
  {
    id: 'c11',
    name: 'Tangan Furniture',
    industry: 'Furniture',
    contactPerson: 'Tan',
    email: 'tan@tangan.com',
    status: 'Active',
    avatarUrl: 'https://ui-avatars.com/api/?name=Tangan&background=a855f7&color=fff',
  },
  {
    id: 'c12',
    name: 'MO Clinic',
    industry: 'Medical Aesthetics',
    contactPerson: 'Dr. Mo',
    email: 'contact@moclinic.com',
    status: 'Active',
    avatarUrl: 'https://ui-avatars.com/api/?name=MO+Clinic&background=06b6d4&color=fff',
  },
  {
    id: 'c13',
    name: 'synops labs',
    industry: 'Technology',
    contactPerson: 'Sy',
    email: 'sy@synopslabs.com',
    status: 'Onboarding',
    avatarUrl: 'https://ui-avatars.com/api/?name=Synops&background=64748b&color=fff',
  },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    clientId: 'c3',
    campaignId: 'cmp5',
    title: 'Website Development',
    description: 'Complete website overhaul and launch.',
    status: Status.COMPLETED,
    priority: Priority.HIGH,
    team: Team.DEV,
    dueDate: '2025-05-20',
    assignedTo: ['Thameem'],
    assignedBy: 'Salman',
    comments: [
      { id: 'cm1', text: 'Waiting for the final assets from the client.', author: 'Thameem', createdAt: '2025-05-10T09:00:00Z' }
    ],
    attachments: [],
    history: [
      { id: 'h1', action: 'Created task', author: 'Salman', timestamp: '2025-05-01T10:00:00Z' }
    ],
    reminderHoursBefore: 24,
    performance: {
      completion: 100,
      onTime: 100,
      quality: 100,
      teamwork: 100,
      taskScore: 90, // Max 90 without ideas
      ratedBy: 'Salman',
      ratedAt: '2025-05-21T10:00:00Z'
    }
  },
  {
    id: 't2',
    clientId: 'c4',
    campaignId: 'cmp1',
    title: 'Google Ads Optimization',
    description: 'Optimize keywords and bid strategy for Q2.',
    status: Status.COMPLETED,
    priority: Priority.HIGH,
    team: Team.MARKETING,
    dueDate: '2025-05-15',
    assignedTo: ['Akhil'],
    assignedBy: 'Fazil',
    comments: [],
    attachments: [],
    history: [],
    performance: {
        completion: 100,
        onTime: 50, // Slightly late
        quality: 100,
        teamwork: 50,
        taskScore: 75,
        ratedBy: 'Fazil',
        ratedAt: '2025-05-16T14:00:00Z'
    }
  },
  {
    id: 't3',
    clientId: 'c8',
    title: 'New Website Launch',
    description: 'Finalize design and implement frontend.',
    status: Status.PENDING,
    priority: Priority.CRITICAL,
    team: Team.DEV,
    dueDate: '2025-06-01',
    assignedTo: ['Thameem'],
    assignedBy: 'Salman',
    comments: [],
    attachments: [],
    history: []
  },
  {
    id: 't4',
    clientId: 'c9',
    campaignId: 'cmp2',
    title: 'Shopify Optimization',
    description: 'Improve page load speed and checkout flow.',
    status: Status.IN_PROGRESS,
    priority: Priority.MEDIUM,
    team: Team.DEV,
    dueDate: '2025-05-25',
    assignedTo: ['Thameem'],
    assignedBy: 'Jefla',
    comments: [],
    attachments: [],
    history: []
  },
  {
    id: 't5',
    clientId: 'c9',
    campaignId: 'cmp2',
    title: 'Launch Ad Campaign',
    description: 'Setup and run new seasonal marketing ads.',
    status: Status.PENDING,
    priority: Priority.HIGH,
    team: Team.MARKETING,
    dueDate: '2025-05-18',
    assignedTo: ['Akhil'],
    assignedBy: 'Fazil',
    comments: [],
    attachments: [],
    history: []
  },
  {
    id: 't6',
    clientId: 'c10',
    campaignId: 'cmp3',
    title: 'Fashion Shoot',
    description: 'Video production for new collection.',
    status: Status.PENDING,
    priority: Priority.HIGH,
    team: Team.CREATIVE,
    dueDate: '2025-05-30',
    assignedTo: ['Saleema', 'Anshif'],
    assignedBy: 'Ajzal',
    comments: [],
    attachments: [],
    history: []
  },
  {
    id: 't7',
    clientId: 'c11',
    title: 'Strategy Meeting',
    description: 'Quarterly review and planning meeting with client.',
    status: Status.PENDING,
    priority: Priority.MEDIUM,
    team: Team.MARKETING, 
    dueDate: '2025-05-12',
    assignedTo: ['Jefla'],
    assignedBy: 'Fazil',
    comments: [],
    attachments: [],
    history: []
  },
  {
    id: 't8',
    clientId: 'c12',
    title: 'Clinic Promo Video',
    description: 'On-site video shoot for facility walkthrough.',
    status: Status.COMPLETED,
    priority: Priority.HIGH,
    team: Team.CREATIVE,
    dueDate: '2025-05-22',
    assignedTo: ['Saleema'],
    assignedBy: 'Ajzal',
    comments: [],
    attachments: [],
    history: [],
    performance: {
        completion: 100,
        onTime: 100,
        quality: 70, // Some issues
        teamwork: 100,
        taskScore: 84,
        ratedBy: 'Ajzal',
        ratedAt: '2025-05-23T09:00:00Z'
    }
  },
  {
    id: 't9',
    clientId: 'c13',
    campaignId: 'cmp4',
    title: 'Founder Interview',
    description: 'Record and edit interview for PR release.',
    status: Status.PENDING,
    priority: Priority.MEDIUM,
    team: Team.MARKETING,
    dueDate: '2025-05-28',
    assignedTo: ['Ayisha'],
    assignedBy: 'Jefla',
    comments: [],
    attachments: [],
    history: []
  },
  {
    id: 't10',
    clientId: 'c1', 
    title: 'Q2 Performance Report',
    description: 'Compile analytics for Q2 review.',
    status: Status.COMPLETED,
    priority: Priority.LOW,
    team: Team.MARKETING,
    dueDate: '2025-04-30',
    assignedTo: ['Jefla'],
    assignedBy: 'Fazil',
    comments: [],
    attachments: [],
    history: [],
    performance: {
        completion: 100,
        onTime: 100,
        quality: 100,
        teamwork: 100,
        taskScore: 90,
        ratedBy: 'Fazil',
        ratedAt: '2025-05-01T10:00:00Z'
    }
  },
  {
    id: 't11',
    clientId: 'c2', 
    title: 'Social Media Content',
    description: 'Design posts for Instagram.',
    status: Status.IN_PROGRESS,
    priority: Priority.MEDIUM,
    team: Team.CONTENT,
    dueDate: '2025-05-14',
    assignedTo: ['Ahalya'],
    assignedBy: 'Saleema',
    comments: [],
    attachments: [],
    history: []
  }
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp1',
    clientId: 'c4', // Neonlight
    name: 'Summer Glow 2025',
    status: 'Active',
    budget: 5000,
    spent: 2150,
    startDate: '2025-05-01',
    endDate: '2025-06-30',
    platform: 'Google',
    kpi: 'ROAS 3.5'
  },
  // ... other campaigns same as before
  {
    id: 'cmp2',
    clientId: 'c9', // Zappo
    name: 'Clearance Sale Blitz',
    status: 'Active',
    budget: 10000,
    spent: 8500,
    startDate: '2025-04-15',
    endDate: '2025-05-15',
    platform: 'Meta',
    kpi: 'CPA $12'
  },
  {
    id: 'cmp3',
    clientId: 'c10', // Styleloom
    name: 'Fall Collection Teaser',
    status: 'Planning',
    budget: 15000,
    spent: 0,
    startDate: '2025-07-01',
    endDate: '2025-08-15',
    platform: 'TikTok',
    kpi: 'Views 1M+'
  },
  {
    id: 'cmp4',
    clientId: 'c13', // Synops
    name: 'Tech Leader Awareness',
    status: 'Active',
    budget: 8000,
    spent: 1200,
    startDate: '2025-05-01',
    endDate: '2025-07-31',
    platform: 'LinkedIn',
    kpi: 'Leads 50+'
  },
  {
    id: 'cmp5',
    clientId: 'c3', // AudioPro
    name: 'Audiophile Retargeting',
    status: 'Paused',
    budget: 3000,
    spent: 540,
    startDate: '2025-04-01',
    endDate: '2025-05-31',
    platform: 'Google',
    kpi: 'Conv. Rate 2%'
  }
];

export const MOCK_IDEAS: Idea[] = [
  {
    id: 'i1',
    title: 'Interactive Instagram Story Series',
    description: 'Create a "Choose Your Own Adventure" story campaign for product launches. Users vote on next steps, increasing engagement and retention.',
    category: 'Creative',
    author: 'Saleema',
    votes: 24,
    hasVoted: false,
    createdAt: '2025-05-10',
    status: 'Implemented',
    tags: ['instagram', 'interactive', 'engagement'],
    clientId: 'c1' // Bridgewater
  },
  {
    id: 'i2',
    title: 'Behind-the-Scenes TikTok Strategy',
    description: 'Show the "making of" our campaigns. Humanizes the agency and attracts potential clients who appreciate the craft.',
    category: 'Content',
    author: 'Fazil',
    votes: 19,
    hasVoted: true,
    createdAt: '2025-05-12',
    status: 'New',
    tags: ['tiktok', 'bts', 'branding'],
    // General idea, no client
  },
  {
    id: 'i3',
    title: 'Loyalty Rewards Integration',
    description: 'Gamify the shopping experience for E-commerce clients. Points for shares, not just purchases.',
    category: 'Strategy',
    author: 'Salman',
    votes: 15,
    hasVoted: false,
    createdAt: '2025-05-08',
    status: 'Considering',
    tags: ['loyalty', 'ecommerce', 'gamification'],
    clientId: 'c9' // Zappo
  },
  {
    id: 'i4',
    title: 'AI-Generated Personalized Emails',
    description: 'Use Gemini to craft unique opening lines for cold outreach based on prospect LinkedIn profiles.',
    category: 'Tools',
    author: 'Ayisha',
    votes: 32,
    hasVoted: false,
    createdAt: '2025-05-01',
    status: 'Implemented',
    tags: ['ai', 'email', 'automation'],
    clientId: 'c13' // Synops
  },
  {
    id: 'i5',
    title: 'Micro-Influencer Seeding Kits',
    description: 'Design ultra-premium unboxing experiences specifically for influencers with <50k followers for higher engagement rates.',
    category: 'Marketing',
    author: 'Jefla',
    votes: 8,
    hasVoted: false,
    createdAt: '2025-05-14',
    status: 'New',
    tags: ['influencer', 'pr', 'packaging'],
    clientId: 'c10' // Styleloom
  }
];

// --- HR Mock Data ---

export const MOCK_HOLIDAYS: Holiday[] = [
  { id: 'h1', name: 'New Year', date: '2025-01-01', type: 'Public' },
  { id: 'h2', name: 'Eid Al Fitr', date: '2025-03-31', type: 'Public' },
  { id: 'h3', name: 'Team Outing', date: '2025-06-15', type: 'Company' },
];

export const MOCK_LEAVES: LeaveRequest[] = [
  {
    id: 'l1',
    userId: 'u6', // Saleema
    userName: 'Saleema',
    type: 'Sick Leave',
    startDate: '2025-05-05',
    endDate: '2025-05-06',
    reason: 'Flu and high fever',
    status: 'Approved',
    approvedBy: 'Fazil'
  },
  {
    id: 'l2',
    userId: 'u8', // Akhil
    userName: 'Akhil',
    type: 'Vacation',
    startDate: '2025-06-20',
    endDate: '2025-06-25',
    reason: 'Family trip',
    status: 'Pending'
  }
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'a1',
    userId: 'u1',
    userName: 'Fazil',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '09:05',
    status: 'Present'
  },
  {
    id: 'a2',
    userId: 'u9',
    userName: 'Jefla',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '08:55',
    status: 'Present'
  }
];

export const MOCK_OVERTIME: OvertimeRecord[] = [
  {
    id: 'ot1',
    userId: 'u7', // Anshif
    userName: 'Anshif',
    date: '2025-05-15',
    durationMinutes: 120, // 2 hours
    workDescription: 'Urgent edits for Fashion Shoot video delivery.',
    loggedBy: 'Jefla'
  },
  {
    id: 'ot2',
    userId: 'u4', // Thameem
    userName: 'Thameem',
    date: '2025-05-18',
    durationMinutes: 45,
    workDescription: 'Deploying hotfix for Bridgewatersite.',
    loggedBy: 'Jefla'
  }
];

// --- OLD TARGETS (Keeping for compatibility if needed, but primary focus is new Sales Data) ---
export const MOCK_TARGETS: QuarterlyTarget[] = [
  {
    id: 'qt1',
    quarter: 'Q1',
    year: 2026,
    status: 'Current',
    revenue: { target: 150000, actual: 125000, unit: 'currency' },
    newClients: { target: 10, actual: 8, unit: 'count' },
    salesLeads: { target: 50, actual: 42, unit: 'count' },
    notes: 'Strong start in January. Need to close deal with Synops.'
  },
  // ...
];

// --- NEW DETAILED Q1 2026 SALES DATA ---
export const MOCK_Q1_2026_SALES_DATA: QuarterlySalesData = {
  id: 'q1-2026',
  quarter: 'Q1',
  year: 2026,
  overallTargetClients: 10,
  overallTargetRevenue: 40000, // 40K AED MRR
  channels: [
    {
      id: 'ch-google',
      name: 'Google',
      kpis: ['Impressions (12K/wk)', 'CTR (0.8%+)', 'Leads (3/wk)'],
      monthlyData: [
        {
          month: 'Jan',
          metrics: {
            'Impressions': { target: 50000, actual: 42000, unit: 'count' },
            'Clicks': { target: 400, actual: 350, unit: 'count' },
            'Leads Generated': { target: 12, actual: 10, unit: 'count' },
            'Calls Booked': { target: 8, actual: 6, unit: 'count' },
            'Proposals Sent': { target: 5, actual: 4, unit: 'count' },
            'Clients Closed': { target: 1, actual: 1, unit: 'count' }
          }
        },
        {
          month: 'Feb',
          metrics: {
            'Impressions': { target: 80000, actual: 0, unit: 'count' },
            'Clicks': { target: 650, actual: 0, unit: 'count' },
            'Leads Generated': { target: 18, actual: 0, unit: 'count' },
            'Calls Booked': { target: 12, actual: 0, unit: 'count' },
            'Proposals Sent': { target: 8, actual: 0, unit: 'count' },
            'Clients Closed': { target: 2, actual: 0, unit: 'count' }
          }
        },
        {
          month: 'Mar',
          metrics: {
            'Impressions': { target: 100000, actual: 0, unit: 'count' },
            'Clicks': { target: 850, actual: 0, unit: 'count' },
            'Leads Generated': { target: 25, actual: 0, unit: 'count' },
            'Calls Booked': { target: 17, actual: 0, unit: 'count' },
            'Proposals Sent': { target: 10, actual: 0, unit: 'count' },
            'Clients Closed': { target: 1, actual: 0, unit: 'count' }
          }
        }
      ]
    },
    {
      id: 'ch-indeed',
      name: 'Indeed (Cold Calls)',
      kpis: ['Calls (10/day)', 'Qualified (1/day)', 'Meetings (2/wk)'],
      monthlyData: [
        {
          month: 'Jan',
          metrics: {
            'Companies Identified': { target: 200, actual: 180, unit: 'count' },
            'Cold Calls Made': { target: 200, actual: 150, unit: 'count' },
            'Qualified Leads': { target: 20, actual: 12, unit: 'count' },
            'Meetings Booked': { target: 8, actual: 5, unit: 'count' },
            'Proposals Sent': { target: 5, actual: 3, unit: 'count' },
            'Clients Closed': { target: 1, actual: 0, unit: 'count' }
          }
        },
        {
          month: 'Feb',
          metrics: {
            'Companies Identified': { target: 300, actual: 0, unit: 'count' },
            'Cold Calls Made': { target: 300, actual: 0, unit: 'count' },
            'Qualified Leads': { target: 30, actual: 0, unit: 'count' },
            'Meetings Booked': { target: 12, actual: 0, unit: 'count' },
            'Proposals Sent': { target: 8, actual: 0, unit: 'count' },
            'Clients Closed': { target: 1, actual: 0, unit: 'count' }
          }
        },
        {
          month: 'Mar',
          metrics: {
            'Companies Identified': { target: 400, actual: 0, unit: 'count' },
            'Cold Calls Made': { target: 400, actual: 0, unit: 'count' },
            'Qualified Leads': { target: 40, actual: 0, unit: 'count' },
            'Meetings Booked': { target: 15, actual: 0, unit: 'count' },
            'Proposals Sent': { target: 11, actual: 0, unit: 'count' },
            'Clients Closed': { target: 3, actual: 0, unit: 'count' }
          }
        }
      ]
    },
    {
      id: 'ch-referrals',
      name: 'Referrals',
      kpis: ['Requests Made (11)', 'Received (5)', 'Close Rate (50%)'],
      monthlyData: [
        {
          month: 'Jan',
          metrics: {
            'Requests Made': { target: 11, actual: 11, unit: 'count' },
            'Referrals Received': { target: 5, actual: 4, unit: 'count' },
            'Calls Booked': { target: 3, actual: 3, unit: 'count' },
            'Proposals Sent': { target: 2, actual: 2, unit: 'count' },
            'Clients Closed': { target: 1, actual: 1, unit: 'count' }
          }
        },
        {
          month: 'Feb',
          metrics: {
            'Requests Made': { target: 15, actual: 0, unit: 'count' },
            'Referrals Received': { target: 8, actual: 0, unit: 'count' },
            'Calls Booked': { target: 5, actual: 0, unit: 'count' },
            'Proposals Sent': { target: 3, actual: 0, unit: 'count' },
            'Clients Closed': { target: 1, actual: 0, unit: 'count' }
          }
        },
        {
          month: 'Mar',
          metrics: {
            'Requests Made': { target: 20, actual: 0, unit: 'count' },
            'Referrals Received': { target: 12, actual: 0, unit: 'count' },
            'Calls Booked': { target: 8, actual: 0, unit: 'count' },
            'Proposals Sent': { target: 5, actual: 0, unit: 'count' },
            'Clients Closed': { target: 0, actual: 0, unit: 'count' }
          }
        }
      ]
    },
    {
      id: 'ch-email',
      name: 'Email Marketing',
      kpis: ['Emails Sent (200)', 'Open Rate (35%)', 'Replies (10)'],
      monthlyData: [
        {
          month: 'Jan',
          metrics: {
            'Scraped': { target: 200, actual: 210, unit: 'count' },
            'Emails Sent': { target: 200, actual: 195, unit: 'count' },
            'Opened': { target: 70, actual: 65, unit: 'count' },
            'Replies': { target: 10, actual: 8, unit: 'count' },
            'Meetings Booked': { target: 3, actual: 2, unit: 'count' },
            'Proposals Sent': { target: 2, actual: 1, unit: 'count' },
            'Clients Closed': { target: 0, actual: 0, unit: 'count' }
          }
        },
        {
          month: 'Feb',
          metrics: {
            'Scraped': { target: 300, actual: 0, unit: 'count' },
            'Emails Sent': { target: 300, actual: 0, unit: 'count' },
            'Opened': { target: 190, actual: 0, unit: 'count' },
            'Replies': { target: 20, actual: 0, unit: 'count' },
            'Meetings Booked': { target: 5, actual: 0, unit: 'count' },
            'Proposals Sent': { target: 3, actual: 0, unit: 'count' },
            'Clients Closed': { target: 0, actual: 0, unit: 'count' }
          }
        },
        {
          month: 'Mar',
          metrics: {
            'Scraped': { target: 400, actual: 0, unit: 'count' },
            'Emails Sent': { target: 400, actual: 0, unit: 'count' },
            'Opened': { target: 320, actual: 0, unit: 'count' },
            'Replies': { target: 32, actual: 0, unit: 'count' },
            'Meetings Booked': { target: 8, actual: 0, unit: 'count' },
            'Proposals Sent': { target: 6, actual: 0, unit: 'count' },
            'Clients Closed': { target: 1, actual: 0, unit: 'count' }
          }
        }
      ]
    }
  ],
  pipeline: [
    { name: 'Total Leads/Contacts', jan: 28, feb: 43, mar: 60, total: 131, conversionRate: '100%' },
    { name: 'Qualified/Interested', jan: 20, feb: 30, mar: 40, total: 90, conversionRate: '69%' },
    { name: 'Meetings Booked', jan: 22, feb: 34, mar: 48, total: 104, conversionRate: '79%' },
    { name: 'Meetings Conducted', jan: 18, feb: 28, mar: 41, total: 87, conversionRate: '84%' },
    { name: 'Proposals Sent', jan: 14, feb: 22, mar: 32, total: 68, conversionRate: '78%' },
    { name: 'Clients Closed', jan: 3, feb: 4, mar: 3, total: 10, conversionRate: '15%' }
  ]
};
    