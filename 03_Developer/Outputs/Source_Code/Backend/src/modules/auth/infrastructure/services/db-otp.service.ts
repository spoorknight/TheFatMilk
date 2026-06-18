import { IOtpService } from '../../domain/services/otp.service.interface';
import { prisma } from '../../../../core/database/prisma.service';

export class DbOtpService implements IOtpService {
  private readonly OTP_TTL_MINUTES = 5;

  async generate(userId: string, type: string): Promise<string> {
    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + this.OTP_TTL_MINUTES * 60 * 1000);

    // Delete any existing OTP for this user + type before creating new one
    await prisma.otpCode.deleteMany({
      where: { userId, type },
    });

    await prisma.otpCode.create({
      data: {
        userId,
        code,
        type,
        expiresAt,
      },
    });

    return code;
  }

  async verify(userId: string, code: string, type: string): Promise<boolean> {
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        userId,
        code,
        type,
        expiresAt: { gte: new Date() },
      },
    });

    if (!otpRecord) {
      return false;
    }

    // OTP is single-use: delete after successful verification
    await prisma.otpCode.delete({
      where: { id: otpRecord.id },
    });

    return true;
  }
}
