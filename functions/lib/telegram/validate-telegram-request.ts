import { z } from "zod";

const userSchema = z
  .object({
    id: z.number(),
    first_name: z.string(),
    last_name: z.string().optional(),
    language_code: z.string().optional(),
    username: z.string().optional(),
  })
  .transform((result) => ({
    id: result.id,
    firstName: result.first_name,
    lastName: result.last_name,
    languageCode: result.language_code,
    username: result.username,
  }));

/**
 * The function is responsible for validating and parsing data coming from the Telegram web.
 * When executed in Cloudflare Workers, it uses the Web Crypto API: https://developers.cloudflare.com/workers/runtime-apis/web-crypto/
 * When executed in tests, it uses a polyfill for Node.js
 */
export async function validateTelegramRequest(
  crypto: Crypto,
  queryString: string,
  botToken: string,
) {
  const queryStringObject = Object.fromEntries(
    new URLSearchParams(queryString),
  );

  const encoder = new TextEncoder();
  const checkString = Object.keys(queryStringObject)
    .filter((key) => key !== "hash")
    .map((key) => `${key}=${queryStringObject[key]}`)
    .sort()
    .join("\n");

  const secretKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode("WebAppData"),
    { name: "HMAC", hash: "SHA-256" },
    true,
    ["sign"],
  );
  const secret = await crypto.subtle.sign(
    "HMAC",
    secretKey,
    encoder.encode(botToken),
  );
  const signatureKey = await crypto.subtle.importKey(
    "raw",
    secret,
    { name: "HMAC", hash: "SHA-256" },
    true,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    signatureKey,
    encoder.encode(checkString),
  );

  const computedHash = [...new Uint8Array(signature)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (computedHash === queryStringObject["hash"]) {
    return userSchema.parse(JSON.parse(queryStringObject['user']));
  }

  return null;
}
