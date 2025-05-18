import React, { useEffect, useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert 
} from 'react-native';

// ✅ Обновлённый URL (убрали /forum)
const API_URL = 'http://localhost:3000/api';

type Comment = {
  _id: string;
  username: string;
  text: string;
};

type Post = {
  _id: string;
  username: string;
  content: string;
  comments: Comment[];
};

export default function SimpleForum() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/posts`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      Alert.alert('Ошибка', 'Не удалось загрузить посты');
    }
  };

  const createPost = async () => {
    if (!newPost.trim()) return;
    try {
      await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'Аноним', content: newPost }),
      });
      setNewPost('');
      fetchPosts();
    } catch (err) {
      Alert.alert('Ошибка', 'Не удалось создать пост');
    }
  };

  const addComment = async (postId: string) => {
    const text = newComment[postId];
    if (!text?.trim()) return;
    try {
      await fetch(`${API_URL}/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'Аноним', text }),
      });
      setNewComment((prev) => ({ ...prev, [postId]: '' }));
      fetchPosts();
    } catch (err) {
      Alert.alert('Ошибка', 'Не удалось добавить комментарий');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Форум родителей</Text>

      <TextInput
        value={newPost}
        onChangeText={setNewPost}
        placeholder="Напишите сообщение..."
        style={styles.input}
        multiline
      />
      <TouchableOpacity onPress={createPost} style={styles.button}>
        <Text style={styles.buttonText}>Отправить</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scroll}>
        {posts.map((post) => (
          <View key={post._id} style={styles.post}>
            <Text style={styles.postUser}>{post.username}</Text>
            <Text style={styles.postText}>{post.content}</Text>

            <Text style={styles.commentTitle}>Ответы:</Text>
            {post.comments.map((cmt) => (
              <View key={cmt._id} style={styles.comment}>
                <Text style={styles.commentUser}>{cmt.username}</Text>
                <Text>{cmt.text}</Text>
              </View>
            ))}

            <TextInput
              placeholder="Ответить..."
              value={newComment[post._id] || ''}
              onChangeText={(text) => setNewComment((prev) => ({ ...prev, [post._id]: text }))}
              style={styles.commentInput}
            />
            <TouchableOpacity onPress={() => addComment(post._id)} style={styles.commentButton}>
              <Text style={styles.commentButtonText}>Ответить</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F9FAFB' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 10, backgroundColor: '#fff' },
  button: { backgroundColor: '#4F46E5', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  scroll: { flex: 1 },
  post: { backgroundColor: '#fff', padding: 12, marginBottom: 16, borderRadius: 12, borderWidth: 1, borderColor: '#ddd' },
  postUser: { fontWeight: 'bold', marginBottom: 4 },
  postText: { marginBottom: 10 },
  commentTitle: { fontWeight: '600', marginBottom: 4 },
  comment: { paddingLeft: 10, marginBottom: 6 },
  commentUser: { fontWeight: 'bold' },
  commentInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 8, backgroundColor: '#F3F4F6' },
  commentButton: { backgroundColor: '#4F46E5', padding: 8, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  commentButtonText: { color: '#fff' },
});
