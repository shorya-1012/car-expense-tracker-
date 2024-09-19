import Navbar from "@/components/general/Navbar";
import WeeklyChart from "@/components/home/weeklyChart";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { subDays } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GiAutoRepair } from "react-icons/gi";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { FaCar } from "react-icons/fa";

const iconsMap = [
    {
        name: "Fuel",
        icon: <BsFillFuelPumpFill />
    },
    {
        name: "Repair",
        icon: <GiAutoRepair />
    },
    {
        name: "Servicing", icon: <FaCar />
    },
];


export default async function Page() {
    const { userId } = auth();
    if (!userId) redirect('/')

    const oneWeekAgo = subDays(new Date(), 7);

    const prevSpendings = await db.expense.findMany({
        orderBy: {
            date: 'asc'
        },
        where: {
            AND: [
                {
                    date: {
                        gte: oneWeekAgo,
                    }
                },
                {
                    userId: userId,
                }
            ],

        }
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

    const currentMonthExpenditure = await db.expense.aggregate({
        _sum: {
            spending: true
        },
        where: {
            date: {
                gte: firstDayofMonth,
                lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
            },
            userId: userId
        }
    });

    return (
        <div className="flex flex-col justify-start">
            <Navbar />
            <div data-aos="fade-up" className="flex flex-col gap-y-2 items-center justify-center mt-5">
                <span className="text-gray-400">This Month</span>
                <p className="text-4xl font-semibold tracking-widest">₹{currentMonthExpenditure._sum.spending}</p>
            </div>
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
                                    <FaCar />
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
