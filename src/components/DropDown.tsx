"use client";

import { ClerkProvider,SignInButton } from "@clerk/nextjs";

const DropDown = () => {
  return(
    <div className="flex items-center justify-center border-2 border-red-500">
      <ClerkProvider>
      <SignInButton/>
      </ClerkProvider>
 
     
    </div>
  )
  
};

export default DropDown;
