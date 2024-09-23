'use client'
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { ChevronLeft, CalendarDays, UserPlus } from "lucide-react"
import Link from "next/link"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { GiAutoRepair } from "react-icons/gi";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { FaCar } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react";
import axios from 'axios'
import { AddExpensePayload } from "@/lib/validators";
import { ExpenseType } from "@prisma/client";
import { formatDate } from "date-fns";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";


const expenseTypes = [
    {
        id: 1,
        name: "Fuel",
        icon: <BsFillFuelPumpFill />
    },
    {
        id: 2,
        name: "Repair",
        icon: <GiAutoRepair />
    },
    {
        id: 3,
        name: "Servicing", icon: <FaCar />
    },
];



export default function Page() {

    const [date, setDate] = useState<Date | undefined>();
    const [spending, setSpending] = useState<number | string>('');
    const [type, setType] = useState('');
    const [contributor, setContributor] = useState('');
    const [contributonAmount, setContibutionAmount] = useState<number | string>('');
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        if (!date) {
            alert("Date not provided")
            return;
        }
        if (!spending) {
            alert("Spendings not provided")
            return;
        }
        if (!type) {
            alert("Type not provided")
            return;
        }

        try {
            const payload: AddExpensePayload = {
                date: date,
                spending: Number(spending),
                type: type as ExpenseType,
                hasContirbutor: showDropdown,
                contributor: contributor,
                contirbutionAmount: Number(contributonAmount)
            };

            await axios.post("/api/create-expense", payload);
            router.push('/home');

        } catch (error) {
            alert("Could not create expense")
        }
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="w-screen h-[70px] flex justify-between items-center px-5">
                <Link
                    href={'/home'}
                    className="flex items-center gap-x-1">
                    <ChevronLeft />
                    Home
                </Link>
            </div>
            <h1 className="text-3xl my-10 font-semibold">Add Your Expense</h1>
            <form className="w-full flex flex-col items-center px-5 justify-center mt-10 gap-y-2">
                <section className="w-full flex flex-col items-start gap-y-3 px-2">
                    <Label>Type</Label>
                    <Select onValueChange={val => setType(val)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Expense Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                expenseTypes.map(expense => {
                                    return (
                                        <SelectItem key={expense.id} value={expense.name} >
                                            <div className="flex items-center justify-between w-[70vw]">
                                                <span className="">
                                                    {expense.name}
                                                </span>
                                                {expense.icon}
                                            </div>
                                        </SelectItem>
                                    )
                                })
                            }
                        </SelectContent>
                    </Select>
                </section>
                <section className="w-full flex flex-col items-start gap-y-3 my-5 px-2">
                    <Label>Spending</Label>
                    <Input
                        className="w-full"
                        placeholder="Cost"
                        value={spending}
                        onChange={(e) => setSpending(e.target.value)}
                        type="number"
                    />
                </section>
                <section className="w-full flex flex-col items-start gap-y-3 mb-5 px-2">
                    <Label>Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={'outline'} className="w-full flex justify-start">
                                {date ? formatDate(date, 'PPP') :
                                    <div className="w-full flex items-center justify-between">
                                        Pick Date
                                        <CalendarDays size={15} />
                                    </div>
                                }
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                selected={date}
                                onSelect={(val) => setDate(val)}
                                mode="single"
                                disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </section>
                <section className="w-full flex flex-col items-start gap-y-3 mb-5 px-2">
                    <Button
                        variant={'outline'}
                        className={cn("w-full items-center gap-x-3", showDropdown ? "hidden" : "flex")}
                        type="button"
                        onClick={() => setShowDropdown(true)}
                    >
                        Add Contirbutor
                        <UserPlus size={15} />
                    </Button>
                    <div className={cn(showDropdown ? 'flex' : 'hidden', "flex-col items-start w-full")}>
                        <section className="w-full flex flex-col items-start gap-y-3 mb-5 px-2">
                            <Label>Contirbutor</Label>
                            <Input
                                className="w-full"
                                placeholder="Contributor name"
                                value={contributor}
                                onChange={(e) => setContributor(e.target.value)}
                            />
                        </section>
                        <section className="w-full flex flex-col items-start gap-y-3 my-5 px-2">
                            <Label>Amount</Label>
                            <Input
                                className="w-full"
                                placeholder="Amount contributed"
                                value={contributonAmount}
                                onChange={(e) => setContibutionAmount(e.target.value)}
                                type="number"
                            />
                        </section>
                        <Button
                            type="button"
                            variant={'outline'}
                            className="place-self-end mr-2"
                            onClick={() => {
                                setContributor('');
                                setContibutionAmount('')
                                setShowDropdown(false)
                            }
                            }
                        >
                            Cancel
                        </Button>
                    </div>
                </section>
                <section className="w-full flex flex-col items-start gap-y-3 my-5 px-2">
                    <Button
                        type="submit"
                        onClick={e => handleSubmit(e)}
                        variant={'secondary'} className="w-full">Sumbit</Button>
                </section>
            </form >
        </div >
    )
}
