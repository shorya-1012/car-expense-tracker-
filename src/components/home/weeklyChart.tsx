'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"


const chartConfig = {
    fuel: {
        label: "Fuel",
        color: "hsl(var(--chart-1))",
    },
    repair: {
        label: "Repair",
        color: "hsl(var(--chart-2))",
    },
    servicing: {
        label: "servicing",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig

type Props = {
    graphData: {
        day: string,
        fuel: number,
        repair: number,
        servicing: number
    }[]
}

export default function WeeklyChart({ graphData }: Props) {

    return (
        <div className="w-screen p-5 my-5 flex flex-col">
            <ChartContainer config={chartConfig} className="rounded-xl bg-zinc-900 p-3">
                <BarChart accessibilityLayer data={graphData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="day"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar
                        dataKey="fuel"
                        stackId="a"
                        fill="#2742C5"
                        radius={[0, 0, 4, 4]}
                    />
                    <Bar
                        dataKey="repair"
                        stackId="a"
                        fill="#e65f92"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="servicing"
                        stackId="a"
                        fill="#CBDA36"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ChartContainer>
            <p className="text-zinc-500 place-self-center mt-3">Last 7 days</p>
        </div>
    )
}
