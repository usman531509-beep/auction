import { auth } from "./auth";

export async function getSession() {
  return auth();
}

export async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    return { session: null, error: new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }) };
  }
  return { session, error: null };
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { session: null, error: new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }) };
  }
  if (session.user.role !== "admin") {
    return { session: null, error: new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 }) };
  }
  return { session, error: null };
}
