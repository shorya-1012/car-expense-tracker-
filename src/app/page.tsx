import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function Page() {

    const { userId } = auth();
    if (userId) {
        redirect("/home")
    }

    return (
        <div className="h-screen overflow-x-hidden flex flex-col justify-center items-center">
            <span className="text-3xl font-semibold">
                Sign in to continue
            </span>
            <SignInButton />
        </div>
    );
}
