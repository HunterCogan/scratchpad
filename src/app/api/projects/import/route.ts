import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { SCRATCH_API, SCRATCH_PROJECTS } from "@/lib/scratch";
import { projectIdSchema } from "@/lib/schemas/scratch.zod";
import { ScratchProject } from "@/types";

// These Scratch endpoints are undocumented and not officially supported, so they could be changed at any time.
export async function POST(req: NextRequest) {
  try {
    await verifySession();

    const { url } = await req.json();

    const parsed = projectIdSchema.safeParse(url);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }
    const id = parsed.data;

    // Requests project metadata (title, description, and project_token).
    const metaRes = await fetch(`${SCRATCH_API}/projects/${id}`, {
      headers: { Accept: "application/json" },
    });

    if (metaRes.status === 404) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (!metaRes.ok) {
      return NextResponse.json(
        { error: "Could not reach Scratch API" },
        { status: 502 },
      );
    }

    const meta = await metaRes.json();

    const token = meta?.project_token;
    if (!token) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Requests the project.json using project_token.
    // This must be part of this route because project_token seems to expire fast.
    const projectRes = await fetch(
      `${SCRATCH_PROJECTS}/${id}?token=${encodeURIComponent(token)}`,
    );
    if (!projectRes.ok) {
      return NextResponse.json(
        { error: "Could not reach Scratch API" },
        { status: 502 },
      );
    }

    const projectData = await projectRes.text();

    // Verify that project follows ScratchProject format and is a Scratch 3 project.
    try {
      const parsed: ScratchProject = JSON.parse(projectData);
      if (parsed.meta.semver[0] != "3") throw new Error();
    } catch {
      return NextResponse.json(
        {
          error: "Unsupported project format",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      projectData,
      title: typeof meta.title === "string" ? meta.title : null,
      description:
        typeof meta.instructions === "string" ? meta.instructions : null,
    });
  } catch (error) {
    console.error("Import project error:", error);
    return NextResponse.json(
      { error: "Failed to import project" },
      { status: 500 },
    );
  }
}
