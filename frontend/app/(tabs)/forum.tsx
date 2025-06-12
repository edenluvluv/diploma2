import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
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
    } catch {
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
    } catch {
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
    } catch {
      Alert.alert('Қате', 'Комментарий қосу мүмкін болмады');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('games' as never)} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#1E3A8A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Форум</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={newPost}
          onChangeText={setNewPost}
          placeholder="Жаңалық бөлісіңіз..."
          style={styles.input}
          multiline
          placeholderTextColor="#94A3B8"
        />
        <TouchableOpacity onPress={createPost} style={[styles.button, !newPost.trim() && styles.buttonDisabled]} disabled={!newPost.trim()}>
          <Text style={styles.buttonText}>Жіберу</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {posts.map((post) => (
          <View key={post._id} style={styles.post}>
            <View style={styles.postHeader}>
              <Ionicons name="person-circle-outline" size={24} color="#2563EB" />
              <Text style={styles.postUser}>{post.username}</Text>
            </View>
            <Text style={styles.postText}>{post.content}</Text>

            <Text style={styles.commentTitle}>Жауаптар:</Text>
            {post.comments.length === 0 && (
              <Text style={styles.noCommentsText}>Комментарийлер жоқ</Text>
            )}
            {post.comments.map((cmt) => (
              <View key={cmt._id} style={styles.comment}>
                <View style={styles.commentHeader}>
                  <Ionicons name="chatbubble-ellipses-outline" size={18} color="#2563EB" />
                  <Text style={styles.commentUser}>{cmt.username}</Text>
                </View>
                <Text style={styles.commentText}>{cmt.text}</Text>
              </View>
            ))}

            <View style={styles.commentInputRow}>
              <TextInput
                placeholder="Жауап жазу..."
                value={newComment[post._id] || ''}
                onChangeText={(text) =>
                  setNewComment((prev) => ({ ...prev, [post._id]: text }))
                }
                style={styles.commentInput}
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity
                onPress={() => addComment(post._id)}
                style={[
                  styles.commentButton,
                  !newComment[post._id]?.trim() && styles.commentButtonDisabled,
                ]}
                disabled={!newComment[post._id]?.trim()}
              >
                <Ionicons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 6,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#DBEAFE',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E40AF',
    letterSpacing: 0.8,
  },
  inputContainer: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1E293B',
    textAlignVertical: 'top',
    minHeight: 60,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  scroll: {
    flex: 1,
  },
  post: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  postUser: {
    fontWeight: '700',
    fontSize: 17,
    color: '#1E3A8A',
    marginLeft: 8,
  },
  postText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#334155',
    marginBottom: 14,
  },
  commentTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 4,
  },
  noCommentsText: {
    fontStyle: 'italic',
    color: '#94A3B8',
    marginBottom: 10,
  },
  comment: {
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUser: {
    fontWeight: '600',
    color: '#1E40AF',
    marginLeft: 6,
    fontSize: 13,
  },
  commentText: {
    fontSize: 14,
    color: '#475569',
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
    fontSize: 15,
    color: '#1E293B',
    marginRight: 10,
  },
  commentButton: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5,
  },
  commentButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
});
