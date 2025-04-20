// db/schema/customers-schema.ts
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Define a PostgreSQL ENUM type for membership status
// ENUMs provide type safety at the database level.
export const membershipEnum = pgEnum("membership", ["free", "pro"]);

// Define the schema for the 'customers' table
export const customersTable = pgTable("customers", {
  /**
   * 'userId': Links to the Clerk user ID.
   * - Type: text
   * - Constraint: primaryKey() - Uniquely identifies each customer record.
   * - Constraint: notNull() - Must have a value.
   */
  userId: text("user_id").primaryKey().notNull(),

  /**
   * 'membership': Stores the customer's current membership status.
   * - Type: membershipEnum ('free' or 'pro')
   * - Constraint: notNull()
   * - Constraint: default('free') - New records default to 'free'.
   */
  membership: membershipEnum("membership").notNull().default("free"),

  /**
   * 'stripeCustomerId': Stores the corresponding Stripe Customer ID.
   * - Type: text
   * - Nullable: A user might exist in our DB before interacting with Stripe.
   * - We might add a UNIQUE constraint later if needed.
   */
  stripeCustomerId: text("stripe_customer_id"),

  /**
   * 'stripeSubscriptionId': Stores the active Stripe Subscription ID.
   * - Type: text
   * - Nullable: A user might not have an active subscription.
   * - We might add a UNIQUE constraint later if needed.
   */
  stripeSubscriptionId: text("stripe_subscription_id"),

  /**
   * 'createdAt': Timestamp when the customer record was first created.
   * - Type: timestamp
   * - Constraint: defaultNow(), notNull()
   */
  createdAt: timestamp("created_at").defaultNow().notNull(),

  /**
   * 'updatedAt': Timestamp when the record was last updated.
   * - Type: timestamp
   * - Constraint: defaultNow(), notNull()
   * - Helper: .$onUpdate() - Automatically updates on modification via Drizzle.
   */
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// Export TypeScript types inferred from the schema for type safety
export type InsertCustomer = typeof customersTable.$inferInsert;
export type SelectCustomer = typeof customersTable.$inferSelect;
