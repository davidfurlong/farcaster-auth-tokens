import "dotenv/config";
import { ethers, utils } from "ethers";
import canonicalize from "canonicalize";
import axios from "axios";

export async function revokeAuthToken(
  authenticationToken: string
): Promise<true> {
  await axios.delete("https://api.warpcast.com/v2/auth", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authenticationToken}`,
    },
    data: {
      method: "revokeToken",
      params: { timestamp: Date.now() },
    },
  });

  return true;
}

export async function createNewAuthToken(expiresAt: number) {
  const bearerToken = await generateFcBearerToken(
    process.env.SEED_PHRASE!,
    expiresAt
  );
  const authenticationToken = await generateFcAuthenticationToken(bearerToken);

  const currentToken = {
    bearerToken,
    authenticationToken,
  };

  return currentToken;
}

// https://farcasterxyz.notion.site/Authenticating-with-the-Merkle-V2-API-06226da351f447358a783b438b2aefdd
async function generateFcBearerToken(
  mnemonic: string,
  expiresAt: number
): Promise<{ bearerToken: string; payload: string }> {
  const payload = canonicalize({
    method: "generateToken",
    params: {
      timestamp: Date.now(),
      expiresAt: expiresAt,
    },
  }) as string;

  // 2. The client’s custody address signs the canonicalized (RFC-8785) JSON message using EIP-191 to obtain a signature.
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  const signature = Buffer.from(
    ethers.utils.arrayify(await wallet.signMessage(payload))
  ).toString("base64");

  const bearerToken = `eip191:${signature}`;

  const recoveredAddress = ethers.utils.recoverAddress(
    utils.hashMessage(payload),
    utils.hexlify(Buffer.from(bearerToken.split(":")[1], "base64"))
  );

  if (recoveredAddress !== wallet.address) {
    console.error("ERROR invalid signature");
  }

  return { bearerToken, payload };
}

// baseline: https://replit.com/@VarunSrinivasa4/Merkle-V2-Custody-Bearer-Token-Example?v=1
async function generateFcAuthenticationToken({
  bearerToken,
  payload,
}: {
  bearerToken: string;
  payload: string;
}): Promise<{ secret: string; expiresAt: number }> {
  const res = await axios.put("https://api.warpcast.com/v2/auth", payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  if (res.status >= 400) {
    console.error("Failed to create auth token", res.status);
  }

  const body: {
    result: {
      token: {
        secret: string;
        expiresAt: number;
      };
    };
  } = res.data;

  return body.result.token;
}
