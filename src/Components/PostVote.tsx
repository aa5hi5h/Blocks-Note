'use client'
import { PostVoteRequest } from "@/app/lib/validators/Vote"
import { PostVote, VoteType } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { ArrowBigDown, ArrowBigUp } from "lucide-react"
import { useEffect, useState } from "react"
import { usePrevious} from '@mantine/hooks'
import { useToast } from "./ui/use-toast"
import { cn } from "@/utils/clsx"

type partialVote = Pick< PostVote  , "type">

interface PostVoteProp{
    postId: string,
    initialVoteAmt: number,
    initialVote?: VoteType 
}

const PostVoteClient = ({
    postId,
    initialVoteAmt,
    initialVote
}: PostVoteProp) => {

    const[votesAmt,setVotesAmt] = useState<number>(initialVoteAmt)
    const[currentVote,setCurrentVote] = useState(initialVote)

    const prevVote = usePrevious(currentVote)


    useEffect(() => {
        setCurrentVote(initialVote)
    },[initialVote])



    const {toast} = useToast()




    const {mutate:Vote} = useMutation({
        mutationFn: async(vote:VoteType) => {

            const payload : PostVoteRequest = {
                postId,
                vote 
            }

            await axios.patch(`/api/post/vote`,payload)
        },
        onError: (err,vote) => {
            if(vote === "UP") setVotesAmt((prev) => prev-1)
            else setVotesAmt((prev) => prev + 1)

            setCurrentVote(prevVote)

            if(err instanceof AxiosError){
                if(err.response?.status=== 400){
                    return toast({
                        variant:"destructive",
                        title:"Login Required"
                    })
                }
            }
        },
        onMutate: (vote: VoteType) => {
            if(currentVote === vote){
                setCurrentVote(undefined)

                if( vote === "UP") setVotesAmt((prev) => prev -1)
                else if (vote === "DOWN") setVotesAmt((prev) => prev + 1)
            }else{
        setCurrentVote(vote)
        if(vote === "UP") setVotesAmt((prev) => prev + (currentVote ? 2 : 1))
        else if (vote === "DOWN") setVotesAmt((prev) => prev - (currentVote ? 2 : 1))
    }
        }
    })

    
    return (
        <div className="flex items-center gap-2">
            <ArrowBigDown onClick={() => Vote("DOWN")} size={32} className={cn("opacity-70 hover:opacity-90",{
                "text-red-500 fill-red-500": currentVote === "DOWN"
            })} />
            <div className="font-medium text-lg">{votesAmt}</div>
            <ArrowBigUp onClick={() => Vote("UP")} size={32} className={cn("opacity-70 hover:opacity-90",{
                'text-emerald-500 fill-emerald-500': currentVote === "UP"
            })} />
        </div>
    )
}

export default PostVoteClient