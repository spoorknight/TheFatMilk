import { IFileStorageService, UploadedFile } from './file-storage.interface';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class LocalFileStorageService implements IFileStorageService {
  private readonly uploadDir: string;

  constructor(uploadDir?: string) {
    this.uploadDir = uploadDir || path.join(process.cwd(), 'public', 'uploads');
    this.ensureDirectoryExists(this.uploadDir);
  }

  private ensureDirectoryExists(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  async uploadFile(file: UploadedFile, folder?: string): Promise<string> {
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    const targetDir = folder ? path.join(this.uploadDir, folder) : this.uploadDir;

    this.ensureDirectoryExists(targetDir);

    const filePath = path.join(targetDir, fileName);
    await fs.promises.writeFile(filePath, file.buffer);

    // Return the public URL path
    return folder ? `/uploads/${folder}/${fileName}` : `/uploads/${fileName}`;
  }

  async uploadMultipleFiles(files: UploadedFile[], folder?: string): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  async deleteFile(fileUrl: string): Promise<void> {
    // URL typically looks like: /uploads/folder/filename.jpg
    if (!fileUrl.startsWith('/uploads/')) return;
    
    const relativePath = fileUrl.replace('/uploads/', '');
    const filePath = path.join(this.uploadDir, relativePath);

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }
}
