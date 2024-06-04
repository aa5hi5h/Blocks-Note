import { db } from "@/app/lib/db";
import { CommentUpdateDataValidators } from "@/app/lib/validators/Comment";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { CommentDataValidators } from "@/app/lib/validators/Comment";
import { CommentDeleteDataValidators } from "@/app/lib/validators/Comment";
export async function POST(request:Request){
try{
    const {userId} = auth()

    if(!userId){
        return new Response("UnAuthorized",{status:400})
    }

    const body = await request.json()
    const {message,postId,replytoId} = CommentDataValidators.parse(body)

    const comment = await db.comment.create({
        data:{
            message,
            postId,
            replytoId,
            userId
        }
    })
    return new Response("Comment Created")
}catch(error){
    if(error instanceof z.ZodError){
       return new Response("Error in the payload",{status:422})
    }

    return new Response("Internal server Error",{status : 500})
}
}

export async function PATCH(request:Request){
    try{
        const {userId} = auth()

        if(!userId){
            return new Response("Unauthorized",{status:400})
        }

        const body = await request.json()

        const {message,replytoId,postId,commentId} = CommentUpdateDataValidators.parse(body)

        const post = await db.comment.update({
            where:{
                id:commentId,
                userId,
                postId,
                replytoId 
            },data:{
                message
            }
        })
        return new Response("Comment Edited")

    }catch(error){
        if(error instanceof z.ZodError){
            return new Response("Error in the payload",{status:422})
        }
        return new Response("Internal server error",{status:500})
    }
}


export async function DELETE(request:Request){
    try{

        const {userId} = auth()
        if(!userId){
            return new Response("Unauthorized",{status:400})
        } 
        const body = await request.json()
        const {commentId,postId,replytoId} = CommentDeleteDataValidators.parse(body)

        const replies = await db.comment.findMany({
            where:{
                replytoId:commentId
            }
        })

        for(const reply of replies){
            await db.comment.delete({
                where:{
                    id:reply.id
                }
            })
        }

        const comment = await db.comment.delete({
            where:{
                id:commentId,
                postId,
                replytoId,
                userId
            }
        })
        return new Response("Comment Deleted")
    }catch(error){
        return new Response("Internal server error",{status:500})
    }
}