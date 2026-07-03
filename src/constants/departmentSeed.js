import { DEPARTMENT_COLORS } from './roles';

/**
 * departmentSeed.js — initial department records.
 * Loaded into localStorage on first run; after that the
 * DepartmentContext CRUD actions manage everything.
 */
export const DEPARTMENTS_STORAGE_KEY = 'departments';

export const DEPARTMENT_SEED = [
  {
    id:          'dept_001',
    name:        'Engineering',
    description: 'Product development, infrastructure and platform engineering.',
    manager:     'Aarav Sharma',
    budget:      50000000, // ₹5 Cr
    location:    'Bengaluru, Karnataka',
    color:       DEPARTMENT_COLORS['Engineering'],
    createdAt:   '2019-01-01',
  },
  {
    id:          'dept_002',
    name:        'Design',
    description: 'UX, brand identity, product and graphic design.',
    manager:     'Neha Kapoor',
    budget:      18000000, // ₹1.8 Cr
    location:    'Ahmedabad, Gujarat',
    color:       DEPARTMENT_COLORS['Design'],
    createdAt:   '2019-03-01',
  },
  {
    id:          'dept_003',
    name:        'Marketing',
    description: 'Growth, demand generation and brand communications.',
    manager:     'Ananya Iyer',
    budget:      22000000, // ₹2.2 Cr
    location:    'Mumbai, Maharashtra',
    color:       DEPARTMENT_COLORS['Marketing'],
    createdAt:   '2019-06-01',
  },
  {
    id:          'dept_004',
    name:        'Finance',
    description: 'Accounting, FP&A, treasury and compliance.',
    manager:     'Rohan Patel',
    budget:      16000000, // ₹1.6 Cr
    location:    'Mumbai, Maharashtra',
    color:       DEPARTMENT_COLORS['Finance'],
    createdAt:   '2019-01-01',
  },
  {
    id:          'dept_005',
    name:        'Human Resources',
    description: 'Talent acquisition, people operations and culture.',
    manager:     'Priya Patel',
    budget:      15000000, // ₹1.5 Cr
    location:    'Ahmedabad, Gujarat',
    color:       DEPARTMENT_COLORS['Human Resources'],
    createdAt:   '2019-01-01',
  },
  {
    id:          'dept_006',
    name:        'Operations',
    description: 'Supply chain, facilities and business operations.',
    manager:     'Vikram Singh',
    budget:      25000000, // ₹2.5 Cr
    location:    'Pune, Maharashtra',
    color:       DEPARTMENT_COLORS['Operations'],
    createdAt:   '2020-02-01',
  },
  {
    id:          'dept_007',
    name:        'Legal',
    description: 'Corporate legal, compliance and risk management.',
    manager:     'Karan Malhotra',
    budget:      12000000, // ₹1.2 Cr
    location:    'New Delhi',
    color:       DEPARTMENT_COLORS['Legal'],
    createdAt:   '2020-11-01',
  },
  {
    id:          'dept_008',
    name:        'Product',
    description: 'Product strategy, roadmap and stakeholder management.',
    manager:     'Sneha Nair',
    budget:      30000000, // ₹3 Cr
    location:    'Hyderabad, Telangana',
    color:       DEPARTMENT_COLORS['Product'],
    createdAt:   '2021-05-01',
  },
];
