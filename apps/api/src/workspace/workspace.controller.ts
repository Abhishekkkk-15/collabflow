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
import { User } from '@collabflow/types';
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
    @Req() req: ExtendedRequest,
  ) {
    return this.workspaceService.create(createWorkspaceDto, req.user.id);
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

  @Get(':id/members')
  getWorkspaceMembers(@Param('id') id: string, @Query('limit') limit: string) {
    return this.workspaceService.getWorkspaceMembers(id, +limit);
  }
}
