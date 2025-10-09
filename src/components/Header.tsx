import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import NavItems from './NavItems'
import DropDown from './DropDown'

const Header = () => {
  return (
    <header className='sticky top-0 z-50 bg-gray-900 shadow-md'>
        <div className="container header-wrapper">
            <Link href="/">
                <Image src="/assets/images/logo.png" alt="logo" width={100} height={100} />
            </Link>
            <NavItems />
            <DropDown />
        </div>
    </header>
  )
}

export default Header
