"use client"
import { MessageSquareMore } from "lucide-react"
import { useRouter } from "next/navigation"

interface CommentsProp {
    postId : string
}
const Comments : React.FC<CommentsProp> = ({postId}) => {
    const router = useRouter()

    const handleClick = () => {
        router.push(`/p/post/${postId}`)
        console.log(postId)
    }
    return (
        <div onClick={handleClick} className="flex gap-x-2 p-2 hover:opacity-70 hover:cursor-pointer">
            <MessageSquareMore />
            Add Comment
        </div>
    )
}

export default Comments