import { env } from "../env";
import { trimEnd } from "../lib/string/trim";
import { userStore } from "../store/user-store";
import { api } from "./trpc-api";

export async function uploadImage(file: File): Promise<{
  publicUrl: string;
}> {
  const imageId = crypto.randomUUID();
  const fileName = `${userStore.myId}.${imageId}-${file.name}`;

  const { url: uploadUrl } = await api.signedUrl.generate.mutate({
    fileName,
  });

  await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
  });

  const publicUrl = `${trimEnd(env.VITE_R2_PUBLIC_URL, "/")}/${fileName}`;
  return { publicUrl };
}

// fetch() has no upload progress, XMLHttpRequest does
export const uploadWithProgress = (
  url: string,
  file: File,
  onProgress: (uploadedBytes: number, totalBytes: number) => void,
) => {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", url);
    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        onProgress(event.loaded, event.total);
      }
    });
    request.addEventListener("load", () => {
      if (request.status >= 200 && request.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with ${request.status}`));
      }
    });
    request.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });
    request.send(file);
  });
};
