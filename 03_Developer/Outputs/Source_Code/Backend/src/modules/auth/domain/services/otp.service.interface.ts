export interface IOtpService {
  generate(userId: string, type: string): Promise<string>;
  verify(userId: string, code: string, type: string): Promise<boolean>;
}
