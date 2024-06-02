import { Bookmark } from "lucide-react"


const Saved = () => {
    return (
        <div className="flex gap-x-2 p-2 hover:opacity-70 hover:cursor-pointer">
            <Bookmark />
            Saved
        </div>
    )
}

export default Saved