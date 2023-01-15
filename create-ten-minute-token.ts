import "dotenv/config";
import { createNewAuthToken } from "./lib";

if (!process.env.SEED_PHRASE) {
  throw new Error("missing seed phrase");
}

const TEN_MINUTES_IN_MILLIS = 600000;

async function main() {
  const expiresInTenMins = Date.now() + TEN_MINUTES_IN_MILLIS;

  console.log("Creating an auth token that will expire in 10 minutes");
  const token = await createNewAuthToken(expiresInTenMins);

  console.log("Heres your token");
  console.log(token);

  console.log(
    `To use it, add an "Authorization" header to your requests, with value "Bearer ${token.authenticationToken.secret}"`
  );

  return token;
}

main();
