import { useState, useEffect } from "react"
import jwtDecode from "jwt-decode"

interface jwtPayload {
  user: {
    id: string,
    email: string,
    name?: string,
  }
}

const useAuth = () => {
  return (
    
  )
}

export default useAuth
