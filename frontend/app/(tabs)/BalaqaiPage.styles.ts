import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "80%",  // Adjust width as needed
        marginTop: 20,
    },
    centeredRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", // Centers them horizontally
        marginTop: 20,
        gap: 10, // Adds small spacing between greeting and button
    },
    header: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#FFD700",
    },
    content: {
        alignItems: "center",
    },
    logoutIcon: {
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 10, // Ensures it stays on top
        backgroundColor: "rgba(255, 255, 255, 0.5)", // Slight background to improve visibility
        padding: 8,
        borderRadius: 20,
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
