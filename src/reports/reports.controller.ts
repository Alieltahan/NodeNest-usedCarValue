import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from "../guard";
import { CreateReportDto } from './dtos';
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
  createReport(@Body() body: CreateReportDto) {
    return this.reportsService.create(body);
  }
}
