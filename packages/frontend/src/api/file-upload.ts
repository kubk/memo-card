import { env } from "../env";
import { trimEnd } from "../lib/string/trim";
import { api } from "./trpc-api";

export async function uploadImage(file: File): Promise<{
  publicUrl: string;
}> {
  const {
    url: uploadUrl,
    fileName,
    contentType,
  } = await api.signedUrl.generate.mutate({
    fileName: file.name,
    size: file.size,
  });

  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": contentType },
  });
  if (!response.ok) {
    throw new Error(`Image upload failed with ${response.status}`);
  }

  const publicUrl = `${trimEnd(env.VITE_R2_PUBLIC_URL, "/")}/${fileName}`;
  return { publicUrl };
}

// fetch() has no upload progress, XMLHttpRequest does
export const uploadWithProgress = ({
  url,
  file,
  contentType,
  onProgress,
}: {
  url: string;
  file: File;
  contentType: string;
  onProgress: (uploadedBytes: number, totalBytes: number) => void;
}) => {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", url);
    request.setRequestHeader("Content-Type", contentType);
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
