import { IOtpService } from '../../domain/services/otp.service.interface';
import { prisma } from '../../../../core/database/prisma.service';

export class DbOtpService implements IOtpService {
  async generateAndSendOtp(userId: string, phone: string): Promise<string> {
    // Generate a 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes TTL

    // Invalidate previous OTPs for this user
    await prisma.otpCode.updateMany({
      where: { userId, isUsed: false },
      data: { isUsed: true },
    });

    await prisma.otpCode.create({
      data: {
        userId,
        code,
        expiresAt,
      },
    });

    // In a real scenario, integrate with SMS gateway here
    console.log(`[SMS Mock] Sending OTP ${code} to phone ${phone}`);

    return code;
  }

  async verifyOtp(userId: string, code: string): Promise<boolean> {
    const otp = await prisma.otpCode.findFirst({
      where: {
        userId,
        code,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      return false;
    }

    // Mark as used
    await prisma.otpCode.update({
      where: { id: otp.id },
      data: { isUsed: true },
    });

    return true;
  }
}
