import { verifySession } from "@/lib/dal";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Project from "@/models/Project";
import Remix from "@/models/Remix";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const session = await verifySession();

    await connectDB();

    const userId = new mongoose.Types.ObjectId(session.userId);

    // Delete remixes uploaded by the user
    await Remix.deleteMany({
      uploader: userId,
    });

    // Delete projects owned by the user
    await Project.deleteMany({
      creator: userId,
    });

    // Remove user from collaborator lists
    await Project.updateMany(
      {},
      {
        $pull: {
          team: userId,
        },
      },
    );

    // Delete user account
    const result = await User.deleteOne({
      _id: userId,
    });

    if (result.deletedCount === 0) {
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
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Delete account error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete account",
      },
      {
        status: 500,
      },
    );
  }
}
