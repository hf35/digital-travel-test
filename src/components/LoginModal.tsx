import { Button, Modal, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginModal({ visible, onClose }: any) {
  const { doAuth } = useAuth();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            padding: 30,
            borderRadius: 12,
            width: "80%",
          }}
        >
          <Text style={{ fontSize: 20, marginBottom: 20 }}>
          {"Вход через биометрию"}
          </Text>

          <Button
            title="Войти через Face/Touch ID"
            onPress={async () => {
              await doAuth();
            }}
          />

          <Button title="Отмена" onPress={onClose} color="gray" />
        </View>
      </View>
    </Modal>
  );
}
