import { Global, Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { LoginGuard } from './login.guard';
import { AuthModule } from '../auth.module';
import { UserModule } from 'src/user/user.module';

@Global()
@Module({
  imports: [AuthModule, UserModule],
  providers: [AuthGuard, LoginGuard],
})
export class GuardModule {}
