import "dotenv/config";
import { createNewAuthToken, revokeAuthToken } from "./lib";

if (!process.env.SEED_PHRASE) {
  throw new Error("missing seed phrase");
}

const NUM_TOKENS = 50;
// In the situation that you have 50 farcaster auth tokens and apps don't work because their auth token's expiry isn't long enough
async function main() {
  console.log("Revoking all your farcaster auth tokens");
  // generate 50 new farcaster auth tokens with longest expiry, in order to invalidate all existing tokens
  const tokens = await Promise.all(
    Array.from(Array(NUM_TOKENS).keys()).map(() =>
      // go for the a very big expiry to make sure they have longer expiry than all existing tokens
      createNewAuthToken(109999999999999)
    )
  );
  // revoke all of these auth tokens
  for (const token of tokens) {
    try {
      await revokeAuthToken(token.authenticationToken.secret);
    } catch (err) {
      console.log("Failed to revoke a token");
    }
  }
  // now your account should now have 0 farcaster auth tokens

  console.log("Completed");
}

main();
