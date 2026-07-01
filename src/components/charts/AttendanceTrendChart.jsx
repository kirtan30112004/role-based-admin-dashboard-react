import {
  ComposedChart, Area, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, Legend, ResponsiveContainer,
} from 'recharts';
import { ATTENDANCE_TREND } from '../../constants/dashboardData';

/* ── Custom tooltip ─────────────────────────────────────────────────── */
function Tooltip_({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const rate   = payload.find((p) => p.dataKey === 'rate')?.value;
  const target = 90;
  const diff   = rate != null ? (rate - target).toFixed(1) : null;
  const above  = diff != null && parseFloat(diff) >= 0;

  return (
    <div className="bg-white border border-surface-border rounded-xl shadow-lg
                    px-3.5 py-3 text-xs min-w-[140px]">
      <p className="font-semibold text-slate-600 mb-2">{label}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Rate</span>
          <span className="font-bold text-emerald-600 tabular-nums">{rate}%</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Target</span>
          <span className="font-bold text-slate-400 tabular-nums">{target}%</span>
        </div>
        {diff != null && (
          <div className="flex justify-between gap-4 border-t border-surface-border pt-1.5 mt-1">
            <span className="text-slate-400">vs target</span>
            <span className={`font-bold tabular-nums ${above ? 'text-emerald-500' : 'text-rose-500'}`}>
              {above ? '+' : ''}{diff}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * AttendanceTrendChart — ComposedChart: Area (attendance rate) + dashed Line (target).
 *
 * Improvements over previous version:
 *  - Target rendered as a Recharts Line so it appears in the Legend
 *  - Red reference line removed (target line serves the same purpose more cleanly)
 *  - Wider Y-axis to avoid label clipping on mobile
 *  - minHeight prevents chart from collapsing on very narrow screens
 */
function AttendanceTrendChart({ data = ATTENDANCE_TREND, height = 210 }) {
  return (
    <ResponsiveContainer width="100%" height={height} minHeight={180}>
      <ComposedChart data={data} margin={{ top: 12, right: 10, left: -14, bottom: 0 }}>
        <defs>
          <linearGradient id="atGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#10b981" stopOpacity={0.2}  />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
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
          domain={[84, 100]}
          tickFormatter={(v) => `${v}%`}
          width={40}
        />

        <Tooltip content={<Tooltip_ />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />

        <Legend
          wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
          iconType="circle"
          iconSize={8}
          formatter={(v) => <span className="text-slate-500">{v}</span>}
        />

        {/* Attendance rate — filled area */}
        <Area
          type="monotone"
          dataKey="rate"
          name="Attendance %"
          stroke="#10b981"
          strokeWidth={2.5}
          fill="url(#atGrad)"
          dot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
          activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
        />

        {/* Target — dashed line, shows in Legend */}
        <Line
          type="monotone"
          dataKey="target"
          name="Target (90%)"
          stroke="#f43f5e"
          strokeWidth={1.5}
          strokeDasharray="5 3"
          dot={false}
          activeDot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default AttendanceTrendChart;
