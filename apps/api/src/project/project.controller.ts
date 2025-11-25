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
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from '../common/guards/AuthGuard';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createProjectDto: CreateProjectDto, @Req() req: any) {
    return this.projectService.create(createProjectDto, req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findAll(@Param('id') workspaceId: string, @Req() req: any) {
    return this.projectService.findAll(workspaceId, req.user.id);
  }

  @Get('project/:id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
