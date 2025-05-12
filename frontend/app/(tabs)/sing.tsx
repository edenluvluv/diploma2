import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview'; // You need to install this library if not already

const SingPage: React.FC = ({ route }: any) => {
    const { song } = route.params;  // Access the song data directly from route.params

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{song.title} - {song.artist}</Text>
            <WebView
                source={{ uri: song.audio_url }}  // Use the audio_url as the YouTube video URL
                style={styles.webView}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    webView: {
        flex: 1,
    },
});

export default SingPage;
