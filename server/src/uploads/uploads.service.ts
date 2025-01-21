import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cloudinary from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadsService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.v2.config({
      cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  public uploadFile = async (
    file: Express.Multer.File,
  ): Promise<{ url: string }> => {
    try {
      if (!file.path && file.buffer) {
        const uploadStream = () =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream(
              { resource_type: 'auto', timeout: 60000 },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              },
            );

            const readable = Readable.from(file.buffer);
            readable.pipe(stream);
          });

        const result = (await uploadStream()) as any;

        return {
          url: result.secure_url,
        };
      }

      const result = await cloudinary.v2.uploader.upload(file.path, {
        resource_type: 'auto',
        timeout: 60000,
      });

      return {
        url: result.secure_url,
      };
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      throw new Error('Failed to upload file');
    }
  };
}
