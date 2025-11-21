import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Protected({ children }: any) {
  const { isAuth, openLoginModal } = useAuth();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      console.log("Protected component mounted, isAuth:", isAuth);
      if (!isAuth) {
        console.log("User not authenticated, opening login modal");
        openLoginModal();  // сразу показать модалку биометрии
      }
    }
  }, [isFocused]);

  if (!isAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return children;
}
