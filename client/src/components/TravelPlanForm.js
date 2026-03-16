import { useState, useEffect } from "react"
import "./TravelPlanForm.css"

function TravelPlanForm({ plan, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    places: "",
    notes: ""
  })

  useEffect(() => {
    if (plan) {
      setFormData({
        destination: plan.destination || "",
        startDate: plan.startDate ? new Date(plan.startDate).toISOString().split('T')[0] : "",
        endDate: plan.endDate ? new Date(plan.endDate).toISOString().split('T')[0] : "",
        budget: plan.budget || "",
        places: plan.places ? plan.places.join(", ") : "",
        notes: plan.notes || ""
      })
    }
  }, [plan])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const placesArray = formData.places
      .split(",")
      .map(p => p.trim())
      .filter(p => p.length > 0)

    onSubmit({
      destination: formData.destination,
      startDate: formData.startDate,
      endDate: formData.endDate,
      budget: Number(formData.budget),
      places: placesArray,
      notes: formData.notes
    })
  }

  return (
    <div className="travel-form-container">
      <h2>{plan ? "Редактировать поездку" : "Новая поездка"}</h2>
      
      <form onSubmit={handleSubmit} className="travel-form">
        <div className="form-row">
          <div className="form-group">
            <label>Место назначения *</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Например: Париж"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Дата начала *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Дата окончания *</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Бюджет (тг) *</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="50000"
              min="0"
              step="1000"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Места для посещения</label>
            <input
              type="text"
              name="places"
              value={formData.places}
              onChange={handleChange}
              placeholder="Эйфелева башня, Лувр, Нотр-Дам (через запятую)"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Заметки</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Дополнительная информация о поездке..."
              rows="4"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save">
            {plan ? "Сохранить изменения" : "Создать поездку"}
          </button>
          <button type="button" onClick={onCancel} className="btn-cancel">
            Отмена
          </button>
        </div>
      </form>
    </div>
  )
}

export default TravelPlanForm

