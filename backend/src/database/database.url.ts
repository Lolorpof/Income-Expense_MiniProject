import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseUrl {
  constructor(private readonly configService: ConfigService) {}

  dbUrl(): string {
    return `postgres://${this.configService.getOrThrow('POSTGRES_USER')}:${this.configService.getOrThrow('POSTGRES_PASSWORD')}@${this.configService.getOrThrow('POSTGRES_HOST')}:${this.configService.getOrThrow('POSTGRES_PORT')}/${this.configService.getOrThrow('POSTGRES_DB')}`;
  }

  adminUrl(): string {
    return `postgres://${this.configService.getOrThrow('POSTGRES_SUPER_USER')}:${this.configService.getOrThrow('POSTGRES_SUPER_PASSWORD')}@${this.configService.getOrThrow('POSTGRES_HOST')}:${this.configService.getOrThrow('POSTGRES_PORT')}/${this.configService.getOrThrow('POSTGRES_DB')}`;
  }
}
