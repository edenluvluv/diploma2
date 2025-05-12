import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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

export default function Forum() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPost, setNewPost] = useState('');
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [editPostContent, setEditPostContent] = useState('');
    const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
    const router = useRouter();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch('https://your-api-url.com/api/posts');
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            console.error('Fetch posts error:', error);
        }
    };

    const createPost = async () => {
        if (!newPost) return;
        try {
            const res = await fetch('https://your-api-url.com/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newPost, username: 'CurrentUser' }),
            });
            await res.json();
            setNewPost('');
            fetchPosts();
        } catch (error) {
            console.error('Create post error:', error);
        }
    };

    const deletePost = async (id: string) => {
        try {
            await fetch(`https://your-api-url.com/api/posts/${id}`, { method: 'DELETE' });
            fetchPosts();
        } catch (error) {
            console.error('Delete post error:', error);
        }
    };

    const updatePost = async () => {
        if (!editingPostId || !editPostContent) return;
        try {
            await fetch(`https://your-api-url.com/api/posts/${editingPostId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: editPostContent }),
            });
            setEditingPostId(null);
            setEditPostContent('');
            fetchPosts();
        } catch (error) {
            console.error('Update post error:', error);
        }
    };

    const addComment = async (postId: string) => {
        if (!newComment[postId]) return;
        try {
            await fetch(`https://your-api-url.com/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newComment[postId], username: 'CurrentUser' }),
            });
            setNewComment((prev) => ({ ...prev, [postId]: '' }));
            fetchPosts();
        } catch (error) {
            console.error('Add comment error:', error);
        }
    };

    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 12 }}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>Forum</Text>

            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                <TextInput
                    value={newPost}
                    onChangeText={setNewPost}
                    placeholder="Write a post..."
                    style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        padding: 10,
                        borderRadius: 8,
                    }}
                />
                <TouchableOpacity onPress={createPost} style={{ marginLeft: 8, justifyContent: 'center' }}>
                    <Ionicons name="send" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <ScrollView>
                {posts.map((post) => (
                    <View
                        key={post._id}
                        style={{
                            borderWidth: 1,
                            borderColor: '#ddd',
                            borderRadius: 12,
                            padding: 12,
                            marginBottom: 16,
                            backgroundColor: '#f9f9f9',
                        }}
                    >
                        <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>{post.username}</Text>

                        {editingPostId === post._id ? (
                            <>
                                <TextInput
                                    value={editPostContent}
                                    onChangeText={setEditPostContent}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#ccc',
                                        borderRadius: 8,
                                        padding: 8,
                                        marginBottom: 8,
                                    }}
                                />
                                <TouchableOpacity onPress={updatePost} style={{ marginBottom: 8 }}>
                                    <Text style={{ color: '#007AFF' }}>Save</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <Text style={{ marginBottom: 8 }}>{post.content}</Text>
                        )}

                        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                            <TouchableOpacity onPress={() => {
                                setEditingPostId(post._id);
                                setEditPostContent(post.content);
                            }}>
                                <Text style={{ color: '#007AFF', marginRight: 16 }}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deletePost(post._id)}>
                                <Text style={{ color: 'red' }}>Delete</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Comments</Text>
                        {post.comments.map((comment) => (
                            <View key={comment._id} style={{ paddingLeft: 12, marginBottom: 6 }}>
                                <Text style={{ fontWeight: '600' }}>{comment.username}</Text>
                                <Text>{comment.text}</Text>
                            </View>
                        ))}

                        <View style={{ flexDirection: 'row', marginTop: 8 }}>
                            <TextInput
                                value={newComment[post._id] || ''}
                                onChangeText={(text) => setNewComment((prev) => ({ ...prev, [post._id]: text }))}
                                placeholder="Add a comment..."
                                style={{
                                    flex: 1,
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    padding: 8,
                                    borderRadius: 8,
                                }}
                            />
                            <TouchableOpacity onPress={() => addComment(post._id)} style={{ marginLeft: 8, justifyContent: 'center' }}>
                                <Ionicons name="chatbubble-ellipses" size={22} color="#007AFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
