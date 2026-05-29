import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const callbackURL = searchParams.get("callbackURL") || "/";

    if (!token) {
      return NextResponse.redirect(
        new URL("/login?error=invalid_token", req.url)
      );
    }

    const result = await auth.api.verifyEmail({
      body: { token },
      headers: await headers(),
    });

    if (!result?.user) {
      return NextResponse.redirect(
        new URL("/login?error=verification_failed", req.url)
      );
    }

    console.log("✅ Email verified successfully for:", result.user.email);

    return NextResponse.redirect(
      new URL(callbackURL, req.url)
    );
  } catch (error) {
    console.error("❌ Email verification error:", error);
    return NextResponse.redirect(
      new URL("/login?error=verification_error", req.url)
    );
  }
}