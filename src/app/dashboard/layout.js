import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { UserProvider } from "@/components/dashboard/UserContext";
import { getCurrentUser, publicUser } from "@/lib/auth";

export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser();
  // Middleware already guards this, but guard again in case of a stale session.
  if (!user) redirect("/login");

  return (
    <UserProvider initialUser={publicUser(user)}>
      <DashboardShell>{children}</DashboardShell>
    </UserProvider>
  );
}
