import { z } from "zod";


export const CommentDataValidators = z.object({
    message: z.string()
    .min(1,{message:"Comment must be 1 characters long"})
    .max(512,{message:"Comment must not exceeds"}),
    postId : z.string(),
    replytoId: z.string().optional()
})

export type CommentPayloadCreation = z.infer<typeof CommentDataValidators>

//update comment payload
export const CommentUpdateDataValidators = z.object({
    message:z.string()
    .min(1,{message:"Comment must be 1 characters long "})
    .max(512,{message:"Comment must not exceeds the 512 character word limit"}),
    postId: z.string(),
    replytoId: z.string().optional(),
    commentId: z.string()
})

export type CommentUpdatePayload = z.infer<typeof CommentUpdateDataValidators>

//delete comment 
export const CommentDeleteDataValidators = z.object({
    postId: z.string(),
    replytoId: z.string().optional(),
    commentId: z.string()
})

export type CommentDeletePayload = z.infer<typeof CommentDeleteDataValidators>