import{
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { currentUser } from "@clerk/nextjs/server"
import { AlignJustify, IndianRupee } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SignoutButton from "./SignoutButton";

export default async function Navbar() {

    const user = await currentUser();
    const { firstName, lastName, imageUrl } = user!;

    const fallbackAvatar = firstName![0] + lastName![0];

    return (
        <div className="w-screen h-[70px] flex justify-between items-center px-5">
            <div className="flex items-center gap-x-2">
                <Avatar>
                    {imageUrl ?
                        <AvatarImage src={imageUrl}></AvatarImage> :
                        <AvatarFallback className="bg-zinc-800">{fallbackAvatar}</AvatarFallback>
                    }
                </Avatar>
                <span className="">
                    {firstName + ' ' + lastName}
                </span>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <AlignJustify />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-3">
                    <DropdownMenuItem className="h-[40px]">
                        <div className="w-full h-full flex justify-between items-center">
                            Spendings
                            <IndianRupee size={18} />
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="h-[40px]">
                        <SignoutButton />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
