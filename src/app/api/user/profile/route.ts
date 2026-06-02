import { verifySession } from "@/lib/dal";
import connectDB from "@/lib/db";
import User from "@/models/User";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UpdateProfileSchema = z.object({
  name: z.string().trim().min(1).max(50),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await verifySession();

    await connectDB();

    const body = await request.json();

    const result = UpdateProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const user = await User.findByIdAndUpdate(
      new mongoose.Types.ObjectId(session.userId),
      {
        name: result.data.name,
      },
      {
        new: true,
      },
    );

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        user,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Update profile error:", error);

    return NextResponse.json(
      {
        error: "Failed to update profile",
      },
      {
        status: 500,
      },
    );
  }
}
