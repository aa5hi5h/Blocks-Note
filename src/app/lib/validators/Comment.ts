import { z } from "zod";


export const CommentDataValidators = z.object({
    message: z.string()
    .min(3,{message:"Comment must be 3 characters long"})
    .max(512,{message:"Comment must not exceeds"}),
    postId : z.string(),
    replytoId: z.string().optional()
})

export type CommentPayloadCreation = z.infer<typeof CommentDataValidators>