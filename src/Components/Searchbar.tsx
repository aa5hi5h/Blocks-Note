"use client"
import { useQuery } from "@tanstack/react-query"
import { Command, CommandEmpty,CommandGroup,CommandInput,CommandItem,CommandList } from "./ui/command"
import { useCallback, useState } from "react"
import axios from "axios"
import { Post, Prisma } from "@prisma/client"
import { FileLineChart, Satellite } from "lucide-react"
import { useRouter } from "next/navigation"
import debounce from 'lodash.debounce'

const SearchBar = () => {

    const [input ,setInput] = useState<string>("")
    const  router = useRouter()

    const {data:SerachResponse,refetch,isFetched,isFetching} = useQuery({
        queryFn: async() => {
            if(!input) return []

            const {data} = await axios.get(`/api/search?q=${input}`)
            return data as (Post & {
                _count: Prisma.PostCountOutputType
            })[]
        },
        queryKey: ["Search-query"],
        enabled: false
    })

    const request = debounce(() => {
         refetch()
    },300)

    const debounceRequest = useCallback(() => {
        request()
    },[])
    return (
        <Command className="relative rounded-lg border max-w-xl z-50 overflow-visible">
            <CommandInput placeholder="Type here to search...."
             className="border-none focus:border-none outline-none focus:outline-none ring-0 "
             value={input}
             onValueChange={(query) => { 
                setInput(query)
                debounceRequest()
             }}
              />
              {isFetched && <CommandEmpty>No such posts found.</CommandEmpty>}
            {
                input.length > 0 ? (
                    <CommandList className="absolute bg-white top-full mt-1 inset-x-0 shadow rounded-md" >
                        {(SerachResponse?.length ?? 0 ) > 0 ? (
                            <CommandGroup heading="Posts">
                                {SerachResponse?.map((item) => (
                <CommandItem
                onSelect={() => { 
                    router.push(`/p/post/${item.id}`)
                    router.refresh()
                }
                }
                  key={item.id}
                  value={item.title}>
                  <Satellite className='mr-2 h-6 w-6' />
                  {item.title}
                </CommandItem>
              ))}
                            </CommandGroup>
                        ) : null }
                    </CommandList>
                 ): null
            }
        </Command>
    )
}

export default SearchBar