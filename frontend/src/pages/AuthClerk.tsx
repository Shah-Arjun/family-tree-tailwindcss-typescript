import { useState, useEffect } from "react";
import { useAuth } from '@clerk/clerk-react';   // to check user is sige=ned in or not

import { useNavigate, useLocation } from "react-router-dom";   // to redirect user

// importing components from clerk
import { SignIn, SignUp } from "@clerk/clerk-react";



const AuthClerk = () => {
    //save the user signed in or not status
    const [mode, setMode] = useState<"signin" | "signup">('signin');
    const { isSignedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    //if user is already logged in, redirects to family-tree
    useEffect(() => {
        if (isSignedIn) {
            // If protected route redirected user here, location.state?.from exists
            const destination = (location.state as any)?.from?.pathname || "/family-tree";
            navigate(destination, { replace: true });
        }
    }, [isSignedIn, location, navigate]);


    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {mode === 'signin' ? (
                <>
                    <SignIn routing="virtual" />
                    <p className="mt-2 text-sm">
                        Don't have an account?
                        <button onClick={() => setMode('signup')} className="text-blue-600 underline" >
                            Sign Up
                        </button>
                    </p>
                </>
            ) : (
                <>
                    <SignUp routing="virtual" />
                    <p className="mt-4 text-sm">
                        Already have an account?
                        <button onClick={() => setMode("signin")} className="text-blue-600 underline">
                            Sign In
                        </button>
                    </p>
                </>
            )}
        </div>
    )
}

export default AuthClerk;
