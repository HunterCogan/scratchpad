import connectDB from "@/lib/db";
import Test from "@/models/Test";

export async function GET() {
  await connectDB();

  const data = await Test.find().sort({ createdAt: -1 });
  return Response.json(data);
}

export async function POST() {
  await connectDB();

  await Test.create({
    message: "Hello from MongoDB",
  });

  return Response.json({ success: true });
}

export async function DELETE(req: Request) {
  await connectDB();

  const { id } = await req.json();

  await Test.findByIdAndDelete(id);

  return Response.json({ success: true });
}