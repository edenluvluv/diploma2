import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, ImageBackground } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'; // Import logout icon
import styles from "./BalaqaiPage.styles";
import AsyncStorage from '@react-native-async-storage/async-storage';

const BalaqaiPage: React.FC = () => {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            }
        };

        checkUser();
    }, []);

    const handleStart = () => {
        if (user) {
            const parsedUser = typeof user === "string" ? JSON.parse(user) : user;
            if (parsedUser?.role === "admin") {
                router.push("/admin");
            } else {
                router.push("/games");
            }
        } else {
            setModalVisible(true);
        }
    };


    const handleLogout = async () => {
        await AsyncStorage.removeItem('user');
        setUser(null);
        router.push("/login");
    };

    return (
        <ImageBackground
            source={require("./main.png")}
            style={styles.background}
            resizeMode="cover"
        >
            {/* 🔥 Move Logout Button to the top level 🔥 */}
            <TouchableOpacity onPress={handleLogout} style={styles.logoutIcon}>
                <MaterialIcons name="logout" size={28} color="black" />
            </TouchableOpacity>

            {/* Main Content */}
            <View style={styles.container}>
                <Text style={styles.header}>Welcome</Text>
                <Text style={styles.header}>BALAQAI</Text>

                {/* Centered Greeting and Button */}
                <View style={styles.centeredRow}>
                    <View style={styles.greeting}>
                        <Text>Сәлем</Text>
                        <Text style={styles.bold}>АЛИЯР!</Text>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleStart}>
                        <Text style={styles.buttonText}>БАСТАУ</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Modal for Login/Register */}
            {modalVisible && (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Қайсысын таңдауға болады?</Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={() => {
                                        setModalVisible(false);
                                        router.push("/register");
                                    }}
                                >
                                    <Text style={styles.buttonText}>Тіркелу</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.loginButton]}
                                    onPress={() => {
                                        setModalVisible(false);
                                        router.push("/login");
                                    }}
                                >
                                    <Text style={styles.buttonText}>Кіру</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Болдырмау</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </ImageBackground>
    );


}


export default BalaqaiPage;
