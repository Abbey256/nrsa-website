import bcrypt from "bcrypt";
import { storage } from "./storage";

async function main() {
  const hashedPassword = await bcrypt.hash("SuperSecret123!", 10);

  const admin = await storage.createAdmin({
    name: "Admin",
    email: "admin@example.com",
    passwordHash: hashedPassword
  });

  console.log("Admin created:", admin);
  process.exit(0);
}

main().catch(console.error);
