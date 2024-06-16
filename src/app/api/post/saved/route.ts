import { db } from "@/app/lib/db";
import { PostSavedValidator } from "@/app/lib/validators/Saved";
import { auth } from "@clerk/nextjs/server";
import { AxiosError } from "axios";
import { ZodError } from "zod";



export async function PATCH(request:Request){

    try{

        const {userId} = auth()

        if(!userId){
            return new Response("Unauthorized",{status:400})
        }

        const body = await request.json()
        const {postId} = PostSavedValidator.parse(body)

        const existingPost = await db.post.findFirst({
            where:{
                id: postId
            }
        })

        if(!existingPost){
            return new Response("Post doesnot exist",{status:401})
        }

        const alreadySaved = await db.saved.findFirst({
            where:{
                postId,
                userId,
                saved: true
            }
        })

        if(alreadySaved){
            await db.saved.upsert({
                where:{
                    userId_postId:{
                        userId,
                        postId
                    }
                },
                update:{
                    saved: false
                },
                create:{
                    userId,
                    postId,
                    saved: false
                }
            })
        }else{
           await db.saved.upsert({
            where:{
                userId_postId:{
                    userId,
                    postId
                }
            },
            update:{
                saved: true
            },
            create:{
                postId,
                userId,
                saved:true
            }
           })
        }

        return new Response("OK")

    }catch(error){
        if(error instanceof ZodError){
            return new Response("Error in the Payload",{status:422})
        }

        console.log("EROOOOOOOOOOOOOOOOOOOOOOOOOOOOO",error)
        return new Response("Internal server error",{status:500})
    }
}