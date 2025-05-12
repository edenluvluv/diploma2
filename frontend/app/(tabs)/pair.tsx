import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, Dimensions, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDailyTimer, BlockedMessage } from './timer'; // adjust path if needed

const images = [
    require('@/assets/images/doll.png'),
    require('@/assets/images/cat.png'),
    require('@/assets/images/dog.png'),
    require('@/assets/images/sofa.png'),
    require('@/assets/images/lego.png'),
];

const getShuffledCards = (): Card[] => {
    const pairsNeeded = 15; // 15 pairs of images (30 cards in total)
    const imagePool = [];

    // Create 15 pairs (30 cards total)
    for (let i = 0; i < pairsNeeded; i++) {
        const img = images[i % images.length];
        imagePool.push({ id: i * 2, image: img, matched: false, revealed: false });
        imagePool.push({ id: i * 2 + 1, image: img, matched: false, revealed: false });
    }

    // Shuffle the cards
    return imagePool.sort(() => Math.random() - 0.5);
};

type Card = {
    id: number;
    image: any;
    matched: boolean;
    revealed: boolean;
};

const PairPage: React.FC = () => {
    const router = useRouter();
    const { isBlocked, beginTracking, endTracking } = useDailyTimer();
    const [cards, setCards] = useState<Card[]>(getShuffledCards());
    const [selected, setSelected] = useState<number[]>([]);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [showContent, setShowContent] = useState(true);

    // First useEffect - Timer tracking
    useEffect(() => {
        beginTracking();
        return () => endTracking();
    }, []);

    // Check if blocked and update state
    useEffect(() => {
        if (isBlocked) {
            setShowContent(false);
        }
    }, [isBlocked]);

    // Second useEffect - Card matching logic
    useEffect(() => {
        if (selected.length === 2) {
            const [firstIndex, secondIndex] = selected;
            if (cards[firstIndex].image === cards[secondIndex].image) {
                const newCards = [...cards];
                newCards[firstIndex].matched = true;
                newCards[secondIndex].matched = true;
                setCards(newCards);
                setMatchedPairs((prev) => prev + 1);
            } else {
                setTimeout(() => {
                    const newCards = [...cards];
                    newCards[firstIndex].revealed = false;
                    newCards[secondIndex].revealed = false;
                    setCards(newCards);
                }, 800);
            }
            setTimeout(() => setSelected([]), 800);
        }
    }, [selected]);

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

    const restartGame = () => {
        setCards(getShuffledCards());
        setSelected([]);
        setMatchedPairs(0);
    };

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const availableHeight = screenHeight * 0.85;
    const availableWidth = screenWidth * 0.95;

    const numColumns = 6;
    const numRows = 5;
    const cardMargin = 8;

    const totalMarginsHorizontal = (numColumns + 1) * cardMargin;
    const totalMarginsVertical = (numRows + 1) * cardMargin;

    const cardWidth = Math.min(
        (availableWidth - totalMarginsHorizontal) / numColumns,
        (availableHeight - totalMarginsVertical) / numRows
    );

    // Render based on state - no early returns
    return (
        <>
            {!showContent ? (
                <BlockedMessage />
            ) : (
                <View style={styles.container}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.title}>Суреттерді сәйкестендіріңіз</Text>

                    <FlatList
                        data={cards}
                        numColumns={numColumns}  // Ensures 6 columns
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                style={[
                                    styles.card,
                                    {
                                        width: cardWidth,
                                        height: cardWidth,
                                        margin: cardMargin,
                                    },
                                ]}
                                onPress={() => handleCardPress(index)}
                                disabled={item.revealed || item.matched}
                            >
                                {item.revealed || item.matched ? (
                                    <Image source={item.image} style={styles.image} />
                                ) : (
                                    <View style={styles.cover} />
                                )}
                            </TouchableOpacity>
                        )}
                    />

                    {matchedPairs === 15 && (
                        <View style={styles.result}>
                            <Text style={styles.resultText}>Барлық жұп табылды!</Text>
                            <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
                                <Text style={styles.restartText}>Қайта бастау</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#A3E7FC',
        paddingTop: 40,
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 30,
        left: 20,
    },
    title: {
        fontSize: 22,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    card: {
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    cover: {
        width: '100%',
        height: '100%',
        backgroundColor: '#eee',
    },
    result: {
        marginTop: 20,
        alignItems: 'center',
    },
    resultText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    restartButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        marginTop: 10,
        borderRadius: 8,
    },
    restartText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default PairPage;