/**
 * dashboardData.js — all mock chart series and KPI seed values.
 * Single source of truth for every chart in the app.
 */
import { DEPARTMENT_COLORS } from './roles';

/* ── Headcount trend (12 months) ──────────────────────────────────────
   Includes target line so HeadcountChart can show plan vs actual.
   ───────────────────────────────────────────────────────────────────── */
export const HEADCOUNT_TREND = [
  { month: 'Aug',  employees: 78,  hires: 4, exits: 1, target: 82  },
  { month: 'Sep',  employees: 82,  hires: 5, exits: 1, target: 86  },
  { month: 'Oct',  employees: 84,  hires: 3, exits: 1, target: 88  },
  { month: 'Nov',  employees: 86,  hires: 3, exits: 1, target: 90  },
  { month: 'Dec',  employees: 88,  hires: 2, exits: 0, target: 92  },
  { month: 'Jan',  employees: 92,  hires: 5, exits: 1, target: 95  },
  { month: 'Feb',  employees: 95,  hires: 4, exits: 1, target: 98  },
  { month: 'Mar',  employees: 99,  hires: 5, exits: 1, target: 102 },
  { month: 'Apr',  employees: 102, hires: 4, exits: 1, target: 105 },
  { month: 'May',  employees: 106, hires: 5, exits: 1, target: 108 },
  { month: 'Jun',  employees: 109, hires: 4, exits: 1, target: 111 },
  { month: 'Jul',  employees: 112, hires: 4, exits: 1, target: 113 },
];

/* ── Department headcount snapshot ────────────────────────────────────
   Used by the donut chart as a static fallback (live data comes from
   DepartmentContext in AdminDashboard).
   ───────────────────────────────────────────────────────────────────── */
export const DEPARTMENT_DATA = Object.entries(DEPARTMENT_COLORS).map(([name, color]) => ({
  name,
  color,
  count: ({
    'Engineering':     38,
    'Design':          14,
    'Marketing':       18,
    'Finance':         12,
    'Human Resources': 10,
    'Operations':      16,
    'Legal':            4,
    'Product':         12,
  }[name] ?? 8),
}));

/* ── Weekly attendance ─────────────────────────────────────────────────
   `late` is a sub-segment of `present` — tooltip shows it separately.
   ───────────────────────────────────────────────────────────────────── */
export const ATTENDANCE_WEEKLY = [
  { day: 'Mon', present: 104, absent: 8,  late: 3, rate: 92.9 },
  { day: 'Tue', present: 108, absent: 4,  late: 2, rate: 96.4 },
  { day: 'Wed', present: 102, absent: 10, late: 4, rate: 91.1 },
  { day: 'Thu', present: 106, absent: 6,  late: 2, rate: 94.6 },
  { day: 'Fri', present: 98,  absent: 14, late: 5, rate: 87.5 },
];

/* ── Monthly attendance rate trend (12 months) ─────────────────────── */
export const ATTENDANCE_TREND = [
  { month: 'Aug', rate: 88.4, target: 90 },
  { month: 'Sep', rate: 89.7, target: 90 },
  { month: 'Oct', rate: 90.1, target: 90 },
  { month: 'Nov', rate: 91.2, target: 90 },
  { month: 'Dec', rate: 89.8, target: 90 },
  { month: 'Jan', rate: 92.5, target: 90 },
  { month: 'Feb', rate: 91.2, target: 90 },
  { month: 'Mar', rate: 92.5, target: 90 },
  { month: 'Apr', rate: 90.8, target: 90 },
  { month: 'May', rate: 93.1, target: 90 },
  { month: 'Jun', rate: 94.0, target: 90 },
  { month: 'Jul', rate: 94.2, target: 90 },
];

/* ── Leave request trends (12 months) ─────────────────────────────── */
export const LEAVE_TREND = [
  { month: 'Aug', approved: 8,  pending: 2, rejected: 1 },
  { month: 'Sep', approved: 10, pending: 3, rejected: 1 },
  { month: 'Oct', approved: 11, pending: 4, rejected: 2 },
  { month: 'Nov', approved: 9,  pending: 2, rejected: 1 },
  { month: 'Dec', approved: 6,  pending: 1, rejected: 0 },
  { month: 'Jan', approved: 13, pending: 5, rejected: 2 },
  { month: 'Feb', approved: 12, pending: 3, rejected: 2 },
  { month: 'Mar', approved: 18, pending: 5, rejected: 1 },
  { month: 'Apr', approved: 14, pending: 4, rejected: 3 },
  { month: 'May', approved: 20, pending: 6, rejected: 2 },
  { month: 'Jun', approved: 16, pending: 7, rejected: 1 },
  { month: 'Jul', approved: 10, pending: 7, rejected: 0 },
];

/* ── Salary distribution (INR) ────────────────────────────────────── */
export const SALARY_BANDS = [
  { range: '<₹5L',     label: 'Below ₹5 LPA',        count: 1 },
  { range: '₹5–10L',   label: '₹5 LPA – ₹10 LPA',    count: 2 },
  { range: '₹10–15L',  label: '₹10 LPA – ₹15 LPA',   count: 4 },
  { range: '₹15–20L',  label: '₹15 LPA – ₹20 LPA',   count: 2 },
  { range: '₹20–30L',  label: '₹20 LPA – ₹30 LPA',   count: 2 },
  { range: '>₹30L',    label: 'Above ₹30 LPA',       count: 1 },
];

/* ── KPI card seed values ──────────────────────────────────────────── */
export const ADMIN_KPIS = [
  { id: 'employees',   label: 'Total Employees', value: 112,  unit: '',  delta: +4,   deltaLabel: 'this month',   color: 'primary' },
  { id: 'departments', label: 'Departments',      value: 8,    unit: '',  delta: 0,    deltaLabel: 'unchanged',    color: 'blue'    },
  { id: 'attendance',  label: 'Avg Attendance',   value: 94.2, unit: '%', delta: +1.3, deltaLabel: 'vs last week', color: 'emerald' },
  { id: 'leaves',      label: 'Leave Requests',   value: 7,    unit: '',  delta: -3,   deltaLabel: 'vs last week', color: 'amber'   },
];

export const HR_KPIS = [
  { id: 'headcount', label: 'Total Headcount', value: 112,  unit: '',  delta: +4,   deltaLabel: 'this month',    color: 'primary' },
  { id: 'new_hires', label: 'New Hires (Jul)',  value: 4,    unit: '',  delta: +1,   deltaLabel: 'vs last month', color: 'emerald' },
  { id: 'pending',   label: 'Pending Leaves',   value: 7,    unit: '',  delta: +2,   deltaLabel: 'vs last week',  color: 'amber'   },
  { id: 'attrition', label: 'Attrition Rate',   value: 2.1,  unit: '%', delta: -0.4, deltaLabel: 'vs last month', color: 'blue'    },
];

export const EMPLOYEE_KPIS = [
  { id: 'balance',    label: 'Leave Balance',    value: 14,   unit: 'days', delta: 0,    deltaLabel: 'annual',    color: 'primary' },
  { id: 'used',       label: 'Leaves Used',       value: 6,    unit: 'days', delta: 0,    deltaLabel: 'this year', color: 'emerald' },
  { id: 'pending',    label: 'Pending Requests',  value: 1,    unit: '',     delta: 0,    deltaLabel: 'awaiting',  color: 'amber'   },
  { id: 'attendance', label: 'Attendance Rate',   value: 97.5, unit: '%',    delta: +0.5, deltaLabel: 'this month',color: 'blue'    },
];

/* ── Activity feed ─────────────────────────────────────────────────── */
export const ACTIVITY_FEED = [
  { id: 1, type: 'leave_approved',  actor: 'Priya Patel',  detail: "Approved Rahul Verma's leave (Jul 10–14)",      time: '2m ago',     avatar_role: 'hr'       },
  { id: 2, type: 'user_created',    actor: 'Aarav Sharma',  detail: 'Created account for rohan.patel@company.com',  time: '1h ago',     avatar_role: 'admin'    },
  { id: 3, type: 'leave_requested', actor: 'Neha Kapoor',    detail: 'Requested sick leave for Jul 17',              time: '3h ago',     avatar_role: 'employee' },
  { id: 4, type: 'role_changed',    actor: 'Aarav Sharma',  detail: 'Updated Legal department budget to ₹19.5L',     time: '5h ago',     avatar_role: 'admin'    },
  { id: 5, type: 'role_changed',    actor: 'Aarav Sharma',  detail: 'Promoted Priya Patel → HR Manager',             time: 'Yesterday',  avatar_role: 'admin'    },
  { id: 6, type: 'login',           actor: 'Ananya Iyer',  detail: 'Logged in from 192.168.1.45',                  time: 'Yesterday',  avatar_role: 'employee' },
  { id: 7, type: 'leave_approved',  actor: 'Priya Patel',  detail: "Approved Rohan Patel's annual leave (Aug 1–7)",time: '2 days ago', avatar_role: 'hr'       },
  { id: 8, type: 'user_created',    actor: 'Aarav Sharma',  detail: 'Onboarded arjun.mehta@company.com (Engineering)',   time: '3 days ago', avatar_role: 'admin'    },
];

/* ── Users table seed (used by AdminUsers) ─────────────────────────── */
export const EMPLOYEES_TABLE = [
  { id: 'e01', name: 'Aarav Sharma',   email: 'employee@company.com', dept: 'Engineering',    role: 'employee', status: 'Active',   joinDate: '2022-07-20' },
  { id: 'e02', name: 'Neha Kapoor',   email: 'neha.kapoor@company.com',    dept: 'Design',          role: 'employee', status: 'Inactive', joinDate: '2021-11-05' },
  { id: 'e03', name: 'Ananya Iyer', email: 'ananya.iyer@company.com', dept: 'Marketing',       role: 'employee', status: 'Active',   joinDate: '2023-01-15' },
  { id: 'e04', name: 'Rohan Patel',  email: 'rohan.patel@company.com',  dept: 'Finance',         role: 'employee', status: 'Active',   joinDate: '2020-06-01' },
  { id: 'e05', name: 'Priya Patel',   email: 'hr@company.com',    dept: 'Human Resources', role: 'hr',       status: 'Active',   joinDate: '2021-03-10' },
  { id: 'e06', name: 'Arjun Mehta',  email: 'arjun.mehta@company.com',   dept: 'Design',          role: 'employee', status: 'Active',   joinDate: '2024-03-01' },
];
