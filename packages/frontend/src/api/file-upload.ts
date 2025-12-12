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
