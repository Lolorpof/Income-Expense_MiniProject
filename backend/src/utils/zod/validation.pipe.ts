import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ZodSchema } from 'zod';
import { fromError } from 'zod-validation-error';

export class ZodValidationPipe implements PipeTransform {
  constructor(private zodSchema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parse = this.zodSchema.parse(value);
      return parse;
    } catch (error) {
      const formattedError = fromError(error);
      // console.log(formattedError.toString());
      throw new BadRequestException(formattedError.toString());
    }
  }
}
