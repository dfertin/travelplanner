const router = require("express").Router()
const TravelPlan = require("../models/Item")
const auth = require("../middleware/authMiddleware")

router.get("/", auth, async (req, res) => {
  try {
    const travelPlans = await TravelPlan.find({ userId: req.user.id })
      .sort({ startDate: 1 })
    
    res.status(200).json(travelPlans)
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении поездок", error: error.message })
  }
})

router.get("/:id", auth, async (req, res) => {
  try {
    const travelPlan = await TravelPlan.findOne({
      _id: req.params.id,
      userId: req.user.id
    })

    if (!travelPlan) {
      return res.status(404).json({ message: "Поездка не найдена" })
    }

    res.status(200).json(travelPlan)
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении поездки", error: error.message })
  }
})

router.post("/", auth, async (req, res) => {
  try {
    const { destination, startDate, endDate, budget, places, notes } = req.body

    if (!destination || !startDate || !endDate || budget === undefined) {
      return res.status(400).json({ message: "Заполните все обязательные поля" })
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: "Дата окончания должна быть позже даты начала" })
    }

    const travelPlan = new TravelPlan({
      destination,
      startDate,
      endDate,
      budget,
      places: places || [],
      notes: notes || "",
      userId: req.user.id
    })

    await travelPlan.save()
    res.status(201).json(travelPlan)
  } catch (error) {
    res.status(500).json({ message: "Ошибка при создании поездки", error: error.message })
  }
})

router.put("/:id", auth, async (req, res) => {
  try {
    const { destination, startDate, endDate, budget, places, notes } = req.body

    const travelPlan = await TravelPlan.findOne({
      _id: req.params.id,
      userId: req.user.id
    })

    if (!travelPlan) {
      return res.status(404).json({ message: "Поездка не найдена" })
    }

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: "Дата окончания должна быть позже даты начала" })
    }

    const updatedPlan = await TravelPlan.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        ...(destination && { destination }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(budget !== undefined && { budget }),
        ...(places !== undefined && { places }),
        ...(notes !== undefined && { notes })
      },
      { new: true, runValidators: true }
    )

    res.status(200).json(updatedPlan)
  } catch (error) {
    res.status(500).json({ message: "Ошибка при обновлении поездки", error: error.message })
  }
})

router.delete("/:id", auth, async (req, res) => {
  try {
    const travelPlan = await TravelPlan.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    })

    if (!travelPlan) {
      return res.status(404).json({ message: "Поездка не найдена" })
    }

    res.status(200).json({ message: "Поездка удалена", id: req.params.id })
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении поездки", error: error.message })
  }
})

module.exports = router