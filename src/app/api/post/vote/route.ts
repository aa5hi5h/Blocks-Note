import { db } from "@/app/lib/db";
import { PostVoteValidator } from "@/app/lib/validators/Vote";
import { auth } from "@clerk/nextjs/server";
import { ZodError } from "zod";


export async function PATCH(request:Request){
    try{

        const {userId} = auth()

        if(!userId){
            return new Response("unauthorized",{status:400})
        }

        const body = await request.json()

        const {postId,vote} = PostVoteValidator.parse(body)

        const post = await db.post.findFirst({
            where:{
                id: postId
            },
            include:{
                likes: true
            }
        })

        if(!post){
            return new Response("Something went wrong",{status:401})
        }

        const existingVote = await db.postVote.findFirst({
            where:{
                postId,
                userId
            }
        })

        if(existingVote){
            if(vote === existingVote.type){
                await db.postVote.delete({
                    where:{
                        userId_postId:{
                            userId,
                            postId
                        }
                    }
                })
            }else{
                await db.postVote.update({
                    where:{
                        userId_postId:{
                            userId,
                            postId
                        }
                    },
                    data:{
                        type: vote,
                    }
                })
            }
        }

       if(!existingVote){
        await db.postVote.create({
            data:{
                userId,
                postId,
                type: vote
            }
        })
       } 

       const votesAmt = await post.likes.reduce((acc,vote) => {
        if(vote.type=== "UP") return acc + 1
        if(vote.type === "DOWN") return acc -1
        return acc
       },0)

       const data = {
        postId,
        userId,
        currentVote : vote,
        votesAmt 
       }

       return new Response("Ok")
    }catch(error){
        if(error instanceof ZodError){
            return new Response("Error in the payload",{status:422})
        }

        return new Response("Internal server error",{status:500})
    }
}