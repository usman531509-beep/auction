import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import AdminUserRow from "@/components/admin/AdminUserRow";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await dbConnect();
  const users = await User.find().select("name email role createdAt").sort({ createdAt: -1 }).lean();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-ink-muted">Promote bidders to admins or remove accounts.</p>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u: any) => (
              <AdminUserRow
                key={String(u._id)}
                user={{
                  _id: String(u._id),
                  name: u.name,
                  email: u.email,
                  role: u.role,
                  createdAt: u.createdAt.toISOString(),
                }}
              />
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
