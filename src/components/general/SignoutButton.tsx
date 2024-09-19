'use client'

import { useClerk } from "@clerk/nextjs"
import { LogOut } from "lucide-react"

export default function SignoutButton() {
    const { signOut } = useClerk();

    return (
        <button
            onClick={() => signOut({ redirectUrl: '/' })}
            className="w-full h-full flex justify-between items-center"
        >
            Sign Out
            <LogOut size={18} />
        </button>
    )
}
