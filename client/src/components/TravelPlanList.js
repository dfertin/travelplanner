import "./TravelPlanList.css"

function TravelPlanList({ plans, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ru-RU").format(amount) + " ₸"
  }

  const getDuration = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="travel-list">
      {plans.map((plan) => (
        <div key={plan._id} className="travel-card">
          <div className="travel-card-header">
            <h3>{plan.destination}</h3>
            <div className="travel-card-actions">
              <button
                onClick={() => onEdit(plan)}
                className="btn-edit"
              >
                Редактировать
              </button>
              <button
                onClick={() => onDelete(plan._id)}
                className="btn-delete"
              >
                Удалать
              </button>
            </div>
          </div>

          <div className="travel-card-body">
            <div className="travel-info">
              <div className="info-item">
                <span className="info-label">Даты:</span>
                <span className="info-value">
                  {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">Длительность:</span>
                <span className="info-value">
                  {getDuration(plan.startDate, plan.endDate)} дней
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">Бюджет:</span>
                <span className="info-value budget">
                  {formatCurrency(plan.budget)}
                </span>
              </div>

              {plan.places && plan.places.length > 0 && (
                <div className="info-item">
                  <span className="info-label">Места:</span>
                  <div className="places-list">
                    {plan.places.map((place, index) => (
                      <span key={index} className="place-tag">
                        {place}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {plan.notes && (
                <div className="info-item">
                  <span className="info-label">Заметки:</span>
                  <span className="info-value notes">{plan.notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TravelPlanList

