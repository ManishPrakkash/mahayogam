import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import CitiesPage from "./pages/CitiesPage"
import BatchesPage from "./pages/BatchesPage"
import AttendancePage from "./pages/AttendancePage"
import StudentProfilePage from "./pages/StudentProfilePage"
import ProtectedRoute from "./components/ProtectedRoute"
import "./index.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/cities"
            element={
              <ProtectedRoute>
                <CitiesPage />
              </ProtectedRoute>
            }/>
          <Route
            path="/cities/:cityId/batches"
            element={
              <ProtectedRoute>
                <BatchesPage />
              </ProtectedRoute>
            }/>
          <Route
            path="/cities/:cityId/batches/:batchId/attendance"
            element={
              <ProtectedRoute>
                <AttendancePage />
              </ProtectedRoute>
            }/>
          <Route
            path="/cities/:cityId/batches/:batchId/students/:studentId"
            element={
              <ProtectedRoute>
                <StudentProfilePage />
              </ProtectedRoute>
            }/>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

