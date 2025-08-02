import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchNextjsServer } from "@/helpers";
import { User } from "@/@types";

export const useUserInfo = () => {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const t = localStorage.getItem("IdToken");
        if (!t) {
            router.push("/auth/login");
        } else {
            setToken(t);
        }
    }, [router]);

    const {
        data,
        isLoading = true,
        error
    } = useQuery({
        queryKey: ["userInfo", token],
        queryFn: async () => {
            if (!token) throw new Error("Token missing");

            const { sub } = jwtDecode<{ sub: string }>(token);
            const user = await fetchNextjsServer<User>(`/api/userSub/${sub}`, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: token
                }
            });

            return user.data;
        },
        enabled: !!token,
        retry: false
    });

    return { data, isLoading, error };
};
