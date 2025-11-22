import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/authGuard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(AuthGuard)
  getData(@Req() req: any) {
    console.log(req.user);
    return {
      message: 'Its protected route',
      user: req.user,
    };
  }
}
