import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const storedUser = localStorage.getItem("worksphereUser");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Invalid stored user data");

                localStorage.removeItem("worksphereUser");
                localStorage.removeItem("token");
            }
        }

        setLoading(false);

    }, []);

    const login = (userData, token) => {

        localStorage.setItem(
            "worksphereUser",
            JSON.stringify(userData)
        );

        localStorage.setItem("token", token);

        setUser(userData);
    };

    const logout = () => {

        localStorage.removeItem("worksphereUser");
        localStorage.removeItem("token");

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};