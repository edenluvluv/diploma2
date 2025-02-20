import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    games: undefined;
    achievements: undefined;
};

type AchievementsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'achievements'>;

const AchievementsPage: React.FC = () => {
    const navigation = useNavigation<AchievementsScreenNavigationProp>();

    const handleBack = () => {
        navigation.navigate('games'); // Navigate back to the games page
    };

    const achievements = [
        { id: 1, name: 'xericrik', completed: true },
        { id: 2, name: 'xericrik', completed: true },
        { id: 3, name: 'xericrik', completed: true },
        { id: 4, name: 'xericrik', completed: false },
        { id: 5, name: 'xericrik', completed: false },
        { id: 6, name: 'xericrik', completed: false },
    ];

    const completedCount = achievements.filter((a) => a.completed).length;
    const totalCount = achievements.length;

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color="#555" />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title}>Achievements</Text>

            {/* Progress Indicator */}
            <Text style={styles.progressText}>
                Mehlix xericrikrepilx {completedCount}/{totalCount}
            </Text>

            {/* Achievements List */}
            <View style={styles.achievementsList}>
                {achievements.map((achievement) => (
                    <View key={achievement.id} style={styles.achievementItem}>
                        <Text style={styles.achievementText}>{achievement.name}</Text>
                        {achievement.completed && (
                            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#A3E7FC',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginTop: 60,
        marginBottom: 20,
    },
    progressText: {
        fontSize: 18,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    achievementsList: {
        width: '100%',
    },
    achievementItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    achievementText: {
        fontSize: 18,
        color: '#555',
    },
});

export default AchievementsPage;