# Task 01: Encryption Utility & DB Schema Update

## Status

pending

## Wave

1

## Description

Create a server-side AES-256-GCM encryption utility to encrypt/decrypt user OpenRouter API keys. Add `ENCRYPTION_KEY` to the environment schema validation. The utility will be used by all subsequent tasks to securely store and retrieve API keys from the database.

## Dependencies

**Depends on:** None (Wave 1)
**Blocks:** task-03-ai-settings-actions.md, task-05-wire-backend.md

**Context from dependencies:** This is a foundational task. No prior task output is needed.

## Files to Create

- `src/lib/crypto.ts` — AES-256-GCM encrypt/decrypt functions

## Files to Modify

- `src/lib/env.ts` — Add `ENCRYPTION_KEY` env var validation (optional, 64 hex chars)
- `.env` — Add `ENCRYPTION_KEY=<generated_hex>` placeholder (user must fill)

## Technical Details

### Implementation Steps

1. Create `src/lib/crypto.ts` with two exported functions: `encrypt(plaintext: string): string` and `decrypt(encrypted: string): string`
2. Use Node.js `crypto` module with AES-256-GCM
3. The `encrypt` function:
   - Takes plaintext string (the API key)
   - Generates a random 12-byte IV
   - Encrypts with AES-256-GCM using `ENCRYPTION_KEY` from `process.env`
   - Returns a JSON string: `{ iv: hex, ciphertext: hex, tag: hex }`
4. The `decrypt` function:
   - Takes the JSON string from encrypt
   - Parses iv, ciphertext, tag
   - Decrypts and returns plaintext
   - Throws on tampering (GCM auth tag verification)
5. Add `ENCRYPTION_KEY` to `src/lib/env.ts` server env schema as `z.string().length(64).optional()`
6. Add a warning in `checkEnv()` if `ENCRYPTION_KEY` is not set
7. Add `ENCRYPTION_KEY=` to `.env` file (empty, user must fill)

### Code Snippets

```ts
// src/lib/crypto.ts
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 64) throw new Error("ENCRYPTION_KEY not configured");
  return Buffer.from(key, "hex");
}

export function encrypt(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return JSON.stringify({
    iv: iv.toString("hex"),
    ciphertext: encrypted.toString("hex"),
    tag: tag.toString("hex"),
  });
}

export function decrypt(json: string): string {
  const { iv, ciphertext, tag } = JSON.parse(json);
  const decipher = createDecipheriv("aes-256-gcm", getKey(), Buffer.from(iv, "hex"), Buffer.from(ciphertext, "hex"));
  decipher.setAuthTag(Buffer.from(tag, "hex"));
  return decipher.update(Buffer.from(ciphertext, "hex"), undefined, "utf8") + decipher.final("utf8");
}
```

### Environment Variables

- `ENCRYPTION_KEY` — 64 hex character string (32 bytes) for AES-256. Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## Acceptance Criteria

- [ ] `encrypt("hello")` returns a JSON string with iv, ciphertext, tag fields
- [ ] `decrypt(encrypt("hello"))` returns `"hello"`
- [ ] Tampering with the ciphertext causes decrypt to throw
- [ ] Missing `ENCRYPTION_KEY` causes a clear error
- [ ] `ENCRYPTION_KEY` is validated in `env.ts` as optional 64-char hex

## Notes

Do NOT run `drizzle generate/migrate` in this task — no schema changes needed since we're storing encrypted data in the existing JSONB column.
