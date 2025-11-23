import NewsCard from "@/components/NewsCard";
import { ThemedText } from "@/components/themed-text";
import { useSavedNews } from "@/context/SavedNewsContext";
import { useNewsStore } from "@/storage/currentNews";
import { router, Stack } from "expo-router";
import { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";

export default function NewsWebView() {
  const { selected: newsItem } = useNewsStore();
  const { save, remove, saved } = useSavedNews();

  const isSaved = useMemo(() => saved.some((n) => n.id === newsItem?.id), [saved, newsItem]);

  const openFullNews = useCallback(() => {
    router.push({
      pathname: "/news/[id]/view",
    });
  }, [])

  if (!newsItem) {
    return (
      <View style={styles.errorBox}>
        <ThemedText>{"Что то пошло не так"}</ThemedText>
      </View>
    );
  }
  return (
    <>

      <Stack.Screen
        options={{
          title: newsItem.title as string || "Новость",
        }}

      />

      <View style={{ flex: 1 }}>
        <View style={styles.newsContainer}>
          <NewsCard newsItem={newsItem} showFullData={true} />
        </View>
        <View style={styles.bottomBar}>
          <IconButton
            icon="content-save"
            iconColor={isSaved ? "black" : "gray"}
            size={20}
            onPress={() => isSaved ? remove(newsItem.id) : save(newsItem)}
          />
          <IconButton
            icon="open-in-new"
            iconColor={"black"}
            size={20}
            onPress={() => openFullNews()}
          />
        </View>
      </View>
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
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  newsContainer:{ flex: 1, padding: 16, flexGrow: 1 },
  errorBox: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});