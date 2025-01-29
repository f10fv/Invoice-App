import { signOut } from "@/auth";

export async function POST(req: Request) {
    try {
        await signOut();
        return new Response(null, { status: 302, headers: { Location: '/auth/login' } });
    } catch (error) {
        return new Response("Failed to log out", { status: 500 });
    }
}
