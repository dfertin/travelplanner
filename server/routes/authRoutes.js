const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email и пароль обязательны" })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Пароль должен быть не менее 6 символов" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Пользователь с таким email уже существует" })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = new User({
      email,
      password: hash
    })

    await user.save()

    res.status(201).json({ message: "Пользователь успешно зарегистрирован" })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Пользователь с таким email уже существует" })
    }
    res.status(500).json({ message: "Ошибка при регистрации", error: error.message })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email и пароль обязательны" })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: "Неверный email или пароль" })
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return res.status(401).json({ message: "Неверный email или пароль" })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.status(200).json({ token, userId: user._id })
  } catch (error) {
    res.status(500).json({ message: "Ошибка при входе", error: error.message })
  }
})

module.exports = router