import clsx from 'clsx';

const SIZE_MAP = {
  sm:  'h-7 w-7 text-xs',
  md:  'h-9 w-9 text-sm',
  lg:  'h-12 w-12 text-base',
  xl:  'h-16 w-16 text-lg',
};

const ROLE_COLORS = {
  admin:    'bg-purple-100 text-purple-700',
  hr:       'bg-blue-100 text-blue-700',
  employee: 'bg-emerald-100 text-emerald-700',
};

/**
 * Avatar — shows image if provided, otherwise falls back to initials.
 */
function Avatar({ user, size = 'md', className }) {
  const initials = user?.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '?';

  const colorClass = ROLE_COLORS[user?.role] ?? 'bg-slate-100 text-slate-600';

  return (
    <div
      aria-label={user?.name ?? 'User avatar'}
      className={clsx(
        'flex-shrink-0 rounded-full flex items-center justify-center font-semibold select-none',
        SIZE_MAP[size],
        !user?.avatar && colorClass,
        className,
      )}
    >
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
}

export default Avatar;
