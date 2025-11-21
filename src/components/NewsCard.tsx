

import { NewsItem } from "@/services/types/api";
import { router } from 'expo-router';
import { ThemedText } from "./themed-text";

import { useAuth } from "@/context/AuthContext";
import { useSavedNews } from "@/context/SavedNewsContext";
import { useMemo } from "react";
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { IconButton } from "react-native-paper";


export default function NewsCard({ newsItem }: { newsItem: NewsItem }) {
    const { requireAuth, isAuth } = useAuth();
    const { save, remove, saved } = useSavedNews();
    const openNews = (item: NewsItem) => {
        console.log('Open news item');
        router.push({
            pathname: "/news/[id]",
            params: { item: JSON.stringify(item) },
        });
    }
    const isSaved = useMemo(() => saved.some((n) => n.id === newsItem?.id), [saved, newsItem]);


    return (<Pressable onPress={() => openNews(newsItem)}>
        <View style={{ marginBottom: 8, flexDirection: 'column', gap: 4 }} >
            <View>
                <Image source={{ uri: newsItem.image_url }} style={{ width: '100%', height: 200 }} />
                <ThemedText key={newsItem.id} type="subtitle" style={styles.newsSource}>
                    {newsItem.news_site}
                </ThemedText>
                <View style={styles.cardButtons}>
                    <IconButton
                        icon="content-save"
                        iconColor={isSaved && isAuth ? "black" : "gray"}
                        size={20}
                        onPress={() => isSaved && isAuth ? remove(newsItem.id) : requireAuth(() => save(newsItem))}
                    />
                </View>
            </View>
            <ThemedText type="subtitle" numberOfLines={2}>{newsItem.title}</ThemedText>
            <ThemedText type="default" numberOfLines={5}>{newsItem.summary}</ThemedText>

        </View>

    </Pressable>)
}


const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    newsSource: { position: 'absolute', bottom: 0, right: 0, textAlign: 'center', backgroundColor: '#ffffffce', paddingVertical: 8, paddingHorizontal: 16, borderTopLeftRadius: 16 },
    cardButtons: {
        position: 'absolute', top: 0, right: 0, textAlign: 'center', backgroundColor: '#ffffffce', borderBottomLeftRadius: 16
    },
});