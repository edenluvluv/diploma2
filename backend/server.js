require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = 'mongodb+srv://bbxx77:NurAli2013@cluster0.o4f0yrh.mongodb.net/diploma?retryWrites=true&w=majority';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// User Schema
const UserSchema = new mongoose.Schema({
  fullName: String,
  phoneNumber: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' }
});

const User = mongoose.model('User', UserSchema);

// Song Schema
const SongSchema = new mongoose.Schema({
  title: String,
  artist: String,
  audio_url: String,
  lyrics: String,
  added_by_admin: { type: Boolean, default: true },
});

const Song = mongoose.model('Song', SongSchema);

// NEW: Note Schema for Diary App
const NoteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Note = mongoose.model('Note', NoteSchema);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// === User Routes ===
app.post('/api/register', async (req, res) => {
  const { fullName, phoneNumber, email, password } = req.body;

  if (!fullName || !phoneNumber || !email || !password) {
    return res.status(400).json({ message: 'Все поля должны быть заполнены' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Этот email уже зарегистрирован' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      phoneNumber,
      email,
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();
    res.status(201).json({ message: 'Регистрация успешна!' });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверный пароль' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ message: 'Вход выполнен!', token, user: { fullName: user.fullName, role: user.role } });
  } catch (error) {
    console.error('Ошибка при входе:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении списка пользователей' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, role } = req.body; // Only allow updating these fields

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { fullName, role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// === Karaoke Song Routes ===
app.get('/api/songs', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении списка песен' });
  }
});

// Add new song (Admin only)
app.post('/api/songs', verifyAdmin, async (req, res) => {
  const { title, artist, audio_url, lyrics } = req.body;

  try {
    const newSong = new Song({ title, artist, audio_url, lyrics });
    await newSong.save();
    res.status(201).json(newSong);
  } catch (error) {
    console.error('Ошибка при добавлении песни:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Delete song (Admin only)
app.delete('/api/songs/:id', verifyAdmin, async (req, res) => {
  try {
    const deletedSong = await Song.findByIdAndDelete(req.params.id);

    if (!deletedSong) {
      return res.status(404).json({ message: 'Song not found' });
    }

    res.json({ message: 'Song deleted successfully' });
  } catch (error) {
    console.error('Error deleting song:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// === NEW: DIARY NOTES ROUTES ===
// Get all notes for a user
app.get('/api/notes', async (req, res) => {
  try {
    console.log('Fetching notes');
    // For now, we'll return all notes - you might want to filter by userId later
    const notes = await Note.find();
    console.log(`Found ${notes.length} notes`);
    res.json(notes);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new note
app.post('/api/notes', async (req, res) => {
  try {
    const { userId, title, content } = req.body;
    console.log('Creating new note:', { userId, title, content });
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    const newNote = new Note({ userId, title, content });
    const savedNote = await newNote.save();
    console.log('Note saved successfully:', savedNote);
    res.status(201).json(savedNote);
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update note
app.put('/api/notes/:id', async (req, res) => {
  try {
    const { userId, title, content } = req.body;
    console.log('Updating note:', req.params.id, { userId, title, content });
    
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { userId, title, content },
      { new: true }
    );
    
    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    console.log('Note updated successfully:', updatedNote);
    res.json(updatedNote);
  } catch (err) {
    console.error('Error updating note:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    console.log('Deleting note:', req.params.id);
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    
    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    console.log('Note deleted successfully');
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error('Error deleting note:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Middleware for Admin Authentication ---
function verifyAdmin(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    req.user = decoded;
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access forbidden: Admins only' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// --- Start the server ---
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});