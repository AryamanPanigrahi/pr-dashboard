import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { OutletPoint } from '../../utils/analytics'
import { CHART } from '../../utils/chartTheme'
import { formatNumber } from '../../utils/format'
import { TooltipRow, TooltipShell } from './TooltipShell'

const truncate = (s: string) => (s.length > 22 ? `${s.slice(0, 21)}…` : s)

// Horizontal bars (outlet names are long). One series, so one colour for every
// bar: a ramp here would re-encode length as shade. Each bar's value sits at
// its tip, so the value axis is hidden.
export function OutletChart({ data }: { data: OutletPoint[] }) {
  const height = Math.max(160, data.length * 40 + 16)

  return (
    <div
      style={{ height }}
      className="w-full"
      role="img"
      aria-label="Bar chart of published coverage pieces by outlet. A table view is available."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 32, bottom: 4, left: 0 }}>
          <XAxis type="number" hide domain={[0, (max: number) => max + 0.5]} />
          <YAxis
            type="category"
            dataKey="outlet"
            width={148}
            interval={0}
            tickLine={false}
            axisLine={{ stroke: CHART.axis }}
            tick={{ fill: CHART.inkSecondary, fontSize: 12 }}
            tickFormatter={truncate}
          />
          <Tooltip
            cursor={{ fill: 'rgba(11, 11, 11, 0.04)' }}
            content={(p) => {
              const point = p.payload?.[0]?.payload as OutletPoint | undefined
              if (!p.active || !point) return null
              return (
                <TooltipShell title={point.outlet}>
                  <TooltipRow color={CHART.series1} value={String(point.coverage)} name={point.coverage === 1 ? 'piece' : 'pieces'} />
                  <TooltipRow value={formatNumber(point.reach)} name="estimated reach" />
                </TooltipShell>
              )
            }}
          />
          <Bar
            dataKey="coverage"
            fill={CHART.series1}
            barSize={20}
            radius={[0, 4, 4, 0]}
            activeBar={{ fill: CHART.series1Hover }}
            isAnimationActive={false}
          >
            <LabelList dataKey="coverage" position="right" fill={CHART.ink} fontSize={12} fontWeight={600} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
