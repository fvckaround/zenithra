import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/lib/models/User";
import { createNotification } from "@/lib/notify";
import { sendKycApprovedEmail, sendKycRejectedEmail } from "@/lib/emails";

export async function PATCH(req, { params }) {
  const { id } = await params;
  try {
    await connectDB();
    const { status, reason } = await req.json();

    const update = { kycStatus: status };
    if (status === "rejected" && reason) update.kycRejectedReason = reason;
    if (status === "approved") update.kycRejectedReason = null;

    const user = await User.findByIdAndUpdate(id, update, { new: true });

    if (status === "approved") {
      await createNotification(id, {
        title: "Identity Verified",
        message: "Your identity has been verified successfully. Your account is now fully verified.",
        type: "kyc",
      });
      await sendKycApprovedEmail({
        to: user.email,
        fullName: user.fullName,
      });
    }

    if (status === "rejected") {
      await createNotification(id, {
        title: "KYC Rejected",
        message: `Your identity verification was rejected. Reason: ${reason || "Please resubmit clearer images."}`,
        type: "kyc",
      });
      await sendKycRejectedEmail({
        to: user.email,
        fullName: user.fullName,
        reason,
      });
    }

    return NextResponse.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      kycStatus: user.kycStatus,
      kycRejectedReason: user.kycRejectedReason,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}