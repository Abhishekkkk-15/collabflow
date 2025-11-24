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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workspaceService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.update(+id, updateWorkspaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workspaceService.remove(+id);
  }
}
