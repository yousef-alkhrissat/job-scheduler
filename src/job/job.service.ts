import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobDetailsDto } from './dto/job-details.dto';
import { Job } from '@prisma/client';
import * as cron from 'node-cron';

@Injectable()
export class JobService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  private schedules = new Map<number, cron.ScheduledTask>();

  async onModuleInit() {
    await this.initializeJobs();
  }

  private async initializeJobs() {
    const jobs = await this.findAll();
    jobs.forEach((job: Job) => {
      this.scheduleJob(job);
    });
  }

  async findAll(): Promise<JobDetailsDto[]> {
    return this.prisma.job.findMany();
  }

  async findOne(id: number): Promise<JobDetailsDto> {
    return this.prisma.job.findUnique({ where: { id } });
  }

  async create(createJobDto: CreateJobDto): Promise<JobDetailsDto> {
    const job = await this.prisma.job.create({
      data: {
        ...createJobDto,
        options: createJobDto.options
          ? JSON.parse(createJobDto.options)
          : undefined,
      },
    });
    this.scheduleJob(job);
    return job;
  }

  private scheduleJob(job: Job) {
    const task = cron.schedule(job.interval, async () => {
      console.log(`Executing job: ${job.name}`);

      await this.prisma.job.update({
        where: { id: job.id },
        data: { lastRun: new Date() },
      });
    });

    this.schedules.set(job.id, task);
  }
}
