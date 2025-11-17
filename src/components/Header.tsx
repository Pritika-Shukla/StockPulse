import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import NavItems from './NavItems'
import DropDown from './DropDown'

interface HeaderProps {
  showAuth?: boolean;
}

const Header = ({ showAuth = true }: HeaderProps) => {
  return (
    <header className='sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 shadow-lg'>
        <div className="container header-wrapper">
            <Link href="/" className="flex items-center">
                <Image src="/assets/images/logo.png" alt="StockPulse" width={120} height={40} className="h-10 w-auto" />
            </Link>
            
            <div className="hidden md:block">
              <NavItems />
            </div>
            
            <div className="flex items-center gap-4">
              {showAuth && (
                <>
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="yellow-btn px-6 py-2 text-sm font-semibold">
                        Sign In
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8",
                          userButtonPopoverCard: "bg-gray-800 border-gray-700",
                          userButtonPopoverActionButton: "text-gray-300 hover:bg-gray-700",
                          userButtonPopoverActionButtonText: "text-gray-300",
                          userButtonPopoverFooter: "hidden"
                        }
                      }}
                    />
                  </SignedIn>
                </>
              )}
              <div className="md:hidden">
                <DropDown />
              </div>
            </div>
        </div>
    </header>
  )
}

export default Header
