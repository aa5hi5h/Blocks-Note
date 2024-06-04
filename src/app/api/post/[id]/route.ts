import { db } from "@/app/lib/db";
import { PostDataValidators } from "@/app/lib/validators/Post";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";


export async function  PATCH(request:Request,{params}:{params:{id:string}}) {
    try{

        const {userId} = auth()

        const {id} = params

       const body = await request.json()

       const {title,description,image} = PostDataValidators.parse(body)

        if(!userId){
            return new Response("unAuthorized",{status:400})
        }

        const post = await db.post.update({
            where:{
                id,
                userId
            },
            data:{
                title,
                description,
                image
            }
        })
        return new Response("Post edited",{status:200})
    }catch(error){
        if( error instanceof z.ZodError){
           return new Response("There is some error in the payload user is sending",{status:422})
        }
        return new Response("Internal server error",{status:500})
    }
    
}

export async function GET(request:Request,{params}:{params:{id:string}}){
    try{
        const {id} = params

        const post = await db.post.findFirst({
            where:{
                id
            }
        })

        return new Response(JSON.stringify(post))
    }catch(erorr){
        return new Response("Internal server Error",{status:500})
    }
}

export async function DELETE(request:Request,{params}:{params:{id:string}}){
    try{
        const {userId} = auth()

        const {id} = params

        if(!userId){
            return new Response("UnAuthorized",{status:400})
        }

        const post = await db.post.delete({
            where:{
                id,
                userId
            }
        })

        return new Response("Post deleted",{status:200})

    }catch(error){
        return new Response("Internal server error",{status:500})
    }
}