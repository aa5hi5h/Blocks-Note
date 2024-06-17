import { db } from "@/app/lib/db"


export async function GET(request:Request){

    const url = new URL(request.url)
    const query = url.searchParams.get("q")

    if(!query){
        return new Response("Invalid Query",{status:400})
    }

    const results = await db.post.findMany({
        where:{
            title:{
                startsWith: query
            }
        },
        include:{
            _count: true
        },
        take: 5
    })

    return new Response(JSON.stringify(results))
}