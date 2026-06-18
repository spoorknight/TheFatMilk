export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface IFileStorageService {
  uploadFile(file: UploadedFile, folder?: string): Promise<string>;
  uploadMultipleFiles(files: UploadedFile[], folder?: string): Promise<string[]>;
  deleteFile(fileUrl: string): Promise<void>;
}
