// actions/prompts-actions.ts
"use server";

import { db } from "@/db";
import { prompts } from "@/db/schema/prompts-schema";
import { devDelay } from "@/lib/dev-delay";
import { eq, count } from "drizzle-orm"; // Only keep eq and count
import { requireUserId } from "./auth-actions";
import { getCustomerByUserIdAction } from "./customers-actions"; // Import customer action

/**
 * GET: Retrieves all prompts for the current user.
 */
export async function getPrompts() {
  const userId = await requireUserId(); // Ensure user is logged in

  try {
    await devDelay(); // Simulate latency

    // Fetch prompts belonging to the current user
    const userPrompts = await db
      .select()
      .from(prompts)
      .where(eq(prompts.user_id, userId))
      .orderBy(prompts.created_at);

    return userPrompts;
  } catch (error) {
    console.error(`Error fetching prompts for user ${userId}:`, error);
    throw new Error("Failed to fetch prompts.");
  }
}

/**
 * CREATE: Creates a new prompt.
 * Enforces prompt limit for free users.
 */
export async function createPrompt({ name, description, content }: { name: string; description: string; content: string }) {
  const userId = await requireUserId(); // Ensure user is logged in

  try {
    await devDelay(); // Simulate latency

    // --- Check Membership Status & Prompt Limit ---
    console.log(`Action: Checking limits for user ${userId}`);
    const customerResult = await getCustomerByUserIdAction(userId);
    const isPro = customerResult[0]?.membership === "pro";

    if (!isPro) {
      // User is 'free', check their current prompt count
      // Drizzle query to count prompts for the user
      const userPromptsResult = await db
        .select({ value: count() }) // Select the count
        .from(prompts)
        .where(eq(prompts.user_id, userId));

      const promptCount = userPromptsResult[0]?.value ?? 0;
      console.log(`Action: User ${userId} (Free) has ${promptCount} prompts.`);

      // Enforce the limit (e.g., 3 prompts for free users)
      const FREE_PLAN_LIMIT = 3;
      if (promptCount >= FREE_PLAN_LIMIT) {
         console.warn(`Action: User ${userId} reached free limit (${FREE_PLAN_LIMIT}).`);
        // Throw a specific error that the frontend can potentially catch
        throw new Error(`Free users can create up to ${FREE_PLAN_LIMIT} prompts. Please upgrade to Pro for unlimited prompts.`);
      }
    } else {
       console.log(`Action: User ${userId} is Pro. No limit applied.`);
    }
    // --- End Limit Check ---

    console.log(`Action: Creating prompt for user ${userId}...`);
    const [newPrompt] = await db
      .insert(prompts)
      .values({ name, description, content, user_id: userId }) // Ensure user_id is set
      .returning();

    console.log("Action: Prompt created:", newPrompt);
    return newPrompt;

  } catch (error) {
    console.error(`Error creating prompt for user ${userId}:`, error);
     // Re-throw the original error (especially the limit error)
     // or a generic one if it's unexpected.
     if (error instanceof Error) {
         throw error; // Re-throw specific error (like the limit message)
     }
    throw new Error("Failed to create prompt.");
  }
}

/**
 * UPDATE: Updates a prompt by ID.
 * Ensures the user can only update their own prompts.
 */
export async function updatePrompt(id: number, { name, description, content }: { name: string; description: string; content: string }) {
  const userId = await requireUserId(); // Ensure user is logged in

  try {
    await devDelay(); // Simulate latency

    // Security check: Only allow updating own prompts
    const promptToUpdate = await db
      .select()
      .from(prompts)
      .where(eq(prompts.id, id))
      .limit(1);

    // Check if prompt exists and belongs to user
    if (!promptToUpdate.length || promptToUpdate[0].user_id !== userId) {
      throw new Error("Prompt not found or you don't have permission to update it.");
    }

    // Update the prompt
    const updated = await db
      .update(prompts)
      .set({ name, description, content })
      .where(eq(prompts.id, id))
      .returning();

    return updated[0];
  } catch (error) {
    console.error(`Error updating prompt ${id}:`, error);
    throw new Error("Failed to update prompt.");
  }
}

/**
 * DELETE: Deletes a prompt by ID.
 * Ensures the user can only delete their own prompts.
 */
export async function deletePrompt(id: number) {
  const userId = await requireUserId(); // Ensure user is logged in

  try {
    await devDelay(); // Simulate latency

    // Security check: Only allow deleting own prompts
    const promptToDelete = await db
      .select()
      .from(prompts)
      .where(eq(prompts.id, id))
      .limit(1);

    // Check if prompt exists and belongs to user
    if (!promptToDelete.length || promptToDelete[0].user_id !== userId) {
      throw new Error("Prompt not found or you don't have permission to delete it.");
    }

    // Delete the prompt
    const deleted = await db
      .delete(prompts)
      .where(eq(prompts.id, id))
      .returning();

    return deleted[0];
  } catch (error) {
    console.error(`Error deleting prompt ${id}:`, error);
    throw new Error("Failed to delete prompt.");
  }
}