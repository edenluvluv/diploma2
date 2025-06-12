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

// MongoDB connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas
const User = mongoose.model('User', new mongoose.Schema({
  fullName: String,
  phoneNumber: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' }
}));

const Note = mongoose.model('Note', new mongoose.Schema({
  userId: { type: String, default: 'anonymous' },
  title: { type: String, required: true },
  content: { type: String, required: true },
  mood: String,
  createdAt: { type: Date, default: Date.now }
}));

// ============ USER ROUTES ==============
app.post('/api/register', async (req, res) => {
  const { fullName, phoneNumber, email, password } = req.body;

  if (!fullName || !phoneNumber || !email || !password) {
    return res.status(400).json({ message: 'Барлық өрістер толтырылуы керек' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Бұл email бұрын тіркелген' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, phoneNumber, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Тіркелу сәтті өтті!' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Сервер қатесі' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email және құпиясөз қажет' });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'Пайдаланушы табылмады' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Құпиясөз қате' });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Кіру сәтті өтті',
      token,
      user: { id: user._id, fullName: user.fullName, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Сервер қатесі' });
  }
});

// ============ DIARY ROUTES ==============

// Get all notes (anonymous supported)
app.get('/api/notes', async (req, res) => {
  try {
    const userId = req.query.userId || 'anonymous';
    const notes = await Note.find({ userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error('Fetch notes error:', error);
    res.status(500).json({ message: 'Сервер қатесі' });
  }
});

// Get specific note
app.get('/api/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Жазба табылмады' });
    res.json(note);
  } catch (error) {
    console.error('Fetch note error:', error);
    res.status(500).json({ message: 'Сервер қатесі' });
  }
});

// Create new note (anonymous allowed)
app.post('/api/notes', async (req, res) => {
  try {
    const { userId, title, content, mood } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Атауы мен мазмұны міндетті' });
    }

    const newNote = new Note({
      userId: userId || 'anonymous',
      title,
      content,
      mood,
      createdAt: new Date()
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Сервер қатесі' });
  }
});

// Update note
app.put('/api/notes/:id', async (req, res) => {
  try {
    const { title, content, mood } = req.body;
    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, mood },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Жазба табылмады' });
    res.json(updated);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Сервер қатесі' });
  }
});

// Delete note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Жазба табылмады' });
    res.json({ message: 'Жазба жойылды' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Сервер қатесі' });
  }
});
const CommentSchema = new mongoose.Schema({
  username: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
  username: String,
  content: String,
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', PostSchema);
// Получить все посты
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении постов' });
  }
});

// Создать новый пост
app.post('/api/posts', async (req, res) => {
  const { username, content } = req.body;

  if (!content) return res.status(400).json({ message: 'Текст обязателен' });

  try {
    const newPost = new Post({ username, content });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при создании поста' });
  }
});

// Добавить комментарий к посту
app.post('/api/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const { username, text } = req.body;

  if (!text) return res.status(400).json({ message: 'Комментарий обязателен' });

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Пост не найден' });

    post.comments.push({ username, text });
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при добавлении комментария' });
  }
});


// ============ SONGS ROUTES ==============

const Song = mongoose.model('Song', new mongoose.Schema({
  songID: { type: String, unique: true },
  songTitle: String,
  URL: String,
  lyrics: String
}));

// Get all songs
app.get('/api/songs', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Сервер қатесі' });
  }
});

// Add a new song
app.post('/api/songs', async (req, res) => {
  try {
    const { songID, songTitle, URL, lyrics } = req.body;
    const newSong = new Song({ songID, songTitle, URL, lyrics });
    await newSong.save();
    res.status(201).json(newSong);
  } catch (error) {
    res.status(500).json({ message: 'Қосу қатесі' });
  }
});

// Update a song
app.put('/api/songs/:id', async (req, res) => {
  try {
    const { songTitle, URL, lyrics } = req.body;
    const updated = await Song.findByIdAndUpdate(
      req.params.id,
      { songTitle, URL, lyrics },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Ән табылмады' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Жаңарту қатесі' });
  }
});

// Delete a song
app.delete('/api/songs/:id', async (req, res) => {
  try {
    const deleted = await Song.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Ән табылмады' });
    res.json({ message: 'Ән жойылды' });
  } catch (error) {
    res.status(500).json({ message: 'Жою қатесі' });
  }
});









// Start server
app.listen(PORT, () => {
  console.log(`🚀 Сервер іске қосылды: http://192.168.1.69:${PORT}`);
});
