"use client";

import { Input } from "@/components/ui/input";
import { useMemoStore } from "@/store/memoStore";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

export function MemoSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const setSearchQuery = useMemoStore((state) => state.setSearchQuery);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    setSearchQuery(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchQuery]);

  return (
    <div className="relative">
      <Input
        type="search"
        placeholder="메모 검색..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10"
      />
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}
