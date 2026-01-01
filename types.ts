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

export interface Task {
  id: string;
  clientId: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  team: Team;
  dueDate: string; // ISO date string
  assignedTo?: string;
}

export interface Metric {
  label: string;
  value: string | number;
  trend: number; // percentage
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
