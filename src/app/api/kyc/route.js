import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { getCurrentUser, publicUser } from "@/lib/auth";
import { sendAdminKycEmail } from "@/lib/emails";
import { fail } from "@/lib/api";

export async function POST(req) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return fail("Not authenticated", 401);

    if (user.kycStatus === "approved")
      return fail("Your KYC is already verified");

    const formData = await req.formData();
    const frontFile = formData.get("frontImage");
    const backFile = formData.get("backImage");

    if (!frontFile || !backFile)
      return fail("Both front and back ID images are required");

    const toBase64 = async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      return `data:${file.type};base64,${buffer.toString("base64")}`;
    };

    user.kycFrontImage = await toBase64(frontFile);
    user.kycBackImage = await toBase64(backFile);
    user.kycStatus = "pending";
    user.kycRejectedReason = null;
    await user.save();

    await sendAdminKycEmail({
      fullName: user.fullName,
      email: user.email,
    });

    return NextResponse.json({ ok: true, user: publicUser(user) });
  } catch (err) {
    console.error("kyc error:", err);
    return fail("Failed to submit KYC", 500);
  }
}