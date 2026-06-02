import { verifySession } from "@/lib/dal";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export async function PATCH(request: NextRequest) {
  try {
    await verifySession();

    const body = await request.json();

    const result = ChangePasswordSchema.safeParse(body);

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

    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword: result.data.currentPassword,
        newPassword: result.data.newPassword,
      },
    });

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Change password error:", error);

    return NextResponse.json(
      {
        error: "Failed to update password",
      },
      {
        status: 500,
      },
    );
  }
}
