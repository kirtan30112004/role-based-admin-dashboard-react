import {
  ComposedChart, Area, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { HEADCOUNT_TREND } from '../../constants/dashboardData';

/* ── Custom tooltip ─────────────────────────────────────────────────── */
function Tooltip_({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const get = (key) => payload.find((p) => p.dataKey === key)?.value;
  const hc     = get('employees');
  const target = get('target');
  const hires  = get('hires');
  const exits  = get('exits');
  const delta  = hires != null && exits != null ? hires - exits : null;

  return (
    <div className="bg-white border border-surface-border rounded-xl shadow-lg
                    px-3.5 py-3 text-xs min-w-[160px]">
      <p className="font-semibold text-slate-600 mb-2 text-[11px] uppercase tracking-wide">
        {label}
      </p>
      <div className="space-y-1">
        {hc     != null && <Row color="#6366f1" label="Headcount" value={hc} />}
        {target != null && <Row color="#a5b4fc" label="Target"    value={target} dash />}
        {hires  != null && <Row color="#10b981" label="Hires"     value={`+${hires}`} />}
        {exits  != null && <Row color="#f43f5e" label="Exits"     value={`−${exits}`} />}
        {delta  != null && (
          <div className="border-t border-surface-border mt-1.5 pt-1.5 flex justify-between">
            <span className="text-slate-400">Net change</span>
            <span className={`font-bold tabular-nums ${delta >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
              {delta >= 0 ? '+' : ''}{delta}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ color, label, value, dash }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-1.5">
        <span
          className="h-2 w-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: color, opacity: dash ? 0.6 : 1 }}
        />
        <span className="text-slate-500">{label}</span>
      </div>
      <span className="font-bold text-slate-800 tabular-nums">{value}</span>
    </div>
  );
}

/**
 * HeadcountChart — ComposedChart.
 *
 * Layers (bottom → top):
 *  1. Filled area  — actual headcount
 *  2. Dashed line  — target headcount
 *  3. Green bars   — new hires  (right axis, small scale)
 *  4. Red bars     — exits      (right axis, small scale)
 */
function HeadcountChart({ data = HEADCOUNT_TREND, height = 240 }) {
  return (
    <ResponsiveContainer width="100%" height={height} minHeight={180}>
      <ComposedChart data={data} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="hcFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#6366f1" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0}    />
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

        {/* Left axis — headcount (large scale) */}
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          width={30}
          domain={['auto', 'auto']}
        />

        {/* Right axis — hires / exits (small scale 0-10) */}
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          width={20}
          domain={[0, 'auto']}
        />

        <Tooltip content={<Tooltip_ />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />

        <Legend
          wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
          iconSize={8}
          formatter={(v) => <span className="text-slate-500">{v}</span>}
        />

        {/* 1. Headcount area */}
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="employees"
          name="Headcount"
          stroke="#6366f1"
          strokeWidth={2.5}
          fill="url(#hcFill)"
          dot={false}
          activeDot={{ r: 5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
        />

        {/* 2. Target line */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="target"
          name="Target"
          stroke="#c7d2fe"
          strokeWidth={1.5}
          strokeDasharray="5 3"
          dot={false}
          activeDot={false}
        />

        {/* 3. Hires */}
        <Bar
          yAxisId="right"
          dataKey="hires"
          name="Hires"
          fill="#10b981"
          radius={[3, 3, 0, 0]}
          barSize={5}
          opacity={0.85}
        />

        {/* 4. Exits */}
        <Bar
          yAxisId="right"
          dataKey="exits"
          name="Exits"
          fill="#f43f5e"
          radius={[3, 3, 0, 0]}
          barSize={5}
          opacity={0.85}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default HeadcountChart;
