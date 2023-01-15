import "dotenv/config";
import { revokeAuthToken } from "./lib";

const args = process.argv.slice(2);

if (args.length !== 1) {
  throw new Error("Passed too few or too many arguments");
}

// In the situation that you have 50 farcaster auth tokens and apps don't work because their auth token's expiry isn't long enough
async function main() {
  console.log("Revoking specific token");

  try {
    await revokeAuthToken(args[0]);
    console.log("Successfully revoked the auth token");
  } catch (err) {
    console.log("Failed to revoke token");
  }
}

main();
