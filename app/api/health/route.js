import { connection, NextResponse } from "next/server";

// Liveness probe for uptime checks. Do not add search or bad-words work here.
// connection() keeps this route dynamic under cacheComponents, which rejects
// the old `export const dynamic = "force-dynamic"` segment config.

const NO_STORE = {
  "Cache-Control": "no-store",
};

export async function GET() {
  await connection();
  return NextResponse.json({ ok: true }, { status: 200, headers: NO_STORE });
}

export async function HEAD() {
  await connection();
  return new NextResponse(null, { status: 200, headers: NO_STORE });
}
