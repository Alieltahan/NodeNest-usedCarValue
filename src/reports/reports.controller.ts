import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from "../guard";
import { customInterceptorSerialize } from '../interceptors';
import { CurrentUser } from '../users/decorators';
import { User } from '../users/user.entity';
import { CreateReportDto, ReportDto, ApproveReportDto } from './dtos';
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

  @Patch('/:id')
  async approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    const getReport= await this.reportsService.changApproval(parseInt(id), body.approved)
    return getReport;
  }
}
