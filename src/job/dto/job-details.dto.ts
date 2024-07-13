export class JobDetailsDto {
  id: number;
  name: string;
  lastRun: Date;
  nextRun: Date;
  interval: string;
  options?: any;
}
