"use client"
import { Delete } from "lucide-react"
import { Button } from "./ui/button"
import { useUser } from "@clerk/nextjs"
import { Post } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { PostCreationPayload } from "@/app/lib/validators/Post"
import axios from "axios"
import { useToast } from "./ui/use-toast"

interface PostActionProp{
    post: Post
}


const PostAction = ({post}:PostActionProp) => {
    const {user} = useUser()

    const router = useRouter()
    const {toast} = useToast()

    const {mutate:DeletePost} = useMutation({
        mutationFn : async() => {

            const {data} = await axios.delete(`/api/post/${post.id}`)
            return data
        },
        onError:() => {
            toast({
                variant:"destructive",
                title:"Error",
            })
        },
        onSuccess: () => {
            router.push('/')
            router.refresh()
            toast({
                title:"Success",
                description:"deleted your Post"
            })
        }
    })

    const handleDelete =() => {
        DeletePost()
    }

    if(!user){
        return null
    }


    return (
        <div className="pb-8">
            {user.id === post.userId ? (
                 <div className="flex gap-x-4">
                 <Button onClick={() => router.push(`/p/post/${post.id}/edit`)} variant={"outline"}>Edit</Button>
                 <Button onClick={handleDelete} variant={"destructive"} className="flex gap-x-2">Delete <Delete /></Button>
             </div>
            ) :  (null) }

        </div>
    )
}

export default PostAction