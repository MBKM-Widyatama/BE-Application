import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SanitizePipe implements PipeTransform {
  constructor(private readonly className: any) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      return plainToInstance(this.className, value);
    }

    return value;
  }
}
