import { NextResponse } from "next/server";

export function ok(data = {}, init) {
  return NextResponse.json({ ok: true, ...data }, init);
}

export function fail(message, status = 400, extra = {}) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}
