import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { autoConnectNotesByTags } from "@/lib/actions/graph";
import { auth } from "@/lib/auth";

export async function POST() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await autoConnectNotesByTags(session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Auto-connect failed:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
