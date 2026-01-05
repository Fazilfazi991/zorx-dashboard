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

// Preserving Team Members for Login Access
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

// Empty Data for Production
export const MOCK_CLIENTS: Client[] = [];

export const MOCK_TASKS: Task[] = [];

export const MOCK_CAMPAIGNS: Campaign[] = [];

export const MOCK_IDEAS: Idea[] = [];

export const MOCK_HOLIDAYS: Holiday[] = [];

export const MOCK_LEAVES: LeaveRequest[] = [];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [];

export const MOCK_OVERTIME: OvertimeRecord[] = [];

export const MOCK_TARGETS: QuarterlyTarget[] = [];

// Reset Sales Data Structure (Preserving Structure for Chart rendering, but zeroing Actuals)
export const MOCK_Q1_2026_SALES_DATA: QuarterlySalesData = {
  id: 'q1-2026',
  quarter: 'Q1',
  year: 2026,
  overallTargetClients: 10,
  overallTargetRevenue: 40000, // 40K AED MRR Target
  channels: [
    {
      id: 'ch-google',
      name: 'Google',
      kpis: ['Impressions (12K/wk)', 'CTR (0.8%+)', 'Leads (3/wk)'],
      monthlyData: [
        {
          month: 'Jan',
          metrics: {
            'Impressions': { target: 50000, actual: 0, unit: 'count' },
            'Clicks': { target: 400, actual: 0, unit: 'count' },
            'Leads Generated': { target: 12, actual: 0, unit: 'count' },
            'Calls Booked': { target: 8, actual: 0, unit: 'count' },
            'Proposals Sent': { target: 5, actual: 0, unit: 'count' },
            'Clients Closed': { target: 1, actual: 0, unit: 'count' }
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
            'Companies Identified': { target: 200, actual: 0, unit: 'count' },
            'Cold Calls Made': { target: 200, actual: 0, unit: 'count' },
            'Qualified Leads': { target: 20, actual: 0, unit: 'count' },
            'Meetings Booked': { target: 8, actual: 0, unit: 'count' },
            'Proposals Sent': { target: 5, actual: 0, unit: 'count' },
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
            'Requests Made': { target: 11, actual: 0, unit: 'count' },
            'Referrals Received': { target: 5, actual: 0, unit: 'count' },
            'Calls Booked': { target: 3, actual: 0, unit: 'count' },
            'Proposals Sent': { target: 2, actual: 0, unit: 'count' },
            'Clients Closed': { target: 1, actual: 0, unit: 'count' }
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
            'Scraped': { target: 200, actual: 0, unit: 'count' },
            'Emails Sent': { target: 200, actual: 0, unit: 'count' },
            'Opened': { target: 70, actual: 0, unit: 'count' },
            'Replies': { target: 10, actual: 0, unit: 'count' },
            'Meetings Booked': { target: 3, actual: 0, unit: 'count' },
            'Proposals Sent': { target: 2, actual: 0, unit: 'count' },
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
    { name: 'Total Leads/Contacts', jan: 0, feb: 0, mar: 0, total: 0, conversionRate: '0%' },
    { name: 'Qualified/Interested', jan: 0, feb: 0, mar: 0, total: 0, conversionRate: '0%' },
    { name: 'Meetings Booked', jan: 0, feb: 0, mar: 0, total: 0, conversionRate: '0%' },
    { name: 'Meetings Conducted', jan: 0, feb: 0, mar: 0, total: 0, conversionRate: '0%' },
    { name: 'Proposals Sent', jan: 0, feb: 0, mar: 0, total: 0, conversionRate: '0%' },
    { name: 'Clients Closed', jan: 0, feb: 0, mar: 0, total: 0, conversionRate: '0%' }
  ]
};