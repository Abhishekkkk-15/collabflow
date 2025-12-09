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
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: ExtendedRequest) {
    return this.workspaceService.findAll(req.user.id);
  }
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.workspaceService.findOne(slug);
  }

  @Get(':slug/members')
  getWorkspaceMembers(
    @Param('slug') slug: string,
    @Query('limit') limit: string,
  ) {
    return this.workspaceService.getWorkspaceMembers(slug, +limit);
  }

  @Post(':slug/invite')
  inviteMembers(
    @Param('slug') slug: string,
    @Body() body: InviteWorkspaceDto,
    @CurrentUser() user: User,
  ) {
    console.log('inviteing new user');
    return this.workspaceService.handleInvite(slug, body, user);
  }

  @Patch(':slug')
  updateWorkspace(
    @Param('slug') slug: string,
    @Body() body: { name?: string; description?: string },
  ) {
    return this.workspaceService.update(slug, body);
  }
}
