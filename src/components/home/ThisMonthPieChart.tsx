'use client'

import { Label, Pie, PieChart } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

type Props = {
    totalExpenditure: number,
    totalContribution: number,
    mySpending: number;
}

const chartConfig = {
    totalSpent: {
        label: "Total Spent",
    },
    mySpending: {
        label: "My Expenditure",
        color: "hsl(var(--chart-1))",
    },
    contributions: {
        label: "Contributions",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

export default function ThisMonthPieChart({ totalExpenditure, totalContribution, mySpending }: Props) {
    const chartData = [
        { type: "mySpending", amount: mySpending, fill: "#2742C5" },
        { type: "contribution", amount: totalContribution, fill: "#dae304" },
    ]

    return (
        <div data-aos="fade-up" className="flex flex-col gap-y-2 items-center justify-center mt-5 mb-2 w-screen ">
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square h-[250px]"
            >
                <PieChart>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                        data={chartData}
                        dataKey="amount"
                        nameKey="type"
                        innerRadius={60}
                        strokeWidth={5}
                    >
                        <Label
                            content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                className="fill-white text-3xl font-bold"
                                            >
                                                ₹{totalExpenditure.toLocaleString()}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 24}
                                                className="fill-muted-foreground"
                                            >
                                                This Month
                                            </tspan>
                                        </text>
                                    )
                                }
                            }}
                        />
                    </Pie>
                </PieChart>
            </ChartContainer>
            <div className="w-full flex gap-x-5 items-center justify-center">
                <div className="flex gap-x-2 items-center">
                    <div className="bg-[#2742C5] w-[10px] h-[10px] rounded"></div>
                    <p>My Spending</p>
                </div>
                <div className="flex gap-x-2 items-center">
                    <div className="bg-[#dae304] w-[10px] h-[10px] rounded"></div>
                    <p>Contributions</p>
                </div>
            </div>
        </div>
    )
}
