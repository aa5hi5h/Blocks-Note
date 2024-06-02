import { db } from "@/app/lib/db"


export async function GET(request:Request){
    try{

        const post = await db.post.findMany({
            orderBy:{
                createdAt:"desc"
            }
        })

        return new Response(JSON.stringify(post))

    }catch(error){
        return new Response("Internal server error",{status:500})
    }
}