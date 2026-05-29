import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notes } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { generateEmbeddings } from "@/lib/embeddings";

export async function POST() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userNotes = await db.select().from(notes)
      .where(eq(notes.userId, session.user.id));

    let generated = 0;
    let failed = 0;

    for (const note of userNotes) {
      try {
        await generateEmbeddings(note.id, note.content ?? "", session.user.id);
        generated++;
      } catch (error) {
        console.error(`Failed to generate embedding for note ${note.id}:`, error);
        failed++;
      }
    }

    return NextResponse.json({ total: userNotes.length, generated, failed });
  } catch (error) {
    console.error("Regenerate embeddings failed:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
