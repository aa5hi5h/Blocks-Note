"use client"
import Link from "next/link"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Bomb, BotMessageSquare, NotebookText } from "lucide-react"
import { useRouter } from "next/navigation"
import { UserButton, useUser } from "@clerk/nextjs"
import SearchBar from "./Searchbar"


const Navbar = () => {
    const router = useRouter()
    const {isSignedIn,user,} = useUser()
    return (
        <div className="p-3">
            <div className="flex w-full items-center space-x-4 border-b pb-4 border-slate-500">
                <Link href={"/"} className="text-4xl font-semibold w-[240px] text-zinc-900">Blocks-Note</Link>
                <div className="w-[560px] pr-2">
                    <SearchBar />
                </div>
                <div className="pr-8">
                    <ul className="flex space-x-2 items-center">
                        <li>
                            <Button onClick={() => router.push("/p/create")} className="flex items-center bg-blue-500 hover:bg-blue-600 space-x-1 ">
                                <NotebookText size={22}  />
                                <div>Create</div>
                            </Button></li>
                            <li className="pr-4">
                            <Button onClick={() => router.push("/p/featured")} variant={"outline"} className="hidden md:flex space-x-1 text-black bg-slate-200 shadow-sm hover:bg-amber-400 hover:text-white transition">
                                <Bomb size={22} />
                                <h1>Featured Post</h1>
                            </Button>
                        </li >
                        <BotMessageSquare className="cursor-pointer hover:text-blue-500" />
                    </ul>
                </div>
                <div>
                    {isSignedIn ? (
                        <UserButton />
                     ) : (
                        <Button onClick={() => router.push("/sign-in")} >SignIn</Button>
                     )}
                </div>
            </div>
        </div>
    )
}
export default Navbar