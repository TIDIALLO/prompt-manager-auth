// app/confirmation/page.tsx
"use client"; // Needed for useRouter

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation"; // Import useRouter
import { useEffect } from "react";

export default function ConfirmationPage() {
  const router = useRouter(); // Hook for navigation

   // Optional: Automatically redirect after a few seconds
   useEffect(() => {
     const timer = setTimeout(() => {
       router.push('/prompts');
     }, 5000); // Redirect after 5 seconds
     return () => clearTimeout(timer); // Cleanup timer on unmount
   }, [router]);


  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-16 pt-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "backOut" }}
        className="text-center space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md"
      >
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 150 }}>
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Subscription Successful!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Thank you for upgrading to Pro! Your payment was successful and your account has been updated.
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => router.push("/prompts")} // Navigate on click
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Go to My Prompts
        </Button>
        <p className="text-xs text-gray-500 dark:text-gray-400">You will be redirected automatically shortly.</p>
      </motion.div>
    </div>
  );
}
