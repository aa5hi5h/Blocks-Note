"use client"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import  TextareaAutoSize from "react-textarea-autosize"
import { Button } from "./ui/button"
import { PostCreationPayload, PostDataValidators } from "@/app/lib/validators/Post"
import {zodResolver} from "@hookform/resolvers/zod"
import { UploadButton } from "@/utils/uploadthing"
import { useToast } from "./ui/use-toast"
import { useState } from "react"
import { OurFileRouter } from "@/app/api/uploadthing/core"
import Image from "next/image"
import { UploadDropzone } from "@/utils/uploadthing"
import {useMutation} from "@tanstack/react-query"
import axios from "axios"
import { error } from "console"
import { useRouter } from "next/navigation"



const CreatePostForm = () => {

    const [imageUrl,setImageUrl] = useState<string | undefined>(undefined)
    
    const router = useRouter()
    const {toast} = useToast()


    const form = useForm<PostCreationPayload>({
        resolver: zodResolver(PostDataValidators),
        defaultValues:{
            title: "",
            description: "",
            image:""
        }
    })


    const OnSubmit = (values: PostCreationPayload ) => {
        console.log(imageUrl)
        const payload: PostCreationPayload = {
            title: values.title,
            description: values.description,
            image: imageUrl 
        }
        console.log(payload)
        CreatePost(payload)
    }


    const {mutate:CreatePost} = useMutation({
        mutationFn: async({title,description,image}:PostCreationPayload) => {
            const payload: PostCreationPayload = {title,description,image}
            const {data} = await axios.post("/api/post",payload)
            return data;
        },
        onError: (error:Error) => {
            console.log(error)
            return toast({
                variant:"destructive",
                title:'Error in the file upload'
            })
        },
        onSuccess:(data) => {
            router.push("/")
            router.refresh()
            return toast({
                title:"Blog Uploaded"
            })
        }
    })
    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-4">
                <FormField 
                control={form.control}
                name="title"
                render={({field}) => (
                    <FormItem>
                        <FormLabel className="text-2xl">Title</FormLabel>
                        <FormControl>
                            <Input className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                            placeholder="e.g. Top 10 hackathon to join in 2024" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                ) } />
                <FormField name="description" control={form.control}
                render={({field}) => (
                    <FormItem>
                    <FormLabel className="text-2xl ">Description</FormLabel>
                    <FormControl>
                        <TextareaAutoSize className="w-full p-2 resize-none appearance-none"
                         placeholder="Type here to add description" {...field} minRows={7}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )} />
                <FormField name="image" 
                control={form.control}
                render={({field}) => (
                    <FormItem>
                        <FormLabel className="text-2xl">Image</FormLabel>
                        <FormControl>
                           {imageUrl ? (
                            <div className=" relative max-w-[400px] max-h-[400px] min-h-[200px] mt-4">
                            <Image fill src={imageUrl} className="object-contain"  alt="Blog Image" />
                            </div>
                           ) : (
                            <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res:any) => {
                                console.log("files:",res)
                                toast({
                                    title:"Image Uploaded"
                                })
                                setImageUrl(res[0].url)
                            }}
                            {...field}
                            onUploadError={(error: string) => {
                                toast({
                                    variant:"destructive",
                                    title:"Error"
                                })
                                return console.log(error)
                            }}  />
                           )}
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button type="submit">Post</Button>
                
                </form>
            </Form>
        </div>
    )
}

export default CreatePostForm