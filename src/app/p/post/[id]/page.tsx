import CommentsFeed from "@/Components/CommentsFeed"
import PostAction from "@/Components/PostAction"
import PostMenu from "@/Components/PostMenu"
import { db } from "@/app/lib/db"
import Image from "next/image"
import { notFound } from "next/navigation"


const page = async({params}:{params:{id:string}}) => {
    const {id} = params
    const post = await db.post.findUnique({
        where:{
            id
        }
    })
    if(!post) return notFound;

    const comments = await db.comment.findMany({
        where:{
            postId: post.id,
            replytoId: undefined
        },include : {
           likes: true,
           replies:{
            include:{
                likes:true,
                
            }
           }

        }
    })

    

    return (
        <div className=" max-w-[635px] p-3 mx-auto h-full ">
            <div className=" p-2 h-fit w-full flex  ">
                <PostMenu />
               <div className="flex w-[80rem] mx-auto p-6 rounded-md bg-white flex-col space-y-4">
                <div className="flex items-center justify-between">
                <h1 className="text-5xl font-bold pb-8">{post.title}</h1>
                <PostAction post={post} />
                </div>
                <div className="">
                {
                    post.image ? (
                        <div className="relative w-[500px] p-2  rounded-sm h-[600px]">
                        <Image alt="Blog image" className="object-contain" fill src={post.image} />
                        </div>
                    ) : (
                         null
                    )
                }
                </div>
                <h2 className="text-xl font-normal p-4 pt-8">{post.description}</h2>
                <CommentsFeed postId={post.id} comments={comments} />
               </div>
            </div>
        </div>
    )
}

export default page