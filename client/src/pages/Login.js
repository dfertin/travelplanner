import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import "./Auth.css"

function Login() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const form = e.currentTarget
      const formData = new FormData(form)
      const password = String(formData.get("password") || "")

      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password }
      )

      localStorage.setItem("token", res.data.token)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка при входе")
    } finally {
      const passwordInput = e.currentTarget?.elements?.namedItem?.("password")
      if (passwordInput && "value" in passwordInput) {
        passwordInput.value = ""
      }
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Travel Planner</h1>
        <h2>Вход</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>

        <p className="auth-link">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
