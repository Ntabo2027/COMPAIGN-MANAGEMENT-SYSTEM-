export type NairobiConstituency =
  | 'Westlands'
  | 'Dagoretti North'
  | 'Dagoretti South'
  | 'Lang\'ata'
  | 'Kibra'
  | 'Roysambu'
  | 'Kasarani'
  | 'Ruaraka'
  | 'Embakasi South'
  | 'Embakasi North'
  | 'Embakasi Central'
  | 'Embakasi East'
  | 'Embakasi West'
  | 'Makadara'
  | 'Kamukunji'
  | 'Starehe'
  | 'Mathare';

export const NAIROBI_CONSTITUENCIES: NairobiConstituency[] = [
  'Westlands',
  'Dagoretti North',
  'Dagoretti South',
  'Lang\'ata',
  'Kibra',
  'Roysambu',
  'Kasarani',
  'Ruaraka',
  'Embakasi South',
  'Embakasi North',
  'Embakasi Central',
  'Embakasi East',
  'Embakasi West',
  'Makadara',
  'Kamukunji',
  'Starehe',
  'Mathare',
];

export type ActivityType =
  | 'Mega Rally'
  | 'Town Hall'
  | 'Door-to-Door'
  | 'Market Walk'
  | 'Youth Summit'
  | 'Stakeholder Roundtable'
  | 'Volunteer Briefing';

export type ActivityStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Postponed' | 'Cancelled';

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  constituency: NairobiConstituency;
  wardOrVenue: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  targetAttendance: number;
  actualAttendance?: number;
  leadOrganizer: string;
  status: ActivityStatus;
  notes: string;
  securityClearance?: boolean;
}

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'To Do' | 'In Progress' | 'Under Review' | 'Completed';
export type TaskCategory =
  | 'Logistics & Sound'
  | 'Field Mobilization'
  | 'Communications & Media'
  | 'Security & Protocols'
  | 'Legal & Permits'
  | 'Youth League';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  constituency: NairobiConstituency | 'Countywide';
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  assignedTo: string;
  completedAt?: string;
}

export type IssueCategory =
  | 'Water & Sanitation'
  | 'Waste Management'
  | 'Roads & Drainage'
  | 'Hawkers & Trade Markets'
  | 'Youth Jobs & Vocational'
  | 'Healthcare Clinics'
  | 'Street Lighting & Security'
  | 'Early Childhood Education';

export type IssueSeverity = 'Critical' | 'High' | 'Moderate';
export type IssueStatus =
  | 'Logged'
  | 'Investigating'
  | 'Action Plan Drafted'
  | 'Manifesto Pledged'
  | 'Resolved';

export interface CommunityIssue {
  id: string;
  title: string;
  category: IssueCategory;
  constituency: NairobiConstituency;
  ward: string;
  locationDetails: string;
  severity: IssueSeverity;
  status: IssueStatus;
  reportedBy: string;
  dateReported: string;
  pledgedSolution: string;
  upvotes: number;
}

export type TeamRole =
  | 'Campaign Manager'
  | 'Sub-County Coordinator'
  | 'Field Mobilization Lead'
  | 'Communications & Media Director'
  | 'Youth League Coordinator'
  | 'Women Caucus Lead'
  | 'Logistics Specialist'
  | 'Ward Captain'
  | 'Volunteer Agent';

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  constituency: NairobiConstituency | 'Countywide';
  phone: string;
  email: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  assignedTasksCount: number;
  avatarBgColor?: string;
}

export interface ConstituencyMetric {
  name: NairobiConstituency;
  registeredVoterEstimate: number;
  supporterTarget: number;
  currentMobilized: number;
  momentum: 'Stronghold' | 'Battleground' | 'High Momentum' | 'Needs Push';
  coordinatorName: string;
}
