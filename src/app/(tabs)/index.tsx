import NewsCard from '@/components/NewsCard';
import NewsFilter from '@/components/NewsFilters';
import { ThemedText } from '@/components/themed-text';
import { getSpaceNews } from '@/services/api/dataService';
import { NewsItem } from '@/services/types/api';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';


export default function TabTwoScreen() {
  const [totalNews, setTotalNews] = useState<number | null>(null);
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  useEffect(() => {
    const fetchNews = async () => {
      const spaceNews = await getSpaceNews();
      setTotalNews(spaceNews.data?.count || null);
      spaceNews.data?.results && setNewsData(spaceNews.data?.results) && setFilteredNews(spaceNews.data?.results);
    }
    fetchNews()
  }, []);
  const onFilterNews = useCallback((filteredNews: NewsItem[]) => {
    setFilteredNews(filteredNews);
  }, []);

  return (
    <View style={styles.container}>
      <ThemedText type="title">Our Space</ThemedText>
      {totalNews !== null ? (
        <ThemedText style={styles.pageSubtitle}>Total news articles about space: {totalNews}</ThemedText>
      ) : (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size="large" />
        </View>
      )}
      {newsData.length > 0 && <NewsFilter newsData={newsData} onFilterNews={onFilterNews} />}
      <FlatList data={filteredNews} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => (
        <NewsCard newsItem={item} />
      )}>
      </FlatList>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  pageSubtitle: { marginVertical: 8 },
  activityIndicator: { flex: 1, justifyContent: "center" },
  newsTitle: { position: 'absolute', bottom: 0, left: 0, width: '100%', textAlign: 'center', backgroundColor: '#ffffffa4', paddingVertical: 8 }
});
