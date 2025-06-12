import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

type RootStackParamList = {
    games: undefined;
};

type UserScreenNavigationProp = StackNavigationProp<RootStackParamList, 'games'>;

type User = {
    fullName: string;
};

const profileImages = [
    require('../../assets/images/pfp1.jpg'),
    require('../../assets/images/pfp2.png'),
    require('../../assets/images/pfp3.png'),
];

const UserPage: React.FC = () => {
    const navigation = useNavigation<UserScreenNavigationProp>();
    const [user, setUser] = useState<User>({ fullName: 'Аты жоқ' });
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const savedIndex = await AsyncStorage.getItem('profileImageIndex');
                setSelectedImageIndex(savedIndex ? parseInt(savedIndex, 10) : 0);

                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser({ fullName: parsedUser.fullName || 'Аты жоқ' });
                }
            } catch (error) {
                console.error('Error loading user:', error);
            }
        };

        loadUserData();
    }, []);

    const handleBack = () => {
        navigation.navigate('games');
    };

    const handleImageSelect = async (index: number) => {
        setSelectedImageIndex(index);
        await AsyncStorage.setItem('profileImageIndex', index.toString());
    };

    return (
        <LinearGradient colors={['#C2E9FB', '#A1C4FD']} style={styles.gradient}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>

                <View style={styles.card}>
                    <Image source={profileImages[selectedImageIndex]} style={styles.profileImage} />
                    <Text style={styles.name}>{user.fullName}</Text>

                    <Text style={styles.subtitle}>Профиль суретін таңдаңыз:</Text>
                    <FlatList
                        data={profileImages}
                        horizontal
                        renderItem={({ item, index }) => (
                            <TouchableOpacity onPress={() => handleImageSelect(index)}>
                                <Image
                                    source={item}
                                    style={[
                                        styles.optionImage,
                                        index === selectedImageIndex && styles.selectedImage,
                                    ]}
                                />
                            </TouchableOpacity>
                        )}
                        keyExtractor={(_, index) => index.toString()}
                        contentContainerStyle={styles.imageList}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        paddingTop: 80,
        paddingBottom: 60,
        paddingHorizontal: 20,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
    backText: {
        fontSize: 24,
        color: '#0077CC',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 30,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    profileImage: {
        width: 130,
        height: 130,
        borderRadius: 65,
        marginBottom: 18,
        borderWidth: 4,
        borderColor: '#6EC6FF',
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#555',
        marginTop: 30,
        marginBottom: 10,
    },
    imageList: {
        marginTop: 10,
    },
    optionImage: {
        width: 70,
        height: 70,
        marginHorizontal: 10,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: '#ccc',
        opacity: 0.8,
    },
    selectedImage: {
        borderColor: '#0077CC',
        borderWidth: 4,
        opacity: 1,
    },
});

export default UserPage;
