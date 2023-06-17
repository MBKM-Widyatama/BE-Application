import { Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { VerificationEmailService } from './services/verification-email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('APP_MAILER_HOST'),
          port: +config.get('APP_MAILER_PORT'),
          secure: false,
          auth: {
            user: config.get('APP_MAILER_USERNAME'),
            pass: config.get('APP_MAILER_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('APP_MAILER_FROM')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'), // --> It means src/libs/mailers/verification-email/templates
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),

      inject: [ConfigService],
    }),
  ],
  providers: [VerificationEmailService],
  exports: [VerificationEmailService],
})
export class VerificationEmailModule {}
