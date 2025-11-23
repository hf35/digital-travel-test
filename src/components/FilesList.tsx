import { DownloadFile, downloadFile, fetchFilesList } from "@/services/remote-files";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, Button, Card, IconButton, ProgressBar } from "react-native-paper";
import { useToast } from "react-native-paper-toast";
import { ThemedText } from "./themed-text";


export default function FilesList({ updateTrigger }: { updateTrigger?: number }) {
  const toaster = useToast();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  const [downloaded, setDownloaded] = useState<Record<string, string>>({});

  useEffect(() => {
    loadFiles();
  }, [updateTrigger]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const list = await fetchFilesList();
      setFiles(list);
    } catch (e) {
      toaster.show({ message: `Failed to load files: ${e}`, duration: 2000 });
    }
    setLoading(false);
  };

  const startDownload = async (file: DownloadFile) => {
    setDownloadProgress((p) => ({ ...p, [file.name]: 0 }));

    try {
      const uri = await downloadFile(file.url, file.name, (percent) => {
        setDownloadProgress((p) => ({ ...p, [file.name]: percent }));
      });
      setDownloaded((d) => ({ ...d, [file.name]: uri }));
    } catch (e) {
      toaster.show({ message: `Failed to download file: ${file.name}`, duration: 2000 });
      setDownloadProgress((p) => ({ ...p, [file.name]: -1 }));
    }
  };

  if (loading) return <View style={{ marginVertical: 16 }}><ActivityIndicator size={"small"} /></View>;

  return (
    <View>
      <View style={styles.titleBox}>
        <ThemedText type="subtitle">
          {"Available Files"}
        </ThemedText>
        <IconButton
          icon="reload"
          disabled={loading}
          iconColor={loading ? "gray" : "black"}
          size={20}
          onPress={() => loadFiles()}
        />
      </View>
      {files.length === 0 && <Text>No files available.</Text>}
      {loading && <ActivityIndicator size={"small"} />}
      {files.map((file: DownloadFile) => {
        //@ts-ignore
        const progress = downloadProgress[file.name];
        const localUri = downloaded[file.name];

        return (
          <Card key={file.name} style={styles.card}>
            <Card.Title title={file.name} titleStyle={{ color: "black" }} />

            <Card.Content>
              {progress > 0 && progress < 100 && (
                <>
                  <ThemedText>Скачивание: {progress}%</ThemedText>
                  <ProgressBar progress={progress / 100} style={{ marginTop: 8 }} />
                </>
              )}

              {progress === -1 && (
                <Text style={{ color: "red" }}>Ошибка скачивания</Text>
              )}

              {localUri && <Text>{"Загружено"}</Text>}
            </Card.Content>

            <Card.Actions>
              <Button onPress={() => startDownload(file)}>Скачать</Button>
            </Card.Actions>
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  titleBox:{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 8 },
  card: { marginBottom: 12, backgroundColor: 'white' },
});
