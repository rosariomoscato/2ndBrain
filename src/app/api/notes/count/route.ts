import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notes } from "@/lib/schema";
import { eq, and, count } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ count: 0 });
    }

    const result = await db
      .select({ count: count() })
      .from(notes)
      .where(eq(notes.userId, session.user.id));

    return NextResponse.json({ count: result[0]?.count ?? 0 });
  } catch (error) {
    console.error("Failed to get note count:", error);
    return NextResponse.json({ count: 0 });
  }
}
