import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"

interface JwtPayload {
  user: {
    id: string,
    email: string,
    name?: string,
  };
  exp: number;
}

export const useAuth = () => {
  const [user, setUser] = useState<JwtPayload['user'] | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token");

    if(!token) return setUser(null);

    try {
      const decoded = jwtDecode<JwtPayload>(token)

      //check if token is expired
      if(decoded.exp * 1000 > Date.now()){          // second*1000 > millisecond
        localStorage.removeItem("token");
        return setUser(null);
      }

      setUser(decoded.user)
    } catch (err) {
      console.error("Invalid token:", err)
      localStorage.removeItem("token");
      setUser(null)
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null);
  }

  return (
    { user, logout }
  )
}

