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
  BadRequestException,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { AuthGuard } from '../common/guards/AuthGuard';
import { MemberGuard } from '../common/guards/MemberGuard';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import type { User } from '@prisma/client';
import { WsAuthorizationGuard } from '../common/guards/ws-authorization.guard';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  @Get(':id/members')
  getProjectMembers(
    @Param('id') id: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
    @Query('q') query: string,
  ) {
    return this.projectService.getProjectMembers(id, +page, +limit, query);
  }
  @Get()
  @UseGuards(AuthGuard, MemberGuard)
  findOne(
    @Query('slug') slug: string,
    @Query('pId') id: string,
    @Req() req: any,
    @CurrentUser() user: any,
  ) {
    if (!slug && !id)
      throw new BadRequestException('Slug or Project id must be provided');
    return this.projectService.findOne(id, slug, user);
  }
  @Post()
  @UseGuards(MemberGuard, AuthGuard)
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: User,
  ) {
    return this.projectService.create(createProjectDto, user);
  }

  @Delete(':slug')
  @UseGuards(WsAuthorizationGuard)
  deleteProject(@Param('slug') slug: string) {
    return this.projectService.remove(slug);
  }

  // @Get(':id')
  // @UseGuards(AuthGuard)
  // findAll(@Param('id') workspaceId: string, @Req() req: any) {
  //   return this.projectService.findAll(workspaceId, req.user.id);
  // }
}
