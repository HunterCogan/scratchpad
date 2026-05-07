import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import connectDB from "./db";

// Establish MongoDB connection once the module loads
const conn = await connectDB();
const client = conn.getClient();

export const auth = betterAuth({
  // Use MongoDB adapter with the connected client's database
  database: mongodbAdapter(client.db()),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    database: {
      // Disable Better Auth ID generation; let MongoDB use its native _id
      generateId: false,
    },
  },
});
