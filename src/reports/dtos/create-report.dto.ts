import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

const currentYear = new Date().getFullYear();
export class CreateReportDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Max(currentYear)
  @Min(1930)
  year: number;

  @IsNumber()
  @Max(1000000)
  @Min(0)
  mileage: number;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;

  @IsNumber()
  price: number;
}
