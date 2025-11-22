import { ThemedText } from "@/components/themed-text";
import { useSavedNews } from "@/context/SavedNewsContext";
import { useNewsStore } from "@/storage/currentNews";
import { Stack } from "expo-router";
import { useMemo, useState, } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import Animated, { FadeIn } from "react-native-reanimated";
import { WebView } from "react-native-webview";

export default function NewsWebView() {

  const { selected: newsItem } = useNewsStore();
  const [loaded, setLoaded] = useState(false);
  const { save, remove, saved } = useSavedNews();

  const isSaved = useMemo(() => saved.some((n) => n.id === newsItem?.id), [saved, newsItem]);

  if (!newsItem) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>{"Something went wrong"}</ThemedText>
      </View>
    );
  }
  return (
    <>

      <Stack.Screen
        options={{
          title: newsItem.title as string || "Новость",
          headerRight: () => (
            !loaded ? <ActivityIndicator style={{ marginRight: 15 }} size={"small"} /> : null
          ),
        }}

      />

      <Animated.View entering={FadeIn.duration(300)} style={{ flex: 1 }}>
        <WebView
          source={{ uri: String(newsItem.url) }}
          onLoadEnd={() => setLoaded(true)}
          style={{ flex: 1 }}
        />
        <View style={styles.bottomBar}>
          <IconButton
            icon="content-save"
            iconColor={isSaved ? "black":"gray"}
            size={20}
            onPress={() => isSaved ? remove(newsItem.id) : save(newsItem)}
          />

        </View>
      </Animated.View>
    </>

  );
}

const styles = StyleSheet.create({
  bottomBar: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    display: 'flex',
    paddingHorizontal: 10,
  }
});