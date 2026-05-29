import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

/**
 * Gets the encryption key from environment variables.
 * The key must be a 64-character hex string (32 bytes) for AES-256.
 * @throws Error if ENCRYPTION_KEY is not configured or invalid
 */
function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 64) {
    throw new Error(
      "ENCRYPTION_KEY not configured or invalid. Must be 64 hex characters (32 bytes)."
    );
  }
  return Buffer.from(key, "hex");
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Generates a random 12-byte IV and returns the encrypted data as JSON.
 *
 * @param plaintext - The string to encrypt (e.g., an API key)
 * @returns A JSON string containing { iv, ciphertext, tag } as hex strings
 * @throws Error if ENCRYPTION_KEY is not configured or encryption fails
 *
 * @example
 * ```ts
 * const encrypted = encrypt("sk-or-12345678");
 * // Returns: '{"iv":"abc123...","ciphertext":"def456...","tag":"ghi789..."}'
 * ```
 */
export function encrypt(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return JSON.stringify({
    iv: iv.toString("hex"),
    ciphertext: encrypted.toString("hex"),
    tag: tag.toString("hex"),
  });
}

/**
 * Decrypts an encrypted string using AES-256-GCM.
 * Verifies the GCM authentication tag to detect tampering.
 *
 * @param json - The JSON string returned by encrypt()
 * @returns The original plaintext string
 * @throws Error if ENCRYPTION_KEY is not configured, decryption fails, or tag verification fails
 *
 * @example
 * ```ts
 * const encrypted = encrypt("sk-or-12345678");
 * const decrypted = decrypt(encrypted);
 * // Returns: "sk-or-12345678"
 * ```
 */
export function decrypt(json: string): string {
  const { iv, ciphertext, tag } = JSON.parse(json);

  const decipher = createDecipheriv(
    "aes-256-gcm",
    getKey(),
    Buffer.from(iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(tag, "hex"));

  return (
    decipher.update(Buffer.from(ciphertext, "hex"), undefined, "utf8") +
    decipher.final("utf8")
  );
}