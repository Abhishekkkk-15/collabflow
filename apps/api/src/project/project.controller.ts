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
  create(@Body() createProjectDto: CreateProjectDto, @Req() req: any) {
    return this.projectService.create(createProjectDto, req.user.id);
  }

  // @Get(':id')
  // @UseGuards(AuthGuard)
  // findAll(@Param('id') workspaceId: string, @Req() req: any) {
  //   return this.projectService.findAll(workspaceId, req.user.id);
  // }
}
