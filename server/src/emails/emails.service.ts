import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import * as path from 'path';
import { Email } from 'src/emails/entities/emails.entity';
import { UploadsService } from 'src/uploads/uploads.service';
import { User } from 'src/users/entities/users.entity';
import { getEnvValue } from 'src/utils';
import { DataSource, LessThan, Repository } from 'typeorm';

@Injectable()
export class EmailsService implements OnModuleInit {
  private transporter: Transporter;

  constructor(
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly uploadsService: UploadsService,
    private readonly configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: configService.get('EMAIL_USER'),
        pass: configService.get('EMAIL_PASS'),
      },
    });
  }

  async onModuleInit(): Promise<void> {
    await this.emailRepository.delete({
      expired_at: LessThan(new Date()),
    });
  }

  public handleVerifyVerificationCode = async (
    code: string,
    email: string,
    type: string,
  ): Promise<boolean> => {
    const findCode = await this.emailRepository.findOneBy({
      verification_code: code,
      recipient: email,
      type,
    });

    if (!findCode)
      throw new NotFoundException(
        'The provided verification code is invalid or does not match our records.',
      );

    const now = new Date();

    return findCode.expired_at.getTime() > now.getTime();
  };

  public sendVerificationCode = async (
    email: string,
    code: string,
  ): Promise<void> => {
    const htmlContent = `
      <p>Hi there,</p>
      <p>Your verification code is <strong style="font-size: 20px; color: red;">${code}</strong>.</p>
      <p>Please enter it to verify your email address.</p>
      <p style="font-size: 12px;">Note: The code will expire in 
          <strong style="font-size: 20px; color: black;">2</strong>
      minutes! Please enter it promptly.</p>
    `;

    const filePath = path.join(__dirname, `${email}/verification-code.html`);

    const dirPath = path.dirname(filePath);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(filePath, htmlContent);

    const fileBuffer = fs.readFileSync(filePath);

    const mockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'verification-email.html',
      encoding: '7bit',
      mimetype: 'text/html',
      size: fileBuffer.length,
      buffer: fileBuffer,
      stream: fs.createReadStream(filePath),
      filename: 'verification-email.html',
      destination: path.dirname(filePath),
      path: filePath,
    };

    const { url } = await this.uploadsService.uploadFile(mockFile);

    const mailOptions: Mail.Options = {
      from: this.configService.get('EMAIL_USER'),
      to: email,
      subject: 'Email Update Verification Code',
      html: htmlContent,
    };

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 2);

    const newEmail = this.emailRepository.create({
      type: 'verify',
      recipient: email,
      verification_code: code,
      content_url: url,
      sent_at: new Date(),
      expired_at: expiresAt,
    });

    await this.emailRepository.save(newEmail);

    await this.transporter.sendMail(mailOptions);
  };

  public sendResetEmail = async (
    email: string,
    token: string,
  ): Promise<void> => {
    const localAccountWithEmail = await this.dataSource
      .getRepository(User)
      .findOneBy({ email });

    if (!localAccountWithEmail)
      throw new BadRequestException(
        'There is no account linked to this email in the system, please enter the correct email.',
      );

    const { google_id, facebook_id } = localAccountWithEmail;

    const methodAccount = google_id
      ? 'Google'
      : facebook_id
        ? 'Facebook'
        : 'Local';

    if (google_id || facebook_id) {
      throw new BadRequestException(
        `The account linked to this email is a ${methodAccount} login account, not a username and 
            password login account, so the password cannot be recovered.`,
      );
    }

    const resetLink = `${getEnvValue('RESET_PASSWORD_LINK_PROD', 'RESET_PASSWORD_LINK_DEV')}/?token=${token}`;

    const htmlContent = `
        <p>Hi there,</p>
        <p>Please click below link to reset your password.</p>
        <strong style="font-size: 18px; color: #4CAF50;">${resetLink}</strong>
         <p style="font-size: 12px;">Note: The link will expire in 
          <strong style="font-size: 20px; color: black;">2</strong>
      minutes! Please click it promptly.</p>
      `;

    const filePath = path.join(__dirname, `${email}/forget-password.html`);

    const dirPath = path.dirname(filePath);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(filePath, htmlContent);

    const fileBuffer = fs.readFileSync(filePath);

    const mockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: `${email}/forget-password.html`,
      encoding: '7bit',
      mimetype: 'text/html',
      size: fileBuffer.length,
      buffer: fileBuffer,
      stream: fs.createReadStream(filePath),
      filename: '',
      destination: '',
      path: '',
    };

    const { url } = await this.uploadsService.uploadFile(mockFile);
    const mailOptions: Mail.Options = {
      from: this.configService.get('EMAIL_USER'),
      to: email,
      subject: 'Reset Your Password',
      html: htmlContent,
    };

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 2);

    const newEmail = this.emailRepository.create({
      type: 'forget-password',
      recipient: email,
      verification_link: resetLink,
      content_url: url,
      sent_at: new Date(),
      expired_at: expiresAt,
    });

    await this.emailRepository.save(newEmail);

    await this.transporter.sendMail(mailOptions);
  };
}
