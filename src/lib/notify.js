import { connectDB } from "@/lib/mongoose";
import Notification from "@/lib/models/Notification";

export async function createNotification(userId, { title, message, type = "general" }) {
  try {
    await connectDB();
    await Notification.create({ userId, title, message, type });
  } catch (err) {
    console.error("Failed to create notification:", err);
  }
}