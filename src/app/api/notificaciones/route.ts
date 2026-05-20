import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // TODO: Fase 5 — trigger de email/SMS via Resend + Twilio
  return NextResponse.json({ message: "not implemented" }, { status: 501 });
}
