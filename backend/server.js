require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = 'mongodb+srv://bbxx77:NurAli2013@cluster0.o4f0yrh.mongodb.net/diploma?retryWrites=true&w=majority';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ Error connecting to MongoDB:', err));

// 📌 Схема пользователя (БЕЗ ХЕШИРОВАНИЯ ПАРОЛЕЙ)
const UserSchema = new mongoose.Schema({
  fullName: String,
  phoneNumber: String,
  email: { type: String, unique: true },
  password: String // ⚠️ Пароль будет храниться в открытом виде
});

const User = mongoose.model('User', UserSchema);

// 📌 Главная страница
app.get('/', (req, res) => {
  res.send('Welcome to Diploma API!');
});

// 📌 Регистрация пользователя (БЕЗ ХЕШИРОВАНИЯ)
app.post('/api/register', async (req, res) => {
  const { fullName, phoneNumber, email, password } = req.body;

  if (!fullName || !phoneNumber || !email || !password) {
    return res.status(400).json({ message: 'Все поля должны быть заполнены' });
  }

  try {
    // Проверяем, существует ли email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Этот email уже зарегистрирован' });
    }

    // СОХРАНЯЕМ ПАРОЛЬ В ОТКРЫТОМ ВИДЕ (⚠️ НЕБЕЗОПАСНО)
    const newUser = new User({ fullName, phoneNumber, email, password });
    await newUser.save();

    res.status(201).json({ message: 'Регистрация успешна!' });
  } catch (error) {
    console.error('❌ Ошибка при регистрации:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// 📌 Вход в систему (логин)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Введите email и пароль' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // ПРОВЕРЯЕМ ПАРОЛЬ (БЕЗ ХЕШИРОВАНИЯ)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Неверный пароль' });
    }

    // Создаем токен
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ message: 'Вход выполнен!', token, user });
  } catch (error) {
    console.error('❌ Ошибка при входе:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// 📌 Получение списка пользователей (без паролей)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Исключаем пароли
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении списка пользователей' });
  }
});

// 📌 Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
