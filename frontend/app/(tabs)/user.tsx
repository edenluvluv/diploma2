import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    games: undefined;
};

type UserScreenNavigationProp = StackNavigationProp<RootStackParamList, 'games'>;

const UserPage: React.FC = () => {
    const navigation = useNavigation<UserScreenNavigationProp>();

    const handleBack = () => {
        navigation.navigate('games');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Қолданушы беті</Text>
            <Image
                source={require('../../assets/images/profile.png')}
                style={styles.icon}
            />
            <Text style={styles.name}>Алияр</Text>
            <Text style={styles.info}>Жас: 6</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#A3E7FC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    icon: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    info: {
        fontSize: 18,
        marginTop: 10,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
    },
    backText: {
        fontSize: 24,
        color: '#000',
    },
});

export default UserPage;
