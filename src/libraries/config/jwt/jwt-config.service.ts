import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createJwtOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
    return {
      privateKey: this.configService.get<string>('APP_JWT_PRIVATE_KEY'),
      publicKey: this.configService.get<string>('APP_JWT_PUBLIC_KEY'),
      signOptions: {
        expiresIn: this.configService.get<string>('APP_JWT_EXPIRES_IN'),
        issuer: this.configService.get<string>('APP_JWT_ISSUER'),
        algorithm: this.configService.get('APP_JWT_ALGORITHM'),
      },
    };
  }
}
