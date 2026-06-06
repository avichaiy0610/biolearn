import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  if (!email || !password || password.length < 6) {
    return Response.json({ error: "נדרש מייל וסיסמה (לפחות 6 תווים)" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return Response.json({ error: "כתובת מייל לא תקינה" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ error: "כתובת מייל כבר רשומה במערכת" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { email, hashedPassword, name: name ?? null },
  });

  return Response.json({ success: true });
}
