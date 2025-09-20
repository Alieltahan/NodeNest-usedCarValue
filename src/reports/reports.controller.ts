import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from "../guard";
import { customInterceptorSerialize } from '../interceptors';
import { CurrentUser } from '../users/decorators';
import { User } from '../users/user.entity';
import { CreateReportDto } from './dtos';
import { ReportDto } from './dtos/report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  findAll() {
    // return this.reportsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Post()
  @customInterceptorSerialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }
}
