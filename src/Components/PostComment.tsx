"use client"
import { useUser } from "@clerk/nextjs"
import { Comment } from "@prisma/client"
import { MessageSquareReply, ThumbsDown, ThumbsUp, UserRound } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import  TextareaAutosize  from "react-textarea-autosize"
import { Button } from "./ui/button"
import { useMutation } from "@tanstack/react-query"
import { CommentPayloadCreation } from "@/app/lib/validators/Comment"
import axios from "axios"
import { toast } from "./ui/use-toast"
interface PostCommentsProp{
    comment: Comment
    postId: string
    replytoId?: string
}

const PostComments : React.FC<PostCommentsProp> = ({comment , postId ,replytoId}) => {

    const [isReplying,setIsReplying] = useState<boolean>(false)
    const[input,setInput] = useState<string>("")


    const {isSignedIn} = useUser()

    const toggleReply = () => setIsReplying((current) => !current)

    const {mutate: ReplyComment} = useMutation({
        mutationFn : async({
            message,
            postId,
            replytoId
        }:CommentPayloadCreation) => {

            const payload: CommentPayloadCreation = {
                message,
                postId,
                replytoId
            }

            const {data} = await axios.post("/api/post/comment",payload)
            return data
        },
        onError: (error) => {
            toast({
                variant:"destructive",
                title:"Error",
                description:"Cannot replyto at the current moment"
            })
        },
        onSuccess: () => {

            toggleReply()
            router.refresh()
            toast({
                variant:"default",
                title:"Success",
                description:"Your comment addedd"
            })
        }
    })
    

    const router = useRouter()
    return (
        <div className="flex flex-col gap-y-2 p-2">
                            <div className="text-xl flex  gap-x-2 font-normal text-zinc-900   rounded-md"  >
                                <UserRound size={36} className="bg-slate-300 rounded-full mr-2" />
                                <div className="flex flex-col gap-y-2 pt-4">
                                {comment.message}
                                <div className="flex flex-col">
                                    <div className="flex gap-x-8 items-center ">
                                    <ThumbsUp size={20}/>
                                    <ThumbsDown className="" size={20} />
                                    <div onClick={() => {
                                      if(!isSignedIn){
                                        router.push("/sign-in")
                                      } else{
                                        toggleReply()
                                      }  
                                    }} className="flex p-2 cursor-pointer gap-x-1 items-center">
                                    <MessageSquareReply size={20}/>
                                    Reply
                                    </div>
                                    </div>
                                    <div>                                    
                                        {
                                        isReplying ? (
                                             <div className="flex flex-col flex-wrap gap-y-2  ">
                                            <TextareaAutosize
                                            className="appearence-none resize-none p-3 border-[1px] border-gray-300 rounded-lg"
                                            placeholder="" 
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}/>
                                            <div className="flex items-center gap-x-6">
                                                <Button onClick={() => ReplyComment({message:input,postId: comment.postId,replytoId:comment.replytoId ?? comment.id}) } disabled={input.length === 0}>Comment</Button>
                                                <Button variant={"outline"} onClick={() => {
                                                    setIsReplying(false)
                                                }}>Cancel</Button>
                                            </div>
                                        </div>
                                        ) : (
                                            null
                                        )
                                    }
                                    </div>
                                    <div>
                                       
                                    </div>
                                    </div>
                                </div>
                                </div>
                                </div>
    )

}

export default PostComments