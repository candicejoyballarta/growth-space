import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { User } from "@/models/User";
import { transporter } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    await connectToDB();

    const user = await User.findOne({ email: email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate a token (could also use crypto or JWT)
    const token = Math.random().toString(36).substring(2, 15);

    // Save token to DB
    user.verificationToken = token;
    user.verificationTokenExpires = Date.now() + 1000 * 60 * 30; // 30 minutes
    await user.save();

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

    // Send email
    await transporter.sendMail({
      from: `"Growth Space" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Verify your email address",
      html: `
        <p>Hello ${user.name || "there"},</p>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl}" target="_blank">Verify Email</a>
        <p>This link will expire in 30 minutes.</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Email error:", error.message, error);
    return NextResponse.json(
      { error: "Failed to send verification email", details: error.message },
      { status: 500 }
    );
  }
}
