import { FlatList, StyleSheet, View } from 'react-native';


import NewsCard from '@/components/NewsCard';
import Protected from '@/components/protected';
import { ThemedText } from '@/components/themed-text';
import { useSavedNews } from '@/context/SavedNewsContext';


export default function SavedNewsScreen() {
  const { saved, remove } = useSavedNews();
  console.log("Saved news:", saved);

  return (
    <Protected>
      <View style={styles.container}>
        <ThemedText type='title' style={styles.pageTitle}>{"My Space"}</ThemedText>
        {!saved && (
          <ThemedText>{"Loading saved news..."}</ThemedText>
        )}
        {saved.length === 0 && (
          <ThemedText>{"No saved news articles."}</ThemedText>
        )}

        {saved && <FlatList data={saved} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => (
          <NewsCard newsItem={item} />
        )}>
        </FlatList>}

      </View>
    </Protected>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    marginBottom: 16,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
