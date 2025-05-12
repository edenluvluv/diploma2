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
        width: "80%",
        marginTop: 20,
    },
    centeredRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        gap: 10,
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
        zIndex: 10,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
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

    // Modal Styles (Improved)
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "80%",
        padding: 25,
        backgroundColor: "#fff",
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 10,
    },
    modalText: {
        fontSize: 22,
        fontWeight: "600",
        color: "#333",
        textAlign: "center",
        marginBottom: 25,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    modalButton: {
        flex: 1,
        backgroundColor: "#FFD700",
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginHorizontal: 6,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    loginButton: {
        backgroundColor: "#FFC107",
    },
    cancelButton: {
        marginTop: 20,
        backgroundColor: "#d27856",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: "center",
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
    gamesButton: {
        backgroundColor: '#4CAF50',
    },
});

export default styles;
