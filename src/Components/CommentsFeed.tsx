"use client"
import  TextareaAutosize  from "react-textarea-autosize"
import { Button } from "./ui/button"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { CommentPayloadCreation } from "@/app/lib/validators/Comment"
import axios from "axios"
import { useToast } from "./ui/use-toast"


interface CommentsProp{
    postId: string
    replytoId?: string
}

const CommentsFeed = ({postId,replytoId}: CommentsProp) => {

    const [ input,setInput] = useState<string>("")

    const {toast} = useToast()

    const {mutate:CreateComment} = useMutation({
        mutationFn : async({message,postId,replytoId}: CommentPayloadCreation) => {
            const payload: CommentPayloadCreation = {
                message,
                postId,
                replytoId
            }
            const {data} = await axios.patch("/api/post/comment",payload)
        },
        onError: (error:Error) =>{
            return toast({
                variant:"destructive",
                title:"Error",
                description:"Cannot post your comment now"
            })
        },
        onSuccess: () => {
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
        </div>
    )
}

export default CommentsFeed