import { db } from "@/app/lib/db";
import { CommentDataValidators } from "@/app/lib/validators/Comment";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";


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
