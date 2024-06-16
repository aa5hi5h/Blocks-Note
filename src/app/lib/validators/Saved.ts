import { z } from "zod";


export const PostSavedValidator = z.object({
    postId : z.string()
})

export type PostSavedRequest = z.infer<typeof PostSavedValidator>