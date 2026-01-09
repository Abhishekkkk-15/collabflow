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
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { AuthGuard } from '../common/guards/AuthGuard';
import type { Request } from 'express';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import type { User } from '@prisma/client';
import { InviteWorkspaceDto } from './dto/invite.workspace.dto';
import { ChangeRoleDto } from './dto/change-role';
import { UpdatePermissinDto } from './dto/update-permission.dto';
export interface ExtendedRequest extends Request {
  user: User;
}

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @CurrentUser() user: User,
  ) {
    return this.workspaceService.create(createWorkspaceDto, user);
  }

  @Get('/dashboard')
  findAllWsForOwnerAndMaintainer(@CurrentUser() user: User) {
    return this.workspaceService.findAllWSForOwnerAndMaintainer(user);
  }
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: ExtendedRequest) {
    return this.workspaceService.findAll(req.user.id);
  }
  @Get(':slug')
  @UseGuards(AuthGuard)
  findOne(@Param('slug') slug: string, @CurrentUser() user: User) {
    return this.workspaceService.findOne(slug, user);
  }

  @Get(':id/members')
  getWorkspaceMembers(
    @Param('id') id: string,
    @Query('limit') limit: string,
    @Query('cursor') cursor: string,
    @Query('q') query: string,
  ) {
    return this.workspaceService.getWorkspaceMembers(id, +limit, cursor, query);
  }

  @Patch(':id/permissions/')
  handleChangePermission(
    @Param('id') id: string,
    @Body() body: UpdatePermissinDto,
  ) {
    return this.workspaceService.changePermissions(id, body);
  }

  @Patch('members/role')
  changeRole(@Body() body: ChangeRoleDto, @CurrentUser() user: User) {
    console.log('Dto', body);
    return this.workspaceService.changeRoles(body, user);
  }
  @Patch(':slug')
  updateWorkspace(
    @Param('slug') slug: string,
    @Body() body: { name?: string; description?: string },
    @CurrentUser() user: User,
  ) {
    return this.workspaceService.update(slug, body, user);
  }
  @Patch('/visible/:id')
  handleVisibility(@Param('id') id: string, @CurrentUser() user: User) {
    this.workspaceService.handleVisibility(id, user);
  }
  @Delete(`/members/:id/remove/`)
  handleRemoveMember(@Param('id') id: string) {
    return this.workspaceService.removeMember(id);
  }

  @Delete(':slug')
  deleteWorkspace(@Param('slug') slug: string, @CurrentUser() user: User) {
    this.workspaceService.remove(slug, user);
  }
}
