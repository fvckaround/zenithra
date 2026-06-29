import { getCurrentUser, publicUser } from "@/lib/auth";
import { ok, fail } from "@/lib/api";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return fail("Not authenticated", 401);
  return ok({ user: publicUser(user) });
}
