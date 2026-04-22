import { Global, Injectable } from '@nestjs/common';
import { EmailNotificationDto } from '@utils/data-transfer-objects';
import * as nodemailer from 'nodemailer';

@Injectable()
@Global()
export class SendEmail {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: String(process.env['SMTP_SERV']),
      auth: {
        user: String(process.env['SMTP_USER']), //Ja raha ha
        pass: String(process.env['SMTP_PASS']),
      },
    });
  }
  async sendEmailNotifications(emailDto: EmailNotificationDto): Promise<void> {
    try {
      const mailOptions = {
        from: emailDto.from,
        to: emailDto.to,
        subject: emailDto.subject,
        text: emailDto.text.toString(),
        html: emailDto.html,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${emailDto.to}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(`Failed to send email: ${error.message}`);
      throw new Error('Email sending failed');
    }
  }
}
