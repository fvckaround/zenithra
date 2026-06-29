import { getCurrentUser, publicUser, hashPassword, comparePassword } from "@/lib/auth";
import { ok, fail } from "@/lib/api";

export async function PATCH(request) {
  try {
    const user = await getCurrentUser();
    if (!user) return fail("Not authenticated", 401);

    const body = await request.json();
    const { fullName, currentPassword, newPassword } = body;

    if (typeof fullName === "string") {
      if (!fullName.trim()) return fail("Full name cannot be empty");
      user.fullName = fullName.trim();
    }

    if (newPassword) {
      if (newPassword.length < 8)
        return fail("New password must be at least 8 characters");
      const valid = await comparePassword(currentPassword || "", user.passwordHash);
      if (!valid) return fail("Current password is incorrect");
      user.passwordHash = await hashPassword(newPassword);
    }

    await user.save();
    return ok({ user: publicUser(user) });
  } catch (err) {
    console.error("profile PATCH error:", err);
    return fail("Failed to update profile", 500);
  }
}
