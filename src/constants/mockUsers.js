import { ROLES } from './roles';

/**
 * Mock user database.
 * In a real app this lives behind an API + password hashing.
 * Passwords are stored in plain-text here solely for demo purposes.
 */
const MOCK_USERS = [
  {
    id:         'usr_001',
    email:      'admin@company.com',
    password:   'Admin@123',
    role:       ROLES.ADMIN,
    name:       'Alex Johnson',
    department: 'IT',
    avatar:     null,          // null → falls back to initials avatar
    joinDate:   '2020-01-15',
    phone:      '+1 (555) 001-0001',
  },
  {
    id:         'usr_002',
    email:      'hr@company.com',
    password:   'Hr@12345',
    role:       ROLES.HR,
    name:       'Maria Garcia',
    department: 'Human Resources',
    avatar:     null,
    joinDate:   '2021-03-10',
    phone:      '+1 (555) 002-0002',
  },
  {
    id:         'usr_003',
    email:      'employee@company.com',
    password:   'Emp@1234',
    role:       ROLES.EMPLOYEE,
    name:       'Sam Wilson',
    department: 'Engineering',
    avatar:     null,
    joinDate:   '2022-07-20',
    phone:      '+1 (555) 003-0003',
  },
];

/**
 * Simulate an async credential check.
 * Returns the user (minus password) or null.
 */
export const authenticateUser = async (email, password) => {
  // Simulate network latency
  await new Promise((res) => setTimeout(res, 600));

  const found = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );

  if (!found) return null;

  // Never expose the password outside this module
  const { password: _pwd, ...safeUser } = found;
  return safeUser;
};

export default MOCK_USERS;
