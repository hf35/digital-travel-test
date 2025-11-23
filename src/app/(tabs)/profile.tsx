import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import FilesList from '@/components/FilesList';
import FileUploadForm from '@/components/FileUploadForm';
import Protected from '@/components/Protected';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import { router } from "expo-router";
import { useState } from 'react';
import { Button } from 'react-native-paper';

export default function HomeScreen() {
  const { doLogout } = useAuth();
  const [uploadTrigger, setUploadTrigger] = useState(0);
  return (
    <Protected>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.canvas}>
          <ThemedText type='title' >{"Account"}</ThemedText>
          <FilesList updateTrigger={uploadTrigger} />
          <FileUploadForm fileUploaded={() => setUploadTrigger(uploadTrigger + 1)} />
        </View>
      </ScrollView>
      {Platform.OS !== "web" &&
        <View style={styles.manageButton}>
          <Button onPress={() => doLogout().then(() => router.replace("/"))} mode="contained"> Logout</Button>
        </View>
      }
    </Protected>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  contentContainer: { flexGrow: 1, paddingBottom: 32 },
  canvas: {
    flex: 1
  },
  manageButton: { padding: 16, borderTopColor: "#ccc", borderTopWidth: 1 },
});


