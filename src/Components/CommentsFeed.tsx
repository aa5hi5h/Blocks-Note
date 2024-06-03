"use client"
import  TextareaAutosize  from "react-textarea-autosize"
import { Button } from "./ui/button"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { CommentPayloadCreation } from "@/app/lib/validators/Comment"
import axios from "axios"
import { useToast } from "./ui/use-toast"
import { useRouter } from "next/navigation"
import { Comment, CommentLike } from "@prisma/client"
import { MessageSquareReply, ThumbsDown, ThumbsUp, UserRound } from "lucide-react"
import PostComments from "./PostComment"


type ExtendedComments = Comment & {
    likes: CommentLike[],
    replies: ReplyComment[]
}

type ReplyComment = Comment & {
    likes: CommentLike[]
}


interface CommentsProp{
    postId: string
    replytoId?: string
    comments : ExtendedComments[]
}

const CommentsFeed = ({postId,replytoId,comments}: CommentsProp) => {

    const [ input,setInput] = useState<string>("")
    const [isReplying,setIsReplying] = useState<boolean>(false)

    const {toast} = useToast()
    const router = useRouter()



    const {mutate:CreateComment} = useMutation({
        mutationFn : async({message,postId,replytoId}: CommentPayloadCreation) => {
            const payload: CommentPayloadCreation = {
                message,
                postId,
                replytoId
            }
            const {data} = await axios.post("/api/post/comment",payload)
            return data as string
        },
        onError: (error:Error) =>{
            return toast({
                variant:"destructive",
                title:"Error",
                description:"Cannot post your comment now"
            })
        },
        onSuccess: () => {
            router.refresh()
            return toast({
                variant:"default",
                title:"Success",
                description:"Comment added to the disccusion"
            })
        }
    })
    return (
        <div className="p-3">
            <form>
            <div className="flex w-full  flex-col space-y-4">
            <h1 className="text-4xl font-semibold">Comments</h1>
            <TextareaAutosize value={input} onChange={(e) => setInput(e.target.value)}  placeholder="Type here to comment" minRows={3} className="appearence-none p-2 border-2 border-zinc-400 rounded-lg resize-none" />
            <Button disabled={input.length === 0} 
            onClick={() => CreateComment({message:input,postId,replytoId})} className="max-w-max ml-auto">Comment</Button>
            </div>
            </form>
           <hr className="border-[1px] border-zinc-300 w-full mt-4" />
           <div className="mt-4">
            {
                comments ? (
                    <div className="flex flex-col ">
                        {comments
                        .filter((comment) => !comment.replytoId)
                        .map((item,index) => {

                          return (  
                            <div>
                          <PostComments key={index} comment={item} postId={postId} replytoId={item.replytoId || undefined} />
                          {item.replies.map((reply) => {
                            return (
                                <div key={reply.id} className="ml-12 py-2 pl-4 border-l-2 border-zinc-200">
                                    <PostComments comment={reply} postId={postId} replytoId={item.replytoId ?? item.id}/>
                                  
                                </div>
                            )}
                            )
                          }
                          
                          </div>

                         )})}
                    </div>
                ) : (
                    <div>THis place is empty </div>
                )
            }
            {
                
            }
           </div>
        </div>
    )
}

export default CommentsFeed