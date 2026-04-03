import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

export default function CallbackPage() {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // If the authentication is successful, the user object will be populated
        if (auth.isAuthenticated) {
            console.log("Login Successful!");
            navigate("/dashboard");
        }

        // If there was an error during the sign-in process
        if (auth.error) {
            console.error("Auth error:", auth.error);
            navigate("/login-error");
        }
    }, [auth.isAuthenticated, auth.error, navigate]);

    return (
        <div className="bg-surface min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mb-4 mx-auto"></div>
                <p className="text-on-surface-variant font-label uppercase tracking-widest animate-pulse">
                    Finalizing Synchronization...
                </p>
                {auth.isLoading && (
                    <p className="text-[10px] text-on-surface-variant/40 mt-4 uppercase tracking-tighter">
                        Establishing Secure Link
                    </p>
                )}
            </div>
        </div>
    );
};