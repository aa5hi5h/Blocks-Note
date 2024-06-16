"use client"
import { Post, PostVote, VoteType } from "@prisma/client"
import Image from "next/image"
import Comments from "./Comments"
import Saved from "./Saved"
import { useRouter } from "next/navigation"
import PostVoteClient from "./PostVote"

type PartialVote = Pick< PostVote , "type">

interface PostFeedProp{
    post: Post,
    initialVoteAmt: number
    currentVote?: VoteType
}

const PostFeed: React.FC<PostFeedProp>= ({
    post,
    initialVoteAmt,
    currentVote
}) => {

    const router = useRouter()
    return (
        <div className="p-3 border flex flex-col h-fit bg-white rounded-md mb-4 border-gray-300 shadow-sm space-y-2">
            <h1 onClick={() => router.push(`/p/post/${post.id}`) }
             className="text-2xl font-bold px-3 hover:text-blue-500 hover:cursor-pointer py-2">{post.title}</h1>
            <h2 className="text-lg font-normal px-4 py-2 ">{post.description}</h2>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-x-4">
            <Comments postId={post.id} />
            <PostVoteClient postId={post.id} initialVote={currentVote} initialVoteAmt={initialVoteAmt}  />
            </div>
            <Saved />
            </div>

        </div>
    )
}

export default PostFeed