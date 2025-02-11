"use client";

import { UserInfo } from "@/components/user-info";
import { currentUser } from "@/lib/auth";

export default async function ClientPage() {
    const user = await currentUser();

    return (
        <div>
            <UserInfo 
                label="Client component"
                user={user}
            />
        </div>
    )
}
