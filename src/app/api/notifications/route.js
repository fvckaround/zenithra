import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { getCurrentUser } from "@/lib/auth";
import Notification from "@/lib/models/Notification";
import { fail } from "@/lib/api";

export async function GET() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return fail("Not authenticated", 401);

    const notifications = await Notification.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const unreadCount = await Notification.countDocuments({
      userId: user._id,
      isRead: false,
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (err) {
    console.error(err);
    return fail("Failed to load notifications", 500);
  }
}

export async function PATCH() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return fail("Not authenticated", 401);

    await Notification.updateMany(
      { userId: user._id, isRead: false },
      { isRead: true }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return fail("Failed to mark notifications as read", 500);
  }
}