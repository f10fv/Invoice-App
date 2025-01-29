import { auth } from "@/auth";
import { UserInfo } from "@/components/user-info";
import { currentUser } from "@/lib/auth";

const profilePage = async () => {
    const user = await currentUser();

    return (
        <div>
            <UserInfo 
                label="Profile Page"
                user={user}
            />
        </div>
    )
}

export default profilePage;