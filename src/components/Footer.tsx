import React from 'react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black border-t border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm">
            © {currentYear} StockPulse. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-orange-500 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-orange-500 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-orange-500 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

