import { BookMarked, Bookmark, Heart, MessageSquareMore } from "lucide-react"
import Saved from "./Saved"


const PostMenu = () => {
    return (
        <div className="p-2">
            <div className="flex flex-col items-center pt-4 space-y-8">
                        <Heart />
                    <Bookmark />
            </div>
        </div>
    )
}
export default  PostMenu