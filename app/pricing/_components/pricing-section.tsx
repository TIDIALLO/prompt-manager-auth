"use client";

import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMembership } from "@/hooks/use-membership";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";

export const PricingSection = () => {
  const { membership } = useMembership();
  
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Free Plan */}
      <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Free
        </h3>
        
        <div className="mt-4 flex items-baseline text-gray-900 dark:text-white">
          <span className="text-4xl font-extrabold tracking-tight">
            $0
          </span>
          <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">
            /month
          </span>
        </div>
        
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Perfect for getting started with prompt management
        </p>
        
        <ul className="mt-6 space-y-3 flex-1">
          <li className="flex">
            <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" />
            <span className="ml-3 text-gray-500 dark:text-gray-400">
              Up to 10 prompts
            </span>
          </li>
          <li className="flex">
            <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" />
            <span className="ml-3 text-gray-500 dark:text-gray-400">
              Basic folder organization
            </span>
          </li>
          <li className="flex">
            <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" />
            <span className="ml-3 text-gray-500 dark:text-gray-400">
              Single user access
            </span>
          </li>
        </ul>
        
        <div className="mt-8">
          <Button asChild className="w-full">
            <Link href="/prompts">Current Plan</Link>
          </Button>
        </div>
      </div>

      {/* Pro Plan */}
      <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Pro
        </h3>
        
        <div className="mt-4 flex items-baseline text-gray-900 dark:text-white">
          <span className="text-4xl font-extrabold tracking-tight">
            $9.99
          </span>
          <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">
            /month
          </span>
        </div>
        
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          For power users who need more flexibility
        </p>
        
        <ul className="mt-6 space-y-3 flex-1">
          <li className="flex">
            <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" />
            <span className="ml-3 text-gray-500 dark:text-gray-400">
              Unlimited prompts
            </span>
          </li>
          <li className="flex">
            <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" />
            <span className="ml-3 text-gray-500 dark:text-gray-400">
              Advanced folder organization
            </span>
          </li>
          <li className="flex">
            <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" />
            <span className="ml-3 text-gray-500 dark:text-gray-400">
              Priority support
            </span>
          </li>
        </ul>
        
        <div className="mt-8">
          {membership === "pro" ? (
            <Button disabled className="w-full">
              Current Plan
            </Button>
          ) : (
            <SignInButton mode="modal">
              <span className="w-full py-2 px-4 bg-blue-500 text-white hover:bg-blue-600 rounded-md font-medium flex justify-center items-center cursor-pointer">
                Upgrade to Pro
              </span>
            </SignInButton>
          )}
        </div>
      </div>
    </div>
  );
};