import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobDetailsDto } from './dto/job-details.dto';
import { Job } from '@prisma/client';
import * as cron from 'node-cron';
import IntervalEnum from './enums/interval.enum';
import { PaginatorDto } from './dto/paginator.dto';

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

  async findAll(paginator?: PaginatorDto): Promise<JobDetailsDto[]> {
    let paginatorConstruction;
    if (paginator) {
      paginatorConstruction = {
        skip: +(paginator.limit * (paginator.page - 1)),
        take: +paginator.limit,
      };
    }
    return this.prisma.job.findMany({
      ...paginatorConstruction,
    });
  }

  async findOne(id: number): Promise<JobDetailsDto> {
    return this.prisma.job.findUnique({ where: { id } });
  }

  async create(createJobDto: CreateJobDto): Promise<JobDetailsDto> {
    if (typeof createJobDto.options === 'string') {
      createJobDto.options = JSON.parse(createJobDto.options);
    }
    const job = await this.prisma.job.create({
      data: {
        ...createJobDto,
      },
    });
    this.scheduleJob(job);
    return job;
  }
  private intervalToCron(interval: string): string {
    switch (interval.toLowerCase()) {
      case IntervalEnum.DAILY:
        return '0 0 * * *';
      case IntervalEnum.HOURLY:
        return '0 * * * *';
      case IntervalEnum.WEEKLY:
        return '0 0 * * 0';
      case IntervalEnum.MONTHLY:
        return '0 0 1 * *';
      case IntervalEnum.YEARLY:
        return '0 0 1 1 *';
      default:
        throw new Error(`Unsupported interval word: ${interval}`);
    }
  }

  private scheduleJob(job: Job) {
    let task;
    // eslint-disable-next-line prefer-const
    task = cron.schedule(this.intervalToCron(job.interval), async () => {
      console.log(`Executing job: ${job.name}`);
      await this.prisma.job.update({
        where: { id: job.id },
        data: { lastRun: new Date() },
      });
    });

    this.schedules.set(job.id, task);
  }
}
