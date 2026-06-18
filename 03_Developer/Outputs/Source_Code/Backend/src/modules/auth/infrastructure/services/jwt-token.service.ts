import * as jwt from 'jsonwebtoken';
import { ITokenService, TokenPayload, TokenPair } from '../../domain/services/token.service.interface';
import { env } from '../../../../core/config/env';

export class JwtTokenService implements ITokenService {
  generateTokenPair(payload: TokenPayload): TokenPair {
    const accessToken = jwt.sign(
      { userId: payload.userId, role: payload.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] },
    );

    const refreshToken = jwt.sign(
      { userId: payload.userId, role: payload.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'] },
    );

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): TokenPayload {
    const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    return { userId: decoded.userId, role: decoded.role };
  }

  verifyRefreshToken(token: string): TokenPayload {
    const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    return { userId: decoded.userId, role: decoded.role };
  }
}
