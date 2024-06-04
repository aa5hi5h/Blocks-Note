import  z  from "zod";


export const PostDataValidators = z.object({
    title:z.string()
    .min(3,{message:"Title must be 3 characters long"})
    .max(256,{message:"Title must not exceed the word limit of 256 characters"}),
    description: z.string(),
    image: z.string().optional(),
})

export type PostCreationPayload = z.infer<typeof PostDataValidators>