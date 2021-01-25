import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthConstants } from '../constants/auth.constants';
import { AuthService, JwtPayload } from '../services/auth.service';
import { SafeUser } from '../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: AuthConstants.jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<SafeUser> {
    return this.authService.parseJwtPayload(payload).user;
  }
}
