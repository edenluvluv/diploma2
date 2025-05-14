import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDailyTimer, BlockedMessage } from './timer';

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
};

const pairsPerLevel = [2, 8, 18]; // Level 1, 2, 3

const generateShuffledCards = (pairCount: number): Card[] => {
    const selectedImages = [];
    for (let i = 0; i < pairCount; i++) {
        const img = images[i % images.length];
        selectedImages.push(img);
    }

    const cards: Card[] = [];
    selectedImages.forEach((img, idx) => {
        cards.push({ id: idx * 2, image: img, matched: false, revealed: false });
        cards.push({ id: idx * 2 + 1, image: img, matched: false, revealed: false });
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
        const pairs = pairsPerLevel[level];
        const newCards = generateShuffledCards(pairs);
        setCards(newCards);
        setSelected([]);
        setMatchedPairs(0);
        setKey(Math.random().toString()); // force FlatList remount
    }, [level]);

    useEffect(() => {
        if (selected.length === 2) {
            const [first, second] = selected;
            if (cards[first].image === cards[second].image) {
                const newCards = [...cards];
                newCards[first].matched = true;
                newCards[second].matched = true;
                setCards(newCards);
                setMatchedPairs((prev) => prev + 1);
            } else {
                setTimeout(() => {
                    const newCards = [...cards];
                    newCards[first].revealed = false;
                    newCards[second].revealed = false;
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

    const nextLevel = () => {
        if (level < pairsPerLevel.length - 1) {
            setLevel((prev) => prev + 1);
        }
    };

    const numColumns = Math.ceil(Math.sqrt(cards.length));
    const screenWidth = Dimensions.get('window').width;
    const cardMargin = 6;
    const totalHorizontalMargin = cardMargin * (numColumns + 1);
    const cardSize = (screenWidth * 0.9 - totalHorizontalMargin) / numColumns; // 5% left + 5% right = 90% usable width

    return !showContent ? (
        <BlockedMessage />
    ) : (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.title}>Level {level + 1}</Text>

            <FlatList
                key={key}
                data={cards}
                numColumns={numColumns}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.grid}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={[styles.card, { width: cardSize, height: cardSize, margin: cardMargin }]}
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

            {matchedPairs === pairsPerLevel[level] && (
                <View style={styles.result}>
                    <Text style={styles.resultText}>🎉 Барлық жұп табылды!</Text>
                    {level < pairsPerLevel.length - 1 ? (
                        <TouchableOpacity style={styles.button} onPress={nextLevel}>
                            <Text style={styles.buttonText}>Келесі деңгей</Text>
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.resultText}>Ойын аяқталды!</Text>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#A3E7FC',
        paddingTop: 60,
        paddingHorizontal: '5%', // 5% space from left and right edges
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 30,
        left: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    grid: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '90%',
        height: '90%',
        resizeMode: 'contain',
    },
    cover: {
        width: '100%',
        height: '100%',
        backgroundColor: '#17696F',
    },
    result: {
        alignItems: 'center',
        marginTop: 20,
    },
    resultText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#17696F',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginTop: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
        marginBottom:20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
    },
});

export default PairPage;
