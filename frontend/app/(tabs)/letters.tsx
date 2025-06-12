import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface KazakhLetter {
    letter: string;
    example: string;
}

const kazakhAlphabet: KazakhLetter[] = [
    { letter: 'А', example: 'Ана' },
    { letter: 'Ә', example: 'Әке' },
    { letter: 'Б', example: 'Бала' },
    { letter: 'В', example: 'Вагон' },
    { letter: 'Г', example: 'Гүл' },
    { letter: 'Ғ', example: 'Ғалым' },
    { letter: 'Д', example: 'Дос' },
    { letter: 'Е', example: 'Ешкі' },
    { letter: 'Ё', example: 'Ёлка' },
    { letter: 'Ж', example: 'Жол' },
    { letter: 'З', example: 'Заң' },
    { letter: 'И', example: 'Ит' },
    { letter: 'Й', example: 'Йога' },
    { letter: 'К', example: 'Күн' },
    { letter: 'Қ', example: 'Қала' },
    { letter: 'Л', example: 'Лай' },
    { letter: 'М', example: 'Мектеп' },
    { letter: 'Н', example: 'Нан' },
    { letter: 'Ң', example: 'Ңұсқа' },
    { letter: 'О', example: 'Орман' },
    { letter: 'Ө', example: 'Өзен' },
    { letter: 'П', example: 'Піл' },
    { letter: 'Р', example: 'Раушан' },
    { letter: 'С', example: 'Су' },
    { letter: 'Т', example: 'Тау' },
    { letter: 'У', example: 'Уақыт' },
    { letter: 'Ұ', example: 'Ұя' },
    { letter: 'Ү', example: 'Үй' },
    { letter: 'Ф', example: 'Фильм' },
    { letter: 'Х', example: 'Хат' },
    { letter: 'Һ', example: 'Гауһар' },
    { letter: 'Ц', example: 'Цирк' },
    { letter: 'Ч', example: 'Чемпион' },
    { letter: 'Ш', example: 'Шаң' },
    { letter: 'Щ', example: 'Щетка' },
    { letter: 'Ы', example: 'Ыстық' },
    { letter: 'І', example: 'Ірімшік' },
    { letter: 'Э', example: 'Энергия' },
    { letter: 'Ю', example: 'Юла' },
    { letter: 'Я', example: 'Яхта' },
];

type RootStackParamList = {
    letters: undefined;
    letterspractice: undefined;
    games: undefined;
};

type LettersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'letters'>;

const LettersPage: React.FC = () => {
    const navigation = useNavigation<LettersScreenNavigationProp>();
    const [learnMode, setLearnMode] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const soundRef = useRef<Audio.Sound | null>(null);
    const [pulseAnim] = useState(new Animated.Value(1));
    const [scaleAnim] = useState(new Animated.Value(1));

    const nextLetter = () => {
        stopSound();
        animateTransition();
        setCurrentIndex((prev) => (prev + 1) % kazakhAlphabet.length);
    };

    const prevLetter = () => {
        stopSound();
        animateTransition();
        setCurrentIndex((prev) => (prev - 1 + kazakhAlphabet.length) % kazakhAlphabet.length);
    };

    const animateTransition = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const current = kazakhAlphabet[currentIndex];

    const getImageForLetter = (letter: string) => {
        const images: { [key: string]: any } = {
            'А': require('@/assets/images/mom.jpg'),
            'Ә': require('@/assets/images/dad.png'),
            'Б': require('@/assets/images/child.png'),
            'В': require('@/assets/images/wagon.png'),
            'Г': require('@/assets/images/flower.png'),
            'Ғ': require('@/assets/images/scientist.jpg'),
            'Д': require('@/assets/images/friend.png'),
            'Е': require('@/assets/images/lamb.jpg'),
            'Ё': require('@/assets/images/tree.png'),
            'Ж': require('@/assets/images/road.png'),
            'З': require('@/assets/images/law.jpg'),
            'И': require('@/assets/images/dog1.png'),
            'Й': require('@/assets/images/yoga.jpg'),
            'К': require('@/assets/images/sun.jpg'),
            'Қ': require('@/assets/images/city.jpg'),
            'Л': require('@/assets/images/dirt.png'),
            'М': require('@/assets/images/school.jpg'),
            'Н': require('@/assets/images/bread.png'),
            'Ң': require('@/assets/images/option.png'),
            'О': require('@/assets/images/forest.png'),
            'Ө': require('@/assets/images/river.png'),
            'П': require('@/assets/images/elephant.png'),
            'Р': require('@/assets/images/rose.jpg'),
            'С': require('@/assets/images/water.jpg'),
            'Т': require('@/assets/images/mountain.png'),
            'У': require('@/assets/images/time.png'),
            'Ұ': require('@/assets/images/nest.png'),
            'Ү': require('@/assets/images/house.png'),
            'Ф': require('@/assets/images/film.png'),
            'Х': require('@/assets/images/letter.png'),
            'Һ': require('@/assets/images/brilliant.png'),
            'Ц': require('@/assets/images/circus.png'),
            'Ч': require('@/assets/images/champion.png'),
            'Ш': require('@/assets/images/dust.jpg'),
            'Щ': require('@/assets/images/brush.jpg'),
            'Ы': require('@/assets/images/hot.png'),
            'І': require('@/assets/images/cheese.jpg'),
            'Э': require('@/assets/images/energy.jpg'),
            'Ю': require('@/assets/images/yula.png'),
            'Я': require('@/assets/images/yacht.jpg'),
        };

        return images[letter] || require('@/assets/images/a.png');
    };

    const getSoundForLetter = (letter: string) => {
        const sounds: { [key: string]: any } = {
            'А': require('@/assets/sounds/A.mp4'),
            'Ә': require('@/assets/sounds/AE.mp4'),
            'Б': require('@/assets/sounds/Б.mp4'),
        };
        return sounds[letter];
    };

    const stopSound = async () => {
        if (soundRef.current) {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
            soundRef.current = null;
            setIsPlaying(false);
        }
    };

    const playSound = async () => {
        if (isPlaying) {
            await stopSound();
            return;
        }

        // Pulse animation for sound feedback
        Animated.sequence([
            Animated.timing(pulseAnim, {
                toValue: 1.1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();

        const soundUri = getSoundForLetter(current.letter);
        if (!soundUri) return;

        try {
            const { sound } = await Audio.Sound.createAsync(soundUri);
            soundRef.current = sound;
            setIsPlaying(true);

            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    setIsPlaying(false);
                    soundRef.current = null;
                }
            });

            await sound.playAsync();
        } catch (error) {
            console.error('Error playing sound:', error);
            setIsPlaying(false);
        }
    };

    React.useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    React.useEffect(() => {
        stopSound();
    }, [learnMode]);

    return (
        <LinearGradient
            colors={['#F8F9FF', '#FFF5F8']}
            style={styles.gradientContainer}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.navigate('games')}
                    activeOpacity={0.8}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                <Text style={styles.title}>Қазақ Әліпби</Text>

                {!learnMode ? (
                    <View style={styles.alphabetContainer}>
                        {kazakhAlphabet.map((letter, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.letterCard}
                                activeOpacity={0.8}
                                onPress={() => {
                                    setCurrentIndex(index);
                                    setLearnMode(true);
                                }}
                            >
                                <Text style={styles.letter}>{letter.letter}</Text>
                                <Text style={styles.example}>{letter.example}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <Animated.View
                        style={[
                            styles.learnContainer,
                            { transform: [{ scale: scaleAnim }] }
                        ]}
                    >
                        <View style={styles.letterDisplayContainer}>
                            <Text style={styles.learnLetter}>{current.letter}</Text>
                        </View>

                        <View style={styles.exampleContainer}>
                            <Text style={styles.learnExample}>{current.example}</Text>
                        </View>

                        <TouchableOpacity onPress={playSound} activeOpacity={0.8}>
                            <Animated.View
                                style={[
                                    styles.imageContainer,
                                    { transform: [{ scale: pulseAnim }] },
                                    isPlaying && styles.playingImage
                                ]}
                            >
                                <Image
                                    source={getImageForLetter(current.letter)}
                                    style={styles.learnImage}
                                    resizeMode="cover"
                                />
                                {isPlaying && (
                                    <View style={styles.playingOverlay}>
                                        <Ionicons name="pause-circle" size={50} color="rgba(255,255,255,0.9)" />
                                    </View>
                                )}
                            </Animated.View>
                        </TouchableOpacity>

                        <View style={styles.arrowContainer}>
                            <TouchableOpacity
                                onPress={prevLetter}
                                style={styles.arrowButton}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="chevron-back" size={32} color="#FFFFFF" />
                            </TouchableOpacity>

                            <View style={styles.progressContainer}>
                                <Text style={styles.progressText}>
                                    {currentIndex + 1} / {kazakhAlphabet.length}
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={nextLetter}
                                style={styles.arrowButton}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="chevron-forward" size={32} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )}

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[
                            styles.bottomButton,
                            { backgroundColor: learnMode ? '#FF9FC7' : '#B8A9FF' }
                        ]}
                        onPress={() => setLearnMode(!learnMode)}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name={learnMode ? "grid-outline" : "school-outline"}
                            size={20}
                            color="#FFFFFF"
                            style={styles.buttonIcon}
                        />
                        <Text style={styles.bottomButtonText}>
                            {learnMode ? 'Көру' : 'Үйрену'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.bottomButton, { backgroundColor: '#B8F5CD' }]}
                        onPress={() => navigation.navigate('letterspractice')}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name="fitness-outline"
                            size={20}
                            color="#4A5568"
                            style={styles.buttonIcon}
                        />
                        <Text style={[styles.bottomButtonText, { color: '#4A5568' }]}>
                            Жаттығу
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    },
    container: {
        padding: 24,
        paddingTop: 60,
        alignItems: 'center',
        minHeight: '100%',
    },
    backButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#B8A9FF',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#B8A9FF',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
        color: '#4A5568',
    },
    alphabetContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingBottom: 20,
        gap: 12,
    },
    letterCard: {
        backgroundColor: '#FFFFFF',
        width: (width - 72) / 3,
        height: 120,
        borderRadius: 20,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#C8B5FF',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#F5F2FF',
    },
    letter: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#B8A9FF',
        marginBottom: 4,
    },
    example: {
        fontSize: 12,
        textAlign: 'center',
        color: '#4A5568',
        fontWeight: '600',
    },
    learnContainer: {
        alignItems: 'center',
        width: '100%',
        flex: 1,
    },
    letterDisplayContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 40,
        paddingVertical: 24,
        borderRadius: 24,
        marginBottom: 20,
        shadowColor: '#C8B5FF',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 10,
        borderWidth: 1,
        borderColor: '#F5F2FF',
    },
    learnLetter: {
        fontSize: 80,
        fontWeight: 'bold',
        color: '#B8A9FF',
        textAlign: 'center',
    },
    exampleContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 28,
        paddingVertical: 16,
        borderRadius: 18,
        marginBottom: 24,
        shadowColor: '#FFB8E1',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1,
        borderColor: '#FFF0F7',
    },
    learnExample: {
        fontSize: 24,
        color: '#4A5568',
        fontWeight: '600',
        textAlign: 'center',
    },
    imageContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 8,
        marginBottom: 32,
        shadowColor: '#C8B5FF',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 10,
        position: 'relative',
    },
    learnImage: {
        width: 200,
        height: 200,
        borderRadius: 18,
    },
    playingImage: {
        opacity: 0.8,
    },
    playingOverlay: {
        position: 'absolute',
        top: 8,
        left: 8,
        right: 8,
        bottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(184, 169, 255, 0.3)',
        borderRadius: 18,
    },
    arrowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 20,
    },
    arrowButton: {
        backgroundColor: '#B8A9FF',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#B8A9FF',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    progressContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 16,
        shadowColor: '#C8B5FF',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F5F2FF',
    },
    progressText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4A5568',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        marginTop: 20,
        gap: 16,
    },
    bottomButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 28,
        borderRadius: 20,
        flex: 1,
        justifyContent: 'center',
        shadowColor: '#C8B5FF',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    buttonIcon: {
        marginRight: 8,
    },
    bottomButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LettersPage;