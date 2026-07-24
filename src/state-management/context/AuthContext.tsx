import { permission } from "process";
import { createContext, useState } from "react";

export interface AuthContextType {
    permissions: string[];
}

const initialSate = {
    permissions: []
}
export const AuthContext = createContext<AuthContextType>(initialSate);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [permissions, setPermissions] = useState<string[]>([]);
    return (
        <AuthContext.Provider value={{permissions}}>
            {children}
        </AuthContext.Provider>
    )
}