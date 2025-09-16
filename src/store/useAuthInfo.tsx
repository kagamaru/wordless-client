import { create } from "zustand";

type AuthInfo = {
    email: string;
    password: string;
};

type AuthInfoStore = {
    authInfo: AuthInfo;
    setAuthInfo: (authInfo: AuthInfo) => void;
    cleanAllData: () => void;
};

let timeoutId: ReturnType<typeof setTimeout> | null = null;

export const useAuthInfoStore = create<AuthInfoStore>((set) => ({
    authInfo: {
        email: "",
        password: ""
    },
    setAuthInfo: (authInfo: AuthInfo) => {
        set({ authInfo });
        // NOTE: 5分で自動クリア（使い回し・放置対策）
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => set({ authInfo: { email: "", password: "" } }), 5 * 60 * 1000);
    },
    cleanAllData: () => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = null;
        set({ authInfo: { email: "", password: "" } });
    }
}));
