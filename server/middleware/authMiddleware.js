const jwt = require("jsonwebtoken")

module.exports = function (req, res, next) {
  try {
    const header = req.headers.authorization

    if (!header) {
      return res.status(401).json({ message: "Токен не предоставлен" })
    }

    const token = header.split(" ")[1]

    if (!token) {
      return res.status(401).json({ message: "Токен не найден" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Токен истёк" })
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Неверный токен" })
    }
    res.status(401).json({ message: "Ошибка аутентификации", error: error.message })
  }
}