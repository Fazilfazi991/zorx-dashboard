
export enum Status {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum Team {
  MARKETING = 'Marketing',
  CONTENT = 'Content',
  CREATIVE = 'Creative',
  DEV = 'Development'
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  contactPerson: string;
  email: string;
  status: 'Active' | 'Onboarding' | 'Paused';
  avatarUrl?: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string; // User name
  createdAt: string; // ISO string
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: string;
  uploadedBy: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string; // e.g., "changed status to Done", "uploaded a file"
  author: string;
  timestamp: string;
}

export interface TaskPerformance {
  completion: number; // Weight 40%
  onTime: number;     // Weight 25%
  quality: number;    // Weight 20%
  teamwork: number;   // Weight 5%
  // Ideas (10%) is now calculated globally from Idea Lab, not per task
  taskScore: number;  // The score out of 90 based on above metrics
  ratedBy: string;
  ratedAt: string;
}

export interface Task {
  id: string;
  clientId: string;
  campaignId?: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  team: Team;
  dueDate: string;
  frequency?: 'Once' | 'Daily' | 'Weekly'; // NEW FIELD for recurring tasks
  assignedTo?: string[];
  assignedBy?: string; // New field to track who assigned the task
  comments?: Comment[];
  attachments?: Attachment[];
  history?: ActivityLog[];
  reminderHoursBefore?: number; // Hours before due date to notify
  performance?: TaskPerformance; // NEW: Optional performance review data
}

export interface Campaign {
  id: string;
  clientId: string;
  name: string;
  status: 'Planning' | 'Active' | 'Completed' | 'Paused';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  platform: 'Google' | 'Meta' | 'TikTok' | 'LinkedIn' | 'Email';
  kpi: string;
}

export interface Metric {
  label: string;
  value: string | number;
  trend: number;
  trendUp: boolean;
}

export interface AIStrategyResponse {
  tasks: Array<{
    title: string;
    description: string;
    priority: Priority;
    team: Team;
  }>;
}

export interface AIContentResponse {
  variations: Array<{
    headline: string;
    body: string;
    hashtags: string[];
  }>;
}

// --- User Types ---
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  password?: string;
}

// --- Idea Lab Types ---

export type IdeaCategory = 'Marketing' | 'Creative' | 'Content' | 'Strategy' | 'Culture' | 'Tools';

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: IdeaCategory;
  author: string;
  votes: number;
  hasVoted: boolean;
  createdAt: string;
  status: 'New' | 'Considering' | 'Implemented';
  tags: string[];
  clientId?: string;
}

// --- HR & Staff Types ---

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  type: 'Sick Leave' | 'Casual Leave' | 'Emergency' | 'Vacation';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  date: string; // YYYY-MM-DD
  checkInTime: string;
  checkOutTime?: string;
  totalHours?: string;
  status: 'Present' | 'Late' | 'Absent' | 'Half Day';
}

export interface Holiday {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  type: 'Public' | 'Company';
}

export interface OvertimeRecord {
  id: string;
  userId: string;
  userName: string;
  date: string;
  durationMinutes: number; // Total minutes worked
  workDescription: string;
  loggedBy: string; // "Jefla"
}

// --- Company Targets & Sales Types (Updated) ---

export interface TargetMetric {
  target: number;
  actual: number;
  unit: 'currency' | 'count' | 'percent';
}

export interface QuarterlyTarget {
  id: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year: number;
  status: 'Upcoming' | 'Current' | 'Completed';
  revenue: TargetMetric;
  newClients: TargetMetric;
  salesLeads: TargetMetric;
  notes?: string;
}

// Detailed Sales Data Structures
export interface MonthlyMetricDetail {
  target: number;
  actual: number;
  unit: string; // e.g., '%', 'count', 'currency'
}

export interface MonthlyChannelData {
  month: string; // 'Jan', 'Feb', 'Mar'
  metrics: Record<string, MonthlyMetricDetail>; // Key: "Impressions", "Calls", etc.
}

export interface SalesChannel {
  id: string;
  name: string; // 'Google', 'Indeed', 'Referrals', 'Email'
  monthlyData: MonthlyChannelData[];
  kpis: string[]; // List of KPI strings to display
}

export interface SalesPipelineStage {
  name: string;
  jan: number;
  feb: number;
  mar: number;
  total: number;
  conversionRate: string; // e.g. "100%"
}

export interface QuarterlySalesData {
  id: string;
  quarter: string; // 'Q1'
  year: number;
  overallTargetClients: number;
  overallTargetRevenue: number; // MRR
  channels: SalesChannel[];
  pipeline: SalesPipelineStage[];
}
