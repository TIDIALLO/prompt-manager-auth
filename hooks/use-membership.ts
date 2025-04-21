 // hooks/use-membership.ts
"use client"; // Custom hooks used in Client Components also need this

import { getCustomerByUserIdAction } from "@/actions/customers-actions";
import { useAuth } from "@clerk/nextjs"; // Hook to get current user ID
import { useEffect, useState } from "react";

// Define the possible membership statuses
export type MembershipStatus = "free" | "pro";

/**
 * Custom hook to fetch and manage the current user's membership status.
 *
 * @returns An object containing:
 *  - membership: The current status ('free' or 'pro').
 *  - loading: Boolean indicating if the status is being fetched.
 *  - isPro: Convenience boolean, true if membership is 'pro'.
 */
export const useMembership = () => {
  const { userId } = useAuth(); // Get Clerk user ID

  // State to store the membership status and loading indicator
  const [membership, setMembership] = useState<MembershipStatus>("free");
  const [loading, setLoading] = useState(true); // Start loading initially

  useEffect(() => {
    // Define the async function to fetch status
    const fetchMembership = async () => {
      setLoading(true); // Set loading true when starting fetch
      if (!userId) {
        // If no user is logged in, they are implicitly 'free'
        setMembership("free");
        setLoading(false);
        return;
      }

      try {
        // Call the server action to get customer data from DB
        const customerResult = await getCustomerByUserIdAction(userId);
        // Customer action returns an array, check if it's non-empty and has membership
        const currentMembership = customerResult[0]?.membership || "free";
        setMembership(currentMembership);
      } catch (error) {
        console.error("Error fetching membership status:", error);
        // Default to 'free' on error
        setMembership("free");
      } finally {
        // Always set loading to false after fetch attempt completes
        setLoading(false);
      }
    };

    fetchMembership(); // Execute the fetch function

  }, [userId]); // Re-run the effect if the userId changes (login/logout)

  // Return the status, loading state, and isPro helper boolean
  return {
    membership,
    loading,
    isPro: membership === "pro",
  };
};