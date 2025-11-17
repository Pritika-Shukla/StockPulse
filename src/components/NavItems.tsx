"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, X, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { NAV_ITEMS } from "@/lib/constants"

export function NavItems() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("")
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const lastScrollY = useRef(0)
  const pathname = usePathname()

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasLoaded(true)
    }, 100)

    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY

        // Only hide/show after scrolling past 50px to avoid flickering at top
        if (currentScrollY > 50) {
          if (currentScrollY > lastScrollY.current && currentScrollY - lastScrollY.current > 5) {
            // Scrolling down - hide navbar
            setIsVisible(false)
          } else if (lastScrollY.current - currentScrollY > 5) {
            // Scrolling up - show navbar
            setIsVisible(true)
          }
        } else {
          // Always show navbar when near top
          setIsVisible(true)
        }

        lastScrollY.current = currentScrollY
      }
    }

    const updateActiveSection = () => {
      if (typeof window !== "undefined") {
        const sections = NAV_ITEMS.filter(item => !item.href.startsWith("/"))
        const scrollPosition = window.scrollY + 150

        for (let i = sections.length - 1; i >= 0; i--) {
          const element = document.querySelector(sections[i].href)
          if (element) {
            const rect = element.getBoundingClientRect()
            const elementTop = rect.top + window.scrollY
            if (scrollPosition >= elementTop) {
              setActiveSection(sections[i].href)
              break
            }
          }
        }
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar, { passive: true })
      window.addEventListener("scroll", updateActiveSection, { passive: true })
      updateActiveSection() // Initial check

      return () => {
        window.removeEventListener("scroll", controlNavbar)
        window.removeEventListener("scroll", updateActiveSection)
        clearTimeout(timer)
      }
    }

    return () => clearTimeout(timer)
  }, []) // Removed lastScrollY dependency to prevent infinite re-renders

  const scrollToSection = (href: string) => {
    if (href.startsWith("/")) {
      return
    }

    const element = document.querySelector(href)
    if (element) {
      const rect = element.getBoundingClientRect()
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop
      const elementAbsoluteTop = rect.top + currentScrollY
      const navbarHeight = 100
      const targetPosition = Math.max(0, elementAbsoluteTop - navbarHeight)

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
    setIsOpen(false)
  }

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown)
      return () => {
        window.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [isOpen])

  return (
    <>
      <nav
        className={`fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-[60] transition-all duration-500 ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-20 md:-translate-y-24 opacity-0"
        } ${hasLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        style={{
          transition: hasLoaded ? "all 0.5s ease-out" : "opacity 0.8s ease-out, transform 0.8s ease-out",
        }}
      >
        {/* Main Navigation */}
        <div className="w-[90vw] max-w-xs md:max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-3 md:px-6 md:py-2">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent rounded-lg p-1"
                aria-label="StockPulse Home"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                  <Image
                    src="/assets/icons/logo.png"
                    alt="StockPulse"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {NAV_ITEMS.map((item) => {
                  const isActive = item.href.startsWith("/") 
                    ? pathname === item.href 
                    : activeSection === item.href
                  const isHovered = hoveredItem === item.label
                  
                  return item.href.startsWith("/") ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      onMouseEnter={() => setHoveredItem(item.label)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onFocus={() => setHoveredItem(item.label)}
                      onBlur={() => setHoveredItem(null)}
                      className={`relative text-white/80 hover:text-white transition-all duration-300 font-medium cursor-pointer group ${
                        isActive ? "text-white" : ""
                      }`}
                    >
                      <span className="relative z-10">{item.label}</span>
                      {/* Active indicator */}
                      {isActive && (
                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full animate-pulse" />
                      )}
                      {/* Hover indicator */}
                      <span 
                        className={`absolute -bottom-1 left-0 h-0.5 bg-white/60 rounded-full transition-all duration-300 ${
                          isHovered ? "right-0" : "right-full"
                        }`}
                      />
                    </Link>
                  ) : (
                    <button
                      key={item.label}
                      onClick={() => scrollToSection(item.href)}
                      onMouseEnter={() => setHoveredItem(item.label)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onFocus={() => setHoveredItem(item.label)}
                      onBlur={() => setHoveredItem(null)}
                      className={`relative text-white/80 hover:text-white transition-all duration-300 font-medium cursor-pointer group focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent rounded px-2 py-1 ${
                        isActive ? "text-white" : ""
                      }`}
                    >
                      <span className="relative z-10">{item.label}</span>
                      {/* Active indicator */}
                      {isActive && (
                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full animate-pulse" />
                      )}
                      {/* Hover indicator */}
                      <span 
                        className={`absolute -bottom-1 left-0 h-0.5 bg-white/60 rounded-full transition-all duration-300 ${
                          isHovered ? "right-0" : "right-full"
                        }`}
                      />
                    </button>
                  )
                })}
              </div>

              {/* Desktop CTA Button */}
              <div className="hidden md:block">
                <button
                  className="relative bg-white hover:bg-gray-50 text-black font-medium px-6 py-2 rounded-full flex items-center transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent active:scale-95"
                  onClick={() => scrollToSection("#contact")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      scrollToSection("#contact")
                    }
                  }}
                >
                  <span className="mr-2">Get Started</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    setIsOpen(!isOpen)
                  }
                }}
                className="md:hidden text-white hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent rounded p-1"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                <div className="relative w-6 h-6">
                  <Menu
                    size={24}
                    className={`absolute inset-0 transition-all duration-300 ${
                      isOpen ? "opacity-0 rotate-180 scale-75" : "opacity-100 rotate-0 scale-100"
                    }`}
                  />
                  <X
                    size={24}
                    className={`absolute inset-0 transition-all duration-300 ${
                      isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-75"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="md:hidden relative">
          {/* Backdrop overlay */}
          <div
            className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300 cursor-pointer ${
              isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsOpen(false)}
            style={{ top: "0", left: "0", right: "0", bottom: "0", zIndex: -1 }}
          />

          {/* Menu container */}
          <div
            className={`mt-2 w-[90vw] max-w-xs mx-auto transition-all duration-500 ease-out transform-gpu ${
              isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-8 scale-95 pointer-events-none"
            }`}
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl">
              <div className="flex flex-col space-y-1">
                {NAV_ITEMS.map((item, index) => {
                  const isActive = item.href.startsWith("/") 
                    ? pathname === item.href 
                    : activeSection === item.href
                  const isHovered = hoveredItem === item.label
                  
                  return item.href.startsWith("/") ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      onMouseEnter={() => setHoveredItem(item.label)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onFocus={() => setHoveredItem(item.label)}
                      onBlur={() => setHoveredItem(null)}
                      className={`relative text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-3 py-3 text-left transition-all duration-300 font-medium cursor-pointer transform hover:scale-[1.02] hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent active:scale-[0.98] ${
                        isOpen ? "animate-mobile-menu-item" : ""
                      } ${isActive ? "text-white bg-white/5" : ""}`}
                      style={{
                        animationDelay: isOpen ? `${index * 80 + 100}ms` : "0ms",
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="relative z-10 flex items-center">
                        {item.label}
                        {isActive && (
                          <span className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse" />
                        )}
                      </span>
                      {isHovered && (
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-white/60 rounded-l-lg transition-all duration-300" />
                      )}
                    </Link>
                  ) : (
                    <button
                      key={item.label}
                      onClick={() => scrollToSection(item.href)}
                      onMouseEnter={() => setHoveredItem(item.label)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onFocus={() => setHoveredItem(item.label)}
                      onBlur={() => setHoveredItem(null)}
                      className={`relative text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-3 py-3 text-left transition-all duration-300 font-medium cursor-pointer transform hover:scale-[1.02] hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent active:scale-[0.98] ${
                        isOpen ? "animate-mobile-menu-item" : ""
                      } ${isActive ? "text-white bg-white/5" : ""}`}
                      style={{
                        animationDelay: isOpen ? `${index * 80 + 100}ms` : "0ms",
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          scrollToSection(item.href)
                        }
                      }}
                    >
                      <span className="relative z-10 flex items-center">
                        {item.label}
                        {isActive && (
                          <span className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse" />
                        )}
                      </span>
                      {isHovered && (
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-white/60 rounded-l-lg transition-all duration-300" />
                      )}
                    </button>
                  )
                })}
                <div className="h-px bg-white/10 my-2" />
                <button
                  className={`relative bg-white hover:bg-gray-50 text-black font-medium px-6 py-3 rounded-full flex items-center transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group transform focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent active:scale-95 ${
                    isOpen ? "animate-mobile-menu-item" : ""
                  }`}
                  style={{
                    animationDelay: isOpen ? `${NAV_ITEMS.length * 80 + 150}ms` : "0ms",
                  }}
                  onClick={() => scrollToSection("#contact")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      scrollToSection("#contact")
                    }
                  }}
                >
                  <span className="mr-2">Get Started</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
