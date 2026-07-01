import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, LabelList, ResponsiveContainer,
} from 'recharts';
import { SALARY_BANDS } from '../../constants/dashboardData';

/* Indigo palette — lightest → darkest for lowest → highest band */
const COLORS = ['#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1', '#4338ca'];

/* ── Custom tooltip ─────────────────────────────────────────────────── */
function Tooltip_({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const count = payload[0].value;
  const total = SALARY_BANDS.reduce((s, b) => s + b.count, 0);
  const pct   = total > 0 ? ((count / total) * 100).toFixed(1) : '0';
  // Look up the friendly label from the dataset
  const entry = SALARY_BANDS.find((b) => b.range === label);

  return (
    <div className="bg-white border border-surface-border rounded-xl shadow-lg
                    px-3.5 py-3 text-xs min-w-[145px]">
      <p className="font-semibold text-slate-700 mb-1.5">{entry?.label ?? label}</p>
      <div className="space-y-0.5">
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Employees</span>
          <span className="font-bold text-primary-600 tabular-nums">{count}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Share</span>
          <span className="font-bold text-slate-500 tabular-nums">{pct}%</span>
        </div>
      </div>
    </div>
  );
}

/**
 * SalaryBandChart — horizontal bar chart (layout="vertical").
 *
 * Horizontal bars make pay-band range labels fully legible on all screen sizes
 * without needing rotation or truncation. Count labels on the right end of each
 * bar eliminate the need to read the X-axis value.
 *
 * Improvements:
 *  - `label` field used for tooltip (friendlier text than the short range key)
 *  - Count labels on bar ends for quick reading without axis
 *  - minHeight prevents collapse on narrow screens
 */
function SalaryBandChart({ data = SALARY_BANDS, height = 210 }) {
  return (
    <ResponsiveContainer width="100%" height={height} minHeight={180}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 44, left: 8, bottom: 4 }}
        barSize={18}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />

        {/* Number axis — hidden ticks, grid lines only */}
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />

        {/* Category axis — the pay band labels */}
        <YAxis
          type="category"
          dataKey="range"
          tick={{ fontSize: 11, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
          width={66}
        />

        <Tooltip content={<Tooltip_ />} cursor={{ fill: '#f8fafc' }} />

        <Bar dataKey="count" radius={[0, 5, 5, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
          {/* Employee count at the right end of each bar */}
          <LabelList
            dataKey="count"
            position="right"
            style={{ fontSize: 11, fill: '#64748b', fontWeight: 700 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default SalaryBandChart;
