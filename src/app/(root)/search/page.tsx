"use client"

import { SearchModal } from '@/components/SearchCommands';
import { useState, useEffect } from 'react';

export default function SearchPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    // Open search modal when page loads
    setIsSearchOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <SearchModal isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </div>
  );
}

