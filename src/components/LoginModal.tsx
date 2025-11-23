import { Modal, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { useAuth } from "../context/AuthContext";
import { ThemedText } from "./themed-text";

export default function LoginModal({ visible, onClose }: any) {
  const { doAuth } = useAuth();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <View
          style={styles.modal}
        >
          <ThemedText type="subtitle">
            {"Вход через биометрию"}
          </ThemedText>

          <Button
            mode="contained"
            onPress={async () => {
              await doAuth();
            }}
            style={styles.button}
          >
            {`Войти через Face/Touch ID`}
          </Button>
          <Button onPress={onClose} mode="outlined" style={styles.button}>{"Отмена"}</Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 12,
    width: "80%",
    display: "flex",
    gap: 16,
    alignItems: "center",
  },
  button: {
    width: "100%",
  }
});