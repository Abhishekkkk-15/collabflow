import { IoAdapter } from '@nestjs/platform-socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { INestApplicationContext } from '@nestjs/common';

export class RedisIoAdapter extends IoAdapter {
  private pubClient: any;
  private subClient: any;

  constructor(app: INestApplicationContext) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    this.pubClient = createClient({ url: redisUrl });
    this.subClient = this.pubClient.duplicate();

    await this.pubClient.connect();
    await this.subClient.connect();

    console.log('[RedisIoAdapter] Redis connected');
  }

  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, options);

    // Bind Redis adapter to Socket.IO
    server.adapter(createAdapter(this.pubClient, this.subClient));

    return server;
  }
}
