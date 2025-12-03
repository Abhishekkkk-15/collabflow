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
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from '../common/guards/AuthGuard';
import { ProjectMemberGuard } from '../common/guards/ProjectMemberGuard';
import { MemberGuard } from '../common/guards/MemberGuard';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import type { User } from '@prisma/client';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  @Get('project')
  @UseGuards(AuthGuard, MemberGuard)
  findOne(
    @Query('slug') slug: string,
    @Query('pId') id: string,
    @Req() req: any,
  ) {
    console.log('got here');
    console.log(slug, id);
    return this.projectService.findOne(id, slug, req.user.id);
  }
  @Post()
  @UseGuards(MemberGuard, AuthGuard)
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: User,
  ) {
    return this.projectService.create(createProjectDto, user);
  }

  // @Get(':id')
  // @UseGuards(AuthGuard)
  // findAll(@Param('id') workspaceId: string, @Req() req: any) {
  //   return this.projectService.findAll(workspaceId, req.user.id);
  // }

  @Get(':slug/members')
  getProjectMembers(@Param('slug') slug: string, @Query('limit') limit = 5) {
    return this.projectService.getProjectMembers(slug, limit);
  }
}
