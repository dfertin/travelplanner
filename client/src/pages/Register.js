import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import "./Auth.css"

function Register() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const form = e.currentTarget
    const formData = new FormData(form)
    const password = String(formData.get("password") || "")
    const confirmPassword = String(formData.get("confirmPassword") || "")

    if (password !== confirmPassword) {
      setError("Пароли не совпадают")
      return
    }

    if (password.length < 6) {
      setError("Пароль должен быть не менее 6 символов")
      return
    }

    setLoading(true)

    try {
      await axios.post(
        `${API_URL}/api/auth/register`,
        { email, password }
      )
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка при регистрации")
    } finally {
      const passwordInput = e.currentTarget?.elements?.namedItem?.("password")
      if (passwordInput && "value" in passwordInput) {
        passwordInput.value = ""
      }
      const confirmInput = e.currentTarget?.elements?.namedItem?.("confirmPassword")
      if (confirmInput && "value" in confirmInput) {
        confirmInput.value = ""
      }
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Travel Planner</h1>
        <h2>Регистрация</h2>
        
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
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <label>Подтвердите пароль</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>

        <p className="auth-link">
          Уже есть аккаунт? <Link to="/">Войти</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
