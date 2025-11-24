import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './common/guards/AuthGuard';
import type { ExtendedRequest } from './workspace/workspace.controller';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(AuthGuard)
  getHello(@Req() req: ExtendedRequest) {
    return this.appService.getHello(req.user.id);
  }
}
