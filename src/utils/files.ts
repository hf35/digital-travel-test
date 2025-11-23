import * as DocumentPicker from "expo-document-picker";


export async function pickFile() {
  const res = await DocumentPicker.getDocumentAsync({
    type: "*/*",
    copyToCacheDirectory: true,
  });

  if (res.canceled) return null;

  return res.assets[0]; // { uri, name, mimeType, size }
}




