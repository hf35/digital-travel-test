import { ScrollView, StyleSheet, View } from 'react-native';

import Protected from '@/components/protected';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import { router } from "expo-router";
import { Button } from 'react-native-paper';

export default function HomeScreen() {
  const { doLogout } = useAuth();

  return (
    <Protected>
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.canvas}>
          <ThemedText type='title' >{"Account"}</ThemedText>
        </View>
        <Button onPress={() => doLogout().then(() => router.replace("/"))} mode="contained"> Logout</Button>
      </ScrollView>
    </Protected>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  canvas: {
    flex: 1,   marginBottom: 16
  }
});
