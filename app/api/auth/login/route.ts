import { NextResponse } from "next/server";
import { checkPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.password !== "string") {
    return NextResponse.json({ error: "Missing password." }, { status: 400 });
  }
  if (!checkPassword(body.password)) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  setSessionCookie();
  return NextResponse.json({ ok: true });
}
