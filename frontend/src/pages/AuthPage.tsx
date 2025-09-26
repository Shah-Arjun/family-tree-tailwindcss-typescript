import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trees, ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import DarkModeToggleButton from '@/components/ui/toggle';

import { jwtDecode } from "jwt-decode";



type StrengthRules = {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
};


const AuthPage = () => {

  // Keeps track of email & password input values.
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({                    //all values are null initially
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  // const [errors, setErrors] = useState({})    //for password strength check, for pw validation,,, // A validation function runs and populates the 'errors' object
  // const [password, setPassword] = useState<string>("")
  const [strength, setStrength] = useState<number>(0);
  const [rules, setRules] = useState<StrengthRules>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  })

  // Controls the error/success notification message
  const [toast, setToast] = useState({ show: false, message: "", type: "danger" });


  const navigate = useNavigate();


  // to trace change in input field of form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    if (e.target.name === "password") {               // if name then validate it
      setStrength(getPasswordStrength(e.target.value));
    }
  };




  // function to handle form submit to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)

    //only validate on signup
    if (!isLogin) {
      if (strength < 3) {   // require at least goot password
        alert("Please choose a stronger password before signing up.")
        return
      }
      if (form.password !== form.confirmPassword) {
        alert("Confirm password and password field should be same.");
        return
      }
    }

    const endpoints = isLogin ? "loginuser" : "createuser";

    const API_URL = import.meta.env.VITE_API_URL

    const response = await fetch(`${API_URL}/api/${endpoints}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await response.json();   // parse the backend response to json
    console.log(data);

    if (data.success) {
      // ✅ Save token always
      localStorage.setItem("token", data.authToken);
      console.log("Token saved:", data.authToken);

      try {
        const token = localStorage.getItem("token")
        console.log("token found:", token)

        // 🔑 Decode the token to extract user id
        const decoded: any = jwtDecode(data.authToken);
        const userId = decoded?.user?.id;

        if (userId) {
          localStorage.setItem("userId", userId);
          console.log("User id saved to localStorage:", userId);
        } else {
          console.warn("No userId found in token payload");
        }

      } catch (err) {
        console.error("failed to fetch member", err)
      } finally {
        setLoading(false)
      }

      if (isLogin) {
        navigate("/family-tree");
        alert("Login Successful!");
      } else {
        setIsLogin(true);
        navigate("/family-tree");
        alert("Sign Up Successful!");
      }
    } else {
      alert(data.error || "Invalid credentials, please try again.");
    }
  };




  //function to validate pw when new user is to be created
  const getPasswordStrength = (password: string): number => {
    let score = 0

    const newRules: StrengthRules = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    };

    if (newRules.length) score++;
    if (newRules.uppercase) score++;
    if (newRules.lowercase) score++;
    if (newRules.number) score++;

    setRules(newRules);
    return score;        //returns 0-4
  }


  // make sure labels are typed as string[]
  const strengthLabels: string[] = [
    "Very Weak",
    "Weak",
    "Fair",
    "Good",
    "Strong",
    "Very Strong",
  ];

  const strengthColors: string[] = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-emerald-600",
  ];

  return (
    <>
      {/* <DarkModeToggleButton /> */}

      {/* back arrow button */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6 relative">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 blur-3xl opacity-60"></div>

        <div className="relative w-full max-w-md z-10">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-muted-foreground hover:text-foreground flex justify-start"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          {/* main login or signup toggle card */}
          <Card className="w-full bg-background/70 backdrop-blur-xl border border-primary/20 shadow-xl rounded-2xl">
            <CardHeader className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-md">
                  <Trees className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {isLogin
                    ? 'Sign in to continue building your family tree'
                    : 'Start your family tree journey today'}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-3">
                {!isLogin && (
                  <div className="space-y-2 text-start">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={handleInputChange}
                        required={!isLogin}
                        className="pl-10 bg-background/70 border-primary/30 focus:border-primary rounded-xl"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-start">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleInputChange}
                      required
                      className="pl-10 bg-background/70 border-primary/30 focus:border-primary rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-start">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleInputChange}
                      required
                      className="pl-10 bg-background/70 border-primary/30 focus:border-primary rounded-xl"
                    />
                  </div>
                </div>


                {!isLogin && (
                  <div className="space-y-2 text-start">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={form.confirmPassword}
                        onChange={handleInputChange}
                        required={!isLogin}
                        className="pl-10 bg-background/70 border-primary/30 focus:border-primary rounded-xl"
                      />
                    </div>

                    {/* live pw strngth show */}
                    {form.password && (
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded h-2 mb-1">
                          <div
                            className={`h-2 rounded ${strengthColors[strength]}`}
                            style={{ width: `${(strength / 4) * 100}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-700">
                          Strength: <span>{strengthLabels[strength]}</span>
                        </p>

                        {/* rules */}
                        <ul className="flex flex-col items-start mx-auto w-fit text-xs text-gray-600 mt-2 space-y-1">
                          <li className={rules.length ? "text-green-600" : ""}>
                            {rules.length ? "✔" : ""} At least 8 characters
                          </li>
                          <li className={rules.uppercase ? "text-green-600" : ""}>
                            {rules.uppercase ? "✔" : ""} One uppercase letter
                          </li>
                          <li className={rules.lowercase ? "text-green-600" : ""}>
                            {rules.lowercase ? "✔" : ""} One lowercase letter
                          </li>
                          <li className={rules.number ? "text-green-600" : ""}>
                            {rules.number ? "✔" : ""} One number
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-6 mt-4 rounded-xl shadow-lg"
                >
                  {loading
                    ? (isLogin ? "Loggin in..." : "Creating Account...")
                    : (isLogin ? "Login" : "Create Account")
                  }                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <Button
                    variant="link"
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-1 pl-0 text-primary hover:text-accent font-semibold"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>



          {/* Toast notification  shows if toast.show:true */}
          {toast.show && (
            <div className="space-y-3 fixed bottom-4 right-4">
              <div className="max-w-xs bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-800 dark:border-neutral-700" role="alert" aria-labelledby="hs-toast-normal-example-label">
                <div className="flex p-4">
                  <div className="shrink-0">
                    <svg className="shrink-0 size-4 text-blue-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"></path>
                    </svg>
                  </div>
                  <div className="ms-3 flex-1">
                    <p id="hs-toast-normal-example-label" className="text-sm text-gray-700 dark:text-neutral-400 pr-5">
                      {toast.message}
                    </p>
                  </div>
                  <button
                    onClick={() => setToast({ ...toast, show: false })}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}




          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </>
  );
};


export default AuthPage;
