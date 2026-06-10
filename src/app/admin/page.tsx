import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-key-change-in-production"
);

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      redirect("/admin/dashboard");
    } catch {
      // Invalid token, redirect to login
    }
  }

  redirect("/admin/login");
}
