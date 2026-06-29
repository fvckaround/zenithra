import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const body = await req.json();
    // In a full implementation these would be saved to DB
    // For now we acknowledge the save
    console.log("Admin settings updated:", body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Failed to save settings" }, { status: 500 });
  }
}