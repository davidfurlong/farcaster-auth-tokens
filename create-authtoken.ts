import "dotenv/config";
import { createNewAuthToken } from "./lib";

if (!process.env.SEED_PHRASE) {
  throw new Error("missing seed phrase");
}

async function main() {
  console.log("Creating an auth token that is long lived");
  const token = await createNewAuthToken(9999999999999);

  console.log("Heres your token");
  console.log(token);

  console.log(
    `To use it, add an "Authorization" header to your requests, with value "Bearer ${token.authenticationToken.secret}"`
  );

  return token;
}

main();
