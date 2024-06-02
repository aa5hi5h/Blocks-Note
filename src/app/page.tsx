import Image from "next/image";
import { db } from "./lib/db";
import { notFound } from "next/navigation";
import PostFeed from "@/Components/PostFeed";

export default async function Home() {

  const post = await db.post.findMany({})

  if(!post){
    return notFound()
  }
  return (
    <div className="p-3">
      <div className="max-w-3xl mx-auto h-full w-full ">
        <div className="h-fit gap-2">
          {post.map((items,index) => (
            <PostFeed key={index} post={items} />
          ))}
        </div>
      </div>
    </div>
  );
}
