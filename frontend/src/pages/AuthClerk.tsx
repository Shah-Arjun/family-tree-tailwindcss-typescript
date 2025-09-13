import { useState } from "react";

// importing components from clerk
import { SignIn, SignUp } from "@clerk/clerk-react";




const AuthClerk = () => {

    const [mode, setMode] = useState<"signin" | "signup">('signin')

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-6">
            {mode === 'signin' ? (
                <>
                    <SignIn path="/auth" routing="path" signUpUrl="/auth" />
                    <p>
                        Don't have an account?
                        <button onClick={() => setMode('signup')}>
                            Sign Up
                        </button>
                    </p>
                </>
            ) : (
                <>
                    <SignUp path="/auth" routing="path" signInUrl="/auth" />
                    <p>
                        Already have an account?
                        <button onClick={() => setMode("signin")}>
                            Sign In
                        </button>
                    </p>
                </>
            )}
        </div>
    )
}

export default AuthClerk;
