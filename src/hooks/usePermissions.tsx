import { AuthContext } from "@/state-management/context/AuthContext"
import { useContext } from "react"

export const usePermissions = () => {
    const context = useContext(AuthContext);
    return context;
}