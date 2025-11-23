import { FileItem } from "@/services/types/api";
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from "react-native";

//export const FILE_SERVER_URL = "http://192.168.1.78:3000";
export const FILE_SERVER_URL = "https://hart-flamov.ru";


export function uploadFileWithProgress(
    file: FileItem,
    onProgress: (percent: number) => void,
): Promise<any> {
    return new Promise(async (resolve, reject) => {
        const xhr = new XMLHttpRequest();

        const formData = new FormData();
        const isWeb = Platform.OS === "web";
        if (isWeb) {

            const blob = await fetch(file.uri).then(r => r.blob());
            formData.append("file", blob, file.name);
        } else {

            formData.append("file", {
                uri: file.uri,
                name: file.name,
                type: file.mimeType || "application/octet-stream",
            } as any);
        }

        xhr.open("POST", `${FILE_SERVER_URL}/upload`);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                onProgress(percent);
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.response));
            } else {
                reject(new Error(`Upload failed with status ${xhr.status}`));
            }
        };

        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(formData);
    });
}

interface UploadFile {
    uri: string;
    name: string;
    mimeType?: string;
}

interface UploadOptions {
    file: UploadFile;
    onProgress: (percent: number) => void;
}

export async function uploadFile2({ file, onProgress }: UploadOptions) {
    const isWeb = Platform.OS === "web";

    if (isWeb) {
        // Web: используем XMLHttpRequest + blob
        const blob = await fetch(file.uri).then(r => r.blob());
        const formData = new FormData();
        formData.append("file", blob, file.name);

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", `${FILE_SERVER_URL}/upload`);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    onProgress(percent);
                }
            };

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject(new Error(`Upload failed: ${xhr.statusText}`));
                }
            };

            xhr.onerror = () => reject(new Error("Upload error"));
            xhr.send(formData);
        });
    } else {
        // iOS / Android: используем createUploadTask из legacy API
        const task = FileSystem.createUploadTask(
            `${FILE_SERVER_URL}/upload`,
            file.uri,
            {
                headers: { "Content-Type": "multipart/form-data" },
                fieldName: "file",
                uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            },
            ({ totalBytesSent, totalBytesExpectedToSend }) => {
                const percent = Math.round((totalBytesSent / totalBytesExpectedToSend) * 100);
                onProgress(percent);
            }
        );

        await task.uploadAsync();
    }
}