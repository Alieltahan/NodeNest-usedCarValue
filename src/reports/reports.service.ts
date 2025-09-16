import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateReportDto } from "./dtos";
import { Report } from "./reports.entity";

@Injectable()
export class ReportsService {
	constructor(@InjectRepository(Report) private readonly repo: Repository<Report>) {}

	create(report: CreateReportDto) {
		const newReport = this.repo.create(report);
		return this.repo.save(newReport);
	}
}
