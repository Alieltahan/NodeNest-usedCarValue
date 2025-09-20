import { BadRequestException, Injectable, NotFoundException, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUser } from '../users/decorators';
import { CurrentUserInterceptor } from '../users/interceptors';
import { User } from '../users/user.entity';
import { CreateReportDto } from './dtos';
import { Report } from './reports.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private readonly repo: Repository<Report>,
  ) {}

  create(report: CreateReportDto, user: User) {
    const newReport = this.repo.create(report);
    newReport.user = user;
    return this.repo.save(newReport);
  }

  findOne(id: number) {
    if(!id) throw new BadRequestException('Bad request');

    return this.repo.findOneBy({ id })
  }

  async changApproval(id: number, approved: boolean) {
    const report = await this.findOne(id)

    if(!report){ throw new NotFoundException('Bad request'); }

    report.approved = approved;

    return this.repo.save(report);
  }
}
