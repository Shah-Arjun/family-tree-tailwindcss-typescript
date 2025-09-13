import { useState, useEffect } from "react";
import { useAuth } from '@clerk/clerk-react';

import { useNavigate } from "react-router-dom";

// importing components from clerk
import { SignIn, SignUp } from "@clerk/clerk-react";



const AuthClerk = () => {

    const [mode, setMode] = useState<"signin" | "signup">('signin');
    const { isSignedIn } = useAuth();
    const navigate = useNavigate();

    //if user is already logged in, redirects to family-tree
    useEffect(() => {
        if (isSignedIn) {
            navigate("/family-tree");
        }
    }, [isSignedIn, navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {mode === 'signin' ? (
                <>
                    <SignIn path="/auth" routing="path" signUpUrl="/auth" />
                    <p className="mt-2 text-sm">
                        Don't have an account?
                        <button onClick={() => setMode('signup')} className="text-blue-600 underline" >
                            Sign Up
                        </button>
                    </p>
                </>
            ) : (
                <>
                    <SignUp path="/auth" routing="path" signInUrl="/auth" />
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
