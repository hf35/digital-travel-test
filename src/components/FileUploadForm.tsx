import { FileItem } from "@/services/types/api";
import { pickFile } from "@/utils/files";
import { uploadFile2 } from "@/utils/upload";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, ProgressBar } from "react-native-paper";
import { useToast } from "react-native-paper-toast";
import { ThemedText } from "./themed-text";


export default function FileUploadForm({ fileUploaded }: { fileUploaded?: () => void }) {
    const toaster = useToast();
    const [selected, setSelected] = useState<FileItem>();
    const [progress, setProgress] = useState(0);


    const chooseFile = async () => {
        const f = await pickFile();
        if (f) { setSelected(f) };
    };

    const upload = async () => {
        if (!selected) return;
        const res = await uploadFile2({
            file: selected, onProgress: (progress) => {
                setProgress(progress);
            }
        }).catch((err) => {
            toaster.show({ message: `Upload failed: ${err.message}`, duration: 1000 });
        }).then(() => {
            toaster.show({ message: `Upload successful`, duration: 1000 });
            setProgress(0);
            setSelected(undefined);
            fileUploaded?.()
        });
    };

    return (
        <View style={styles.container}>
            <ThemedText type='subtitle' style={styles.title}>{"File Upload"}</ThemedText>
            <Button onPress={chooseFile} mode='outlined' >Выбрать файл</Button>

            {selected && <ThemedText>Выбрано: {selected.name}</ThemedText>}

            {selected && (
                <Button onPress={upload} mode='outlined' >Загрузить файл</Button>
            )}
            {progress > 0 && <View style={styles.progress}><ProgressBar progress={progress / 100} /></View>}
        </View>
    )
}


const styles = StyleSheet.create({
    container: { flexShrink: 1 },
    title: { marginBottom: 8, marginTop: 24 },
    progress: { marginTop: 8, height: 10 },
});
