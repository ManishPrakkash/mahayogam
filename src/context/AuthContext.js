import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("mahayogam-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    setIsLoading(true)
    try {
      if (password.length < 6) {
        throw new Error("Invalid credentials")
      }

      const user = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        email,
      }

      localStorage.setItem("mahayogam-user", JSON.stringify(user))
      setUser(user)
      return true
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email, password, name) => {
    setIsLoading(true)
    try {
     if (password.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }

      const user = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        email,
        name,
      }

      localStorage.setItem("mahayogam-user", JSON.stringify(user))
      setUser(user)
      return true
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("mahayogam-user")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

