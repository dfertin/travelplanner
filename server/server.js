const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const authRoutes = require("./routes/authRoutes")
const travelRoutes = require("./routes/itemRoutes")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB подключена"))
  .catch(err => {
    console.error("Ошибка подключения к MongoDB:", err.message)
    process.exit(1)
  })

app.use("/api/auth", authRoutes)
app.use("/api/travels", travelRoutes)

app.use((req, res) => {
  res.status(404).json({ message: "Маршрут не найден" })
})

app.use((err, req, res, next) => {
  console.error("Ошибка сервера:", err)
  res.status(500).json({ 
    message: "Внутренняя ошибка сервера", 
    error: process.env.NODE_ENV === "development" ? err.message : undefined 
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`)
})