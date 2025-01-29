// "use server";

// import { signOut } from "@/auth";

// export const logout = async () => {
//     await signOut();
// }

export const logout = async () => {
    try {
        await fetch('/api/logout', {
            method: 'POST',
        });
        window.location.href = '/auth/login';
    } catch (error) {
        console.error('Error logging out:', error);
    }
}
