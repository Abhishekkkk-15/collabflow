import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  async getHello() {
    return 'Hey there you are at right place CollabFlow';
  }
}
