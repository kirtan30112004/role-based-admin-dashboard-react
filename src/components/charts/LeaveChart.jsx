import {
  ComposedChart, Area, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { LEAVE_TREND } from '../../constants/dashboardData';

/* ── Custom tooltip ─────────────────────────────────────────────────── */
function Tooltip_({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const total = payload.reduce((s, p) => s + (p.value ?? 0), 0);

  return (
    <div className="bg-white border border-surface-border rounded-xl shadow-lg
                    px-3.5 py-3 text-xs min-w-[145px]">
      <p className="font-semibold text-slate-600 mb-2">{label}</p>
      <div className="space-y-1">
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <span className="text-slate-500 capitalize">{p.name}</span>
            </div>
            <span className="font-bold text-slate-800 tabular-nums">{p.value}</span>
          </div>
        ))}
        <div className="border-t border-surface-border mt-1.5 pt-1.5 flex justify-between">
          <span className="text-slate-400">Total</span>
          <span className="font-bold text-slate-700 tabular-nums">{total}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * LeaveChart — ComposedChart: stacked areas for approved / pending + line for rejected.
 *
 * Design rationale:
 *  - Stacked area (approved + pending) shows total leave volume
 *  - Separate line for rejected keeps it visually distinct and unambiguous
 *  - Gradient fills make the volume obvious at a glance
 */
function LeaveChart({ data = LEAVE_TREND, height = 220 }) {
  return (
    <ResponsiveContainer width="100%" height={height} minHeight={180}>
      <ComposedChart data={data} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="lgApproved" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#10b981" stopOpacity={0.22} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="lgPending" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f59e0b" stopOpacity={0.22} />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          width={28}
        />

        <Tooltip content={<Tooltip_ />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />

        <Legend
          wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
          iconType="circle"
          iconSize={8}
          formatter={(v) => <span className="text-slate-500 capitalize">{v}</span>}
        />

        {/* Approved — solid filled area */}
        <Area
          type="monotone"
          dataKey="approved"
          name="Approved"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#lgApproved)"
          dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
        />

        {/* Pending — lighter filled area, dashed stroke */}
        <Area
          type="monotone"
          dataKey="pending"
          name="Pending"
          stroke="#f59e0b"
          strokeWidth={2}
          strokeDasharray="5 3"
          fill="url(#lgPending)"
          dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
        />

        {/* Rejected — line only (small numbers, no fill needed) */}
        <Line
          type="monotone"
          dataKey="rejected"
          name="Rejected"
          stroke="#f43f5e"
          strokeWidth={2}
          strokeDasharray="3 3"
          dot={{ r: 3, fill: '#f43f5e', stroke: '#fff', strokeWidth: 1.5 }}
          activeDot={{ r: 5, fill: '#f43f5e', stroke: '#fff', strokeWidth: 2 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default LeaveChart;
