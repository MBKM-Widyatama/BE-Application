import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IRequestUserPassport } from 'src/models/users/interfaces/users.interface';

@Injectable()
export class AuthenticationJWTStrategy extends PassportStrategy(
  Strategy,
  'authentication-jwt',
) {
  constructor(private readonly configurations: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configurations.get<string>('APP_JWT_PUBLIC_KEY'),
      algorithms: [configurations.get<string>('APP_JWT_ALGORITHM')],
    });
  }

  async validate(payload: any): Promise<IRequestUserPassport> {
    const user: IRequestUserPassport = {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
