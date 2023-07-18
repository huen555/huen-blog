import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const name = this.getName();
    return `Hi ${name}^.^)'`;
  }
  getName(): string {
    return 'Hung Nguyen';
  }
}
