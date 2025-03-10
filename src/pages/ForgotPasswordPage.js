import { useState } from "react"
import { Link } from "react-router-dom"
function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-center mb-2">Forgot Password</h1>

          {submitted ? (
            <div className="text-center space-y-4">
              <p className="text-gray-500">
                If an account exists with the email {email}, we've sent instructions to reset your password.
              </p>
              <Link to="/login">
                <button className="btn btn-primary w-full rounded-xl py-6">Return to Login</button>
              </Link>
            </div>
          ) : (
            <>
              <p className="text-center text-gray-500 mb-8">
                Enter your email address and we'll send you a link to reset your password
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input w-full rounded-xl"
                  />
                </div>

                <button type="submit" className="btn btn-primary w-full rounded-xl py-6">
                  Send Reset Link
                </button>

                <div className="text-center">
                  <Link to="/login" className="text-primary">
                    Back to Login
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage

