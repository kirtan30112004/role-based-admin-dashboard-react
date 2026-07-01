import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, LabelList, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { ATTENDANCE_WEEKLY } from '../../constants/dashboardData';

/* ── Colour per attendance rate ─────────────────────────────────────── */
function rateColor(rate) {
  if (rate >= 95) return '#10b981';   // excellent — emerald
  if (rate >= 90) return '#6366f1';   // good — primary
  if (rate >= 85) return '#f59e0b';   // fair — amber
  return '#f43f5e';                   // needs attention — rose
}

/* ── Custom tooltip ─────────────────────────────────────────────────── */
function Tooltip_({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const present = payload.find((p) => p.dataKey === 'present')?.value ?? 0;
  const absent  = payload.find((p) => p.dataKey === 'absent')?.value  ?? 0;
  const late    = payload.find((p) => p.dataKey === 'late')?.value    ?? 0;
  const total   = present + absent;
  const pct     = total > 0 ? ((present / total) * 100).toFixed(1) : '0.0';
  const color   = rateColor(parseFloat(pct));

  return (
    <div className="bg-white border border-surface-border rounded-xl shadow-lg
                    px-3.5 py-3 text-xs min-w-[140px]">
      <p className="font-semibold text-slate-600 mb-2">{label}</p>
      <div className="space-y-1">
        <Row color={color}     label="Present" value={present} />
        <Row color="#fca5a5"   label="Absent"  value={absent}  />
        {late > 0 && <Row color="#fcd34d" label="Late" value={late} />}
        <div className="border-t border-surface-border mt-1.5 pt-1.5 flex justify-between">
          <span className="text-slate-400">Rate</span>
          <span className="font-bold tabular-nums" style={{ color }}>{pct}%</span>
        </div>
      </div>
    </div>
  );
}

function Row({ color, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-slate-500">{label}</span>
      </div>
      <span className="font-bold text-slate-800 tabular-nums">{value}</span>
    </div>
  );
}

/**
 * AttendanceChart — stacked bar per weekday.
 *
 * Present bars are colour-coded: green ≥95%, indigo ≥90%, amber ≥85%, red below.
 * A 90% reference line and rate labels above each bar make the chart self-contained.
 */
function AttendanceChart({ data = ATTENDANCE_WEEKLY, height = 220 }) {
  // Approximate 90% threshold in headcount (total = present + absent)
  const totalPerDay = data.length > 0 ? data[0].present + data[0].absent : 112;
  const threshold90 = Math.round(totalPerDay * 0.9);

  return (
    <ResponsiveContainer width="100%" height={height} minHeight={180}>
      <BarChart
        data={data}
        margin={{ top: 22, right: 8, left: -20, bottom: 0 }}
        barCategoryGap="30%"
        barSize={38}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />

        {/* 90% reference line with label */}
        <ReferenceLine
          y={threshold90}
          stroke="#94a3b8"
          strokeDasharray="4 2"
          strokeWidth={1}
          label={{
            value: '90%',
            position: 'insideTopRight',
            fontSize: 9,
            fill: '#94a3b8',
            fontWeight: 600,
          }}
        />

        <Tooltip content={<Tooltip_ />} cursor={{ fill: '#f8fafc', radius: 4 }} />

        {/* Present — colour varies by rate */}
        <Bar dataKey="present" stackId="a" name="Present">
          {data.map((entry, i) => (
            <Cell key={i} fill={rateColor(entry.rate)} fillOpacity={0.88} />
          ))}
          <LabelList
            dataKey="rate"
            position="top"
            style={{ fontSize: 10, fill: '#475569', fontWeight: 700 }}
            formatter={(v) => `${v}%`}
          />
        </Bar>

        {/* Absent — always light rose */}
        <Bar
          dataKey="absent"
          stackId="a"
          name="Absent"
          fill="#fca5a5"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default AttendanceChart;
