import Image from "next/image";
import { db } from "./lib/db";
import { notFound } from "next/navigation";
import PostFeed from "@/Components/PostFeed";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {

  const post = await db.post.findMany({
    include:{
      likes: true,
      saved: true
    }
  })

  if(!post){
    return notFound()
  }

  const {userId} = auth()


  return (
    <div className="p-3">
      <div className="max-w-3xl mx-auto h-full w-full ">
        <div className="h-fit gap-2">
          {post.map((items,index) => {

            const votesAmount = items.likes.reduce((acc,vote) => {
              if(vote.type === "UP") return acc + 1
              if(vote.type === "DOWN") return acc - 1
              return acc
            },0)

            const currentVote = items.likes.find((vote) => vote.userId === userId )

            const isSaved = items.saved.find((saved) => saved.userId === userId)

            return ( <PostFeed  key={index} post={items} initialVoteAmt={votesAmount} currentVote={currentVote?.type} isSaved={isSaved }  /> )
})}
        </div>
      </div>
    </div>
  );
}
