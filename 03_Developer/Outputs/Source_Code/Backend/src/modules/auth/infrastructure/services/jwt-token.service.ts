import jwt from 'jsonwebtoken';
import { ITokenService, TokenPayload } from '../../domain/services/token.service.interface';
import { env } from '../../../../core/config/env';

export class JwtTokenService implements ITokenService {
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
    });
  }

  verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      // jsonwebtoken throws JsonWebTokenError or TokenExpiredError which will be caught by middleware later
      throw error; 
    }
  }
}
