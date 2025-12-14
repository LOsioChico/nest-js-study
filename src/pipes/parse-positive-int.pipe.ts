import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform {
  transform(value: string): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(`Invalid number: ${value}`);
    }
    if (val <= 0) {
      throw new BadRequestException(`ID must be a positive number: ${value}`);
    }
    return val;
  }
}
