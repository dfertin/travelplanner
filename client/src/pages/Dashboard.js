import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import TravelPlanForm from "../components/TravelPlanForm"
import TravelPlanList from "../components/TravelPlanList"
import "./Dashboard.css"

function Dashboard() {
  const [travelPlans, setTravelPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)

  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000"

  useEffect(() => {
    if (!token) {
      navigate("/")
      return
    }
    fetchTravelPlans()
  }, [token, navigate])

  const fetchTravelPlans = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/api/travels`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTravelPlans(res.data)
      setError("")
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token")
        navigate("/")
      } else {
        setError("Ошибка при загрузке поездок")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (planData) => {
    try {
      await axios.post(`${API_URL}/api/travels`, planData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchTravelPlans()
      setShowForm(false)
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка при создании поездки")
    }
  }

  const handleUpdate = async (id, planData) => {
    try {
      await axios.put(`${API_URL}/api/travels/${id}`, planData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchTravelPlans()
      setEditingPlan(null)
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка при обновлении поездки")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту поездку?")) {
      return
    }

    try {
      await axios.delete(`${API_URL}/api/travels/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchTravelPlans()
    } catch (err) {
      setError("Ошибка при удалении поездки")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  const handleEdit = (plan) => {
    setEditingPlan(plan)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingPlan(null)
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Travel Planner</h1>
        <button onClick={handleLogout} className="btn-logout">
          Выйти
        </button>
      </header>

      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}

        {!showForm ? (
          <>
            <div className="dashboard-actions">
              <button onClick={() => setShowForm(true)} className="btn-add">
                + Новая поездка
              </button>
            </div>

            {travelPlans.length === 0 ? (
              <div className="empty-state">
                <p>У вас пока нет запланированных поездок</p>
                <p>Создайте первую поездку, чтобы начать планирование.</p>
              </div>
            ) : (
              <TravelPlanList
                plans={travelPlans}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </>
        ) : (
          <TravelPlanForm
            plan={editingPlan}
            onSubmit={editingPlan ? (data) => handleUpdate(editingPlan._id, data) : handleCreate}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  )
}

export default Dashboard
