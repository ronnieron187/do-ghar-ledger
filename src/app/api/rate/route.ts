import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/NZD", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("upstream error");
    const data = await res.json();
    const rate = data?.rates?.PKR;
    if (typeof rate !== "number") throw new Error("rate missing");
    return NextResponse.json({ rate });
  } catch {
    return NextResponse.json({ error: "Could not fetch live rate" }, { status: 502 });
  }
}
