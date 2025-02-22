import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "#A3E7FC",
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        position: "absolute",
        top: "8%",
        fontSize: 48,
        fontWeight: "bold",
        color: "#FFD700",
    },
    content: {
        alignItems: "center",
    },
    logoutIcon: {
        position: "absolute",
        top: 20,  // Adjust as needed
        left: 20, // Move it to the left
    },

    greeting: {
        alignItems: "center",
    },
    bold: {
        fontWeight: "bold",
        fontSize: 32,
    },
    button: {
        marginTop: 20,
        backgroundColor: "#FFD700",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        borderWidth: 4,
        borderColor: "#FFC107",
    },
    buttonText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "50%",
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
    },
    modalText: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    modalButton: {
        flex: 1,
        backgroundColor: "#599c9e",
        padding: 15,
        marginHorizontal: 5,
        borderRadius: 10,
        alignItems: "center",
    },
    loginButton: {
        backgroundColor: "#599c9e",
    },
    cancelButton: {
        marginTop: 15,
        backgroundColor: "#d27856",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        width: "50%",
    },
    cancelButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    gamesButton: {
        backgroundColor: '#4CAF50', // Example color for the games button
    },
});

export default styles;
