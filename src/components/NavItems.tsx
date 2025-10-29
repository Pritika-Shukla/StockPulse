"use client";
import React from "react";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";
import { usePathname } from "next/navigation";

const NavItems = () => {
    const pathname = usePathname();
    const isActive = (href: string) => pathname === href;
  return (
    <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-6 font-semibold text-white">
      {NAV_ITEMS.map((item) => {
        return (
          <li key={item.href}>
            <Link 
              className={`hover:text-yellow-500 transition-colors duration-300 ${isActive(item.href) ? 'text-yellow-500' : ''}`} 
              href={item.href}
            >
              {item.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
