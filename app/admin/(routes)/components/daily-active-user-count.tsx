"use client";

import dayjs from "dayjs";
import {
  Bar,
  BarChart,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

export interface DailyActiveUserBarProps {
  data: any[];
}

export default function DailyActiveUserBar({ data }: DailyActiveUserBarProps) {
  console.log(data);

  return (
    <ResponsiveContainer className="w-full h-80" height={320}>
      <BarChart data={data}>
        <XAxis
          tickLine={false}
          axisLine={false}
          dataKey="date"
          tickFormatter={(value) => dayjs(value).format("DD MMM")}
        />
        <YAxis tickLine={false} axisLine={false} dataKey="active1DayUsers" />
        {/* <Tooltip content={CustomTooltip} shared /> */}
        <Bar
          //   type="linear"
          dataKey="active1DayUsers"
          label="Active Users"
          className="fill-card-result"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

function CustomTooltip<TValue extends ValueType, TName extends NameType>({
  active,
  payload,
  contentStyle,
  labelStyle,
  itemStyle,
}: TooltipProps<TValue, TName>) {
  if (!active || !payload) {
    return null;
  }

  return (
    <div
      className="rounded-md bg-background border border-border p-3"
      style={contentStyle}
    >
      <div className="text-sm text-muted-foreground" style={labelStyle}>
        {payload[0].payload.date}
      </div>
      <div className="text-lg font-bold" style={itemStyle}>
        Count: {payload[0].payload.active1DayUsers}
      </div>
    </div>
  );
}
