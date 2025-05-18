// sing.tsx
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, Modal,
    TouchableOpacity, Alert
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

const SingPage: React.FC = ({ route }: any) => {
    const { song } = route.params;
    const navigation = useNavigation();
    const [paused, setPaused] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handlePause = () => {
        setPaused(true);
        setShowModal(true);
    };

    const handleContinue = () => {
        setPaused(false);
        setShowModal(false);
    };

    const handleGoBack = () => {
        setShowModal(false);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{song.title} - {song.artist}</Text>

            <WebView
                source={{ uri: song.audio_url }}
                style={styles.webView}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                mediaPlaybackRequiresUserAction={false}
                paused={paused}
            />

            <Text style={styles.lyrics}>{song.lyrics}</Text>

            <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
                <Text style={styles.pauseText}>⏸ Тоқтату</Text>
            </TouchableOpacity>

            <Modal visible={showModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Ойынды тоқтаттыңыз</Text>
                        <TouchableOpacity style={styles.modalBtn} onPress={handleContinue}>
                            <Text style={styles.modalBtnText}>Жалғастыру</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#dc3545' }]} onPress={handleGoBack}>
                            <Text style={styles.modalBtnText}>Артқа оралу</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    webView: { flex: 1, height: 200 },
    lyrics: { marginTop: 10, fontSize: 16 },
    pauseButton: {
        backgroundColor: '#f0ad4e',
        padding: 12,
        marginTop: 10,
        borderRadius: 10,
        alignItems: 'center'
    },
    pauseText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center', alignItems: 'center'
    },
    modalContent: {
        backgroundColor: '#fff', padding: 20,
        borderRadius: 10, alignItems: 'center'
    },
    modalText: { fontSize: 18, marginBottom: 20 },
    modalBtn: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 8,
        marginVertical: 5,
        minWidth: 150,
        alignItems: 'center'
    },
    modalBtnText: { color: '#fff', fontSize: 16 },
});

export default SingPage;
