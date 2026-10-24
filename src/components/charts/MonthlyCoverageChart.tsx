import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { MonthPoint } from '../../utils/analytics'
import { CHART } from '../../utils/chartTheme'
import { formatNumber } from '../../utils/format'
import { TooltipRow, TooltipShell } from './TooltipShell'

const tick = { fill: CHART.muted, fontSize: 12 }

// Recharts passes position, value and index to a label element.
interface EndLabelProps {
  lastIndex: number
  x?: number | string
  y?: number | string
  value?: number | string
  index?: number
}

function EndLabel({ lastIndex, x, y, value, index }: EndLabelProps) {
  if (index !== lastIndex) return null
  return (
    <text x={Number(x)} y={Number(y) - 12} textAnchor="middle" fontSize={12} fontWeight={600} fill={CHART.ink}>
      {value}
    </text>
  )
}

// One series, so no legend: the card title says what is plotted. Only the
// last point is labelled; the axis and tooltip carry the rest.
export function MonthlyCoverageChart({ data }: { data: MonthPoint[] }) {
  const lastIndex = data.length - 1

  return (
    <div className="h-64 w-full" role="img" aria-label="Line chart of published coverage pieces per month. A table view is available.">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 22, right: 24, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke={CHART.grid} />
          <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: CHART.axis }} tick={tick} tickMargin={8} />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={tick}
            width={32}
            domain={[0, (max: number) => Math.max(2, max + 1)]}
          />
          <Tooltip
            cursor={{ stroke: CHART.axis, strokeWidth: 1 }}
            content={(p) => {
              const point = p.payload?.[0]?.payload as MonthPoint | undefined
              if (!p.active || !point) return null
              return (
                <TooltipShell title={point.fullLabel}>
                  <TooltipRow color={CHART.series1} value={String(point.coverage)} name={point.coverage === 1 ? 'piece' : 'pieces'} />
                  <TooltipRow value={formatNumber(point.reach)} name="estimated reach" />
                </TooltipShell>
              )
            }}
          />
          <Area
            type="linear"
            dataKey="coverage"
            stroke={CHART.series1}
            strokeWidth={2}
            fill={CHART.series1}
            fillOpacity={0.1}
            // fillOpacity is repeated because the area's wash would otherwise
            // leak into the markers. The stroke is the 2px surface ring.
            dot={{ r: 5, fill: CHART.series1, fillOpacity: 1, stroke: CHART.surface, strokeWidth: 2 }}
            activeDot={{ r: 6, fill: CHART.series1, fillOpacity: 1, stroke: CHART.surface, strokeWidth: 2 }}
            isAnimationActive={false}
            label={<EndLabel lastIndex={lastIndex} />}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
