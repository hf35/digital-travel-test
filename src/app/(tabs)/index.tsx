import NewsCard from '@/components/NewsCard';
import { ThemedText } from '@/components/themed-text';
import { getSpaceNews } from '@/services/api/dataService';
import { NewsItem } from '@/services/types/api';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';


export default function TabTwoScreen() {
  const [totalNews, setTotalNews] = useState<number | null>(null);
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
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
      <ThemedText type="title">Our Space</ThemedText>
      {totalNews !== null ? (
        <ThemedText style={styles.pageSubtitle}>Total news articles about space: {totalNews}</ThemedText>
      ) : (
        <ThemedText>Loading news data...</ThemedText>
      )}
      <FlatList data={newsData} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => (
        <NewsCard newsItem={item} />

      )}>
      </FlatList>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  pageSubtitle: { marginVertical: 8 },
  newsTitle: { position: 'absolute', bottom: 0, left: 0, width: '100%', textAlign: 'center', backgroundColor: '#ffffffa4', paddingVertical: 8 }
});
