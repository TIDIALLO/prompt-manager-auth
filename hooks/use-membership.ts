"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

// Define membership status types
export type MembershipStatus = "free" | "pro";

export const useMembership = () => {
  const { user, isLoaded } = useUser();
  const [status, setStatus] = useState<MembershipStatus>("free");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMembership = async () => {
      if (!isLoaded || !user) {
        setStatus("free");
        setIsLoading(false);
        return;
      }

      try {
        // In a real app, this would fetch the subscription status from your API
        // For now, we'll just set it to "free" as a placeholder
        setStatus("free");
      } catch (error) {
        console.error("Failed to fetch membership status:", error);
        setStatus("free");
      } finally {
        setIsLoading(false);
      }
    };

    checkMembership();
  }, [user, isLoaded]);

  return {
    status,
    isLoading,
    isPro: status === "pro",
  };
}; 