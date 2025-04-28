import { signOut } from "next-auth/react";

export async function handleLogout() {
    const currentOrigin = window.location.origin;

    try {
        await fetch(`${currentOrigin}/api/auth/custom-signout`, {
            method: 'POST',
            credentials: 'include',
            redirect: 'follow'
        })
        window.location.href = `${currentOrigin}/auth/login`;
    } catch (error) {
        console.log('erro ao logout', error)
        signOut({
            callbackUrl: `${currentOrigin}/auth/login`,
            redirect: true
        });
    }
}