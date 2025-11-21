import { ScrollView, StyleSheet } from 'react-native';

import Protected from '@/components/protected';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import { router } from "expo-router";
import { Button } from 'react-native';

export default function HomeScreen() {
  const { doLogout } = useAuth();

  return (
    <Protected>
      <ScrollView>
        <ThemedText>{"Account"}</ThemedText>
        <Button title="Press me" onPress={() => doLogout().then(()=> router.replace("/"))} />
      </ScrollView>
    </Protected>
  );
}

const styles = StyleSheet.create({

});
