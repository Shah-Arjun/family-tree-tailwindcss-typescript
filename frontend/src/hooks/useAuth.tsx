import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface JwtPayload {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  exp: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      console.log("token found:", token);

      if (!token) return setUser(null);

      try {
        const decoded = jwtDecode<JwtPayload>(token);
        console.log("decoded user:", decoded);

        // Expired?
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          console.log("token expired");
          return setUser(null);
        }

        // Get user from backend
        const res = await fetch("http://localhost:5000/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data: User = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Invalid token or fetch error:", err);
        localStorage.removeItem("token");
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  // 👀 Watch for updates
  useEffect(() => {
    console.log("User state updated:", user);
  }, [user]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/auth");
  };

  return { user, logout };
};
