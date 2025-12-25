import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../common/guards/AuthGuard';
import { WsAuthorizationGuard } from '../common/guards/ws-authorization.guard';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import type { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @CurrentUser() user: User,
    @Query('cursor') cursor: string,
    @Query('limit') limit: string,
    @Query('q') searchQuery: string,
  ) {
    console.log('SDF', searchQuery, cursor);
    return this.userService.findAll(user, +limit, cursor, searchQuery);
  }

  @Get('/roles')
  @UseGuards(AuthGuard)
  currentUserRoles(@Req() req: any) {
    console.log('user comming here', req.user.id);
    return this.userService.currentUserRoles(req.user.id);
  }

  @Get('/workspaces/:wsSlug/users')
  @UseGuards(WsAuthorizationGuard)
  usersNotInWs(@Param('wsSlug') wsSlug: string) {
    return this.userService.findAllUserNotInWs(wsSlug);
  }
  @Get('/project/:pId/users')
  // @UseGuards()
  usersNotInP(@Param('pId') wsId: string) {
    return this.userService.findAllUserNotInP(wsId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
