import {api} from "@/lib/api";

export async function checkAuth(): Promise<boolean> {
    try {
        const res = await api.get("/auth/me")
        return res.status === 200;
    } catch (error) {
        console.error(error)
        return false
    }
}