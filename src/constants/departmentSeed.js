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
    manager:     'Alex Johnson',
    budget:      850000,
    location:    'Austin, TX',
    color:       DEPARTMENT_COLORS['Engineering'],
    createdAt:   '2019-01-01',
  },
  {
    id:          'dept_002',
    name:        'Design',
    description: 'UX, brand identity, product and graphic design.',
    manager:     'Jordan Lee',
    budget:      320000,
    location:    'Seattle, WA',
    color:       DEPARTMENT_COLORS['Design'],
    createdAt:   '2019-03-01',
  },
  {
    id:          'dept_003',
    name:        'Marketing',
    description: 'Growth, demand generation and brand communications.',
    manager:     'Casey Nguyen',
    budget:      480000,
    location:    'Chicago, IL',
    color:       DEPARTMENT_COLORS['Marketing'],
    createdAt:   '2019-06-01',
  },
  {
    id:          'dept_004',
    name:        'Finance',
    description: 'Accounting, FP&A, treasury and compliance.',
    manager:     'Riley Patel',
    budget:      290000,
    location:    'New York, NY',
    color:       DEPARTMENT_COLORS['Finance'],
    createdAt:   '2019-01-01',
  },
  {
    id:          'dept_005',
    name:        'Human Resources',
    description: 'Talent acquisition, people operations and culture.',
    manager:     'Maria Garcia',
    budget:      260000,
    location:    'Los Angeles, CA',
    color:       DEPARTMENT_COLORS['Human Resources'],
    createdAt:   '2019-01-01',
  },
  {
    id:          'dept_006',
    name:        'Operations',
    description: 'Supply chain, facilities and business operations.',
    manager:     'Avery Davis',
    budget:      410000,
    location:    'Denver, CO',
    color:       DEPARTMENT_COLORS['Operations'],
    createdAt:   '2020-02-01',
  },
  {
    id:          'dept_007',
    name:        'Legal',
    description: 'Corporate legal, compliance and risk management.',
    manager:     'Drew Thompson',
    budget:      190000,
    location:    'Miami, FL',
    color:       DEPARTMENT_COLORS['Legal'],
    createdAt:   '2020-11-01',
  },
  {
    id:          'dept_008',
    name:        'Product',
    description: 'Product strategy, roadmap and stakeholder management.',
    manager:     'Quinn Martinez',
    budget:      380000,
    location:    'Boston, MA',
    color:       DEPARTMENT_COLORS['Product'],
    createdAt:   '2021-05-01',
  },
];
