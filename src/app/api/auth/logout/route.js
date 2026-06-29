import { SESSION_COOKIE } from "@/lib/jwt";
import { ok } from "@/lib/api";

export async function POST() {
  const res = ok();
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
