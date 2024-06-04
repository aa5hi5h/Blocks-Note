import CreatePostForm from "@/Components/TitleForm"
import UpdatePostForm from "@/Components/UpdatePostForm"
import { db } from "@/app/lib/db"
import { notFound } from "next/navigation"


const page = async({params}:{params:{id:string}}) => {

    const {id} = params

    const post = await db.post.findUnique({
        where:{
            id
        }
    })

    if(!post) return notFound

    return (
        <div className="p-3">
            <div className="max-w-xl ml-[240px] h-full  mx-auto">
                <div className="h-fit w-full">
                    <UpdatePostForm post={post} />
                </div>
                
            </div>
        </div>
    )
}

export default page