import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
    memory: undefined;
    games: undefined;
};

type MemoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'memory'>;

// Images for the memory game
const images = [
    require('@/assets/images/doll.png'),
    require('@/assets/images/cat.png'),
    require('@/assets/images/dog.png'),
    require('@/assets/images/sofa.png'),
    require('@/assets/images/lego.png'),
];

const MemoryPage: React.FC = () => {
    const navigation = useNavigation<MemoryScreenNavigationProp>();

    const handleBack = () => {
        navigation.navigate('games'); // Navigate back to the games page
    };

    const [showImages, setShowImages] = useState(false);
    const [imageSequence, setImageSequence] = useState<any[]>([]); // The correct sequence of images
    const [userSequence, setUserSequence] = useState<any[]>([]); // User's input sequence
    const [round, setRound] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false); // Prevent user input while checking

    // Create a new image sequence for each round
    useEffect(() => {
        if (round > 1) {
            setImageSequence((prevSequence) => [
                ...prevSequence,
                images[Math.floor(Math.random() * images.length)],
            ]);
        } else {
            setImageSequence([images[Math.floor(Math.random() * images.length)]]);
        }

        setUserSequence([]);
        setShowImages(true);

        // Hide images after 2 seconds
        const timer = setTimeout(() => {
            setShowImages(false);
        }, 2000); // Show images for 2 seconds

        return () => clearTimeout(timer);
    }, [round]);

    const handleImagePress = (image: any) => {
        if (isProcessing || userSequence.length >= imageSequence.length) return;

        setUserSequence([...userSequence, image]);

        if (userSequence.length + 1 === imageSequence.length) {
            checkSequence();
        }
    };

    const checkSequence = () => {
        setIsProcessing(true);
        const isCorrect = imageSequence.every(
            (img, index) => img === userSequence[index]
        );

        if (isCorrect) {
            setRound((prevRound) => prevRound + 1);
            Alert.alert('Correct!', 'You remembered the sequence!');
        } else {
            Alert.alert('Incorrect!', 'Try again!');
        }

        setIsProcessing(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color="#555" />
            </TouchableOpacity>
            <Text style={styles.title}>Memory Game</Text>
            <Text style={styles.round}>Round: {round}</Text>

            <View style={styles.grid}>
                {images.map((image, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.card}
                        onPress={() => handleImagePress(image)}
                    >
                        {showImages || userSequence.includes(image) ? (
                            <Image source={image} style={styles.image} />
                        ) : (
                            <View style={styles.cardBack}>
                                <Text style={styles.cardBackText}>?</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {userSequence.length === imageSequence.length && (
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => setRound(round + 1)}
                    disabled={isProcessing}
                >
                    <Text style={styles.nextButtonText}>
                        {isProcessing ? 'Checking...' : 'Next Round'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    round: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '80%',
    },
    card: {
        width: 100,
        height: 100,
        margin: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#B0BEC5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    cardBack: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 100,
        backgroundColor: '#B0BEC5',
        borderRadius: 10,
    },
    cardBackText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    nextButton: {
        marginTop: 30,
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
    },
    nextButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default MemoryPage;
