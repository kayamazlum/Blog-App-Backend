import fs from "fs";
import path from "path";

export const deleteFile = async (filePath: string) => {
  try {
    const fullPath = path.join(__dirname, "../", filePath);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
      console.log(`Deleted: ${filePath}`);
    }
  } catch (error) {
    console.error("File delete error:", error);
  }
};
