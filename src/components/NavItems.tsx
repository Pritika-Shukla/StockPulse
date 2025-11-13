"use client";
import React, { useState } from "react";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { SearchModal } from "./SearchCommands";

const NavItems = () => {
    const pathname = usePathname();
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const isActive = (href: string) => pathname === href;
    
    const handleSearchClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsSearchModalOpen(true);
    };

  return (
    <>
      <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-6 font-semibold text-white">
        {NAV_ITEMS.map((item) => {
          // Check if this is the search item
          const isSearchItem = item.href === '/search' || item.label.toLowerCase() === 'search';
          
          return (
            <li key={item.href}>
              {isSearchItem ? (
                <button
                  onClick={handleSearchClick}
                  className={`hover:text-yellow-500 transition-colors duration-300 ${isActive(item.href) ? 'text-yellow-500' : ''}`}
                >
                  {item.label}
                </button>
              ) : (
                <Link 
                  className={`hover:text-yellow-500 transition-colors duration-300 ${isActive(item.href) ? 'text-yellow-500' : ''}`} 
                  href={item.href}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
      <SearchModal isOpen={isSearchModalOpen} onOpenChange={setIsSearchModalOpen} />
    </>
  );
};

export default NavItems;
