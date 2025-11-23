

import { NewsItem } from "@/services/types/api";
import { router } from 'expo-router';
import { ThemedText } from "./themed-text";

import { useAuth } from "@/context/AuthContext";
import { useSavedNews } from "@/context/SavedNewsContext";
import { useNewsStore } from "@/storage/currentNews";
import { useMemo } from "react";
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { IconButton } from "react-native-paper";
import { ExternalLink } from "./external-link";


export default function NewsCard({ newsItem, showFullData = false }: { newsItem: NewsItem, showFullData?: boolean }) {
    const { requireAuth, isAuth } = useAuth();
    const { save, remove, saved } = useSavedNews();
    const { setSelected } = useNewsStore();
    const openNews = (item: NewsItem) => {
        setSelected(item);
        router.push({
            pathname: "/news/[id]",
        });
    }
    const isSaved = useMemo(() => saved.some((n) => n.id === newsItem?.id), [saved, newsItem]);


    return (<Pressable onPress={() => openNews(newsItem)}>
        <View style={styles.card} >
            <View>
                <Image source={{ uri: newsItem.image_url }} style={styles.cardImage} />
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
            <ThemedText type="default" >{new Date(newsItem.published_at).toLocaleString("ru-ru")}</ThemedText>
            {showFullData && <View>
                {newsItem.authors.map((author) => (<View  >
                    <ThemedText type="default" key={author.name}>Author: {author.name}</ThemedText>
                    {author.socials && <View style={styles.authorsContainer}>
                        {Object.entries(author.socials).filter(social => social[1]).map((social) =>
                            <ExternalLink href={social[1]!} text={social[0]} />
                        )}</View>}
                </View>))}

            </View>}
            <ThemedText type="default" numberOfLines={showFullData ? undefined : 5}>{newsItem.summary}</ThemedText>

        </View>

    </Pressable>)
}


const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    card: { marginBottom: 8, flexDirection: 'column', gap: 4 },
    cardImage: { width: '100%', height: 200 },
    newsSource: { position: 'absolute', bottom: 0, right: 0, textAlign: 'center', backgroundColor: '#ffffffce', paddingVertical: 8, paddingHorizontal: 16, borderTopLeftRadius: 16 },
    cardButtons: {
        position: 'absolute', top: 0, right: 0, textAlign: 'center', backgroundColor: '#ffffffce', borderBottomLeftRadius: 16
    },
    authorsContainer: { flexDirection: "row", gap: 8 }
});