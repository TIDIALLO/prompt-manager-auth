// components/header.tsx
"use client";

import { useMembership } from "@/hooks/use-membership"; // Import the custom hook
import { SignedIn, SignedOut, SignInButton, useAuth, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion"; // Import motion
import { BookMarked } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

// Get the subscription link from env
const subscriptionLink = process.env.NEXT_PUBLIC_MONTHLY_SUBSCRIPTION_LINK;

export const Header = () => {
  const pathname = usePathname();
  const { isPro, loading } = useMembership(); // Call the custom hook
  const { userId } = useAuth(); // Get userId for the checkout link

  const finalSubscriptionLink = userId && subscriptionLink ? `${subscriptionLink}?client_reference_id=${userId}` : "#";

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Pricing", href: "/pricing" },
    { name: "Prompts", href: "/prompts" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section (remains the same) */}
          <motion.div /* ... */ >
            <BookMarked className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Prompt Manager</span>
          </motion.div>

          {/* Navigation & Auth Section */}
          <nav className="flex items-center gap-6">
            {/* Render nav items */}
            {navItems.map((item) => (
              <motion.div key={item.href}>
                <Link 
                  href={item.href} 
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}

            {/* --- Signed In State --- */}
            <SignedIn>
              <div className="flex items-center gap-3"> {/* Increased gap slightly */}
                {/* Conditionally render PRO badge or Upgrade button */}
                {!loading && ( // Only render badge/button when loading is complete
                  <>
                    {isPro ? (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-md"
                      >
                        PRO
                      </motion.span>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none hover:opacity-90 transition-opacity px-3 py-1 h-auto"
                        >
                          <a
                            href={finalSubscriptionLink}
                            className={finalSubscriptionLink === "#" ? "pointer-events-none opacity-50" : ""}
                          >
                            Upgrade
                          </a>
                        </Button>
                      </motion.div>
                    )}
                  </>
                )}
                 {/* Optional: Add a simple loading indicator */}
                 {loading && (
                    <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                 )}
                {/* User Button always shown when signed in */}
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

            {/* --- Signed Out State --- */}
            <SignedOut>
              <SignInButton mode="modal">
                <Button>Sign in</Button>
              </SignInButton>
            </SignedOut>
          </nav>
        </div>
      </div>
    </header>
  );
};