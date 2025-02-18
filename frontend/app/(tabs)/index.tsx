import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import styles from "./BalaqaiPage.styles"; // Import styles

const BalaqaiPage: React.FC = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>BALAQAI</Text>
      <View style={styles.content}>
        <View style={styles.greeting}>
          <Text>Сәлем</Text>
          <Text style={styles.bold}>АЛИЯР!</Text>
        </View>

        {/* Start Button - Opens Modal */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>БАСТАУ</Text>
        </TouchableOpacity>

        {/* Modal for Choosing Register, Login, or Games */}
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
                {/* Register Button */}
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setModalVisible(false);
                    router.push("/register");
                  }}
                >
                  <Text style={styles.buttonText}>Тіркелу</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  style={[styles.modalButton, styles.loginButton]}
                  onPress={() => {
                    setModalVisible(false);
                    router.push("/login");
                  }}
                >
                  <Text style={styles.buttonText}>Кіру</Text>
                </TouchableOpacity>

                {/* Games Button */}
                <TouchableOpacity
                  style={[styles.modalButton, styles.gamesButton]}
                  onPress={() => {
                    setModalVisible(false);
                    router.push("/games"); // Correct path
                  }}
                >
                  <Text style={styles.buttonText}>Ойындар</Text>
                </TouchableOpacity>
              </View>

              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Болдырмау</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default BalaqaiPage;