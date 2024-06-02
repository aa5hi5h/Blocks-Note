

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="max-w-2xl mx-auto">
        <SignIn />
    </div>
  )
}