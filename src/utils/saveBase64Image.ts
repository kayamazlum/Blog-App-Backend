import fs from "fs";
import path from "path";

export const saveBase64Image = async (
  base64Data: string
): Promise<string | null> => {
  try {
    const matches = base64Data.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) return null;

    const ext = matches[1].split("/")[1];
    const buffer = Buffer.from(matches[2], "base64");
    const fileName = `${Date.now()}.${ext}`;
    const filePath = path.join(__dirname, "../uploads/posts", fileName);

    await fs.promises.writeFile(filePath, buffer);

    return `/uploads/posts/${fileName}`;
  } catch (error) {
    console.error("Resim kaydedilemedi:", error);
    return null;
  }
};
