import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import dbConnect from "./db";
import User from "./models/User";
import { SESSION_COOKIE, verifySession } from "./jwt";

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function getSessionUserId() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const payload = await verifySession(token);
  return payload?.sub || null;
}

export async function getCurrentUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;
  await dbConnect();
  return User.findById(userId);
}

export function publicUser(user) {
  if (!user) return null;
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    emailVerified: user.emailVerified,
    balance: user.balance,
    totalInvested: user.totalInvested,
    totalEarnings: user.totalEarnings,
    totalWithdrawn: user.totalWithdrawn,
    referralCode: user.referralCode,
    referredBy: user.referredBy?.toString() || null,
    kycStatus: user.kycStatus,
    kycRejectedReason: user.kycRejectedReason,
    createdAt: user.createdAt,
  };
}