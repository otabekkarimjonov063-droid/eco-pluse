// Usage (Recharts):
//   <BarChart data={data}>
//     <ChartDefs />
//     <CartesianGrid {...chart.gridProps} />
//     <XAxis dataKey="m" {...chart.axisProps} />
//     <YAxis {...chart.axisProps} />
//     <Tooltip {...chart.tooltipProps} />
//     <Bar dataKey="aqi" {...chart.barProps} />
//   </BarChart>
//
//   <AreaChart> ... <Area dataKey="co2" stroke={chart.signal} strokeWidth={2} fill="url(#areaFill)" />

export const chart = {
  signal: '#9bf0b8',
  ember: '#f2c14e',
  axisProps: {
    stroke: 'transparent',
    tick: { fill: '#8c9a92', fontSize: 12 },
    tickLine: false,
    axisLine: false,
  },
  gridProps: { stroke: 'rgba(255,255,255,0.06)', vertical: false },
  tooltipProps: {
    cursor: { fill: 'rgba(255,255,255,0.04)' },
    contentStyle: {
      background: 'rgba(8,16,14,0.92)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 12,
      color: '#e8eee4',
      fontSize: 13,
    },
    labelStyle: { color: '#8c9a92' },
  },
  barProps: { radius: [6, 6, 0, 0], fill: 'url(#barFill)', maxBarSize: 36 },
}

// Put <ChartDefs /> as the first child inside the chart
export function ChartDefs() {
  return (
    <defs>
      <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#9bf0b8" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#9bf0b8" stopOpacity="0.12" />
      </linearGradient>
      <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#9bf0b8" stopOpacity="0.28" />
        <stop offset="100%" stopColor="#9bf0b8" stopOpacity="0" />
      </linearGradient>
    </defs>
  )
}

// AQI status colour: calm green, amber, then a warm red-orange
export function aqiColor(v) {
  if (v <= 50) return '#9bf0b8'
  if (v <= 100) return '#f2c14e'
  return '#ff7a59'
}
