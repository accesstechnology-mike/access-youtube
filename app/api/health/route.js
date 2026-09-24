import { NextResponse } from "next/server";

// Liveness probe for uptime checks. Do not add search or bad-words work here.
export const dynamic = "force-dynamic";

const NO_STORE = {
  "Cache-Control": "no-store",
};

export async function GET() {
  return NextResponse.json({ ok: true }, { status: 200, headers: NO_STORE });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200, headers: NO_STORE });
}
