import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, secret } = await req.json() as { email?: string; secret?: string };

  const adminEmail  = process.env.ADMIN_EMAIL;
  const adminSecret = process.env.ADMIN_SECRET;

  if (
    adminEmail &&
    adminSecret &&
    email?.toLowerCase().trim() === adminEmail.toLowerCase().trim() &&
    secret === adminSecret
  ) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false });
}
