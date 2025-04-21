// app/prompts/_components/prompts-grid.tsx
"use client";

// ... other imports ...
import { useMembership } from "@/hooks/use-membership"; // Import membership hook
import { useAuth } from "@clerk/nextjs"; // Need for userId
import { Sparkles, Plus, Loader2 } from "lucide-react"; // Import icons
import { useState } from "react";
import { LoadingGrid } from "./loading-grid"; // Import the LoadingGrid component
import { SelectPrompt } from "@/db/schema/prompts-schema"; // Import SelectPrompt type
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { createPrompt, deletePrompt } from "@/actions/prompts-actions"; // Import the action functions

// Define the interface for PromptsGrid props
interface PromptsGridProps {
  initialPrompts: SelectPrompt[];
}

// Get subscription link from environment
const subscriptionLink = process.env.NEXT_PUBLIC_MONTHLY_SUBSCRIPTION_LINK;

// ... interfaces ...

export const PromptsGrid = ({ initialPrompts }: PromptsGridProps) => {
  const { userId } = useAuth(); // Get user ID for checkout link
  const { isPro, loading: membershipLoading } = useMembership(); // Get membership status

  const [prompts, setPrompts] = useState<SelectPrompt[]>(initialPrompts);
  // Add missing state variables
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", content: "" });
  
  // ... other state variables ...

  // Construct the final checkout link
   const finalSubscriptionLink = userId && subscriptionLink
    ? `${subscriptionLink}?client_reference_id=${userId}`
    : "#";

  // --- Updated Create Click Handler ---
  const handleCreateClick = () => {
    const FREE_PLAN_LIMIT = 3;
    // Check if user is NOT pro AND has reached the limit
    if (!isPro && prompts.length >= FREE_PLAN_LIMIT && !membershipLoading) {
       console.log("Free limit reached, redirecting to checkout...");
      // Redirect directly to Stripe checkout
      if (finalSubscriptionLink !== "#") {
        window.location.href = finalSubscriptionLink;
      } else {
         console.error("Subscription link is not configured.");
         setError("Upgrade link not available. Please contact support."); // Show error if link missing
      }
    } else {
      // Otherwise, open the create form
      setIsCreating(true);
      setFormData({ name: "", description: "", content: "" }); // Reset form
      setError(null); // Clear previous errors
    }
  };

  // Function to start editing a prompt
  const startEditing = (prompt: SelectPrompt) => {
    setEditingId(prompt.id);
    setFormData({
      name: prompt.name,
      description: prompt.description,
      content: prompt.content
    });
    setError(null);
  };

  // ... (copyToClipboard, handleInputChange, cancelEditing remain mostly the same) ...

  // --- Updated Submit Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      if (editingId) {
        // Update logic (remains the same)
        // ...
      } else {
        // Create new prompt
        const newPrompt = await createPrompt(formData);
        setPrompts((prev) => [newPrompt, ...prev]);
        setIsCreating(false); // Close form on success
      }
      // Reset form only on success
      setFormData({ name: "", description: "", content: "" });
    } catch (err) {
      console.error("Failed to save prompt:", err);
      const message = err instanceof Error ? err.message : "Failed to save prompt. Please try again.";
      setError(message);

      // --- Add Check for Limit Error Message ---
      const FREE_PLAN_LIMIT = 3; // Ensure limit is defined here too
      if (message.includes(`up to ${FREE_PLAN_LIMIT} prompts`)) {
        console.log("Server limit error caught, redirecting to checkout...");
        // Redirect to Stripe if the specific limit error is caught from the server
         if (finalSubscriptionLink !== "#") {
            // Small delay might improve UX before redirect
            setTimeout(() => { window.location.href = finalSubscriptionLink; }, 1500);
         } else {
             console.error("Subscription link is not configured.");
             // Keep showing the error message in the form
         }
      }
      // --- End Check ---

    } finally {
      // Only stop saving indicator; don't reset form/close on error
      setIsSaving(false);
    }
  };

  // --- Updated Delete Handler ---
  const handleDelete = async (id: number) => {
     // Reset potential create/edit errors when deleting
     setError(null);
     setDeleteError(null); // Also reset delete error

     setIsDeleting(true);
     try {
       await deletePrompt(id);
       setPrompts((prev) => prev.filter((p) => p.id !== id));
       setDeletingId(null);
     } catch (err) {
       console.error("Failed to delete prompt:", err);
       setDeleteError("Failed to delete prompt. Please try again."); // Use deleteError state
     } finally {
       setIsDeleting(false);
     }
  };

  // --- Render Logic ---
  return (
    <>
      {/* Create prompt button - Updated */}
      <div className="mb-6 flex justify-end">
        <Button
          onClick={handleCreateClick}
          className="gap-2 transition-all"
          // Add visual change when limit is hit and user is not Pro
          variant={!isPro && prompts.length >= 3 && !membershipLoading ? "default" : "outline"} // Change variant
          disabled={membershipLoading} // Disable while checking status
        >
          {membershipLoading ? (
             <Loader2 className="w-5 h-5 animate-spin" />
          ) : !isPro && prompts.length >= 3 ? (
            <>
              <Sparkles className="w-5 h-5 text-yellow-400" /> {/* Sparkle icon */}
              Upgrade to Create More
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Create Prompt
            </>
          )}
        </Button>
      </div>

       {/* Create/Edit Form Dialog (keep conditional rendering logic) */}
       {/* Make sure the error state displayed inside is `error` */}
       {(isCreating || editingId) && (
         <div className="border p-4 rounded-lg mb-6">
           <h2 className="text-xl font-bold mb-4">
             {editingId ? "Edit Prompt" : "Create New Prompt"}
           </h2>
           <form onSubmit={handleSubmit}>
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium mb-1">Name</label>
                 <input
                   type="text"
                   name="name"
                   value={formData.name}
                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                   className="w-full p-2 border rounded"
                   required
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1">Description</label>
                 <input
                   type="text"
                   name="description"
                   value={formData.description}
                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                   className="w-full p-2 border rounded"
                   required
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1">Content</label>
                 <textarea
                   name="content"
                   value={formData.content}
                   onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                   className="w-full p-2 border rounded h-40"
                   required
                 />
               </div>
             </div>
             {error && <p className="text-red-500 my-4">{error}</p>}
             {isSaving && <p className="text-blue-500 my-4">Saving...</p>}
             <div className="flex justify-end gap-2 mt-4">
               <Button type="button" variant="outline" onClick={() => editingId ? setEditingId(null) : setIsCreating(false)}>
                 Cancel
               </Button>
               <Button type="submit" disabled={isSaving}>
                 {isSaving ? "Saving..." : editingId ? "Update" : "Create"}
               </Button>
             </div>
           </form>
         </div>
       )}


       {/* Delete Confirmation Dialog (use deleteError state) */}
       <Dialog open={!!deletingId}>
         <DialogContent>
            <h2>Confirm Deletion</h2>
            {deleteError && <p className="text-red-500 text-sm text-center">{deleteError}</p>}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setDeletingId(null)}>Cancel</Button>
              <Button 
                variant="destructive" 
                onClick={() => deletingId && handleDelete(deletingId)}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
         </DialogContent>
       </Dialog>


      {/* Prompts Grid */}
      {/* Show skeleton or message while loading membership? Optional */}
       {membershipLoading && prompts.length === 0 && <LoadingGrid />}
       {!membershipLoading && prompts.length === 0 && !isCreating && (
         <p className="text-center text-gray-500 my-8">No prompts yet. Create your first prompt to get started.</p>
       )}

       {!membershipLoading && prompts.length > 0 && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <div key={prompt.id} className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-2">{prompt.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">{prompt.description}</p>
                <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-3 rounded mb-4 overflow-hidden">
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-3">{prompt.content}</p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => startEditing(prompt)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => setDeletingId(prompt.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
         </div>
       )}
    </>
  );
};
