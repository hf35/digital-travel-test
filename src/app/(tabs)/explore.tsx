import { ThemedText } from '@/components/themed-text';
import { getSpaceNews } from '@/services/api/dataService';
import { NewsRecord } from '@/services/types/api';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';


export default function TabTwoScreen() {
  const [totalNews, setTotalNews] = useState<number | null>(null);
  const [newsData, setNewsData] = useState<NewsRecord[]>([]);
  useEffect(() => {
    const fetchNews = async () => {
      const spaceNews = await getSpaceNews();
      console.log('NEWS total', spaceNews.data?.count);
      setTotalNews(spaceNews.data?.count || null);
      spaceNews.data?.results && setNewsData(spaceNews.data?.results);

    }

    fetchNews()
  }, []);

  return (
    <View style={styles.container}>
      <ThemedText type="title">Hot News</ThemedText>
      {totalNews !== null ? (
        <ThemedText>Total news articles about space: {totalNews}</ThemedText>
      ) : (
        <ThemedText>Loading news data...</ThemedText>
      )}
      <FlatList data={newsData} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => (
        <View style={{ marginBottom: 24, flexDirection: 'column', gap: 4 }}>
          <Image source={{ uri: item.image_url }} style={{ width: '100%', height: 200, marginVertical: 8 }} />
          <ThemedText key={item.id} type="subtitle">
            {item.title}
          </ThemedText>
        </View>

      )}>
      </FlatList>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
