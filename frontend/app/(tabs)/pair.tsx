import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
    Dimensions,
    Animated,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDailyTimer, BlockedMessage } from './timer';
import { LinearGradient } from 'expo-linear-gradient';

const images = [
    require('@/assets/images/doll.png'),
    require('@/assets/images/cat.png'),
    require('@/assets/images/dog.png'),
    require('@/assets/images/sofa.png'),
    require('@/assets/images/lego.png'),
];

type Card = {
    id: number;
    image: any;
    matched: boolean;
    revealed: boolean;
    flipAnim: Animated.Value;
    matchAnim: Animated.Value;
};

const pairsPerLevel = [2, 8]; // Level 1, 2 only

const generateShuffledCards = (pairCount: number): Card[] => {
    const selectedImages = [];
    for (let i = 0; i < pairCount; i++) {
        const img = images[i % images.length];
        selectedImages.push(img);
    }

    const cards: Card[] = [];
    selectedImages.forEach((img, idx) => {
        cards.push({
            id: idx * 2,
            image: img,
            matched: false,
            revealed: false,
            flipAnim: new Animated.Value(0),
            matchAnim: new Animated.Value(1)
        });
        cards.push({
            id: idx * 2 + 1,
            image: img,
            matched: false,
            revealed: false,
            flipAnim: new Animated.Value(0),
            matchAnim: new Animated.Value(1)
        });
    });

    return cards.sort(() => Math.random() - 0.5);
};

const PairPage: React.FC = () => {
    const router = useRouter();
    const { isBlocked, beginTracking, endTracking } = useDailyTimer();
    const [level, setLevel] = useState(0);
    const [cards, setCards] = useState<Card[]>([]);
    const [selected, setSelected] = useState<number[]>([]);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [key, setKey] = useState(Math.random().toString());
    const [showContent, setShowContent] = useState(true);
    const [titleAnim] = useState(new Animated.Value(0));
    const [confettiAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        beginTracking();
        return () => endTracking();
    }, []);

    useEffect(() => {
        if (isBlocked) {
            setShowContent(false);
        }
    }, [isBlocked]);

    useEffect(() => {
        // Animate title entrance
        Animated.spring(titleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
        }).start();
    }, []);

    useEffect(() => {
        const pairs = pairsPerLevel[level];
        const newCards = generateShuffledCards(pairs);
        setCards(newCards);
        setSelected([]);
        setMatchedPairs(0);
        setKey(Math.random().toString());

        // Reset title animation
        titleAnim.setValue(0);
        Animated.spring(titleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
        }).start();
    }, [level]);

    useEffect(() => {
        if (selected.length === 2) {
            const [first, second] = selected;
            if (cards[first].image === cards[second].image) {
                // Cards match - mark them as matched and keep them revealed permanently
                setTimeout(() => {
                    // Animate match celebration
                    Animated.parallel([
                        Animated.sequence([
                            Animated.timing(cards[first].matchAnim, {
                                toValue: 1.2,
                                duration: 200,
                                useNativeDriver: true,
                            }),
                            Animated.timing(cards[first].matchAnim, {
                                toValue: 1,
                                duration: 200,
                                useNativeDriver: true,
                            }),
                        ]),
                        Animated.sequence([
                            Animated.timing(cards[second].matchAnim, {
                                toValue: 1.2,
                                duration: 200,
                                useNativeDriver: true,
                            }),
                            Animated.timing(cards[second].matchAnim, {
                                toValue: 1,
                                duration: 200,
                                useNativeDriver: true,
                            }),
                        ]),
                    ]).start();

                    const newCards = [...cards];
                    newCards[first].matched = true;
                    newCards[second].matched = true;
                    // Keep cards revealed when matched
                    newCards[first].revealed = true;
                    newCards[second].revealed = true;
                    setCards(newCards);
                    setMatchedPairs((prev) => prev + 1);
                }, 500);

                // Clear selection after match animation
                setTimeout(() => setSelected([]), 1000);
            } else {
                // Cards don't match - flip them back after delay
                setTimeout(() => {
                    const newCards = [...cards];
                    newCards[first].revealed = false;
                    newCards[second].revealed = false;
                    setCards(newCards);
                }, 1200);

                // Clear selection after cards flip back
                setTimeout(() => setSelected([]), 1500);
            }
        }
    }, [selected]);

    // Trigger confetti animation when level is completed
    useEffect(() => {
        if (matchedPairs === pairsPerLevel[level] && matchedPairs > 0) {
            Animated.sequence([
                Animated.timing(confettiAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(confettiAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [matchedPairs]);

    const handleCardPress = (index: number) => {
        if (
            selected.length < 2 &&
            !cards[index].revealed &&
            !cards[index].matched
        ) {
            const newCards = [...cards];
            newCards[index].revealed = true;
            setCards(newCards);
            setSelected([...selected, index]);
        }
    };

    const nextLevel = () => {
        if (level < pairsPerLevel.length - 1) {
            setLevel((prev) => prev + 1);
        }
    };

    const numColumns = Math.ceil(Math.sqrt(cards.length));
    const screenWidth = Dimensions.get('window').width;
    const cardMargin = 8;
    const totalHorizontalMargin = cardMargin * (numColumns + 1);
    const cardSize = (screenWidth * 0.85 - totalHorizontalMargin) / numColumns;

    const renderCard = ({ item, index }: { item: Card; index: number }) => {
        const isRevealed = item.revealed || item.matched;

        return (
            <Animated.View
                style={[
                    styles.cardContainer,
                    {
                        width: cardSize,
                        height: cardSize,
                        margin: cardMargin,
                        transform: [{ scale: item.matchAnim }],
                    },
                ]}
            >
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => handleCardPress(index)}
                    disabled={item.revealed || item.matched}
                    activeOpacity={0.8}
                >
                    {isRevealed ? (
                        // Show card front (image) when revealed
                        <View style={styles.cardFace}>
                            <LinearGradient
                                colors={item.matched ? ['#4CAF50', '#81C784'] : ['#FF9800', '#FFB74D']}
                                style={styles.cardFrontGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <View style={styles.imageContainer}>
                                    <Image source={item.image} style={styles.image} />
                                    {item.matched && (
                                        <View style={styles.matchOverlay}>
                                            <Text style={styles.matchEmoji}>🌟</Text>
                                        </View>
                                    )}
                                </View>
                            </LinearGradient>
                        </View>
                    ) : (
                        // Show card back when not revealed
                        <View style={styles.cardFace}>
                            <LinearGradient
                                colors={['#FF6B9D', '#8E44AD']}
                                style={styles.cardBackGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <View style={styles.cardPattern}>
                                    <View style={styles.centerStar}>
                                        <Text style={styles.starText}>✨</Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </View>
                    )}
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#FDF2F8" />
            {!showContent ? (
                <BlockedMessage />
            ) : (
                <View style={styles.container}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <LinearGradient
                            colors={['#FFB6C1', '#FFF0F5']}
                            style={styles.backButtonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Ionicons name="arrow-back" size={24} color="#8B4B8C" />
                        </LinearGradient>
                    </TouchableOpacity>

                    <Animated.View
                        style={[
                            styles.titleContainer,
                            {
                                transform: [
                                    {
                                        translateY: titleAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [-50, 0],
                                        }),
                                    },
                                    { scale: titleAnim },
                                ],
                                opacity: titleAnim,
                            },
                        ]}
                    >
                        <View style={styles.titleGradient}>
                            <Text style={styles.title}>Level {level + 1}</Text>
                            <Text style={styles.subtitle}>
                                {matchedPairs}/{pairsPerLevel[level]} жұп табылды
                            </Text>
                        </View>
                    </Animated.View>

                    <View style={styles.gameArea}>
                        <FlatList
                            key={key}
                            data={cards}
                            numColumns={numColumns}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={styles.grid}
                            renderItem={renderCard}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>

                    {matchedPairs === pairsPerLevel[level] && (
                        <Animated.View
                            style={[
                                styles.result,
                                {
                                    transform: [
                                        {
                                            scale: confettiAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.8, 1.1],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            <LinearGradient
                                colors={['#FFE0F0', '#E0F0FF']}
                                style={styles.resultGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.resultText}>Барлық жұп табылды!</Text>
                                {level < pairsPerLevel.length - 1 ? (
                                    <TouchableOpacity style={styles.button} onPress={nextLevel}>
                                        <LinearGradient
                                            colors={['#FF6B9D', '#C44569']}
                                            style={styles.buttonGradient}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                        >
                                            <Text style={styles.buttonText}>Келесі деңгей ✨</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                ) : (
                                    <View style={styles.finalMessage}>
                                        <Text style={styles.finalText}>🏆 Ойын аяқталды! 🏆</Text>
                                        <Text style={styles.congratsText}>Керемет ойнадыңыз!</Text>
                                    </View>
                                )}
                            </LinearGradient>
                        </Animated.View>
                    )}
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDF2F8', // Very light pastel pink background
        paddingTop: 60,
        paddingHorizontal: '7.5%',
        alignItems: 'center',
    },
    floatingElements: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 0,
    },
    floatingBubble: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    bubbleEmoji: {
        fontSize: 20,
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
    backButtonGradient: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        marginTop: 20,
        marginBottom: 30,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 8,
    },
    titleGradient: {
        backgroundColor: '#FFFFFF', // White background for title container
        paddingVertical: 15,
        paddingHorizontal: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#8B4B8C',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#B85A9D',
        textAlign: 'center',
        fontWeight: '500',
    },
    gameArea: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
    },
    grid: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    cardContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 8,
    },
    card: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
        overflow: 'hidden',
    },
    cardFace: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backfaceVisibility: 'hidden',
        borderRadius: 16,
        overflow: 'hidden',
    },
    cardBack: {},
    cardFront: {},
    cardBackGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardFrontGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    cardPattern: {
        width: '100%',
        height: '100%',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerStar: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    starText: {
        fontSize: 24,
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    image: {
        width: '85%',
        height: '85%',
        resizeMode: 'contain',
    },
    matchOverlay: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255, 215, 0, 0.9)',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    matchEmoji: {
        fontSize: 14,
    },
    result: {
        marginTop: 20,
        marginBottom: 30,
        borderRadius: 25,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
    },
    resultGradient: {
        paddingVertical: 25,
        paddingHorizontal: 30,
        alignItems: 'center',
    },
    resultText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#8B4B8C',
        textAlign: 'center',
        marginBottom: 15,
    },
    celebrationEmojis: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    celebrationEmoji: {
        fontSize: 32,
        marginHorizontal: 10,
    },
    button: {
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    buttonGradient: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    finalMessage: {
        alignItems: 'center',
    },
    finalText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#8B4B8C',
        textAlign: 'center',
        marginBottom: 10,
    },
    congratsText: {
        fontSize: 16,
        color: '#B85A9D',
        textAlign: 'center',
        fontWeight: '500',
    },
});

export default PairPage;