export interface IOtpService {
  generateAndSendOtp(userId: string, phone: string): Promise<string>;
  verifyOtp(userId: string, code: string): Promise<boolean>;
}
