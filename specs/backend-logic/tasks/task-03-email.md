# Task 03: Resend Email Integration

## Status

complete

## Wave

1

## Description

Replace the console.log email handlers in Better Auth with real email sending via Resend. Currently, password reset and email verification just log URLs to the console. This task installs the Resend SDK, creates an email template utility, and wires it into the Better Auth configuration so users receive actual emails for verification and password reset flows.

## Dependencies

**Depends on:** None (Wave 1)
**Blocks:** None directly

**Context from dependencies:** The existing `src/lib/auth.ts` has two async handlers that currently console.log: `sendResetPassword` and `sendVerificationEmail`. Both receive `{ user, url }` parameters. The app uses Better Auth v1.6.2 with emailAndPassword enabled and emailVerification.sendOnSignUp set to true.

## Files to Create

- `src/lib/email.ts` — Resend email sending utility with HTML templates

## Files to Modify

- `src/lib/auth.ts` — Replace console.log with Resend email calls
- `src/lib/env.ts` — Add RESEND_API_KEY to the validation schema
- `env.example` — Add RESEND_API_KEY with comment

## Technical Details

### Implementation Steps

1. Install Resend SDK:
```bash
pnpm add resend
```

2. Create `src/lib/email.ts`:
```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "2ndBrain <onboarding@yourdomain.com>";

export async function sendVerificationEmail({
  to,
  url,
}: {
  to: string;
  url: string;
}) {
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Verify your email - 2ndBrain",
    html: `
      <div style="font-family: 'Space Grotesk', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #e4e4e7; padding: 40px; border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 16px;">
        <h1 style="font-family: 'Orbitron', sans-serif; color: #60f7fc; font-size: 24px; margin-bottom: 24px;">VERIFY YOUR EMAIL</h1>
        <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6;">Welcome to 2ndBrain. Click the button below to verify your email address and activate your account.</p>
        <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #60f7fc, #a855f7); color: #000; padding: 12px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; margin: 24px 0;">Verify Email</a>
        <p style="color: #71717a; font-size: 14px;">If you didn't create an account, you can ignore this email.</p>
      </div>
    `,
  });
  if (error) console.error("Failed to send verification email:", error);
}

export async function sendPasswordResetEmail({
  to,
  url,
}: {
  to: string;
  url: string;
}) {
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Reset your password - 2ndBrain",
    html: `
      <div style="font-family: 'Space Grotesk', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #e4e4e7; padding: 40px; border: 1px solid rgba(96, 247, 252, 0.3); border-radius: 16px;">
        <h1 style="font-family: 'Orbitron', sans-serif; color: #60f7fc; font-size: 24px; margin-bottom: 24px;">RESET PASSWORD</h1>
        <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6;">We received a request to reset your password. Click the button below to choose a new one.</p>
        <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #60f7fc, #a855f7); color: #000; padding: 12px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; margin: 24px 0;">Reset Password</a>
        <p style="color: #71717a; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  });
  if (error) console.error("Failed to send password reset email:", error);
}
```
Note: Replace `yourdomain.com` with the actual domain configured in Resend. For development/testing, Resend provides a default `onboarding@resend.dev` address that can only send to the registered email.

3. Modify `src/lib/auth.ts`:
Replace the two console.log handlers:
```typescript
import { sendVerificationEmail, sendPasswordResetEmail } from "./email";

// In betterAuth config:
emailAndPassword: {
  enabled: true,
  sendResetPassword: async ({ user, url }) => {
    await sendPasswordResetEmail({ to: user.email, url });
  },
},
emailVerification: {
  sendOnSignUp: true,
  sendVerificationEmail: async ({ user, url }) => {
    await sendVerificationEmail({ to: user.email, url });
  },
},
```

4. Add to `src/lib/env.ts` server schema:
```typescript
RESEND_API_KEY: z.string().optional(),
```

5. Add to `env.example`:
```
RESEND_API_KEY=re_xxxxxxxxxxxx
```

### Environment Variables

- `RESEND_API_KEY` — API key from https://resend.com/api-keys

### Notes

- For local development, Resend has a free tier that allows sending to your registered email
- The FROM_EMAIL domain must be verified in Resend dashboard before sending to arbitrary addresses
- If RESEND_API_KEY is not set, emails will fail silently (error logged to console) — the app should still work
- The HTML templates use inline styles matching the cyberpunk aesthetic (dark background, neon cyan/purple accents)

## Acceptance Criteria

- [ ] Resend SDK installed (resend in package.json)
- [ ] `src/lib/email.ts` exports sendVerificationEmail and sendPasswordResetEmail
- [ ] `src/lib/auth.ts` uses the new email functions instead of console.log
- [ ] RESEND_API_KEY added to env validation and env.example
- [ ] No TypeScript errors (pnpm run typecheck passes)
- [ ] HTML emails render correctly in email clients (dark theme with neon accents)
