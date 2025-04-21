"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Loading skeleton component for prompts grid
export const LoadingGrid = () => {
  // Create an array of 6 items to simulate cards loading
  const skeletons = Array(6).fill(null);

  return (
    <>
      {/* Keep the same header layout but disable the button */}
      <div className="mb-6 flex justify-end">
        <Button
          disabled
          className="gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Prompt
        </Button>
      </div>

      {/* Grid of skeleton cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletons.map((_, index) => (
          <div 
            key={index} 
            className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 animate-pulse"
          >
            {/* Skeleton for title */}
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            
            {/* Skeleton for description */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
            
            {/* Skeleton for content */}
            <div className="flex-1 space-y-2 mb-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
            
            {/* Skeleton for actions */}
            <div className="flex justify-end space-x-2 mt-2">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
