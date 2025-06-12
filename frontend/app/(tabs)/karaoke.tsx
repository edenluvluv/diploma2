import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Animated,
    StatusBar,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';

// Kazakh kids songs playlist
const karaokePlaylist = [
    {
        id: 1,
        title: "Аю Әні",
        url: "https://www.youtube.com/watch?v=9bzPUrWa2uA&ab_channel=Torghai-TV"
    },
    {
        id: 2,
        title: "Қошақаным",
        url: "https://www.youtube.com/watch?v=IhsGPrwMW30&ab_channel=BilimKids%E2%80%93%D0%BC%D0%B5%D0%BA%D1%82%D0%B5%D0%BF%D0%BA%D0%B5%D0%B4%D0%B5%D0%B9%D1%96%D0%BD%D0%B3%D1%96%D0%B1%D1%96%D0%BB%D1%96%D0%BC%D0%B1%D0%B5%D1%80%D1%83"
    },
    {
        id: 3,
        title: "Қуыр, Қуыр Қуырмаш",
        url: "https://www.youtube.com/watch?v=CQt2QNrRSBk&ab_channel=Torghai-TV"
    },
    {
        id: 4,
        title: "Бес қошақан",
        url: "https://www.youtube.com/watch?v=DfR5Bi7nmfg&ab_channel=Torghai-TV"
    },
];

const KaraokeScreen = () => {
    const router = useRouter();
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [titleAnimation] = useState(new Animated.Value(0));
    const [controlsAnimation] = useState(new Animated.Value(0));
    const [videoAnimation] = useState(new Animated.Value(0));

    const screenDimensions = Dimensions.get('window');

    useEffect(() => {
        // Start animations when component mounts
        Animated.stagger(200, [
            Animated.spring(titleAnimation, {
                toValue: 1,
                useNativeDriver: true,
                tension: 100,
                friction: 8,
            }),
            Animated.spring(videoAnimation, {
                toValue: 1,
                useNativeDriver: true,
                tension: 100,
                friction: 8,
            }),
            Animated.spring(controlsAnimation, {
                toValue: 1,
                useNativeDriver: true,
                tension: 100,
                friction: 8,
            })
        ]).start();
    }, []);

    const handlePreviousSong = () => {
        const newIndex = currentSongIndex > 0 ? currentSongIndex - 1 : karaokePlaylist.length - 1;
        setCurrentSongIndex(newIndex);
    };

    const handleNextSong = () => {
        const newIndex = currentSongIndex < karaokePlaylist.length - 1 ? currentSongIndex + 1 : 0;
        setCurrentSongIndex(newIndex);
    };

    const currentSong = karaokePlaylist[currentSongIndex];

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#FDF2F8" />
            <SafeAreaView style={styles.container}>
                {/* Back navigation */}
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <LinearGradient
                        colors={['#FFB6C1', '#FFF0F5']}
                        style={styles.backButtonInner}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Ionicons name="arrow-back" size={24} color="#8B4B8C" />
                    </LinearGradient>
                </TouchableOpacity>

                {/* Header with title */}
                <Animated.View
                    style={[
                        styles.headerSection,
                        {
                            transform: [
                                {
                                    translateY: titleAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-50, 0],
                                    }),
                                },
                                { scale: titleAnimation },
                            ],
                            opacity: titleAnimation,
                        },
                    ]}
                >
                    <LinearGradient
                        colors={['#FFE0F0', '#E0F0FF']}
                        style={styles.headerBackground}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.mainTitle}>🎤 Бірге ән салайық! 🎵</Text>
                        <Text style={styles.songProgress}>
                            {currentSongIndex + 1} / {karaokePlaylist.length}
                        </Text>
                    </LinearGradient>
                </Animated.View>

                {/* Main player area */}
                <View style={styles.playerSection}>
                    {/* Previous button */}
                    <Animated.View
                        style={[
                            styles.controlWrapper,
                            {
                                transform: [
                                    {
                                        translateX: controlsAnimation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [-50, 0],
                                        }),
                                    },
                                    { scale: controlsAnimation },
                                ],
                                opacity: controlsAnimation,
                            },
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.navigationButton}
                            onPress={handlePreviousSong}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#FF6B9D', '#C44569']}
                                style={styles.buttonBackground}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Ionicons name="play-skip-back" size={32} color="#FFFFFF" />
                            </LinearGradient>
                        </TouchableOpacity>
                        <Text style={styles.buttonLabel}>Алдыңғы</Text>
                    </Animated.View>

                    {/* Video player */}
                    <Animated.View
                        style={[
                            styles.videoSection,
                            {
                                transform: [{ scale: videoAnimation }],
                                opacity: videoAnimation,
                            },
                        ]}
                    >
                        <LinearGradient
                            colors={['#FFE0F0', '#E0F0FF']}
                            style={styles.videoWrapper}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View style={styles.videoPlayer}>
                                <WebView
                                    source={{ uri: currentSong.url }}
                                    style={styles.webview}
                                    allowsInlineMediaPlayback={true}
                                    mediaPlaybackRequiresUserAction={false}
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                    startInLoadingState={true}
                                    scalesPageToFit={true}
                                />
                            </View>
                        </LinearGradient>
                        
                        {/* Current song title */}
                        <View style={styles.songInfo}>
                            <LinearGradient
                                colors={['#FFFFFF', '#F8F9FA']}
                                style={styles.songInfoBackground}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.currentSongTitle}>{currentSong.title}</Text>
                            </LinearGradient>
                        </View>
                    </Animated.View>

                    {/* Next button */}
                    <Animated.View
                        style={[
                            styles.controlWrapper,
                            {
                                transform: [
                                    {
                                        translateX: controlsAnimation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [50, 0],
                                        }),
                                    },
                                    { scale: controlsAnimation },
                                ],
                                opacity: controlsAnimation,
                            },
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.navigationButton}
                            onPress={handleNextSong}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#4CAF50', '#81C784']}
                                style={styles.buttonBackground}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Ionicons name="play-skip-forward" size={32} color="#FFFFFF" />
                            </LinearGradient>
                        </TouchableOpacity>
                        <Text style={styles.buttonLabel}>Келесі</Text>
                    </Animated.View>
                </View>

                {/* Background decorations */}
                <View style={styles.backgroundDecorations}>
                    <View style={[styles.musicNote, { top: '20%', left: '10%' }]}>
                        <Text style={styles.noteEmoji}>🎵</Text>
                    </View>
                    <View style={[styles.musicNote, { top: '30%', right: '15%' }]}>
                        <Text style={styles.noteEmoji}>🎤</Text>
                    </View>
                    <View style={[styles.musicNote, { bottom: '25%', left: '8%' }]}>
                        <Text style={styles.noteEmoji}>🎶</Text>
                    </View>
                    <View style={[styles.musicNote, { bottom: '35%', right: '10%' }]}>
                        <Text style={styles.noteEmoji}>⭐</Text>
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDF2F8',
        paddingTop: 20,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
        borderRadius: 25,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    backButtonInner: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerSection: {
        marginTop: 60,
        marginHorizontal: 20,
        marginBottom: 30,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 8,
    },
    headerBackground: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        alignItems: 'center',
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#8B4B8C',
        textAlign: 'center',
        marginBottom: 8,
    },
    songProgress: {
        fontSize: 16,
        color: '#B85A9D',
        fontWeight: '500',
    },
    playerSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    controlWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    navigationButton: {
        borderRadius: 35,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
        marginBottom: 10,
    },
    buttonBackground: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonLabel: {
        fontSize: 14,
        color: '#8B4B8C',
        fontWeight: '600',
        textAlign: 'center',
    },
    videoSection: {
        flex: 1,
        marginHorizontal: 20,
        alignItems: 'center',
    },
    videoWrapper: {
        width: '100%',
        aspectRatio: 16/9,
        borderRadius: 20,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 12,
    },
    videoPlayer: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#000',
    },
    webview: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    songInfo: {
        marginTop: 15,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 6,
        width: '100%',
    },
    songInfoBackground: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    currentSongTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#8B4B8C',
        textAlign: 'center',
    },
    backgroundDecorations: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: -1,
    },
    musicNote: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    noteEmoji: {
        fontSize: 24,
    },
});

export default KaraokeScreen;