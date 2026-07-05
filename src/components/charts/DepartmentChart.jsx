import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

/* ── Custom tooltip ─────────────────────────────────────────────────── */
function Tooltip_({ active, payload }) {
  if (!active || !payload?.length) return null;

  const d     = payload[0];
  const total = d.payload.total ?? 1;
  const pct   = ((d.value / total) * 100).toFixed(1);

  return (
    <div className="bg-white border border-surface-border rounded-xl shadow-lg
                    px-3.5 py-3 text-xs min-w-[150px]">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="h-3 w-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: d.payload.color }}
        />
        <span className="font-semibold text-slate-700">{d.name}</span>
      </div>
      <div className="space-y-0.5">
        <p>
          <span className="font-bold text-slate-800 tabular-nums">{d.value}</span>
          <span className="text-slate-400 ml-1">employees</span>
        </p>
        <p className="text-slate-400">{pct}% of workforce</p>
        {d.payload.budget != null && d.payload.budget > 0 && (
          <p className="text-slate-400 pt-1 border-t border-surface-border mt-1">
            Budget:{' '}
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              notation: 'compact',
              maximumFractionDigits: 1,
            }).format(d.payload.budget)}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Percentage label inside each slice ─────────────────────────────── */
function SliceLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  // Skip label for slices too small to read
  if (percent < 0.05) return null;

  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.52;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x} y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: 11, fontWeight: 700, pointerEvents: 'none' }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

/* ── Custom legend — horizontal wrapping chips ──────────────────────── */
function CustomLegend({ payload }) {
  if (!payload?.length) return null;
  return (
    <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 mt-2 px-2">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span
            className="h-2 w-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          {entry.value}
        </div>
      ))}
    </div>
  );
}

/**
 * DepartmentChart — Donut (hollow pie) chart.
 *
 * Accepts a `data` prop driven by live DepartmentContext so headcounts
 * reflect actual employee records. Falls back to DEPARTMENT_DATA if no
 * prop is provided.
 *
 * Each entry must have: { name, count, color, budget? }
 */
function DepartmentChart({ data, height = 240 }) {
  if (!data?.length) return null;

  const total    = data.reduce((s, d) => s + (d.count ?? 0), 0);
  // Inject total into each entry so tooltip can compute %
  const enriched = data.map((d) => ({ ...d, total }));

  return (
    <ResponsiveContainer width="100%" height={height} minHeight={200}>
      <PieChart>
        <Pie
          data={enriched}
          dataKey="count"
          nameKey="name"
          cx="50%"
          cy="42%"
          innerRadius="40%"
          outerRadius="65%"
          paddingAngle={2}
          strokeWidth={0}
          labelLine={false}
          label={SliceLabel}
        >
          {enriched.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>

        <Tooltip content={<Tooltip_ />} />

        <Legend
          content={<CustomLegend />}
          wrapperStyle={{ paddingTop: 6 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default DepartmentChart;
