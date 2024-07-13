import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobDetailsDto } from './dto/job-details.dto';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  findAll(): Promise<JobDetailsDto[]> {
    return this.jobService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<JobDetailsDto> {
    return this.jobService.findOne(+id);
  }

  @Post()
  create(@Body() createJobDto: CreateJobDto): Promise<JobDetailsDto> {
    return this.jobService.create(createJobDto);
  }
}
