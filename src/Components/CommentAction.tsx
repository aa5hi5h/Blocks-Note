"use client"
import { Trash } from "lucide-react"
import { Button } from "./ui/button"
import { useMutation } from "@tanstack/react-query"
import { CommentDeletePayload, CommentUpdatePayload } from "@/app/lib/validators/Comment"
import axios from "axios"
import { useToast } from "./ui/use-toast"
import { useRouter } from "next/navigation"
import { Comment } from "@prisma/client"
import { useState } from "react"
import TextareaAutosize from "react-textarea-autosize"


interface CommentActionProp{
    comment: Comment
}

const CommentAction = ({comment}:CommentActionProp) => {

    const [input,setInput] = useState<string>("")
    const [isEditing,setIsEditing] = useState<boolean>(false)


    const router = useRouter()
    const {toast} = useToast()


    
    const {mutate:UpdateComment} = useMutation({
        mutationFn: async({message,postId,commentId,replytoId}: CommentUpdatePayload) => {
            const payload: CommentUpdatePayload = { 
                message,
                postId,
                commentId,
                replytoId
              }

              const {data} = await axios.patch("/api/post/comment",payload)
              return data
        },
        onError: (error) => {
            return toast({
                variant:"destructive",
                title:'Error',
                description:"Cannot perform your action currently "
            })
        },
        onSuccess: () => {

            setIsEditing(false)
            toast({
                variant:"default",
                title:'Success',
                description:'Comment edited'
            })
            return router.refresh()
        }
    })


    const {mutate:DeleteComment} = useMutation({
        mutationFn: async({commentId,postId,replytoId}:CommentDeletePayload) => {
            const payload: CommentDeletePayload = {
                commentId,
                postId,
                replytoId
            }

            const {data} = await axios.delete("/api/post/comment",{data:payload})
            return data

        },
        onError: (error) => {
            return toast({
                variant:"destructive",
                title:"Error",
                description:'Cannot deleete at the moment'
            })
        },
        onSuccess: () => {
            router.refresh()
            return toast({
                variant:'default',
                title:"Success",
                })
        }
    })


    const toggleReply = () => setIsEditing((current) => !current)


    return (
        <div className="flex flex-col  gap-x-4">
            <div className="flex gap-x-4">
        <Button 
        onClick={toggleReply} 
        variant={"outline"}>Edit</Button>
        <Trash onClick={() => DeleteComment({postId:comment.postId,commentId:comment.id,replytoId:comment.replytoId ?? undefined})} color="red" 
         className="mt-2 cursor-pointer" />
         </div>
         <div>
            {isEditing ? (
                <div className="flex flex-col pt-4 space-y-4">
                    <TextareaAutosize
                    placeholder="type here to edit your Comment" 
                    value={input} onChange={(e) => setInput(e.target.value)} 
                    className="apearence-none border-[1px] border-slate-300 rounded-lg  w-[24rem] resize-none p-3" minRows={3} />
                    <div className="flex ml-auto">
                        <Button onClick={() => UpdateComment({message:input,postId:comment.postId,replytoId:comment.replytoId ?? undefined,commentId:comment.id})} 
                        disabled={input.length === 0} 
                        variant={"outline"}>Save</Button>
                        <Button onClick={() => setIsEditing(false)} variant={"ghost"}>Cancel</Button>
                    </div>
                </div>

            ) : (null)}
         </div>
    </div>
    )
}

export default CommentAction