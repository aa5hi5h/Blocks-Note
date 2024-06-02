import { PostDataValidators } from "@/app/lib/validators/Post"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { db } from "../../lib/db"


export async function POST(request:Request){
    try{

        const {userId} = auth()

        if(!userId){
            return new Response("Unauthorized",{status:400})
        }

        const body = await request.json()
        console.log(body)
        const {title,description,image} =  PostDataValidators.parse(body)

        const post = await db.post.create({
            data:{
                title,
                description,
                image,
                userId
            }
        })

        return new Response(JSON.stringify(post))

    }catch(error){
        if(error instanceof z.ZodError){
            return new Response("There was some error in the payload you send it",{status:422}) 
        }

        console.log("ERROR", error)
        return new Response("Internla server error",{status:500})
    }
}