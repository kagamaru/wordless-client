import { createContext, useContext } from "react";

interface AuthContextType {
    user: string | null;
    login: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("AuthProvider is not wrapped");
    return context;
};
