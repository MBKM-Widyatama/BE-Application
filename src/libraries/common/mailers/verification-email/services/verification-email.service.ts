import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';

@Injectable()
export class VerificationEmailService {
  private readonly email = 'sample@sample.com';

  constructor(private mailerService: MailerService) {}

  async sendResetPasswordEmail(email: string, name: string, token?: string) {
    await this.mailerService.sendMail({
      to: this.email,
      subject: '[Backend SIMLITAMAS-UTAMA] Verification Reset Password',
      template: '../templates/verification-email', // `.hbs` extension is appended automatically
      context: {
        name,
        email,
        token,
      },
      attachments: [
        {
          filename: 'bg-email.png',
          path: join(__dirname, '../templates/assets/bg-email.png'),
          cid: 'bg-email@winningindonesia.com',
        },
        {
          filename: 'lock-illustration.png',
          path: join(__dirname, '../templates/assets/lock-illustration.png'),
          cid: 'lock-illustration@winningindonesia.com',
        },
      ],
    });
  }
}
