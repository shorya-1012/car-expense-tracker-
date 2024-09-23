import Navbar from "@/components/general/Navbar";
import ThisMonthPieChart from "@/components/home/ThisMonthPieChart";
import WeeklyChart from "@/components/home/weeklyChart";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { constructNow, subDays } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
    const { userId } = auth();
    if (!userId) redirect('/')

    const oneWeekAgo = subDays(new Date(), 7);

    const prevSpendings = await db.expense.findMany({
        orderBy: {
            date: 'asc'
        },
        where: {
            date: {
                gte: oneWeekAgo
            },
            userId: userId
        },
        include: {
            contributionId: true
        },
        take: 5
    })

    const graphData = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleString('en-IN', { weekday: 'long', timeZone: 'Asia/Kolkata' });
        let fuel = 0;
        let repair = 0;
        let servicing = 0;
        prevSpendings.map(data => {
            const dayOfWeek = new Date(data.date).toLocaleDateString('en-IN', { weekday: 'long', timeZone: 'Asia/Kolkata' });

            if (dayOfWeek === dayName) {
                if (data.type === 'Fuel') {
                    fuel += data.spending;
                } else if (data.type === 'Repair') {
                    repair += data.spending;
                } else if (data.type === 'Servicing') {
                    servicing += data.spending;
                }
            }
        })
        graphData.push({
            day: dayName,
            fuel,
            repair,
            servicing
        })
    }

    const now = new Date();
    const firstDayofMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyExpenditure = await db.expense.findMany({
        select: {
            spending: true,
            contributionId: {
                select: {
                    amount: true
                }
            }
        },
        where: {
            date: {
                gte: firstDayofMonth,
                lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
            },
            userId: userId,
        },
    })

    let totalMonthlySpending = 0;
    let totalcontirbution = 0;
    for (let data of monthlyExpenditure) {
        totalMonthlySpending += data.spending;
        totalcontirbution += data.contributionId?.amount || 0;
    }
    const mySpending = totalMonthlySpending - totalcontirbution;

    return (
        <div className="flex flex-col justify-start">
            <Navbar />
            <ThisMonthPieChart totalExpenditure={totalMonthlySpending} totalContribution={totalcontirbution} mySpending={mySpending} />
            <WeeklyChart graphData={graphData} />
            <div data-aos="fade-up" className="w-screen flex flex-col px-3">
                <div className="w-full rounded-lg my-3 bg-zinc-900 flex justify-between items-center px-5 py-3">
                    <p className="">Recent</p>
                    <p className="text-zinc-500 text-sm">see more</p>
                </div>
                <div className="w-full flex flex-col gap-y-2 mb-5">
                    {
                        prevSpendings.reverse().map(prevData => {
                            return (
                                <div key={prevData.id} className="flex items-center justify-between px-3 py-2">
                                    <div className="flex flex-col">
                                        <p className="font-semibold text-blue-400">{prevData.type}</p>
                                        <p className="text-sm text-white">{prevData.date.toLocaleString('en-IN', {
                                            weekday: 'short',
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}</p>
                                    </div>
                                    <div className="flex flex-col gap-y-1 items-end">
                                        <p className="font-semibold tracking-wider text-green-400">₹{prevData.spending}</p>
                                        {prevData.contributionId?.amount &&
                                            <p className="font-semibold tracking-wider text-red-500 text-sm">- ₹{prevData.contributionId.amount}</p>
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <Link
                href={"/add-expense"}
                className="w-[60px] h-[60px] fixed bottom-10 right-6 z-50 bg-zinc-700 text-white p-4 rounded-full shadow-lg hover:bg-zinc-800 flex justify-center items-center"
            >
                +
            </Link>
        </div>
    )
}
