// app/pricing/page.tsx
import { PricingSection } from "./_components/pricing-section"; // We'll create this next

// Optional: Add Metadata for SEO
export const metadata = {
  title: "Pricing - Prompt Manager",
  description: "Simple and transparent pricing for Prompt Manager.",
};

export default function PricingPage() {
  return (
    // Use min-h-screen and flex centering for vertical alignment if needed
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-24 pb-16">
       {/* Container to constrain width and add padding */}
      <div className="container mx-auto max-w-4xl px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Get started for free. Upgrade when you need more.
          </p>
        </div>

        {/* Pricing plans component */}
        <PricingSection />
      </div>
    </div>
  );
}