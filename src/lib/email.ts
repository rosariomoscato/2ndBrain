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