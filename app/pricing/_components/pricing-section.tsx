// app/pricing/_components/pricing-section.tsx
"use client"; // Needed for hooks and event handlers

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; // Assuming Card has Header, Content, Footer exports
import { SignInButton, useAuth } from "@clerk/nextjs"; // Clerk hooks/components
import { Check } from "lucide-react"; // Icon
import Link from "next/link"; // For the "Get Started" button

// Retrieve the payment link from environment variables
const subscriptionLink = process.env.NEXT_PUBLIC_MONTHLY_SUBSCRIPTION_LINK;

export const PricingSection = () => {
  // Get user ID to customize the checkout link and button behavior
  const { userId } = useAuth();

  // Append the Clerk userId to the Stripe Payment Link if available
  // Stripe uses client_reference_id to associate checkout with a user
  const finalSubscriptionLink = userId && subscriptionLink
    ? `${subscriptionLink}?client_reference_id=${userId}`
    : "#"; // Use '#' as a fallback if link/userId missing

  // Helper function to conditionally render the Pro plan button
  const renderProButton = () => {
    // If user is not logged in, show a Sign In button
    if (!userId) {
      return (
        <SignInButton mode="modal">
          <span className="w-full py-2 px-4 bg-white text-primary hover:bg-gray-100 rounded-md font-medium flex justify-center items-center cursor-pointer">
            Sign in to Upgrade
          </span>
        </SignInButton>
      );
    }

    // If user is logged in, show the actual upgrade link
    return (
      <Button asChild variant="secondary" className="w-full bg-white text-primary hover:bg-gray-100">
        {/* Use an anchor tag for external link to Stripe */}
        <a
          href={finalSubscriptionLink}
          // Disable link visually and functionally if URL is missing
          className={finalSubscriptionLink === "#" ? "pointer-events-none opacity-50" : ""}
        >
          Upgrade to Pro
        </a>
      </Button>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
      {/* Free Plan Card */}
      <Card className="p-8 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex flex-col h-full">
          {/* Plan Details */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Perfect for getting started</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">$0</span>
              <span className="text-gray-500 dark:text-gray-400">/month</span>
            </div>
          </div>
          {/* Features List */}
          <div className="flex-grow space-y-4 mb-8 text-gray-700 dark:text-gray-200">
            <div className="flex items-center gap-2"> <Check className="h-5 w-5 text-green-500" /> <span>Up to 3 prompts</span> </div>
            <div className="flex items-center gap-2"> <Check className="h-5 w-5 text-green-500" /> <span>Basic prompt management</span> </div>
            <div className="flex items-center gap-2"> <Check className="h-5 w-5 text-green-500" /> <span>Community support</span> </div>
          </div>
          {/* Action Button */}
          <Button asChild variant="outline" className="w-full">
             {/* Link to sign-up or prompts page if already logged in */}
            <Link href={userId ? "/prompts" : "/sign-up"}>Get Started</Link>
          </Button>
        </div>
      </Card>

      {/* Pro Plan Card */}
      <Card className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl border-none rounded-lg relative overflow-hidden">
         {/* Optional: Add a subtle background pattern or decoration */}
         {/* <div className="absolute inset-0 bg-grid-pattern opacity-10"></div> */}
         <div className="absolute top-0 right-0 m-4 px-3 py-1 text-xs font-semibold uppercase bg-yellow-400 text-blue-900 rounded-full">Most Popular</div>
        <div className="flex flex-col h-full relative z-10">
          {/* Plan Details */}
          <div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-blue-100 mb-6">For power users and creators</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$10</span>
              <span className="text-blue-200">/month</span>
            </div>
          </div>
          {/* Features List */}
          <div className="flex-grow space-y-4 mb-8 text-blue-50">
            <div className="flex items-center gap-2"> <Check className="h-5 w-5" /> <span>Unlimited prompts</span> </div>
            <div className="flex items-center gap-2"> <Check className="h-5 w-5" /> <span>Advanced organization</span> </div>
            <div className="flex items-center gap-2"> <Check className="h-5 w-5" /> <span>Priority support</span> </div>
            <div className="flex items-center gap-2"> <Check className="h-5 w-5" /> <span>Early access to new features</span> </div>
          </div>
          {/* Action Button (conditionally rendered) */}
          {renderProButton()}
        </div>
      </Card>
    </div>
  );
};