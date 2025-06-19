import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly users: string[] = ['joe', 'mama', 'palm', 'eddy'];
  getAll() {
    return this.users;
  }
}
