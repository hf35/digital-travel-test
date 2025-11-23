import { FILE_SERVER_URL } from "@/utils/upload";
import { Platform } from "react-native";

import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";


type ProgressCallback = (percent: number) => void;
export type DownloadFile = {
    name: string;
    url: string;
}

export async function fetchFilesList() {
    const res = await fetch(`${FILE_SERVER_URL}/files`);
    if (!res.ok) throw new Error("Failed to fetch files");
    return res.json(); 
}


export async function downloadFile(
  url: string,
  filename: string,
  onProgress?: ProgressCallback
): Promise<string> {
  if (Platform.OS === "web") {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network error");

    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);

    return blobUrl;
  }

  // iOS / Android: скачиваем во внутреннее хранилище приложения
  const fileUri = FileSystem.documentDirectory + filename;

  const downloadResumable = FileSystem.createDownloadResumable(
    url,
    fileUri,
    {},
    (progress) => {
      if (onProgress && progress.totalBytesExpectedToWrite > 0) {
        const percent = Math.round(
          (progress.totalBytesWritten / progress.totalBytesExpectedToWrite) * 100
        );
        onProgress(percent);
      }
    }
  );

  const result = await downloadResumable.downloadAsync();

  try {
    const available = await Sharing.isAvailableAsync();
    if (available && result) {
      await Sharing.shareAsync(result.uri);
    } else {
      console.warn("Sharing не доступен, файл сохранён в app storage:", result);
    }
  } catch (e) {
    console.error("Ошибка при открытии диалога сохранения:", e);
  }

  return result!.uri;
}