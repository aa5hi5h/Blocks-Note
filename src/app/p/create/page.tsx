import CreatePostForm from "@/Components/TitleForm"
import { Clapperboard } from "lucide-react"


const page = () => {
    return (
        <div className="p-3">
            <div className="max-w-xl ml-[240px] h-full  mx-auto">
                <div className="h-fit w-full">
                    <CreatePostForm />
                </div>
                
            </div>
        </div>
    )
}

export default page