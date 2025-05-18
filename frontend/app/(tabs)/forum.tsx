import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

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
  const navigation = useNavigation();
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
      Alert.alert('Қате', 'Посттарды жүктеу мүмкін болмады');
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
      Alert.alert('Қате', 'Постты жасау мүмкін болмады');
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
      Alert.alert('Қате', 'Комментарий қосу мүмкін болмады');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('games')}> //здесь роут поменять
          <Ionicons name="arrow-back" size={28} color="#1E3A8A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Форум</Text>
      </View>

      <TextInput
        value={newPost}
        onChangeText={setNewPost}
        placeholder="Жаңалық бөлісіңіз..."
        style={styles.input}
        multiline
      />
      <TouchableOpacity onPress={createPost} style={styles.button}>
        <Text style={styles.buttonText}>Жіберу</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scroll}>
        {posts.map((post) => (
          <View key={post._id} style={styles.post}>
            <Text style={styles.postUser}>{post.username}:</Text>
            <Text style={styles.postText}>{post.content}</Text>

            <Text style={styles.commentTitle}>Жауаптар:</Text>
            {post.comments.map((cmt) => (
              <View key={cmt._id} style={styles.comment}>
                <Text style={styles.commentUser}>{cmt.username}</Text>
                <Text>{cmt.text}</Text>
              </View>
            ))}

            <TextInput
              placeholder="Жауап жазу..."
              value={newComment[post._id] || ''}
              onChangeText={(text) =>
                setNewComment((prev) => ({ ...prev, [post._id]: text }))
              }
              style={styles.commentInput}
            />
            <TouchableOpacity
              onPress={() => addComment(post._id)}
              style={styles.commentButton}
            >
              <Text style={styles.commentButtonText}>Жауап беру</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  scroll: { flex: 1 },
  post: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderColor: '#E5E7EB',
    borderWidth: 1,
  },
  postUser: { fontWeight: 'bold', marginBottom: 4 },
  postText: { marginBottom: 10 },
  commentTitle: { fontWeight: '600', marginTop: 10 },
  comment: {
    backgroundColor: '#F1F5F9',
    padding: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  commentUser: { fontWeight: 'bold' },
  commentInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 8,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  commentButton: {
    backgroundColor: '#2563EB',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  commentButtonText: { color: '#fff', fontWeight: '600' },
});
