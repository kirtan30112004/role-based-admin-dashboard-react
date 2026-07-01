import clsx from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * StatCard — KPI metric card used on all dashboards.
 *
 * Props:
 *  label       string   — card title
 *  value       number|string
 *  unit        string   — appended to the value (e.g. "%" or "days")
 *  delta       number   — positive / negative / zero trend figure
 *  deltaLabel  string   — context for the delta (e.g. "vs last week")
 *  icon        ReactNode (Lucide icon component)
 *  color       'primary' | 'blue' | 'emerald' | 'amber' | 'rose'
 *  loading     boolean
 */

const PALETTE = {
  primary: { bg: 'bg-primary-50',  text: 'text-primary-600'  },
  blue:    { bg: 'bg-blue-50',     text: 'text-blue-600'     },
  emerald: { bg: 'bg-emerald-50',  text: 'text-emerald-600'  },
  amber:   { bg: 'bg-amber-50',    text: 'text-amber-600'    },
  rose:    { bg: 'bg-rose-50',     text: 'text-rose-600'     },
};

function StatCard({ label, value, unit = '', delta, deltaLabel, icon: Icon, color = 'primary', loading = false }) {
  const palette = PALETTE[color] ?? PALETTE.primary;

  const isPositive = delta > 0;
  const isNegative = delta < 0;
  const isZero     = delta === 0;

  const deltaColor = isPositive
    ? 'text-emerald-600'
    : isNegative
    ? 'text-rose-500'
    : 'text-slate-400';

  const DeltaIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  return (
    <div className="card flex items-start gap-4 hover:shadow-card-hover transition-shadow duration-200">
      {/* Icon bubble */}
      {Icon && (
        <div className={clsx('p-3 rounded-xl flex-shrink-0', palette.bg)}>
          <Icon size={20} strokeWidth={2} className={palette.text} />
        </div>
      )}

      <div className="flex-1 min-w-0">
        {loading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-3 w-24 bg-slate-100 rounded" />
            <div className="h-7 w-16 bg-slate-100 rounded" />
            <div className="h-3 w-20 bg-slate-100 rounded" />
          </div>
        ) : (
          <>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide truncate">
              {label}
            </p>
            <p className="text-2xl font-bold text-slate-800 mt-1 tabular-nums">
              {value}
              {unit && <span className="text-base font-medium text-slate-500 ml-1">{unit}</span>}
            </p>

            {/* Delta */}
            {delta !== undefined && (
              <div className={clsx('flex items-center gap-1 mt-1.5 text-xs font-medium', deltaColor)}>
                <DeltaIcon size={13} strokeWidth={2.5} />
                <span>
                  {isPositive && '+'}
                  {delta}
                  {unit && unit !== '' ? unit : ''}
                  {deltaLabel && (
                    <span className="text-slate-400 font-normal ml-1">{deltaLabel}</span>
                  )}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default StatCard;
