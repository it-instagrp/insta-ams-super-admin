import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { PlanDistributionItem } from "../../services/reportsService";
import { colors } from "../../styles/theme";

const palette = [colors.primary, colors.info, colors.warning, colors.purple, colors.error];

export default function PlanDistribution({ data }: { data: PlanDistributionItem[] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-text-primary">Plan Distribution</h2>
        <p className="mt-1 text-sm text-text-muted">Organizations by subscription tier</p>
      </div>
      {data.length === 0 ? <p className="py-10 text-sm text-text-muted">No plan data available.</p> : <>
        <div className="relative h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="count" nameKey="plan" innerRadius={52} outerRadius={72}>
                {data.map((item, index) => <Cell key={item.plan} fill={palette[index % palette.length]} />)}
              </Pie>
              <Tooltip formatter={(value) => [Number(value ?? 0).toLocaleString(), "Organizations"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-lg font-semibold text-text-primary">{total.toLocaleString()}</div>
        </div>
        <div className="mt-3 space-y-2">
          {data.map((item, index) => <div key={item.plan} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2 text-text-primary"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: palette[index % palette.length] }} />{item.plan}</span>
            <span className="text-text-muted">{item.count.toLocaleString()} · {item.percentage}%</span>
          </div>)}
        </div>
      </>}
    </div>
  );
}
