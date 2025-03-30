"use client";

import { useState } from "react";
import { useMemoStore } from "@/store/memoStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MemoFilter() {
  const [searchInput, setSearchInput] = useState("");
  const {
    setSearchQuery,
    setSelectedCategory,
    setSelectedTags,
    getAllCategories,
    getAllTags,
  } = useMemoStore();

  const categories = getAllCategories();
  const tags = getAllTags();

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="메모 검색..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch}>검색</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => setSelectedCategory(null)}
          className={
            !useMemoStore.getState().selectedCategory
              ? "bg-primary text-primary-foreground"
              : ""
          }
        >
          전체
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            onClick={() => setSelectedCategory(category)}
            className={
              useMemoStore.getState().selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : ""
            }
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Button
            key={tag}
            variant="outline"
            size="sm"
            onClick={() => {
              const currentTags = useMemoStore.getState().selectedTags;
              const newTags = currentTags.includes(tag)
                ? currentTags.filter((t) => t !== tag)
                : [...currentTags, tag];
              setSelectedTags(newTags);
            }}
            className={
              useMemoStore.getState().selectedTags.includes(tag)
                ? "bg-primary text-primary-foreground"
                : ""
            }
          >
            #{tag}
          </Button>
        ))}
      </div>
    </div>
  );
}
