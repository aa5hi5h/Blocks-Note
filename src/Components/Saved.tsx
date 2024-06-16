"use client"
import { PostSavedRequest } from "@/app/lib/validators/Saved"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { Bookmark } from "lucide-react"
import { useToast } from "./ui/use-toast"
import { useEffect, useState } from "react"
import { Saved } from "@prisma/client"
import { cn } from "@/utils/clsx"
import { usePrevious} from '@mantine/hooks'
import { currentUser } from "@clerk/nextjs/server"


type BookMark = Pick< Saved ,"saved">
interface SavedProp{
    postId : string
    initalVote?: Saved
}

const SavedPost = ({postId, initalVote}: SavedProp) => {

    const [isSaved,setIsSaved] = useState(initalVote?.saved)
    const {toast} = useToast()

    const prevVote = usePrevious(isSaved)

    useEffect(() => {
        setIsSaved(initalVote?.saved)
    },[initalVote?.saved])

    const {mutate: SavedPost} = useMutation({
        mutationFn: async() => {
            const payload: PostSavedRequest = {
                postId
            }

            await axios.patch("/api/post/saved",payload)
        },
        onError: (error) => {
            if(error instanceof AxiosError){
                if(error.response?.status === 400){
                    return toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Login to proceed"
                    })
                }
            }
            setIsSaved(prevVote)
        },
        onMutate: (vote: BookMark) => {
            setIsSaved((prev) => !prev)
        }
    })

    const handleSaved = async() => {
        const payload = {
            saved: isSaved ?? false
        }

        console.log(payload.saved)

         SavedPost(payload)
    }
    return (
        <div onClick={() => handleSaved()} className="flex gap-x-2 p-2 hover:opacity-70 hover:cursor-pointer">
            <Bookmark  className={cn({"text-blue-500 fill-blue-500": isSaved === true })} />
            {
                isSaved === true ? (<p>Saved</p>) : (<p>Bookmark</p>)
            }
        </div>
    )
}

export default SavedPost