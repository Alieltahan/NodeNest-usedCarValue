import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;
  @Expose()
  model: string;
  @Expose()
  make: string;
  @Expose()
  price: number;
  @Expose()
  lat: number;
  @Expose()
  lng: number;
  @Expose()
  mileage: number;
  @Expose()
  year: number;
  @Expose()
  approved: boolean;

  @Transform(({obj}) => obj.user.id)
  @Expose()
  userId: number;
}
